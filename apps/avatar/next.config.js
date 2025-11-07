/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cloudflare.com https://challenges.cloudflare.com https://cdn.jsdelivr.net blob:",
              "script-src-elem 'self' 'unsafe-inline' https://*.cloudflare.com https://challenges.cloudflare.com https://cdn.jsdelivr.net blob:",
              "style-src 'self' 'unsafe-inline' https://*.cloudflare.com https://challenges.cloudflare.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://api.hume.ai wss://api.hume.ai https://api.heygen.com https://*.cloudflare.com https://challenges.cloudflare.com",
              "media-src 'self' blob: https:",
              "frame-src 'self' https://*.cloudflare.com https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
            ].join('; ')
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;

