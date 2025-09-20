import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Battery, ListChecks, Timer, Quote, Shield, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'From Burnout to Baseline: Micro‑Coaching with TalkAI',
  description:
    'Recover from burnout with TalkAI micro‑coaching: capacity-based planning, energy pacing, and compassionate accountability.',
  keywords: [
    'burnout recovery',
    'energy pacing',
    'capacity planning',
    'TalkAI micro coaching',
    'work stress recovery',
    'mental health routines',
  ],
  openGraph: {
    title: 'From Burnout to Baseline: Micro‑Coaching with TalkAI',
    description:
      'Capacity checks, task shrinking, and pacing—simple, repeatable steps to recover from burnout with TalkAI.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'From Burnout to Baseline: Micro‑Coaching with TalkAI',
    description: 'Use capacity-based planning and gentle pacing to rebuild energy and momentum.',
    images: ['/twitter-image.png'],
  },
};

export default function BurnoutRecoveryMicroCoachingPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">Burnout Recovery</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              From Burnout to Baseline: Micro‑Coaching with TalkAI
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Burnout recovery is not about doing more—it’s about doing less, deliberately. TalkAI can pace your energy,
              shrink tasks, and build momentum without self‑judgment.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                TalkAI Research Team
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                July 27, 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                7 min read
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
                <li><a href="#capacity-check" className="text-blue-600 hover:underline">Capacity Check</a></li>
                <li><a href="#task-shrink" className="text-blue-600 hover:underline">Task Shrink</a></li>
                <li><a href="#energy-pacing" className="text-blue-600 hover:underline">Energy Pacing</a></li>
                <li><a href="#boundaries" className="text-blue-600 hover:underline">Boundaries Script</a></li>
                <li><a href="#restore" className="text-blue-600 hover:underline">Daily Restore</a></li>
                <li><a href="#weekly-trend" className="text-blue-600 hover:underline">Weekly Trend Review</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="capacity-check" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Battery className="w-8 h-8 text-blue-600" />
                Capacity Check
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Begin each day by checking your actual capacity and right‑sizing plans:</p>
                  <ul className="space-y-2">
                    <li>• Energy (0–10)?</li>
                    <li>• One must‑do</li>
                    <li>• One could‑do</li>
                    <li>• One rest block</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="task-shrink" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ListChecks className="w-8 h-8 text-blue-600" />
                Task Shrink
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Turn big projects into tiny visible steps. Momentum beats intensity.</p>
                  <p className="italic">Example: “Finish deck” → “Outline 3 slides.” Celebrate the step.</p>
                </CardContent>
              </Card>
            </section>

            <section id="energy-pacing" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Timer className="w-8 h-8 text-blue-600" />
                Energy Pacing
              </h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">Cycle</p>
                  <p>25 minutes focused + 10 minutes restorative (move, breathe, stretch). Adjust to your capacity.</p>
                </CardContent>
              </Card>
            </section>

            <section id="boundaries" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Boundaries Script
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Use direct, respectful language that protects recovery:</p>
                  <p className="italic">“I can commit to <strong>X</strong> by <strong>Y</strong>. For <strong>Z</strong>, I need more time.”</p>
                </CardContent>
              </Card>
            </section>

            <section id="restore" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Quote className="w-8 h-8 text-blue-600" />
                Daily Restore
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Make a non‑negotiable 10‑minute restoration block daily—body before brain.</p>
                  <ul className="space-y-2">
                    <li>• Walk outside</li>
                    <li>• Breathwork</li>
                    <li>• Gentle stretch</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="weekly-trend" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Weekly Trend Review</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Review over‑commit patterns; remove one obligation next week.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Identify best energy windows; schedule key tasks there.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Capture one learning and one win; share with a supporter if helpful.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Enable TalkAI’s Daily Capacity Check</h3>
                  <p className="mb-6">Protect your baseline with pacing and tiny, repeatable steps.</p>
                  <Link href="/auth" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Start Free Trial →
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
                  <Badge variant="secondary" className="w-fit mb-2">Work</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-workplace-stress" className="hover:text-blue-600">
                      AI Therapy for Workplace Stress
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Manage work-related mental health with practical tools.</p>
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
