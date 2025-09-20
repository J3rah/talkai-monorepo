import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.talkai.im'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/auth',
          '/faq',
          '/privacy',
          '/terms',
          '/disclaimer',
          '/mental-health-resources',
          '/subscription',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/chat/',
          '/sessions/',
          '/rechat/',
          '/session/',
          '/auth/callback',
          '/auth/reset-password',
          '/confirm-signup',
          '/subscription/success',
          '/subscription/cancel',
          '/test-*',
          '/_next/',
          '/public/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about',
          '/auth',
          '/faq',
          '/privacy',
          '/terms',
          '/disclaimer',
          '/mental-health-resources',
          '/subscription',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/chat/',
          '/sessions/',
          '/rechat/',
          '/session/',
          '/auth/callback',
          '/auth/reset-password',
          '/confirm-signup',
          '/subscription/success',
          '/subscription/cancel',
          '/test-*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 