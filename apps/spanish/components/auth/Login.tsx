import { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import TurnstileComponent from '../Turnstile';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const router = useRouter();

  // Cleanup effect for Turnstile token
  useEffect(() => {
    return () => {
      // Clear Turnstile token when component unmounts
      setTurnstileToken(null);
      setTurnstileError(null);
    };
  }, []);

  // Helper to verify Turnstile token server-side
  const verifyTurnstile = async (token: string) => {
    const res = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    return data.success;
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTurnstileError(null);
    if (!turnstileToken) {
      setTurnstileError('Please complete the security verification.');
      setLoading(false);
      return;
    }
    const turnstileValid = await verifyTurnstile(turnstileToken);
    if (!turnstileValid) {
      setTurnstileError('Security verification failed. Please try again.');
      setLoading(false);
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      // Handle remember me functionality
      if (rememberMe) {
        // Store a flag in localStorage to indicate the user wants to be remembered
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberMeExpiry', String(Date.now() + (30 * 24 * 60 * 60 * 1000))); // 30 days
      } else {
        // Clear remember me if not checked
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberMeExpiry');
      }
      
      setMessage(error.message);
    } else {
      setMessage('Logged in!');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTurnstileError(null);
    if (!turnstileToken) {
      setTurnstileError('Please complete the security verification.');
      setLoading(false);
      return;
    }
    const turnstileValid = await verifyTurnstile(turnstileToken);
    if (!turnstileValid) {
      setTurnstileError('Security verification failed. Please try again.');
      setLoading(false);
      return;
    }
    
    try {
      // Send magic link for signin - let Supabase handle user existence check
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login-success`,
          shouldCreateUser: false // Prevent creating new users
        }
      });
      
      if (error) {
        // Handle specific error messages from Supabase
        if (error.message.includes('signup') || error.message.includes('not found') || error.message.includes('User not found')) {
          setMessage('No account found with this email. Please sign up first or use password login.');
        } else if (error.message.includes('Email not confirmed')) {
          setMessage('Please check your email and confirm your account before using magic link.');
        } else {
          setMessage(error.message);
        }
      } else {
        // Store remember me preference for when user clicks the magic link
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberMeExpiry', String(Date.now() + (30 * 24 * 60 * 60 * 1000))); // 30 days
        }
        
        setMagicLinkSent(true);
        setMessage('Check your email for the magic link to sign in!');
      }
    } catch (error) {
      console.error('Magic link error:', error);
      setMessage('Something went wrong. Please try again.');
    }
    
    setLoading(false);
  };

  if (magicLinkSent) {
    return (
      <div className="space-y-4 max-w-sm mx-auto p-6 bg-card rounded-lg shadow">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Check your email</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We've sent a magic link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Click the link in your email to sign in to your account. You can close this page.
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
    );
  }

  return (
    <div className="space-y-4 max-w-sm mx-auto p-6 bg-card rounded-lg shadow">
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

      {!useMagicLink ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
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
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="mr-2 h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="remember-me" className="text-sm text-muted-foreground">
              Remember me for 30 days
            </label>
          </div>
          <TurnstileComponent
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
            onVerify={(token: string | null) => setTurnstileToken(token)}
            onError={(error: string) => setTurnstileError(error)}
          />
          {turnstileError && <div className="text-red-500 text-sm">{turnstileError}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login with Password'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleMagicLinkLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
          <div className="flex items-center">
            <input
              id="remember-me-magic"
              name="remember-me-magic"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="mr-2 h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="remember-me-magic" className="text-sm text-muted-foreground">
              Remember me for 30 days
            </label>
          </div>
          <div className="text-sm text-muted-foreground">
            We'll send you a secure link to sign in without a password.
          </div>
          <TurnstileComponent
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
            onVerify={(token: string | null) => setTurnstileToken(token)}
            onError={(error: string) => setTurnstileError(error)}
          />
          {turnstileError && <div className="text-red-500 text-sm">{turnstileError}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </form>
      )}

      {message && (
        <p className={`text-center text-sm mt-2 ${
          message.includes('error') || message.includes('Error') 
            ? 'text-destructive' 
            : 'text-muted-foreground'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
} 