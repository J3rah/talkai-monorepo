import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, Baby, Users, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'terapia IA for Parents: Managing Parenting estrés and salud mental',
  description: 'Learn how terapia IA can help parents manage estrés, improve salud mental, and build stronger family relationships.',
  keywords: [
    'parenting estrés',
    'terapia IA for parents',
    'parent salud mental',
    'parenting apoyo',
    'family therapy',
    'parent estrés management',
    'parenting desafíos',
    'family bienestar',
    'parent asesoramiento',
    'parenting consejos'
  ],
  openGraph: {
    title: 'terapia IA for Parents',
    description: 'Learn how terapia IA can help parents manage estrés and improve salud mental.',
    type: 'article',
    images: ['/og-parents.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terapia IA for Parents',
    description: 'Learn how terapia IA can help parents manage estrés and improve salud mental.',
    images: ['/twitter-parents.png'],
  },
};

export default function ParentsPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                Parenting apoyo
              </Badge>
              <Badge variant="outline">Family Health</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              terapia IA for Parents: Managing Parenting estrés and salud mental
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how terapia IA can help parents manage estrés, improve salud mental, 
              and build stronger family relationships with accessible, judgment-free apoyo.
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">comprensión Parenting estrés</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Parenting is one of life's most rewarding yet challenging experiences. terapia IA provides 
                accessible apoyo for parents dealing with estrés, ansiedad, and the demands of family life.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">terapia IA soluciones for Parents</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-rose-50 dark:bg-rose-950 border-rose-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
                      <Baby className="w-5 h-5" />
                      Parenting apoyo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-rose-700 dark:text-rose-300">
                      Get orientación on parenting desafíos and develop effective parenting estrategias.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                      <Home className="w-5 h-5" />
                      Family bienestar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 dark:text-purple-300">
                      Improve family relationships and create a healthier home environment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Parent Therapy</h2>
              <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 border-rose-200">
                <CardHeader>
                  <CardTitle className="text-rose-800 dark:text-rose-200">Ready to Improve Your Parenting salud mental?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rose-700 dark:text-rose-300 mb-4">
                    Start your journey to better parenting salud mental with TalkAI's AI-powered therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Iniciar Prueba Gratuita
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
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