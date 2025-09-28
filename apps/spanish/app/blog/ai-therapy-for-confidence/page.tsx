import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, Star, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'terapia IA for Confidence: Building autoestima and Personal Power',
  description: 'Learn how terapia IA can help you build confidence, improve autoestima, and develop the personal power to achieve your goals.',
  keywords: [
    'confidence building',
    'terapia IA for autoestima',
    'autoconfianza',
    'personal power',
    'self-valor',
    'confidence therapy',
    'autoestima mejora',
    'personal desarrollo',
    'confidence coaching',
    'self-assurance'
  ],
  openGraph: {
    title: 'terapia IA for Confidence',
    description: 'Learn how terapia IA can help you build confidence and improve autoestima.',
    type: 'article',
    images: ['/og-confidence.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terapia IA for Confidence',
    description: 'Learn how terapia IA can help you build confidence and improve autoestima.',
    images: ['/twitter-confidence.png'],
  },
};

export default function ConfidencePost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Confidence Building
              </Badge>
              <Badge variant="outline">autoestima</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              terapia IA for Confidence: Building autoestima and Personal Power
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how terapia IA can help you build unshakeable confidence, improve autoestima, 
              and develop the personal power to achieve your goals and live your best life.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                TalkAI investigación Team
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                December 19, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                10 min lectura
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">The Power of Confidence and autoestima</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Confidence is the foundation of éxito in all areas of life. terapia IA provides 
                personalizado herramientas and técnicas to help you build lasting confidence and autoestima.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">terapia IA soluciones for Confidence Building</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <Star className="w-5 h-5" />
                      autoestima Boost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Develop a positive autoimagen and build unshakeable autoestima.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <Zap className="w-5 h-5" />
                      Personal Power
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700 dark:text-orange-300">
                      Unlock your personal power and achieve your goals with confidence.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Confidence Therapy</h2>
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200">Ready to Build Unshakeable Confidence?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    Start your journey toward confidence and autoestima with TalkAI's AI-powered therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Iniciar Prueba Gratuita
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
} 