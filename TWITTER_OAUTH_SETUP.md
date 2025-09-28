# Twitter OAuth Setup Guide for Supabase

This guide will walk you through setting up Twitter (X) sign-on authentication in your Supabase project.

## Prerequisites

- A Twitter Developer account
- A Supabase project
- Your application running locally or deployed

## Step 1: Create Twitter OAuth Application

### 1.1 Create a Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter account or create one
3. Apply for a developer account if you don't have one
4. Complete the application process (may take a few days)

### 1.2 Create a Twitter App

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Click "Create App" or "New Project"
3. Fill in the required information:
   - **App Name**: `talkAI` (or your preferred name)
   - **Description**: `AI-powered mental health companion`
   - **Website URL**: Your production domain (e.g., `https://yourdomain.com`)
   - **Callback URL**: `https://your-project-ref.supabase.co/auth/v1/callback`
   - **Terms of Service**: Your terms URL
   - **Privacy Policy**: Your privacy policy URL

### 1.3 Configure OAuth Settings

1. In your Twitter app dashboard, go to "App settings" → "Authentication settings"
2. Enable "OAuth 2.0" (recommended) or "OAuth 1.0a"
3. Set the **Callback URL** to:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
4. Enable "Request email from users" if you want email addresses
5. Save the changes

### 1.4 Get Your Credentials

1. Go to "Keys and tokens" tab
2. Copy the following credentials:
   - **API Key** (Client ID)
   - **API Secret Key** (Client Secret)

## Step 2: Configure Supabase

### 2.1 Add Environment Variables

Add these to your `.env.local` file:

```bash
# Twitter OAuth Credentials
SUPABASE_AUTH_EXTERNAL_TWITTER_CLIENT_ID=your_api_key_here
SUPABASE_AUTH_EXTERNAL_TWITTER_SECRET=your_api_secret_key_here
```

### 2.2 Configure Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" → "Providers"
4. Find "Twitter" and click "Configure"
5. Enable Twitter provider
6. Enter your credentials:
   - **Client ID**: Your Twitter API Key
   - **Client Secret**: Your Twitter API Secret Key
7. Save the configuration

## Step 3: Test the Integration

### 3.1 Local Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your auth page
3. Click "Continue with X (Twitter)"
4. You should be redirected to Twitter's OAuth page

### 3.2 Production Testing

1. Deploy your application
2. Test the Twitter sign-in flow
3. Verify users can sign in and are redirected properly

## Step 4: Troubleshooting

### Common Issues

#### 1. **"Invalid redirect URI" Error**
- **Cause**: The callback URL in Twitter doesn't match Supabase's expected URL
- **Solution**: Ensure your Twitter app's callback URL is exactly:
  ```
  https://your-project-ref.supabase.co/auth/v1/callback
  ```

#### 2. **"App not found" Error**
- **Cause**: Incorrect API credentials
- **Solution**: Double-check your API Key and Secret in both Twitter and Supabase

#### 3. **"OAuth 2.0 not enabled" Error**
- **Cause**: OAuth 2.0 is not enabled in your Twitter app
- **Solution**: Enable OAuth 2.0 in your Twitter app settings

#### 4. **"Email not provided" Error**
- **Cause**: Twitter app doesn't have permission to access email
- **Solution**: Enable "Request email from users" in Twitter app settings

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   echo $SUPABASE_AUTH_EXTERNAL_TWITTER_CLIENT_ID
   echo $SUPABASE_AUTH_EXTERNAL_TWITTER_SECRET
   ```

2. **Verify Supabase Configuration**:
   - Check that Twitter provider is enabled
   - Verify credentials are correctly entered

3. **Check Twitter App Settings**:
   - Ensure callback URL matches exactly
   - Verify OAuth 2.0 is enabled
   - Check that email permission is granted

## Step 5: Production Considerations

### 5.1 Security

- Never commit API secrets to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys

### 5.2 User Experience

- Test the complete sign-in flow
- Ensure proper error handling
- Add loading states for better UX

### 5.3 Monitoring

- Monitor authentication success rates
- Set up alerts for authentication failures
- Track user sign-up sources

## Step 6: Additional Configuration

### 6.1 Custom Scopes

If you need additional permissions, you can modify the OAuth request in your auth component:

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'twitter',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    scopes: 'read:users,read:email' // Add custom scopes if needed
  }
});
```

### 6.2 User Data Handling

After successful authentication, you can access user data:

```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('User data:', user);
console.log('Twitter ID:', user?.user_metadata?.provider_id);
console.log('Username:', user?.user_metadata?.user_name);
```

## Support

If you encounter issues:

1. Check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
2. Review [Twitter API Documentation](https://developer.twitter.com/en/docs/authentication/overview)
3. Check the [Supabase Community Forum](https://github.com/supabase/supabase/discussions)

## Environment Variables Summary

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Twitter OAuth
SUPABASE_AUTH_EXTERNAL_TWITTER_CLIENT_ID=your_twitter_api_key
SUPABASE_AUTH_EXTERNAL_TWITTER_SECRET=your_twitter_api_secret
```

## Next Steps

1. Set up Twitter OAuth credentials
2. Configure Supabase with your Twitter app
3. Test the integration
4. Deploy to production
5. Monitor and maintain the integration

Your Twitter OAuth integration is now ready! Users can sign in with their Twitter accounts seamlessly.
