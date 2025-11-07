# TalkAI Avatar - Deployment Guide

This guide walks you through deploying the TalkAI Avatar app to production on Vercel with the subdomain `avatar.talkai.im`.

## Prerequisites

Before deployment, ensure you have:

1. ✅ Hume AI account with API keys
2. ✅ HeyGen account with API keys and avatar ID
3. ✅ ElevenLabs account (optional, for custom TTS)
4. ✅ Supabase project (shared with main talkAI app)
5. ✅ Vercel account
6. ✅ Domain access to configure DNS

## Step 1: Environment Variables

### Required Variables

Add these to your Vercel project settings:

```env
# Supabase (Shared with main TalkAI app)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hume AI Configuration
HUME_API_KEY=your_hume_api_key
HUME_SECRET_KEY=your_hume_secret_key
NEXT_PUBLIC_HUME_CONFIG_ID=your_evi_config_id

# HeyGen Configuration
HEYGEN_API_KEY=your_heygen_api_key
NEXT_PUBLIC_HEYGEN_AVATAR_ID=your_avatar_id
HEYGEN_VOICE_ID=your_voice_id

# ElevenLabs Configuration (Optional)
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=your_voice_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://avatar.talkai.im
NODE_ENV=production
```

### How to Get API Keys

#### Hume AI
1. Go to https://beta.hume.ai
2. Sign up / Log in
3. Navigate to API Keys section
4. Create new API key and secret key
5. Create an EVI configuration:
   - Go to EVI Configurations
   - Click "Create New Configuration"
   - Set system prompt: "You are an empathetic therapist..."
   - Enable emotion analysis
   - Copy the config ID

#### HeyGen
1. Go to https://app.heygen.com
2. Sign up / Log in
3. Go to Settings → API
4. Generate API key
5. Go to Avatars section
6. Create or select an avatar
7. Copy the avatar ID (found in avatar settings)

#### ElevenLabs (Optional)
1. Go to https://elevenlabs.io
2. Sign up / Log in
3. Go to Profile → API Keys
4. Generate new API key
5. Go to Voices → Select a voice
6. Copy the voice ID

## Step 2: Vercel Project Setup

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/avatar`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add environment variables (from Step 1)
6. Click "Deploy"

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to avatar app
cd apps/avatar

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add HUME_API_KEY
vercel env add HUME_SECRET_KEY
# ... add all other variables
```

## Step 3: Domain Configuration

### DNS Setup

1. Go to your domain registrar (e.g., Cloudflare, GoDaddy, Namecheap)
2. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: `avatar`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: Auto or 3600

Example for Cloudflare:
```
Type: CNAME
Name: avatar
Target: cname.vercel-dns.com
Proxy status: DNS only (grey cloud)
TTL: Auto
```

### Vercel Domain Setup

1. Go to your Vercel project
2. Navigate to Settings → Domains
3. Add domain: `avatar.talkai.im`
4. Wait for DNS propagation (can take 1-48 hours)
5. Verify SSL certificate is issued (automatic)

## Step 4: Database Schema Updates

The avatar app uses the existing talkAI Supabase database but adds a few optional columns:

```sql
-- Add avatar-specific columns to chat_sessions
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS avatar_id TEXT,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- The emotion_metrics table should already exist from talkAI
-- No additional tables needed
```

Run this SQL in your Supabase SQL editor.

## Step 5: Testing

### Test Checklist

1. ✅ Homepage loads at https://avatar.talkai.im
2. ✅ Authentication works (login/signup)
3. ✅ Session page initializes
4. ✅ Microphone permission requested
5. ✅ Avatar video loads and displays
6. ✅ Voice input is captured
7. ✅ Avatar responds with lip-sync
8. ✅ Emotions are detected and displayed
9. ✅ Transcript updates in real-time
10. ✅ Timer counts up correctly
11. ✅ Session can be paused/resumed
12. ✅ Session ends properly
13. ✅ Conversation saved to database (if enabled)

### Test in Multiple Browsers

- ✅ Chrome/Edge (WebRTC highly compatible)
- ✅ Firefox (test WebRTC compatibility)
- ✅ Safari (may have WebRTC restrictions)
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## Step 6: Performance Optimization

### Recommended Vercel Settings

1. Enable Edge Functions for API routes
2. Set region to closest to users (e.g., `iad1` for US East)
3. Enable compression
4. Configure caching headers

### In `vercel.json`:

```json
{
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=0, must-revalidate" }
      ]
    }
  ]
}
```

## Step 7: Monitoring

### Set Up Monitoring

1. **Vercel Analytics**
   - Enable in Project Settings → Analytics
   - Monitor page views, performance

2. **Error Tracking (Optional)**
   - Add Sentry for error tracking
   - Add LogRocket for session replay

3. **Hume AI Dashboard**
   - Monitor API usage
   - Check for errors/rate limits

4. **HeyGen Dashboard**
   - Monitor video streaming minutes
   - Check for avatar rendering issues

## Step 8: Security Checklist

- ✅ All API keys in environment variables (not in code)
- ✅ Supabase Row Level Security (RLS) enabled
- ✅ CORS configured properly
- ✅ Rate limiting on API routes (use Vercel Edge Config)
- ✅ Authentication required for sessions
- ✅ WebRTC connections encrypted (DTLS-SRTP)
- ✅ SSL certificate active
- ✅ Content Security Policy headers

## Step 9: Subdomain Routing (Monorepo)

If deploying from monorepo with multiple apps:

### Root `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/avatar/package.json",
      "use": "@vercel/next",
      "config": {
        "buildCommand": "cd apps/avatar && npm run build",
        "zeroConfig": true
      }
    }
  ],
  "routes": [
    {
      "src": "/avatar/(.*)",
      "dest": "apps/avatar/$1"
    }
  ]
}
```

Or create separate Vercel projects for each app.

## Troubleshooting

### Issue: Avatar video not loading

**Solutions:**
1. Check HeyGen API key is valid
2. Verify avatar ID exists
3. Check browser console for WebRTC errors
4. Test in different browser
5. Check firewall/network restrictions

### Issue: Hume connection fails

**Solutions:**
1. Verify API key and secret key
2. Check EVI config ID is correct
3. Test microphone permissions
4. Check browser console for WebSocket errors
5. Verify Hume API status (https://status.hume.ai)

### Issue: High latency (>2 seconds)

**Solutions:**
1. Lower HeyGen video quality to 'medium'
2. Reduce emotion update throttle interval
3. Check user's internet speed
4. Consider using regional CDN
5. Optimize audio chunk size

### Issue: Authentication fails

**Solutions:**
1. Verify Supabase URL and anon key
2. Check auth callback URL is whitelisted in Supabase
3. Test with direct Supabase login
4. Check browser cookies enabled
5. Verify user exists in database

### Issue: Database save errors

**Solutions:**
1. Verify Supabase RLS policies
2. Check table permissions
3. Verify user has profile in database
4. Check foreign key constraints
5. Review Supabase logs

## Post-Deployment

### Monitor First 24 Hours

1. Check error logs in Vercel
2. Monitor API usage in Hume/HeyGen dashboards
3. Test from different locations/devices
4. Gather user feedback
5. Monitor database query performance

### Scaling Considerations

- **Concurrent Users**: Each session creates WebSocket + WebRTC connections
- **HeyGen Limits**: Check streaming minute limits on your plan
- **Hume Limits**: Monitor API call limits
- **Database**: Ensure Supabase plan supports expected traffic
- **Vercel**: May need Pro plan for higher limits

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Hume AI: support@hume.ai
- HeyGen: support@heygen.com
- Supabase: https://supabase.com/support

---

🎉 Once deployed, your avatar therapist will be live at https://avatar.talkai.im!

