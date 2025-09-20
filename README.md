# talkAI Monorepo

A monorepo containing both English and Spanish versions of talkAI - an AI-powered emotional support platform.

## Structure

```
talkAI-monorepo/
├── apps/
│   ├── english/          # English Next.js app (talkai.im)
│   └── spanish/          # Spanish Next.js app (es.talkai.im)
├── packages/
│   ├── shared/           # Shared utilities, types, and constants
│   ├── ui/              # Shared UI components (future)
│   └── config/          # Shared configuration files (future)
├── locales/
│   ├── en/              # English translations
│   └── es/              # Spanish translations
└── package.json         # Root package.json with workspaces
```

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development
```bash
# Start English version (default)
npm run dev

# Start English version explicitly
npm run dev:en

# Start Spanish version
npm run dev:es
```

### Build
```bash
# Build both versions
npm run build

# Build specific version
npm run build:en
npm run build:es
```

## Deployment

### Vercel Setup

1. **English Project** (`talkai.im`)
   - Repository: This monorepo
   - Root Directory: `apps/english`
   - Domain: `talkai.im`

2. **Spanish Project** (`es.talkai.im`)
   - Repository: This monorepo
   - Root Directory: `apps/spanish`
   - Domain: `es.talkai.im`

### Environment Variables

Each app has its own environment variables:
- `apps/english/.env.local` - English configuration
- `apps/spanish/.env.local` - Spanish configuration

## Features

- ✅ **Monorepo Architecture** - Single codebase, multiple deployments
- ✅ **Shared Code** - Common utilities, types, and constants
- ✅ **Internationalization** - English and Spanish support
- ✅ **Subdomain Support** - `talkai.im` and `es.talkai.im`
- ✅ **Independent Deployments** - Each version deploys separately
- ✅ **TypeScript** - Full type safety across all packages

## Development Workflow

1. **Make changes** in the appropriate app directory
2. **Update shared code** in `packages/shared` if needed
3. **Test both versions** locally
4. **Deploy** - Vercel automatically deploys both apps

## Adding New Features

1. **Core Logic**: Add to `packages/shared`
2. **UI Components**: Add to `packages/ui` (future)
3. **App-Specific**: Add to respective app directory
4. **Translations**: Update locale files in `locales/`

## Scripts

- `npm run dev` - Start English development server
- `npm run dev:en` - Start English development server
- `npm run dev:es` - Start Spanish development server
- `npm run build` - Build both versions
- `npm run build:en` - Build English version
- `npm run build:es` - Build Spanish version
- `npm run lint` - Lint both versions
- `npm run clean` - Clean all node_modules
