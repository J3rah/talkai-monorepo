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
    default: 'talkAI - Terapeuta IA y Apoyo de Salud Mental | IA de Voz Empática',
    template: '%s | talkAI - Terapia IA Empática'
  },
  description: 'talkAI es tu terapeuta IA 24/7 que proporciona conversaciones de voz empáticas para apoyo de salud mental. Experimenta IA emocional que entiende, escucha y ayuda a mejorar tu bienestar. Prueba gratuita disponible.',
  keywords: [
    'terapeuta IA',
    'salud mental IA',
    'IA de voz empática',
    'terapia IA',
    'apoyo emocional IA',
    'terapia de voz',
    'bienestar mental',
    'asesoramiento IA',
    'IA terapéutica',
    'apoyo salud mental',
    'compañero IA',
    'chatbot terapia',
    'IA emocional',
    'bienestar IA',
    'alivio estrés IA'
  ],
  authors: [{ name: 'Equipo talkAI' }],
  creator: 'talkAI',
  publisher: 'talkAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.talkai.es'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    title: 'talkAI - Terapeuta IA y Apoyo de Salud Mental | IA de Voz Empática',
    description: 'Experimenta terapia IA 24/7 con conversaciones de voz empáticas. talkAI proporciona apoyo de salud mental a través de tecnología IA emocional avanzada. Comienza tu prueba gratuita hoy.',
    siteName: 'talkAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'talkAI - Terapeuta IA y Apoyo de Salud Mental',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'talkAI - IA de Voz Empática',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'talkAI - Terapeuta IA y Apoyo de Salud Mental',
    description: 'Experimenta terapia IA 24/7 con conversaciones de voz empáticas. Apoyo de salud mental a través de IA emocional avanzada.',
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
    <html lang="es" suppressHydrationWarning>
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
              name: "talkAI",
              description: "Plataforma de terapia y apoyo de salud mental impulsada por IA con tecnología de voz empática",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.talkai.es",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.talkai.im"}/logo.png?v=${ASSET_VERSION}`,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "Español"
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
              name: "talkAI",
              description: "Terapeuta IA que proporciona apoyo de salud mental 24/7 a través de conversaciones de voz empáticas",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.talkai.es",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Prueba gratuita disponible"
              },
              featureList: [
                "Sesiones de Terapia IA",
                "Conversaciones de Voz",
                "Análisis de Emociones",
                "Disponibilidad 24/7",
                "Protección de Privacidad"
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
