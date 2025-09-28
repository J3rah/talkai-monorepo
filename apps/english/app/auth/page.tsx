"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import supabase from '../../supabaseClient';
import AutoReload from '@/components/AutoReload';
import { Eye, EyeOff } from 'lucide-react';
import TurnstileComponent from '../../components/Turnstile';

type AuthMode = 'login' | 'signup' | 'reset';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

// Turnstile configuration
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  });
  const router = useRouter();
  
  // Get returnTo parameter from URL
  const [returnTo, setReturnTo] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setReturnTo(urlParams.get('returnTo'));
    }
  }, []);

  // Small helper to enforce timeouts while preserving types
  const withTimeout = async <T,>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
      promise
        .then((value) => { clearTimeout(timer); resolve(value); })
        .catch((err) => { clearTimeout(timer); reject(err); });
    });
  };



  // Reset form when switching modes
  const switchMode = (newMode: AuthMode) => {
    console.log('🔧 Switching to mode:', newMode);
    
    setMode(newMode);
    setMessage('');
    setTurnstileError(null);
    setTurnstileToken(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUseMagicLink(false);
    setMagicLinkSent(false);
    setPasswordStrength({ score: 0, feedback: [], isValid: false });
  };

  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('One special character');

    return {
      score,
      feedback,
      isValid: score >= 4 && password.length >= 8
    };
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (mode === 'signup') {
      setPasswordStrength(checkPasswordStrength(newPassword));
    }
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-green-400';
    return 'bg-green-600';
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  const verifyTurnstile = async (token: string) => {
    try {
      const res = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      return data.success;
    } catch (error) {
      console.error('Turnstile verification failed:', error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTurnstileError(null);

    console.log('🔐 AuthPage: Starting login process');

    if (!TURNSTILE_SITE_KEY) {
      setTurnstileError('Security verification is not configured. Please contact support.');
      setLoading(false);
      return;
    }

    if (!turnstileToken) {
      setTurnstileError('Please complete the security verification.');
      setLoading(false);
      return;
    }

    console.log('🔐 AuthPage: Verifying Turnstile...');
    try {
      const turnstileValid = await Promise.race([
        verifyTurnstile(turnstileToken),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Turnstile timeout')), 10000))
      ]);
      
      if (!turnstileValid) {
        setTurnstileError('Security verification failed. Please try again.');
        setLoading(false);
        return;
      }
      console.log('🔐 AuthPage: Turnstile verified successfully');
    } catch (error) {
      console.error('🔐 AuthPage: Turnstile verification error:', error);
      setTurnstileError('Security verification timed out. Please refresh and try again.');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 AuthPage: Attempting Supabase auth...');
      
      if (useMagicLink) {
        console.log('🔐 AuthPage: Sending magic link...');
        const authPromise = supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/login-success`,
            shouldCreateUser: false
          }
        });
        
        const { error } = await withTimeout(authPromise, 15000, 'Auth timeout');
        
        if (error) {
          if (error.message.includes('signup') || error.message.includes('not found')) {
            setMessage('No account found with this email. Please sign up first.');
          } else {
            setMessage(error.message);
          }
        } else {
          setMagicLinkSent(true);
          setMessage('Check your email for the magic link!');
        }
      } else {
        console.log('🔐 AuthPage: Signing in with password...');
        
        // Prefer event-driven success over Promise.race timeouts
        let resolved = false;
        const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
          if (resolved) return;
          if (event === 'SIGNED_IN' && session?.user) {
            resolved = true;
            try { unsubscribe.data.subscription.unsubscribe(); } catch {}
            console.log('🔐 AuthPage: Login successful via auth event');
            setMessage('Logged in successfully!');
            const redirectUrl = (returnTo && returnTo !== '/') ? returnTo : '/landing';
            console.log('🔐 AuthPage: Redirecting to:', redirectUrl);
            // Increase delay to ensure Supabase finishes persisting session tokens
            setTimeout(() => { window.location.href = redirectUrl; }, 1500);
          }
        });

        // Kick off sign-in request (no race with timeout)
        const authPromise = supabase.auth.signInWithPassword({ email, password });
        
        try {
          const { error } = await withTimeout(authPromise, 30000, 'Auth timeout');
          if (error && !resolved) {
            try { unsubscribe.data.subscription.unsubscribe(); } catch {}
            console.error('🔐 AuthPage: Login error:', error);
            setMessage(error.message);
          }
        } catch (timeoutError) {
          // Only show timeout error if login wasn't already successful
          if (!resolved) {
            try { unsubscribe.data.subscription.unsubscribe(); } catch {}
            console.error('🔐 AuthPage: Auth timeout:', timeoutError);
            setMessage('Login timed out. Please check your connection and try again.');
          }
        }

        // Fallback: if neither error nor event fired in time, check session after a short delay
        if (!resolved) {
          await new Promise(r => setTimeout(r, 1200));
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && !resolved) {
            resolved = true;
            try { unsubscribe.data.subscription.unsubscribe(); } catch {}
            console.log('🔐 AuthPage: Session present after sign-in, proceeding');
            setMessage('Logged in successfully!');
            const redirectUrl = (returnTo && returnTo !== '/') ? returnTo : '/landing';
            console.log('🔐 AuthPage: Fallback redirecting to:', redirectUrl);
            setTimeout(() => { window.location.href = redirectUrl; }, 400);
          }
        }
      }
    } catch (err) {
      console.error('🔐 AuthPage: Unexpected error:', err);
      if (err instanceof Error && err.message === 'Auth timeout') {
        setMessage('Login timed out. Please check your connection and try again.');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      // Set loading to false after a delay to prevent premature state reset
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTurnstileError(null);

    console.log('🔐 AuthPage: Starting signup process');

    if (!TURNSTILE_SITE_KEY) {
      setTurnstileError('Security verification is not configured. Please contact support.');
      setLoading(false);
      return;
    }

    if (!turnstileToken) {
      setTurnstileError('Please complete the security verification.');
      setLoading(false);
      return;
    }

    console.log('🔐 AuthPage: Verifying Turnstile for signup...');
    try {
      const turnstileValid = await Promise.race([
        verifyTurnstile(turnstileToken),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Turnstile timeout')), 10000))
      ]);
      
      if (!turnstileValid) {
        setTurnstileError('Security verification failed. Please try again.');
        setLoading(false);
        return;
      }
      console.log('🔐 AuthPage: Turnstile verified for signup');
    } catch (error) {
      console.error('🔐 AuthPage: Turnstile verification error during signup:', error);
      setTurnstileError('Security verification timed out. Please refresh and try again.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!passwordStrength.isValid) {
      setMessage(`Password is too weak: ${passwordStrength.feedback.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 AuthPage: Creating account with Supabase...');
      const signupPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      const { data, error } = await withTimeout(signupPromise, 15000, 'Signup timeout');

      if (error) {
        console.error('🔐 AuthPage: Signup error:', error);
        if (error.message.includes('Email')) {
          setMessage('There was an issue with the email service. Please try again later.');
        } else {
          setMessage(error.message);
        }
      } else if (data?.user && !data.user.email_confirmed_at) {
        console.log('🔐 AuthPage: Signup successful, confirmation email sent');
        setMessage('Please check your email for the confirmation link.');
      } else {
        console.log('🔐 AuthPage: Signup successful, account created');
        setMessage('Account created successfully!');
      }
    } catch (err) {
      console.error('🔐 AuthPage: Unexpected signup error:', err);
      if (err instanceof Error && err.message === 'Signup timeout') {
        setMessage('Signup timed out. Please check your connection and try again.');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTurnstileError(null);

    console.log('🔐 AuthPage: Starting password reset process');

    if (!TURNSTILE_SITE_KEY) {
      setTurnstileError('Security verification is not configured. Please contact support.');
      setLoading(false);
      return;
    }

    if (!turnstileToken) {
      setTurnstileError('Please complete the security verification.');
      setLoading(false);
      return;
    }

    console.log('🔐 AuthPage: Verifying Turnstile for reset...');
    try {
      const turnstileValid = await Promise.race([
        verifyTurnstile(turnstileToken),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Turnstile timeout')), 10000))
      ]);
      
      if (!turnstileValid) {
        setTurnstileError('Security verification failed. Please try again.');
        setLoading(false);
        return;
      }
      console.log('🔐 AuthPage: Turnstile verified for reset');
    } catch (error) {
      console.error('🔐 AuthPage: Turnstile verification error during reset:', error);
      setTurnstileError('Security verification timed out. Please refresh and try again.');
      setLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const redirectTo = `${baseUrl}/auth/reset-password`;
      console.log('🔐 AuthPage: Sending password reset with redirectTo:', redirectTo);
      
      const resetPromise = supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      const { error } = await withTimeout(resetPromise, 15000, 'Reset timeout');

      if (error) {
        console.error('🔐 AuthPage: Reset error:', error);
        setMessage(error.message);
      } else {
        console.log('🔐 AuthPage: Reset email sent successfully');
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      console.error('🔐 AuthPage: Unexpected reset error:', err);
      if (err instanceof Error && err.message === 'Reset timeout') {
        setMessage('Password reset timed out. Please check your connection and try again.');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage('');

    try {
      console.log('🔐 AuthPage: Starting Google OAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('🔐 AuthPage: Google OAuth error:', error);
        setMessage(error.message);
        setLoading(false);
      } else {
        console.log('🔐 AuthPage: Google OAuth initiated successfully');
        // The user will be redirected to Google's OAuth page
      }
    } catch (err) {
      console.error('🔐 AuthPage: Unexpected Google OAuth error:', err);
      setMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleTwitterSignIn = async () => {
    setLoading(true);
    setMessage('');

    try {
      console.log('🔐 AuthPage: Starting Twitter OAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        console.error('🔐 AuthPage: Twitter OAuth error:', error);
        setMessage(error.message);
        setLoading(false);
      } else {
        console.log('🔐 AuthPage: Twitter OAuth initiated successfully');
        // The user will be redirected to Twitter's OAuth page
      }
    } catch (err) {
      console.error('🔐 AuthPage: Unexpected Twitter OAuth error:', err);
      setMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Check your email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setMagicLinkSent(false);
                setMessage('');
              }}
              className="w-full"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <AutoReload />
      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2">
        <Button
          onClick={() => switchMode('login')}
          variant={mode === 'login' ? 'default' : 'outline'}
        >
          Login
        </Button>
        <Button
          onClick={() => switchMode('signup')}
          variant={mode === 'signup' ? 'default' : 'outline'}
        >
          Sign Up
        </Button>
        <Button
          onClick={() => switchMode('reset')}
          variant={mode === 'reset' ? 'default' : 'outline'}
        >
          Reset Password
        </Button>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
            
            {/* Login Type Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={!useMagicLink ? "default" : "outline"}
                onClick={() => setUseMagicLink(false)}
                className="flex-1 text-sm"
              >
                Password
              </Button>
              <Button
                type="button"
                variant={useMagicLink ? "default" : "outline"}
                onClick={() => setUseMagicLink(true)}
                className="flex-1 text-sm"
              >
                Magic Link
              </Button>
            </div>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
            
            {!useMagicLink && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 pr-10 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            {/* Turnstile */}
            {TURNSTILE_SITE_KEY ? (
              <TurnstileComponent
                siteKey={TURNSTILE_SITE_KEY}
                onVerify={(token: string | null) => setTurnstileToken(token)}
                onError={(error: string) => setTurnstileError(error)}
              />
            ) : (
              <div className="text-red-500 text-sm p-3 border border-red-300 rounded bg-red-50">
                ⚠️ Turnstile not configured. Please set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your environment variables.
              </div>
            )}
            {turnstileError && <div className="text-red-500 text-sm">{turnstileError}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : useMagicLink ? 'Send Magic Link' : 'Login'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Twitter Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleTwitterSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Continue with X (Twitter)
            </Button>

            {message && (
              <p className={`text-sm text-center ${message.includes('error') || message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </p>
            )}
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4 p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>

            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-3 py-2 pr-10 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full px-3 py-2 pr-10 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Turnstile */}
            {TURNSTILE_SITE_KEY ? (
              <TurnstileComponent
                siteKey={TURNSTILE_SITE_KEY}
                onVerify={(token: string | null) => setTurnstileToken(token)}
                onError={(error: string) => setTurnstileError(error)}
              />
            ) : (
              <div className="text-red-500 text-sm p-3 border border-red-300 rounded bg-red-50">
                ⚠️ Turnstile not configured. Please set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your environment variables.
              </div>
            )}
            {turnstileError && <div className="text-red-500 text-sm">{turnstileError}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Twitter Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleTwitterSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Continue with X (Twitter)
            </Button>

            {message && (
              <p className={`text-sm text-center ${message.includes('error') || message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </p>
            )}
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4 p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />

            {/* Turnstile */}
            {TURNSTILE_SITE_KEY ? (
              <TurnstileComponent
                siteKey={TURNSTILE_SITE_KEY}
                onVerify={(token: string | null) => setTurnstileToken(token)}
                onError={(error: string) => setTurnstileError(error)}
              />
            ) : (
              <div className="text-red-500 text-sm p-3 border border-red-300 rounded bg-red-50">
                ⚠️ Turnstile not configured. Please set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your environment variables.
              </div>
            )}
            {turnstileError && <div className="text-red-500 text-sm">{turnstileError}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Button>

            {message && (
              <p className={`text-sm text-center ${message.includes('error') || message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
} 