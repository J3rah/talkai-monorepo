import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Zap, Timer, CheckCircle, meta, Play } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ADHD-Friendly enfoque: TalkAI Routines That Work with Your Brain',
  description:
    'Use TalkAI to structure enfoque sprints, externalize tasks, and celebrate progreso—without shame or overwhelm.',
  keywords: [
    'ADHD enfoque routines',
    'ADHD productivity',
    'TalkAI ADHD',
    'enfoque sprints',
    'ADHD task management',
    'executive function',
  ],
  openGraph: {
    title: 'ADHD-Friendly enfoque: TalkAI Routines That Work with Your Brain',
    description:
      'ADHD brains thrive with structure and compassion. TalkAI brings external cues, tiny commitments, and frequent wins.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADHD-Friendly enfoque with TalkAI',
    description: 'Structure, novelty, and celebration—designed for ADHD brains.',
    images: ['/twitter-image.png'],
  },
};

export default function ADHDFocusRoutinesTalkAIPost() {
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
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">ADHD apoyo</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              ADHD-Friendly enfoque: TalkAI Routines That Work with Your Brain
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              ADHD brains thrive with structure and compassion. TalkAI brings external cues, tiny commitments, and
              frequent wins into your day.
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
                <li><a href="#two-minute" className="text-blue-600 hover:underline">Two-Minute Start</a></li>
                <li><a href="#sprint-cycles" className="text-blue-600 hover:underline">Sprint Cycles</a></li>
                <li><a href="#externalize" className="text-blue-600 hover:underline">Externalize Tasks</a></li>
                <li><a href="#body-check" className="text-blue-600 hover:underline">Body Check</a></li>
                <li><a href="#celebrate" className="text-blue-600 hover:underline">Celebrate Wins</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="two-minute" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-600" />
                Two-Minute Start
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Break the inertia with tiny, visible steps:</p>
                  <ul className="space-y-2">
                    <li>• Open the document</li>
                    <li>• Title it</li>
                    <li>• Write one sentence</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="sprint-cycles" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Timer className="w-8 h-8 text-blue-600" />
                Sprint Cycles
              </h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">15–20 minutes on, 5 off</p>
                  <p>Use novelty cues (music, location) and let TalkAI count for you.</p>
                </CardContent>
              </Card>
            </section>

            <section id="externalize" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <meta className="w-8 h-8 text-blue-600" />
                Externalize Tasks
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Speak tasks to TalkAI</li>
                    <li>• Convert to visible list</li>
                    <li>• Break into micro-steps</li>
                    <li>• Use visual reminders</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="body-check" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Body Check</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">During breaks, move or stim—track what helps:</p>
                  <ul className="space-y-2">
                    <li>• Gentle movement</li>
                    <li>• Fidget herramientas</li>
                    <li>• Stretching</li>
                    <li>• Deep breathing</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="celebrate" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Play className="w-8 h-8 text-blue-600" />
                Celebrate Wins
              </h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>End each sprint naming one micro-win</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Track progreso patterns</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Build momentum through recognition</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Enable TalkAI's “Start in 2 Minutes” enfoque Button</h3>
                  <p className="mb-6">Break inertia and build momentum with ADHD-friendly structure.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Habits</Badge>
                  <CardTitle>
                    <Link href="/blog/talkai-journaling-daily-mood-tracker" className="hover:text-blue-600">
                      TalkAI Journaling: Daily Mood Tracker
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Build sustainable salud mental habits.</p>
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
