import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, RefreshCw, Compass, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'terapia IA for Life Transitions: Navigating Change and New Beginnings',
  description: 'Learn how terapia IA can help you navigate life transitions, manage change, and embrace new beginnings with confidence and resiliencia.',
  keywords: [
    'life transitions',
    'terapia IA for change',
    'transition apoyo',
    'change management',
    'new beginnings',
    'life changes',
    'transition therapy',
    'adapting to change',
    'life coaching',
    'resiliencia building'
  ],
  openGraph: {
    title: 'terapia IA for Life Transitions',
    description: 'Learn how terapia IA can help you navigate life transitions and manage change.',
    type: 'article',
    images: ['/og-life-transitions.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terapia IA for Life Transitions',
    description: 'Learn how terapia IA can help you navigate life transitions and manage change.',
    images: ['/twitter-life-transitions.png'],
  },
};

export default function LifeTransitionsPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                Life Transitions
              </Badge>
              <Badge variant="outline">Change Management</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              terapia IA for Life Transitions: Navigating Change and New Beginnings
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how terapia IA can help you navigate life transitions, manage change effectively, 
              and embrace new beginnings with confidence, resiliencia, and propósito.
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
                11 min lectura
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">comprensión Life Transitions</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Life transitions can be challenging, whether they're planned or unexpected. terapia IA provides 
                the apoyo and orientación you need to navigate change and emerge stronger on the other side.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">terapia IA soluciones for Life Transitions</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-cyan-50 dark:bg-cyan-950 border-cyan-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-800 dark:text-cyan-200">
                      <Compass className="w-5 h-5" />
                      Change Navigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-700 dark:text-cyan-300">
                      Navigate life changes with confidence and find your new direction.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <ArrowRight className="w-5 h-5" />
                      New Beginnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 dark:text-blue-300">
                      Embrace new opportunities and build resiliencia for the future.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Transition Therapy</h2>
              <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 border-cyan-200">
                <CardHeader>
                  <CardTitle className="text-cyan-800 dark:text-cyan-200">Ready to Navigate Your Life Transition?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-700 dark:text-cyan-300 mb-4">
                    Start your journey toward successful change management with TalkAI's AI-powered therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                      Iniciar Prueba Gratuita
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors"
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