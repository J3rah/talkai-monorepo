# talkAI Monorepo Deployment Guide

This guide covers deploying both English and Spanish versions of talkAI from the monorepo structure.

## Project Structure

```
talkAI-monorepo/
├── apps/
│   ├── english/          # English version (talkai.im)
│   └── spanish/          # Spanish version (es.talkai.im)
├── packages/
│   ├── common/           # Shared utilities
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utility functions
└── vercel.json           # Root Vercel configuration
```

## Vercel Deployment Setup

### 1. Create Two Separate Vercel Projects

#### English Project (talkai.im)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `talkAI-monorepo`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/english`
   - **Build Command**: `cd ../.. && npm install && npm run build --workspace=apps/english`
   - **Output Directory**: `apps/english/.next`
   - **Install Command**: `cd ../.. && npm install`

#### Spanish Project (es.talkai.im)
1. Create another project in Vercel
2. Import from same GitHub repo: `talkAI-monorepo`
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/spanish`
   - **Build Command**: `cd ../.. && npm install && npm run build --workspace=apps/spanish`
   - **Output Directory**: `apps/spanish/.next`
   - **Install Command**: `cd ../.. && npm install`

### 2. Environment Variables

Set up environment variables for each project:

#### English Project Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hume AI
HUME_API_KEY=your_hume_api_key
HUME_VOICE_CONFIG_ID=your_english_voice_config_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_DEFAULT_LANGUAGE=English
NEXT_PUBLIC_SITE_URL=https://talkai.im
```

#### Spanish Project Environment Variables
```bash
# Supabase (same as English)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hume AI
HUME_API_KEY=your_hume_api_key
HUME_VOICE_CONFIG_ID=your_spanish_voice_config_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=es
NEXT_PUBLIC_DEFAULT_LANGUAGE=Español
NEXT_PUBLIC_SITE_URL=https://es.talkai.im
```

### 3. Domain Configuration

#### English Domain (talkai.im)
1. In the English Vercel project settings
2. Go to "Domains"
3. Add `talkai.im` and `www.talkai.im`
4. Configure DNS records as instructed by Vercel

#### Spanish Domain (es.talkai.im)
1. In the Spanish Vercel project settings
2. Go to "Domains"
3. Add `es.talkai.im`
4. Configure DNS records as instructed by Vercel

### 4. Database Setup

Both projects will use the same Supabase database, but with different:
- Voice configuration IDs (English vs Spanish)
- Locale settings
- Site URLs

### 5. Hume AI Voice Configuration

#### English Voice Config
- Create voice configuration in Hume AI dashboard
- Use English language settings
- Copy the config ID to English project environment variables

#### Spanish Voice Config
- Create separate voice configuration in Hume AI dashboard
- Use Spanish language settings
- Copy the config ID to Spanish project environment variables

## Local Development

### Start Both Apps
```bash
# Start English app (port 3000)
npm run dev:en

# Start Spanish app (port 3001)
npm run dev:es
```

### Build Both Apps
```bash
# Build English app
npm run build:en

# Build Spanish app
npm run build:es

# Build both
npm run build
```

## Deployment Workflow

1. **Make Changes**: Edit code in either `apps/english/` or `apps/spanish/`
2. **Test Locally**: Run `npm run dev:en` and `npm run dev:es`
3. **Commit Changes**: `git add . && git commit -m "your message"`
4. **Push to GitHub**: `git push origin main`
5. **Auto Deploy**: Vercel will automatically deploy both projects

## Shared Code Updates

When updating shared packages in `packages/`:
1. Make changes to shared code
2. Both apps will automatically use the updated shared code
3. Deploy both projects to see changes live

## Troubleshooting

### Build Failures
- Check that all environment variables are set
- Verify that shared packages are properly linked
- Check Next.js version compatibility

### Domain Issues
- Ensure DNS records are properly configured
- Check that domains are added to correct Vercel projects
- Verify SSL certificates are active

### Voice Configuration Issues
- Verify Hume AI API keys are correct
- Check that voice config IDs match the language
- Test voice configurations in Hume AI dashboard

## Support

For issues with:
- **English version**: Check English Vercel project logs
- **Spanish version**: Check Spanish Vercel project logs
- **Shared code**: Check both projects after updates
