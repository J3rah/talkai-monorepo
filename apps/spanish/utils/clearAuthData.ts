/**
 * Utility function to clear all authentication-related data
 * Use this when encountering refresh token errors
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  console.log('Clearing authentication data...');
  
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear Supabase-specific cookies
  document.cookie.split(";").forEach(function(c) { 
    if (c.includes('sb-') || c.includes('supabase')) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    }
  });
  
  console.log('Authentication data cleared successfully');
}

/**
 * Check if current session has refresh token issues
 */
export function hasRefreshTokenIssue(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if there are any Supabase auth tokens in localStorage
    const keys = Object.keys(localStorage);
    const hasSupabaseKeys = keys.some(key => key.includes('sb-'));
    
    // If we have Supabase keys but no valid session, there might be a token issue
    return hasSupabaseKeys;
  } catch (error) {
    console.error('Error checking refresh token status:', error);
    return false;
  }
}
