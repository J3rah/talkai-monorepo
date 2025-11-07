import { NextResponse, type NextRequest } from 'next/server';

export function middleware(_req: NextRequest) {
  const res = NextResponse.next();

  const csp = [
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
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: ['/:path*'],
};
