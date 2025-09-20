"use client";

import TalkAILogo from '@/components/logos/TalkAI';
import Link from 'next/link';
import { useEffect } from 'react';

// Add metadata for this page
const pageMetadata = {
  title: 'Acerca de talkAI - Plataforma de Terapia IA | Nuestra Misión y Tecnología',
  description: 'Conoce la misión de talkAI para hacer el apoyo de salud mental accesible a través de tecnología IA empática. Descubre nuestro enfoque de terapia IA, compromiso de privacidad y cómo estamos revolucionando el bienestar mental.',
  keywords: [
    'acerca de talkAI',
    'misión terapia IA',
    'tecnología salud mental',
    'plataforma IA empática',
    'enfoque terapia IA',
    'innovación bienestar mental'
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
        "name": "Acerca de talkAI",
        "description": pageMetadata.description,
        "url": window.location.origin + "/about",
        "mainEntity": {
          "@type": "Organization",
          "name": "talkAI",
          "description": "Plataforma de apoyo de salud mental impulsada por IA que proporciona terapia de voz empática",
          "foundingDate": "2024",
          "mission": "Hacer el bienestar mental accesible, libre de estigma y siempre disponible a través de tecnología IA empática"
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
        <h1 className="text-3xl font-bold text-center mb-2">Acerca de talkAI - Plataforma de Terapia IA</h1>
        <p className="text-lg text-muted-foreground text-center max-w-xl">
          Empatía. Privacidad. Apoyo. <br />
          Tu terapeuta IA 24/7 para bienestar mental y apoyo emocional.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">¿Qué es talkAI?</h2>
        <p className="text-base text-muted-foreground">
          talkAI es una plataforma de apoyo de salud mental de próxima generación impulsada por IA, diseñada para proporcionar un espacio seguro y libre de juicios para cualquiera que busque terapia, apoyo emocional o alguien con quien hablar. Nuestra IA de voz empática entiende las emociones y proporciona respuestas personalizadas, haciendo el cuidado de salud mental accesible 24/7 desde cualquier lugar del mundo.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Nuestra Misión: Revolucionando el Cuidado de Salud Mental</h2>
        <p className="text-base text-muted-foreground">
          Nuestra misión es hacer el bienestar mental accesible, libre de estigma y siempre disponible a través de tecnología avanzada de terapia IA. Creemos que todos merecen acceso inmediato al apoyo emocional y recursos de salud mental, sin importar su origen, ubicación o circunstancias. talkAI combina IA empática de vanguardia con un profundo compromiso con la privacidad, seguridad y cuidado genuino.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">¿Por qué elegir talkAI?</h2>
        <ul className="list-disc pl-6 text-base text-muted-foreground space-y-2">
          <li><strong>Confidencial y Seguro:</strong> Tus conversaciones son privadas. Nunca compartimos tus datos sin tu consentimiento.</li>
          <li><strong>Siempre Disponible:</strong> talkAI está aquí 24/7—sin citas, sin salas de espera.</li>
          <li><strong>IA Empática:</strong> Nuestra IA está entrenada para escuchar, entender y responder con compasión.</li>
          <li><strong>Experiencia Personalizable:</strong> Elige la voz y estilo de tu compañero IA para que coincida con tu comodidad.</li>
          <li><strong>Accesible para Todos:</strong> Estamos comprometidos a hacer el apoyo disponible para todos, en todas partes.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Conoce al Equipo</h2>
        <p className="text-base text-muted-foreground">
          talkAI está construido por un equipo apasionado de tecnólogos, defensores de la salud mental y diseñadores. Estamos unidos por una visión compartida: empoderar a las personas con herramientas seguras, de apoyo e innovadoras para el bienestar. <br /><br />
          <span className="italic">(¡Biografías del equipo próximamente!)</span>
        </p>
      </section>

      <div className="text-center mt-10">
        <Link href="/">
          <span className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition">Volver al Inicio</span>
        </Link>
      </div>
    </div>
  );
} 