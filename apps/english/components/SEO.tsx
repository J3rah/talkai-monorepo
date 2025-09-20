"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  structuredData?: object;
  noindex?: boolean;
  canonicalUrl?: string;
}

export default function SEO({
  title = 'TalkAI - AI Therapist & Mental Health Support',
  description = 'Experience 24/7 AI therapy with empathetic voice conversations. TalkAI provides mental health support through advanced emotional AI technology.',
  keywords = ['AI therapist', 'mental health AI', 'empathetic voice AI', 'AI therapy'],
  image = '/og-image.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'TalkAI Team',
  structuredData,
  noindex = false,
  canonicalUrl,
}: SEOProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.talkai.im';
  const fullUrl = url || `${baseUrl}${pathname}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const canonical = canonicalUrl || fullUrl;

  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', author);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Open Graph tags
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', fullImageUrl);
    updatePropertyTag('og:url', fullUrl);
    updatePropertyTag('og:site_name', 'TalkAI');
    updatePropertyTag('og:locale', 'en_US');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@TalkAI');
    updateMetaTag('twitter:creator', '@TalkAI');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', fullImageUrl);

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) updatePropertyTag('article:published_time', publishedTime);
      if (modifiedTime) updatePropertyTag('article:modified_time', modifiedTime);
      if (author) updatePropertyTag('article:author', author);
    }

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // Add structured data
    const defaultStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: fullUrl,
      publisher: {
        '@type': 'Organization',
        name: 'TalkAI',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
      ...(publishedTime && { datePublished: publishedTime }),
      ...(modifiedTime && { dateModified: modifiedTime }),
      ...(author && {
        author: {
          '@type': 'Person',
          name: author,
        },
      }),
    };

    const finalStructuredData = structuredData || defaultStructuredData;

    // Remove existing structured data script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(finalStructuredData);
    document.head.appendChild(script);

  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, author, structuredData, noindex, canonicalUrl, pathname, baseUrl, fullUrl, fullImageUrl, canonical]);

  return null;
} 