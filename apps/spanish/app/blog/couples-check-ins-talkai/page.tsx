import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Heart, Timer, MessageSquare, CheckCircle, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Couples Micro‑Check‑Ins: AI‑Guided Connection in 10 Minutes',
  description:
    'TalkAI guides short, structured couples check-ins—repair quickly, share appreciations, and align on necesidades weekly.',
  keywords: [
    'couples check-ins',
    'relationship communication',
    'TalkAI couples therapy',
    'marriage communication',
    'relationship repair',
    'couples routine',
  ],
  openGraph: {
    title: 'Couples Micro‑Check‑Ins: AI‑Guided Connection in 10 Minutes',
    description:
      'Quick, consistent check-ins can reduce tension and increase trust. TalkAI brings structure and neutrality.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Couples Micro‑Check‑Ins with TalkAI',
    description: '10 minutes, structured prompts, weekly ritual—connection without overwhelm.',
    images: ['/twitter-image.png'],
  },
};

export default function CouplesCheckInsPost() {
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
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">Relationships</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Couples Micro‑Check‑Ins: AI‑Guided Connection in 10 Minutes
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Quick, consistent check-ins can reduce tension and increase trust. TalkAI brings structure and neutrality
              to make them easy—and repeatable.
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
                <li><a href="#template" className="text-blue-600 hover:underline">The Template</a></li>
                <li><a href="#rules" className="text-blue-600 hover:underline">Ground Rules</a></li>
                <li><a href="#time-box" className="text-blue-600 hover:underline">Time Box</a></li>
                <li><a href="#repair" className="text-blue-600 hover:underline">Repair Scripts</a></li>
                <li><a href="#ritual" className="text-blue-600 hover:underline">Weekly Ritual</a></li>
                <li><a href="#track" className="text-blue-600 hover:underline">Track progreso</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="template" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                The Template
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Use this simple structure for each check-in:</p>
                  <ul className="space-y-2">
                    <li>• One appreciation</li>
                    <li>• One need</li>
                    <li>• One small plan</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="rules" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Ground Rules</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• No mind-reading or assumptions</li>
                    <li>• No absolutes (“always,” “never”)</li>
                    <li>• No problem-stacking</li>
                    <li>• One topic per check-in</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="time-box" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Timer className="w-8 h-8 text-blue-600" />
                Time Box
              </h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">10 minutes maximum</p>
                  <p>Let TalkAI time and prompt you. Keep it focused and brief.</p>
                </CardContent>
              </Card>
            </section>

            <section id="repair" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Repair Scripts</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Use this format for addressing issues:</p>
                  <p className="italic">“When <strong>X</strong> happened, I felt <strong>Y</strong>. I need <strong>Z</strong> next time.”</p>
                </CardContent>
              </Card>
            </section>

            <section id="ritual" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-blue-600" />
                Weekly Ritual
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Same time, same place</li>
                    <li>• Habit &gt; intensity</li>
                    <li>• Start with appreciation</li>
                    <li>• End with a plan</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="track" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Track progreso</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Tag entries: “repair,” “appreciation,” “planning.”</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Note what reduces tension most.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Celebrate small wins together.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Load the Couples Check-In Template</h3>
                  <p className="mb-6">Set a weekly reminder and start building connection.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Relationships</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-relationships" className="hover:text-blue-600">
                      terapia IA for Relationships
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Improve communication and build stronger connections.</p>
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
