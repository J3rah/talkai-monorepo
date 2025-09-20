import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/Footer"
import ClientOnly from '@/components/ClientOnly'
import ConditionalNav from '@/components/ConditionalNav'
import ConditionalFooter from '@/components/ConditionalFooter'
import NotificationBanner from '@/components/NotificationBanner'
import BannerSpacer from '@/components/BannerSpacer'
import { getActiveBanner } from '@/lib/bannerConfig'
import ConditionalCookieConsent from "@/components/ConditionalCookieConsent"

const ASSET_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION || '1'
const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'TalkAI - AI Therapist & Mental Health Support | Empathetic Voice AI',
    template: '%s | TalkAI - Empathetic AI Therapy'
  },
  description: 'TalkAI is your 24/7 AI therapist providing empathetic voice conversations for mental health support. Experience emotional AI that understands, listens, and helps improve your wellbeing. Free trial available.',
  keywords: [
    'AI therapist',
    'mental health AI',
    'empathetic voice AI',
    'AI therapy',
    'emotional support AI',
    'voice therapy',
    'mental wellness',
    'AI counseling',
    'therapeutic AI',
    'mental health support',
    'AI companion',
    'therapy chatbot',
    'emotional AI',
    'wellbeing AI',
    'stress relief AI'
  ],
  authors: [{ name: 'TalkAI Team' }],
  creator: 'TalkAI',
  publisher: 'TalkAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.talkai.im'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'TalkAI - AI Therapist & Mental Health Support | Empathetic Voice AI',
    description: 'Experience 24/7 AI therapy with empathetic voice conversations. TalkAI provides mental health support through advanced emotional AI technology. Start your free trial today.',
    siteName: 'TalkAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TalkAI - AI Therapist & Mental Health Support',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'TalkAI - Empathetic Voice AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalkAI - AI Therapist & Mental Health Support',
    description: 'Experience 24/7 AI therapy with empathetic voice conversations. Mental health support through advanced emotional AI.',
    images: ['/twitter-image.png'],
    creator: '@TalkAI',
    site: '@TalkAI',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION || '',
    },
  },
  category: 'Health & Wellness',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const activeBanner = getActiveBanner();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.hume.ai" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://checkout.stripe.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href={`/favicon.ico?v=${ASSET_VERSION}`} sizes="any" />
        <link rel="icon" href={`/favicon.svg?v=${ASSET_VERSION}`} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={`/apple-touch-icon.png?v=${ASSET_VERSION}`} />
        <link rel="manifest" href={`/manifest.json?v=${ASSET_VERSION}`} />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TalkAI",
              description: "AI-powered mental health support and therapy platform with empathetic voice technology",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.talkai.im",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.talkai.im"}/logo.png?v=${ASSET_VERSION}`,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "English"
              },
              sameAs: [
                "https://twitter.com/TalkAI",
                "https://www.linkedin.com/company/talkai_im"
              ]
            })
          }}
        />
        
        {/* Structured Data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "TalkAI",
              description: "AI therapist providing 24/7 mental health support through empathetic voice conversations",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.talkai.im",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free trial available"
              },
              featureList: [
                "AI Therapy Sessions",
                "Voice Conversations",
                "Emotion Analysis",
                "24/7 Availability",
                "Privacy Protection"
              ]
            })
          }}
        />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
 })(window,document,'script','dataLayer','GTM-W3W45FPK');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W3W45FPK"
height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Notification Banner */}
          <ClientOnly>
            {activeBanner && (
              <NotificationBanner
                id={activeBanner.id}
                message={activeBanner.message}
                type={activeBanner.type}
                delay={activeBanner.delay}
                autoHide={activeBanner.autoHide}
                autoHideDelay={activeBanner.autoHideDelay}
                persistDismissal={activeBanner.persistDismissal}
                showLink={activeBanner.showLink}
                href={activeBanner.href}
                linkText={activeBanner.linkText}
              />
            )}
          </ClientOnly>

          <div className="flex flex-col min-h-screen">
            {/* Banner Spacer */}
            <ClientOnly>
              {activeBanner && (
                <BannerSpacer 
                  bannerId={activeBanner.id} 
                  delay={activeBanner.delay || 3000} 
                />
              )}
            </ClientOnly>
            
            <ClientOnly>
              <ConditionalNav />
            </ClientOnly>
            <main className="flex-1">
              {children}
            </main>
            <ClientOnly>
              <ConditionalFooter />
            </ClientOnly>
            <ClientOnly>
              <ConditionalCookieConsent />
            </ClientOnly>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
