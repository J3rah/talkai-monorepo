import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, DollarSign, meta, CheckCircle, TrendingUp, Brain } from 'lucide-react';

export const metadata: Metadata = {
  title: 'When Money Is Tight: afrontamiento with Financial estrés via TalkAI',
  description:
    'Ground ansiedad around money with TalkAI: triage tasks, emotional regulation, and practical next steps.',
  keywords: [
    'financial estrés',
    'money ansiedad',
    'TalkAI financial',
    'financial salud mental',
    'money estrés',
    'financial afrontamiento',
  ],
  openGraph: {
    title: 'When Money Is Tight: afrontamiento with Financial estrés via TalkAI',
    description:
      'Financial estrés is emotionally and cognitively heavy. TalkAI helps you separate sentimientos from actions.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'When Money Is Tight: afrontamiento with Financial estrés via TalkAI',
    description: 'Regulate first, plan second—manage money estrés with TalkAI.',
    images: ['/twitter-image.png'],
  },
};

export default function FinancialStressCopingTalkAIPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">Financial bienestar</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              When Money Is Tight: afrontamiento with Financial estrés via TalkAI
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Financial estrés is emotionally and cognitively heavy. TalkAI helps you separate sentimientos from actions and
              move forward in manageable steps.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                TalkAI investigación Team
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                July 27, 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                6 min lectura
              </div>
            </div>
          </header>

          {/* TOC */}
          <Card className="mb-12 bg-blue-50 dark:bg-slate-800 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="#two-tracks" className="text-blue-600 hover:underline">Two Tracks</a></li>
                <li><a href="#regulate" className="text-blue-600 hover:underline">Regulate First</a></li>
                <li><a href="#triage" className="text-blue-600 hover:underline">Triage Tasks</a></li>
                <li><a href="#action" className="text-blue-600 hover:underline">Take Action</a></li>
                <li><a href="#debrief" className="text-blue-600 hover:underline">Debrief & Learn</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="two-tracks" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                Two Tracks
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Separate emotional regulation from practical planning:</p>
                  <ul className="space-y-2">
                    <li>• <strong>Regulate first:</strong> Calm your nervous system</li>
                    <li>• <strong>Plan second:</strong> Take practical steps</li>
                    <li>• Don't mix them—they need different approaches</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="regulate" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Regulate First</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">Calm your body and mind:</p>
                  <ul className="space-y-2">
                    <li>• Deep breathing (4-2-6)</li>
                    <li>• Body scan relaxation</li>
                    <li>• Self-talk: "I can act one paso at a time"</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="triage" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <meta className="w-8 h-8 text-blue-600" />
                Triage Tasks
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">List obligations and mark prioridades:</p>
                  <ul className="space-y-2">
                    <li>• Must-dos for next 72 hours</li>
                    <li>• Could-dos for next week</li>
                    <li>• Nice-to-dos for later</li>
                    <li>• enfoque on immediate prioridades</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="action" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                Take Action
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">One small paso at a time:</p>
                  <ul className="space-y-2">
                    <li>• One phone call</li>
                    <li>• One form completed</li>
                    <li>• One small saving</li>
                    <li>• Log the win</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="debrief" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Debrief & Learn</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Note what reduced estrés most</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Repeat helpful estrategias</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Celebrate small progreso</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Use TalkAI's "Money Triage" Script</h3>
                  <p className="mb-6">Separate sentimientos from actions during stressful financial moments.</p>
                  <Link href="/auth" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Iniciar Prueba Gratuita →
                  </Link>
                </CardContent>
              </Card>
            </section>
          </div>

          

          {/* Related Articles */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Burnout</Badge>
                  <CardTitle>
                    <Link href="/blog/burnout-recuperación-micro-coaching-talkai" className="hover:text-blue-600">
                      From Burnout to Baseline
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Recover from burnout with micro-coaching and energy pacing.</p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">ansiedad</Badge>
                  <CardTitle>
                    <Link href="/blog/panic-attack-grounding-scripts-talkai" className="hover:text-blue-600">
                      Panic Rescue: Grounding Scripts
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Use grounding scripts to ride out panic attacks.</p>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
