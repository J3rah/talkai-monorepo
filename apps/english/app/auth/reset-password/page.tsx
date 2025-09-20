"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../supabaseClient';
import { Button } from '../../../components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        let access_token: string | null = null;
        let refresh_token: string | null = null;

        if (typeof window !== 'undefined' && window.location.hash) {
          const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
          const hashParams = new URLSearchParams(hash);
          access_token = hashParams.get('access_token');
          refresh_token = hashParams.get('refresh_token');
          const token_type = hashParams.get('token_type');
          const expires_in = hashParams.get('expires_in');

          if (access_token && refresh_token) {
            console.log('🔑 Found auth tokens in URL hash. Setting session...');
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });

            if (error) {
              console.error('❌ Error setting session from URL hash:', error);
            } else {
              console.log('✅ Session set successfully from URL hash:', {
                token_type,
                expires_in
              });
            }

            // Clean the hash from URL to avoid leaking tokens
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }

        // 1b) Legacy flow support: if ?token= & type=recovery are present (came from old reset flow)
        const urlParams = new URLSearchParams(window.location.search);
        const legacyToken = urlParams.get('token');
        const legacyType = urlParams.get('type');

        if (!access_token && legacyToken && legacyType === 'recovery') {
          console.log('🕰️ Detected legacy recovery token in query params. Verifying…');
          const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: legacyToken,
            type: 'recovery'
          });

          if (verifyError) {
            console.error('❌ Legacy token verification failed:', verifyError);
          } else {
            console.log('✅ Legacy token verified:', verifyData);
          }
        }

        // 2) Verify that we now have a valid session (after handling tokens)
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔍 Checking session (post-token handling):', { hasSession: !!session, error });

        if (error || !session) {
          console.error('❌ No valid session found – redirecting to auth page');
          router.replace('/auth?error=invalid_session');
          return;
        }

        console.log('✅ Session verified:', {
          userId: session.user.id,
          email: session.user.email
        });
      } catch (err) {
        console.error('❌ Error during reset-password initialization:', err);
        router.replace('/auth?error=session_check_error');
      }
    };

    initialize();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validate passwords
      if (password !== confirmPassword) {
        setMessage('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setMessage('Password must be at least 6 characters long');
        return;
      }

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("❌ No session found:", sessionError);
        setMessage('Session expired. Please try again.');
        router.replace('/auth?error=session_expired');
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (updateError) {
        console.error("❌ Error updating password:", updateError);
        setMessage(updateError.message);
        return;
      }

      console.log("✅ Password updated successfully");
      setMessage('Password updated successfully!');
      
      // Sign out and redirect
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push('/auth?message=password_reset_success');
      }, 2000);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      setMessage('An unexpected error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                defaultValue=""
                onChange={e => setPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full px-3 py-2 pr-10 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                autoComplete="new-password"
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
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 6 characters long
            </p>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              defaultValue=""
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
              className="w-full px-3 py-2 pr-10 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              autoComplete="new-password"
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Reset Password'}
          </Button>
          {message && (
            <p className={`text-center text-sm mt-2 ${
              message.includes('successfully') ? 'text-green-600' : 'text-destructive'
            }`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
} 