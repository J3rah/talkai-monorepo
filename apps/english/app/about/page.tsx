"use client";

import TalkAILogo from '@/components/logos/TalkAI';
import Link from 'next/link';
import { useEffect } from 'react';

// Add metadata for this page
const pageMetadata = {
  title: 'About TalkAI - AI Therapy Platform | Our Mission & Technology',
  description: 'Learn about TalkAI\'s mission to make mental health support accessible through empathetic AI technology. Discover our approach to AI therapy, privacy commitment, and how we\'re revolutionizing mental wellness.',
  keywords: [
    'about TalkAI',
    'AI therapy mission',
    'mental health technology',
    'empathetic AI platform',
    'AI therapy approach',
    'mental wellness innovation'
  ]
};

export default function AboutPage() {
  // Set page metadata dynamically for client component
  useEffect(() => {
    document.title = pageMetadata.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageMetadata.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = pageMetadata.description;
      document.head.appendChild(meta);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', pageMetadata.keywords.join(', '));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = pageMetadata.keywords.join(', ');
      document.head.appendChild(meta);
    }
    
    // Add canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.origin + '/about');
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.origin + '/about';
      document.head.appendChild(link);
    }
    
    // Add structured data for AboutPage
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About TalkAI",
      "description": pageMetadata.description,
      "url": window.location.origin + "/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "TalkAI",
        "description": "AI-powered mental health support platform providing empathetic voice therapy",
        "foundingDate": "2024",
        "mission": "To make mental wellness accessible, stigma-free, and always available through empathetic AI technology"
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => {
        if (script.textContent?.includes('AboutPage')) {
          script.remove();
        }
      });
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* SEO-optimized headings with proper hierarchy */}
      <div className="flex flex-col items-center mb-8">
        <TalkAILogo className="w-32 h-32 mb-4" />
        <h1 className="text-3xl font-bold text-center mb-2">About TalkAI - AI Therapy Platform</h1>
        <p className="text-lg text-muted-foreground text-center max-w-xl">
          Empathy. Privacy. Support. <br />
          Your 24/7 AI therapist for mental wellness and emotional support.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">What is TalkAI?</h2>
        <p className="text-base text-muted-foreground">
          TalkAI is a next-generation AI-powered mental health support platform designed to provide a safe, judgment-free space for anyone seeking therapy, emotional support, or someone to talk to. Our empathetic voice AI understands emotions and provides personalized responses, making mental health care accessible 24/7 from anywhere in the world.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Our Mission: Revolutionizing Mental Health Care</h2>
        <p className="text-base text-muted-foreground">
          Our mission is to make mental wellness accessible, stigma-free, and always available through advanced AI therapy technology. We believe everyone deserves immediate access to emotional support and mental health resources—no matter their background, location, or circumstances. TalkAI combines cutting-edge empathetic AI with a deep commitment to privacy, security, and genuine care.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Why Choose talkAI?</h2>
        <ul className="list-disc pl-6 text-base text-muted-foreground space-y-2">
          <li><strong>Confidential & Secure:</strong> Your conversations are private. We never share your data without your consent.</li>
          <li><strong>Always Available:</strong> talkAI is here 24/7—no appointments, no waiting rooms.</li>
          <li><strong>Empathetic AI:</strong> Our AI is trained to listen, understand, and respond with compassion.</li>
          <li><strong>Customizable Experience:</strong> Choose your AI companion’s voice and style to match your comfort.</li>
          <li><strong>Accessible to All:</strong> We’re committed to making support available to everyone, everywhere.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Meet the Team</h2>
        <p className="text-base text-muted-foreground">
          talkAI is built by a passionate team of technologists, mental health advocates, and designers. We’re united by a shared vision: to empower people with safe, supportive, and innovative tools for well-being. <br /><br />
          <span className="italic">(Team bios coming soon!)</span>
        </p>
      </section>

      <div className="text-center mt-10">
        <Link href="/">
          <span className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition">Back to Home</span>
        </Link>
      </div>
    </div>
  );
} 