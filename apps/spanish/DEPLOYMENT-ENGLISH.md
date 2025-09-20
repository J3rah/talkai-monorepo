# Deployment Guide for the English Version of talkAI

## Deployment on Vercel (Recommended)

### 1. Project Preparation

#### Verify Configuration
```bash
# Verify all translations are complete
npm run build

# Verify no linting errors
npm run lint
```

#### Configure Environment Variables
```bash
# Copy configuration file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 2. Vercel Deployment

#### Option A: Deploy from GitHub
1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Connect your GitHub repository

2. **Configure Environment Variables**:
   ```env
   # General Configuration
   NEXT_PUBLIC_SITE_URL=https://www.talkai.com
   NEXT_PUBLIC_DEFAULT_LOCALE=en
   NEXT_PUBLIC_CURRENCY=USD
   
   # Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Hume AI
   HUME_API_KEY=your_hume_api_key
   HUME_SECRET_KEY=your_hume_secret_key
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

3. **Configure Domain**:
   - Go to "Domains" in Vercel dashboard
   - Add `talkai.com` as custom domain
   - Configure SSL certificate

#### Option B: Deploy from CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Configure environment variables
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add NEXT_PUBLIC_DEFAULT_LOCALE
# ... (add all necessary variables)
```

### 3. Domain Configuration

#### DNS Configuration
```
# A Record
@ 76.76.19.19

# CNAME Record
www cname.vercel-dns.com
```

#### SSL Verification
- Vercel automatically configures SSL certificate
- Verify site loads with HTTPS

### 4. Database Configuration

#### Supabase
1. **Create Project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Configure region (US East for US)

2. **Configure Tables**:
   ```sql
   -- Run SQL migrations
   -- (See files in supabase/migrations/)
   ```

3. **Configure RLS**:
   ```sql
   -- Configure Row Level Security
   -- (See configuration files)
   ```

### 5. External Services Configuration

#### Hume AI
1. **Create Account**:
   - Go to [Hume AI Console](https://beta.hume.ai/)
   - Create an account
   - Generate API keys

2. **Configure Voice**:
   - Configure English voices
   - Test emotion detection

#### OpenAI
1. **Configure API**:
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create an API key
   - Configure model for English

#### Stripe
1. **Configure Account**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Create products with USD pricing
   - Configure webhooks

### 6. Email Configuration

#### SMTP Configuration
```env
# For English emails
EMAIL_FROM_NAME=talkAI
EMAIL_FROM_ADDRESS=noreply@talkai.com
EMAIL_TEMPLATE_LANGUAGE=en
```

#### Email Templates
- Configure English email templates
- Include English contact information
- Configure auto-responses

### 7. Analytics Configuration

#### Google Analytics
```env
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

#### Google Tag Manager
```env
NEXT_PUBLIC_GTM_ID=your_google_tag_manager_id
```

### 8. Monitoring Configuration

#### Vercel Analytics
- Enable Vercel Analytics
- Configure performance alerts

#### Sentry (Optional)
```env
SENTRY_DSN=your_sentry_dsn
```

### 9. SEO Configuration

#### Sitemap
- Configure English sitemap
- Include all translated pages

#### Meta Tags
- Configure English meta tags
- Include English Open Graph

### 10. Post-Deployment Testing

#### Verification Checklist
- [ ] Site loads correctly
- [ ] All pages are in English
- [ ] Forms work correctly
- [ ] Payments process in USD
- [ ] Emails send in English
- [ ] Analytics work
- [ ] SSL is configured
- [ ] Custom domain works

### 11. Production Configuration

#### Production Environment Variables
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.talkai.com
NEXT_PUBLIC_DEBUG_MODE=false
```

#### Cache Configuration
- Configure CDN
- Optimize images
- Configure compression

### 12. Maintenance

#### Updates
- Configure automatic updates
- Configure database backups
- Monitor performance

#### Support
- Configure ticket system
- Configure support chat
- Configure English documentation

### 13. Additional Resources

#### Documentation
- [English README](README.md)
- [English Configuration](CONFIGURATION-ENGLISH.md)

#### Useful Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Hume AI Console](https://beta.hume.ai/)
- [OpenAI Platform](https://platform.openai.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)

---

**Note**: This guide is optimized for deploying the English version of talkAI in the US market.
