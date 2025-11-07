'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import Script from 'next/script';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  // Check if already logged in
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      console.log('🔍 Checking if user is already logged in...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('✅ User is logged in, redirecting to /session');
        router.replace('/session'); // Use replace instead of push
      } else {
        console.log('❌ No active session, showing login form');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check Turnstile verification if enabled
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please complete the security verification.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push('/session');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Failed to login with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Explicit Turnstile script load as a fallback */}
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          async
          defer
        />
      )}

      <div className="max-w-md w-full space-y-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-white/70 mt-2">
              {mode === 'login'
                ? 'Welcome back to TalkAI Avatar'
                : 'Start your journey with TalkAI Avatar'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {/* Cloudflare Turnstile */}
            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <Turnstile
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(token) => {
                    console.log('✅ Turnstile verified');
                    setTurnstileToken(token);
                    setError(null);
                  }}
                  onError={() => {
                    console.error('❌ Turnstile error');
                    setError('Security verification failed. Please refresh and try again.');
                    setTurnstileToken(null);
                  }}
                  onExpire={() => {
                    console.log('⏰ Turnstile expired');
                    setTurnstileToken(null);
                  }}
                  options={{
                    theme: 'dark',
                    size: 'normal',
                  }}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          {/* OAuth */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/70">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>

          {/* Toggle Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-white/70 hover:text-white text-sm"
            >
              {mode === 'login' ? (
                <>
                  Don't have an account? <span className="font-semibold">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="font-semibold">Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div className="text-center text-white/60 text-sm">
          <p>This app uses the same login as the main TalkAI platform</p>
        </div>
      </div>
    </div>
  );
}

