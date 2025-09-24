import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development or for debugging
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!isDev) {
    // In production, return minimal info for security
    return NextResponse.json({
      turnstileSiteKeyExists: !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      turnstileSecretKeyExists: !!process.env.TURNSTILE_SECRET_KEY,
      nodeEnv: process.env.NODE_ENV,
    });
  }
  
  // In development, return full info
  return NextResponse.json({
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || 'NOT_SET',
    turnstileSiteKeyExists: !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ? 'SET' : 'NOT_SET',
    turnstileSecretKeyExists: !!process.env.TURNSTILE_SECRET_KEY,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('TURNSTILE')),
  });
}
