"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import supabase from '../../supabaseClient';
import AutoReload from '@/components/AutoReload';
import { Eye, EyeOff } from 'lucide-react';
// Using manual reCAPTCHA rendering via script

type AuthMode = 'login' | 'signup' | 'reset';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

// Declare global grecaptcha
declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

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
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
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

  // Load reCAPTCHA script manually
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.grecaptcha) {
      window.onRecaptchaLoad = () => {
        console.log('🔧 reCAPTCHA script loaded');
        setRecaptchaLoaded(true);
      };

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.grecaptcha && window.grecaptcha.render) {
      setRecaptchaLoaded(true);
    }
  }, []);

  // Render reCAPTCHA when loaded and mode changes
  useEffect(() => {
    if (recaptchaLoaded && recaptchaRef.current) {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        renderRecaptcha();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [mode, recaptchaLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId.current);
        } catch (e) {
          console.log('🔧 Cleanup: Could not reset reCAPTCHA');
        }
      }
    };
  }, []);

  const renderRecaptcha = () => {
    if (!window.grecaptcha || !window.grecaptcha.render || !recaptchaRef.current) {
      console.log('🔧 reCAPTCHA not ready for rendering');
      return;
    }

    // Check if already rendered in this element
    if (recaptchaRef.current.innerHTML.trim() !== '') {
      console.log('🔧 reCAPTCHA already exists, resetting...');
      if (widgetId.current !== null) {
        try {
          window.grecaptcha.reset(widgetId.current);
          setRecaptchaToken(null);
          return;
        } catch (e) {
          console.log('🔧 Could not reset, clearing container');
          recaptchaRef.current.innerHTML = '';
        }
      } else {
        recaptchaRef.current.innerHTML = '';
      }
    }

    try {
      console.log('🔧 Rendering new reCAPTCHA widget');
      widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: '6LeWV1crAAAAAGg7y41yxfFpxkzbuZb8CuzqCqiR',
        callback: (token: string) => {
          console.log('🔧 reCAPTCHA callback: Token received');
          setRecaptchaToken(token);
          setRecaptchaError(null);
        },
        'expired-callback': () => {
          console.log('🔧 reCAPTCHA expired');
          setRecaptchaToken(null);
        },
        'error-callback': () => {
          console.error('🔧 reCAPTCHA error');
          setRecaptchaError('reCAPTCHA error occurred');
        }
      });
      console.log('🔧 reCAPTCHA rendered with widget ID:', widgetId.current);
    } catch (error) {
      console.error('🔧 Failed to render reCAPTCHA:', error);
    }
  };

  // Reset form when switching modes
  const switchMode = (newMode: AuthMode) => {
    console.log('🔧 Switching to mode:', newMode);
    
    setMode(newMode);
    setMessage('');
    setRecaptchaError(null);
    setRecaptchaToken(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUseMagicLink(false);
    setMagicLinkSent(false);
    setPasswordStrength({ score: 0, feedback: [], isValid: false });
    
    // Clear reCAPTCHA container and reset widget ID to force re-render
    if (recaptchaRef.current) {
      recaptchaRef.current.innerHTML = '';
    }
    widgetId.current = null;
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

  const verifyRecaptcha = async (token: string) => {
    try {
      const res = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      return data.success;
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setRecaptchaError(null);

    console.log('🔐 AuthPage: Starting login process');

    if (!recaptchaToken) {
      setRecaptchaError('Please complete the reCAPTCHA.');
      setLoading(false);
      return;
    }

    console.log('🔐 AuthPage: Verifying reCAPTCHA...');
    try {
      const recaptchaValid = await Promise.race([
        verifyRecaptcha(recaptchaToken),
        new Promise((_, reject) => setTimeout(() => reject(new Error('reCAPTCHA timeout')), 10000))
      ]);
      
      if (!recaptchaValid) {
        setRecaptchaError('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }
      console.log('🔐 AuthPage: reCAPTCHA verified successfully');
    } catch (error) {
      console.error('🔐 AuthPage: reCAPTCHA verification error:', error);
      setRecaptchaError('reCAPTCHA verification timed out. Please refresh and try again.');
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
        const { error } = await withTimeout(authPromise, 15000, 'Auth timeout');

        if (error && !resolved) {
          try { unsubscribe.data.subscription.unsubscribe(); } catch {}
          console.error('🔐 AuthPage: Login error:', error);
          setMessage(error.message);
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
    setRecaptchaError(null);

    console.log('🔐 AuthPage: Starting signup process');

    if (!recaptchaToken) {
      setRecaptchaError('Please complete the reCAPTCHA.');
      setLoading(false);
      return;
    }

    console.log('🔐 AuthPage: Verifying reCAPTCHA for signup...');
    try {
      const recaptchaValid = await Promise.race([
        verifyRecaptcha(recaptchaToken),
        new Promise((_, reject) => setTimeout(() => reject(new Error('reCAPTCHA timeout')), 10000))
      ]);
      
      if (!recaptchaValid) {
        setRecaptchaError('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }
      console.log('🔐 AuthPage: reCAPTCHA verified for signup');
    } catch (error) {
      console.error('🔐 AuthPage: reCAPTCHA verification error during signup:', error);
      setRecaptchaError('reCAPTCHA verification timed out. Please refresh and try again.');
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
    setRecaptchaError(null);

    console.log('🔐 AuthPage: Starting password reset process');

    if (!recaptchaToken) {
      setRecaptchaError('Please complete the reCAPTCHA.');
      setLoading(false);
      return;
    }

    console.log('🔐 AuthPage: Verifying reCAPTCHA for reset...');
    try {
      const recaptchaValid = await Promise.race([
        verifyRecaptcha(recaptchaToken),
        new Promise((_, reject) => setTimeout(() => reject(new Error('reCAPTCHA timeout')), 10000))
      ]);
      
      if (!recaptchaValid) {
        setRecaptchaError('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }
      console.log('🔐 AuthPage: reCAPTCHA verified for reset');
    } catch (error) {
      console.error('🔐 AuthPage: reCAPTCHA verification error during reset:', error);
      setRecaptchaError('reCAPTCHA verification timed out. Please refresh and try again.');
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

            {/* Manual reCAPTCHA */}
            <div ref={recaptchaRef} className="g-recaptcha"></div>
            {recaptchaError && <div className="text-red-500 text-sm">{recaptchaError}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : useMagicLink ? 'Send Magic Link' : 'Login'}
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

            {/* Manual reCAPTCHA */}
            <div ref={recaptchaRef} className="g-recaptcha"></div>
            {recaptchaError && <div className="text-red-500 text-sm">{recaptchaError}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
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

            {/* Manual reCAPTCHA */}
            <div ref={recaptchaRef} className="g-recaptcha"></div>
            {recaptchaError && <div className="text-red-500 text-sm">{recaptchaError}</div>}

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