import { AuthError } from '@supabase/supabase-js';

export function handleAuthError(error: any): void {
  console.error('Authentication error:', error);
  
  // Check if it's a refresh token error
  if (error?.message?.includes('Invalid Refresh Token') || 
      error?.message?.includes('Refresh Token Not Found') ||
      error?.message?.includes('refresh_token_not_found')) {
    
    console.warn('Refresh token error detected, clearing auth state...');
    
    // Clear all authentication-related storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear Supabase-specific cookies
      document.cookie.split(";").forEach(function(c) { 
        if (c.includes('sb-') || c.includes('supabase')) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        }
      });
    }
    
    // Redirect to auth page with error message
    if (typeof window !== 'undefined') {
      window.location.href = '/auth?error=session_expired&message=Your session has expired. Please sign in again.';
    }
  }
}

export function isAuthError(error: any): boolean {
  return error?.message?.includes('Invalid Refresh Token') || 
         error?.message?.includes('Refresh Token Not Found') ||
         error?.message?.includes('refresh_token_not_found') ||
         error?.message?.includes('AuthApiError');
}
