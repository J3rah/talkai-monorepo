import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TalkAI Avatar - Real-time AI Therapy with Human Avatar',
  description: 'Experience empathetic AI therapy with a human-like avatar powered by Hume EVI and HeyGen',
  keywords: ['AI therapy', 'mental health', 'avatar', 'emotional AI', 'teletherapy'],
  authors: [{ name: 'TalkAI' }],
  openGraph: {
    title: 'TalkAI Avatar - Real-time AI Therapy',
    description: 'Experience empathetic AI therapy with a human-like avatar',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cloudflare.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https://vercel.live https://cdn.jsdelivr.net blob:",
            "script-src-elem 'self' 'unsafe-inline' https://*.cloudflare.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https://vercel.live https://cdn.jsdelivr.net blob:",
            "style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data:",
            "connect-src 'self' https://*.supabase.co https://api.hume.ai wss://api.hume.ai https://api.heygen.com https://challenges.cloudflare.com",
            "media-src 'self' blob: https:",
            "frame-src 'self' https://challenges.cloudflare.com",
            "worker-src 'self' blob:",
          ].join('; ')}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

