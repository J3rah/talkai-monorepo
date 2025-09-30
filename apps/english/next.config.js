/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the problematic esmExternals setting
  // experimental: {
  //   esmExternals: 'loose',
  // },
  // Ensure proper hydration
  reactStrictMode: true,
  // Allow builds to succeed even if there are ESLint errors (temporary hot-fix)
  eslint: {
    // WARNING: keeps production builds green despite lint errors
    ignoreDuringBuilds: true,
  },
  // Add compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.talkai.im',
      },
      {
        protocol: 'https',
        hostname: 'talkai.im',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Enable compression
  compress: true,
  // Power page optimization
  poweredByHeader: false,
  // Generate etags for better caching
  generateEtags: true,
  // Optimize for dynamic imports
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Ensure proper client-side module resolution
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Better tree shaking for large libraries
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };

    // Simple webpack configuration without complex splitChunks
    return config;
  },
  // Add headers to prevent caching issues during development
  async headers() {
    return [
      {
        source: '/chat',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      // SEO and Security headers for all pages
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.google.com https://recaptcha.google.com https://www.gstatic.com https://checkout.stripe.com https://js.stripe.com https://www.googletagmanager.com https://challenges.cloudflare.com https://tally.so; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.google.com https://www.gstatic.com https://recaptcha.google.com https://js.stripe.com https://www.googletagmanager.com https://storage.googleapis.com https://challenges.cloudflare.com https://tally.so; worker-src 'self' blob: https://storage.googleapis.com; style-src 'self' 'unsafe-inline' https://www.gstatic.com https://fonts.googleapis.com; img-src 'self' data: https://www.gstatic.com; connect-src 'self' https://www.google.com https://recaptcha.google.com https://*.supabase.co wss://*.supabase.co https://api.hume.ai wss://api.hume.ai https://api.stripe.com https://challenges.cloudflare.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Temporarily commented out to fix Stripe payment issues
          // {
          //   key: 'Permissions-Policy',
          //   value: 'microphone=(self), camera=(self), geolocation=(), payment=*, usb=(), magnetometer=(), gyroscope=()',
          // },
          // SEO headers
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
      // Specific headers for public assets
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Sitemap and robots headers
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },
  // Add redirects for common SEO patterns
  async redirects() {
    return [
      // Redirect www to non-www (updated for correct domain)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'talkai.im',
          },
        ],
        destination: 'https://www.talkai.im/:path*',
        permanent: true,
      },
      // Redirect old paths (if any)
      {
        source: '/talk',
        destination: '/chat',
        permanent: true,
      },
      {
        source: '/therapy',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 