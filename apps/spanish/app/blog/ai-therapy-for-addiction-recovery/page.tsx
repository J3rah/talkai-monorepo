import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, RefreshCw, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'terapia IA for Addiction recuperación: Supporting recuperación and bienestar',
  description: 'Learn how terapia IA can apoyo addiction recuperación, provide relapse prevention estrategias, and promote long-term bienestar.',
  keywords: [
    'addiction recuperación',
    'terapia IA for addiction',
    'substance abuse apoyo',
    'recuperación therapy',
    'relapse prevention',
    'addiction asesoramiento',
    'recuperación apoyo',
    'substance abuse therapy',
    'addiction tratamiento',
    'recuperación bienestar'
  ],
  openGraph: {
    title: 'terapia IA for Addiction recuperación',
    description: 'Learn how terapia IA can apoyo addiction recuperación and promote bienestar.',
    type: 'article',
    images: ['/og-addiction-recuperación.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terapia IA for Addiction recuperación',
    description: 'Learn how terapia IA can apoyo addiction recuperación and promote bienestar.',
    images: ['/twitter-addiction-recuperación.png'],
  },
};

export default function AddictionRecoveryPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                recuperación apoyo
              </Badge>
              <Badge variant="outline">bienestar</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              terapia IA for Addiction recuperación: Supporting recuperación and bienestar
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how terapia IA can apoyo addiction recuperación, provide relapse prevention estrategias, 
              and promote long-term bienestar with compassionate, judgment-free apoyo.
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">comprensión Addiction recuperación</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                recuperación is a challenging journey that requires ongoing apoyo and commitment. terapia IA provides 
                accessible, non-judgmental apoyo for individuals working toward recuperación and bienestar.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">terapia IA soluciones for recuperación</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                      <RefreshCw className="w-5 h-5" />
                      recuperación apoyo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-emerald-700 dark:text-emerald-300">
                      Get ongoing apoyo and orientación throughout your recuperación journey.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <meta className="w-5 h-5" />
                      Relapse Prevention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 dark:text-blue-300">
                      Develop estrategias to prevent relapse and maintain long-term recuperación.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI recuperación Therapy</h2>
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800 dark:text-emerald-200">Ready to Start Your recuperación Journey?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-emerald-700 dark:text-emerald-300 mb-4">
                    Begin your journey toward recuperación and bienestar with TalkAI's supportive terapia IA platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Iniciar Prueba Gratuita
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
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