# Google OAuth Setup Guide for Supabase

This guide will walk you through setting up Google sign-on authentication in your Supabase project.

## Prerequisites

- A Google Cloud Console account
- A Supabase project
- Your application running locally or deployed

## Step 1: Create Google OAuth Application

### 1.1 Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "TalkAI OAuth")
4. Click "Create"

### 1.2 Enable Google Identity API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Identity" or "Google+ API"
3. Click on "Google Identity" and click "Enable"

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Enter a name for your OAuth client (e.g., "TalkAI Web Client")

### 1.4 Configure Authorized Redirect URIs

Add the following redirect URIs:

**For Development:**
```
http://127.0.0.1:54321/auth/v1/callback
```

**For Production:**
```
https://your-project-ref.supabase.co/auth/v1/callback
```

Replace `your-project-ref` with your actual Supabase project reference.

### 1.5 Get Your Credentials

After creating the OAuth client, you'll get:
- **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abcdefghijklmnop`)

**Important:** Keep these credentials secure and never commit them to version control.

## Step 2: Configure Supabase

### 2.1 Update Supabase Config (Already Done)

The Google OAuth configuration has been added to your `supabase/config.toml` files:

```toml
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
redirect_uri = ""
url = ""
skip_nonce_check = true
```

### 2.2 Set Environment Variables

Create or update your environment variables file (`.env.local` or similar):

```bash
# Google OAuth Credentials
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your_google_client_id_here
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your_google_client_secret_here
```

### 2.3 For Production (Supabase Dashboard)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to "Authentication" → "Providers"
3. Find "Google" and click to configure
4. Enable Google provider
5. Enter your Google Client ID and Client Secret
6. Set the redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`

## Step 3: Update Your Application Code (Already Done)

The Google sign-in functionality has been added to your auth components:

### 3.1 Auth Page Updates

- Added `handleGoogleSignIn` function
- Added Google sign-in buttons to both login and signup forms
- Added proper styling with Google branding

### 3.2 OAuth Callback Handling

Your existing callback handler in `/auth/callback/page.tsx` already supports OAuth flows.

## Step 4: Test the Integration

### 4.1 Local Development

1. Start your Supabase local development server:
   ```bash
   supabase start
   ```

2. Start your Next.js application:
   ```bash
   npm run dev
   ```

3. Navigate to your auth page
4. Click "Continue with Google"
5. Complete the OAuth flow

### 4.2 Production Testing

1. Deploy your application
2. Ensure your Google OAuth app has the correct production redirect URI
3. Test the Google sign-in flow

## Step 5: Security Considerations

### 5.1 Environment Variables

- Never commit OAuth credentials to version control
- Use environment variables for all sensitive data
- Rotate credentials regularly

### 5.2 Domain Restrictions

- Configure authorized domains in Google Cloud Console
- Use HTTPS in production
- Validate redirect URIs

### 5.3 User Data

- Google OAuth provides user profile information
- Handle user data according to privacy regulations
- Consider what data you need vs. what you request

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**
   - Ensure your redirect URI exactly matches what's configured in Google Console
   - Check for trailing slashes or HTTP vs HTTPS mismatches

2. **"invalid_client" Error**
   - Verify your Client ID and Client Secret are correct
   - Ensure the OAuth consent screen is configured

3. **"access_denied" Error**
   - User may have denied permissions
   - Check OAuth consent screen configuration

4. **Local Development Issues**
   - Ensure `skip_nonce_check = true` is set in config
   - Verify Supabase is running locally

### Debug Steps

1. Check browser console for errors
2. Verify Supabase logs in the dashboard
3. Test with a different Google account
4. Ensure all environment variables are set correctly

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Providers](https://supabase.com/docs/guides/auth/social-login/auth-google)

## Next Steps

After setting up Google OAuth, you might want to:

1. Add other OAuth providers (GitHub, Apple, etc.)
2. Implement user profile management
3. Add role-based access control
4. Set up email notifications for new users
5. Implement account linking for existing users

---

**Note:** This setup has been configured for both English and Spanish versions of your application. The UI text has been localized appropriately for each version.
