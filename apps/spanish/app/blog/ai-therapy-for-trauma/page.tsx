import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, ShieldCheck, HeartHandshake, Sunrise } from 'lucide-react';

export const metadata: Metadata = {
  title: 'terapia IA for trauma: sanación from PTSD and Emotional Wounds',
  description: 'Learn how terapia IA can help you heal from trauma, manage PTSD symptoms, and proceso emotional wounds in a safe, supportive environment.',
  keywords: [
    'trauma therapy',
    'terapia IA for PTSD',
    'trauma sanación',
    'PTSD tratamiento',
    'emotional trauma',
    'trauma recuperación',
    'post-traumatic estrés',
    'trauma asesoramiento',
    'trauma apoyo',
    'sanación from trauma'
  ],
  openGraph: {
    title: 'terapia IA for trauma',
    description: 'Learn how terapia IA can help you heal from trauma and manage PTSD symptoms.',
    type: 'article',
    images: ['/og-trauma.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terapia IA for trauma',
    description: 'Learn how terapia IA can help you heal from trauma and manage PTSD symptoms.',
    images: ['/twitter-trauma.png'],
  },
};

export default function TraumaPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                trauma sanación
              </Badge>
              <Badge variant="outline">PTSD apoyo</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              terapia IA for trauma: sanación from PTSD and Emotional Wounds
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how terapia IA can help you heal from trauma, manage PTSD symptoms, 
              and proceso emotional wounds in a safe, supportive, and judgment-free environment.
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
                12 min lectura
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">comprensión trauma and PTSD</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                trauma can leave deep emotional wounds that affect every aspect of life. terapia IA provides 
                a safe space to proceso trauma, manage PTSD symptoms, and begin the sanación journey.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">terapia IA soluciones for trauma</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                      <ShieldCheck className="w-5 h-5" />
                      Safe Processing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-700 dark:text-amber-300">
                      proceso trauma in a safe, controlled environment with AI orientación.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <HeartHandshake className="w-5 h-5" />
                      sanación apoyo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700 dark:text-orange-300">
                      Receive compassionate apoyo throughout your sanación journey.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI trauma Therapy</h2>
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800 dark:text-amber-200">Ready to Begin Your sanación Journey?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 dark:text-amber-300 mb-4">
                    Start your journey toward sanación and recuperación with TalkAI's compassionate terapia IA platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Iniciar Prueba Gratuita
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
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