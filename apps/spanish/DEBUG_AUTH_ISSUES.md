# Debug Authentication Issues

## Quick Fix for "Invalid Refresh Token" Error

If you're encountering the "Invalid Refresh Token: Refresh Token Not Found" error, follow these steps:

### Method 1: Browser Console (Quickest)
1. Open Developer Tools (F12)
2. Go to Console tab
3. Run this command:
```javascript
// Clear all authentication data
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log('Authentication data cleared. Please refresh the page and sign in again.');
```

### Method 2: Clear Storage via DevTools
1. Open Developer Tools (F12)
2. Go to Application tab
3. Click "Storage" in the left sidebar
4. Click "Clear storage" button
5. Refresh the page

### Method 3: Use the Utility Function
If you have access to the codebase, you can use the `clearAuthData` utility:
```typescript
import { clearAuthData } from './utils/clearAuthData';
clearAuthData();
```

## What Causes This Error?

This error typically occurs when:
- The refresh token has expired
- The authentication state becomes corrupted
- There's a mismatch between stored tokens and the server
- The user has been inactive for too long

## Prevention

The codebase now includes:
- Global error handling for authentication errors
- Automatic redirection to sign-in when tokens are invalid
- Better error messages for users
- Automatic cleanup of corrupted auth state

## After Clearing Auth Data

1. Refresh the page
2. You should be redirected to the sign-in page
3. Sign in again with your credentials
4. The error should be resolved

## If the Problem Persists

1. Check your internet connection
2. Verify your Supabase project is running
3. Check the browser console for additional error messages
4. Contact support if the issue continues
