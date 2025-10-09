"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "../../../supabaseClient";
import { Suspense } from "react";

export default function CallbackPageWrapper() {
  return (
    <Suspense>
      <CallbackPage />
    </Suspense>
  );
}

function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token and type from the URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        
        console.log("🔍 Processing callback:", {
          hasToken: !!token,
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          type
        });

        // Handle OAuth callback (regular login)
        if (access_token && refresh_token) {
          console.log("🔄 Processing OAuth callback");
          
          // Set the session manually
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          if (error) {
            console.error("❌ Error setting OAuth session:", error);
            throw error;
          }

          if (data.session) {
            console.log("✅ OAuth session established successfully");
            
            // Small delay to ensure session is fully propagated
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Use replace to avoid adding to browser history
            router.replace('/landing');
            return;
          } else {
            throw new Error('No session data received');
          }
        }

        // Handle email confirmation
        if (token && type === 'signup') {
          // Verify email confirmation
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (verifyError) {
            console.error("❌ Error verifying email:", verifyError);
            throw verifyError;
          }

          console.log("✅ Email confirmed successfully");
          
          // Redirect to subscription page with confirmation flag
          router.push('/subscription?justConfirmed=1');
          return;
        }

        // Handle password recovery
        if (token && type === 'recovery') {
          // Verify the token
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          if (verifyError) {
            console.error("❌ Error verifying token:", verifyError);
            throw verifyError;
          }

          console.log("✅ Token verified successfully");
          
          // Get the session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !session) {
            console.error("❌ No session after verification:", sessionError);
            throw new Error('Failed to get session');
          }

          console.log("✅ Session established successfully");
          
          // Redirect to reset password page
          router.push('/auth/reset-password');
          return;
        }

        // If no valid token/type combination
        console.error("❌ Invalid callback parameters:", { 
          token: !!token, 
          accessToken: !!access_token,
          refreshToken: !!refresh_token,
          type 
        });
        throw new Error('Invalid callback parameters');
      } catch (error) {
        console.error("❌ Error in callback:", error);
        router.replace('/auth?error=auth_callback_error');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Processing authentication...</p>
      </div>
    </div>
  );
} 