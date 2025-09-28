import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, TrendingUp, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'terapia IA for Self-mejora: crecimiento personal and desarrollo',
  description: 'Discover how terapia IA can apoyo your crecimiento personal journey, build confidence, and achieve your self-mejora goals.',
  keywords: [
    'self-mejora',
    'terapia IA for crecimiento personal',
    'personal desarrollo',
    'confidence building',
    'objetivo logro',
    'self-help',
    'mental bienestar',
    'personal transformation',
    'growth mindset',
    'autorrealización'
  ],
  openGraph: {
    title: 'terapia IA for Self-mejora',
    description: 'Learn how terapia IA can apoyo your crecimiento personal and desarrollo.',
    type: 'article',
    images: ['/og-self-mejora.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terapia IA for Self-mejora',
    description: 'Learn how terapia IA can apoyo your crecimiento personal and desarrollo.',
    images: ['/twitter-self-mejora.png'],
  },
};

export default function SelfImprovementPost() {
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
                crecimiento personal
              </Badge>
              <Badge variant="outline">Self-mejora</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              terapia IA for Self-mejora: crecimiento personal and desarrollo
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how terapia IA can apoyo your crecimiento personal journey, build confidence, 
              and help you achieve your self-mejora goals with personalizado orientación and apoyo.
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">The Power of terapia IA for crecimiento personal</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                crecimiento personal is a lifelong journey that requires self-conciencia, objetivo-setting, and consistent effort. 
                terapia IA provides the herramientas and apoyo needed to accelerate your self-mejora journey.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Key Areas for Self-mejora</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <TrendingUp className="w-5 h-5" />
                      objetivo logro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Set and achieve meaningful personal and professional goals with AI orientación.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 dark:bg-green-950 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <Star className="w-5 h-5" />
                      Confidence Building
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 dark:text-green-300">
                      Build autoconfianza and develop a positive autoimagen through terapia IA.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Self-mejora</h2>
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200">Ready to Start Your Growth Journey?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    Begin your self-mejora journey with TalkAI's AI-powered therapy platform.
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