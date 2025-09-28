import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Layers, Anchor, ThumbsUp, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Social ansiedad Steps: TalkAI Exposure Plans That Feel Safe',
  description:
    'Gradual exposure with TalkAI: small desafíos, safety scripts, and celebration rituals that build real-world confidence.',
  keywords: [
    'social ansiedad exposure',
    'graded exposure plan',
    'ansiedad ladder',
    'TalkAI exposure therapy',
    'CBT social ansiedad',
    'confidence building',
  ],
  openGraph: {
    title: 'Social ansiedad Steps: TalkAI Exposure Plans That Feel Safe',
    description:
      'Design a safe exposure ladder, use grounding scripts, and reinforce wins with TalkAI—at a pace that fits you.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalkAI Social ansiedad Exposure Plans',
    description: 'Small steps, clear scripts, gentle pacing—confidence without overwhelm.',
    images: ['/twitter-image.png'],
  },
};

export default function SocialAnxietyExposurePlansPost() {
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
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Social ansiedad</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Social ansiedad Steps: TalkAI Exposure Plans That Feel Safe
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Exposure doesn’t need to be extreme to work. TalkAI helps you plan micro‑desafíos, debrief, and reinforce
              progreso at a sustainable pace.
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
                7 min lectura
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
                <li><a href="#ladder" className="text-blue-600 hover:underline">Build Your Ladder</a></li>
                <li><a href="#pre-script" className="text-blue-600 hover:underline">Pre‑Exposure Script</a></li>
                <li><a href="#during" className="text-blue-600 hover:underline">During: Anchor & Proceed</a></li>
                <li><a href="#after" className="text-blue-600 hover:underline">After: Debrief & Learn</a></li>
                <li><a href="#pace" className="text-blue-600 hover:underline">Pacing & Repeats</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Comenzar</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="ladder" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Layers className="w-8 h-8 text-blue-600" />
                Build Your Ladder
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">List 8–10 small situations from easiest to hardest. enfoque on tiny, repeatable steps.</p>
                  <ul className="space-y-2">
                    <li>• Make eye contact and say hello</li>
                    <li>• Ask a cashier one question</li>
                    <li>• Share one opinion in a small group</li>
                    <li>• Request a coffee with a custom change</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="pre-script" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Pre‑Exposure Script</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="italic">“My objetivo is showing up, not perfection. I can leave if I need. I will measure éxito by whether I tried.”</p>
                </CardContent>
              </Card>
            </section>

            <section id="during" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Anchor className="w-8 h-8 text-blue-600" />
                During: Anchor & Proceed
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Breath + anchor phrase: “I can feel scared and still proceed.”</li>
                    <li>• Keep interactions brief; exit is allowed.</li>
                    <li>• Note discomfort (0–10) before, during, after.</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="after" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ThumbsUp className="w-8 h-8 text-blue-600" />
                After: Debrief & Learn
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• What went better than expected?</li>
                    <li>• What would you change next time?</li>
                    <li>• Name one win—reinforce with a small reward.</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="pace" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Pacing & Repeats</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Repeat a paso until discomfort drops by ~30–50%.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Move up only when ready—safety and choice first.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Celebrate progreso to lock in confidence.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Comenzar</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Build Your First Exposure Ladder</h3>
                  <p className="mb-6">Create a 10‑paso ladder in under 5 minutes. Debrief after each attempt.</p>
                  <Link href="/auth" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Iniciar Prueba Gratuita →
                  </Link>
                </CardContent>
              </Card>
            </section>
          </div>

          

          {/* Artículos Relacionados */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Artículos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">ansiedad</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-ansiedad" className="hover:text-blue-600">
                      terapia IA for ansiedad
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Evidence‑based técnicas and éxito stories.</p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Habits</Badge>
                  <CardTitle>
                    <Link href="/blog/talkai-journaling-daily-mood-tracker" className="hover:text-blue-600">
                      TalkAI Journaling: Daily Mood Tracker
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Build a sustainable journaling habit in minutes a day.</p>
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
