import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, NotebookPen, ListChecks, Heart, Star, CheckCircle, Tag, Timer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'TalkAI Journaling: A Daily Mood Tracker That Actually Sticks',
  description:
    "Build a sustainable journaling habit with TalkAI. Track mood, triggers, coping skills, and wins in minutes a day—no perfection required.",
  keywords: [
    'TalkAI journaling',
    'AI mood tracker',
    'daily mental health journal',
    'habit tracking mental health',
    'emotional awareness',
    'CBT journaling prompts',
    'voice journaling',
    'AI therapy tools',
  ],
  openGraph: {
    title: 'TalkAI Journaling: A Daily Mood Tracker That Actually Sticks',
    description:
      'Build a sustainable journaling habit with TalkAI—fast voice check-ins, emotion tagging, and weekly insights.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalkAI Journaling: A Daily Mood Tracker That Actually Sticks',
    description: 'A simple, sustainable journaling flow powered by TalkAI.',
    images: ['/twitter-image.png'],
  },
};

export default function TalkAIJournalingPost() {
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Habits & Tracking</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              TalkAI Journaling: A Daily Mood Tracker That Actually Sticks
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Journaling shouldn’t feel like homework. With TalkAI, you can record quick voice check-ins, tag emotions,
              and surface trends in minutes. This rhythm helps you move from guesswork to clarity—without pressure to
              write long entries.
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
                <li><a href="#why-talkai-journal" className="text-blue-600 hover:underline">Why TalkAI for Journaling</a></li>
                <li><a href="#2-minute-flow" className="text-blue-600 hover:underline">The 2‑Minute Voice Flow</a></li>
                <li><a href="#what-to-track" className="text-blue-600 hover:underline">What to Track Daily</a></li>
                <li><a href="#weekly-review" className="text-blue-600 hover:underline">Weekly Review & Insights</a></li>
                <li><a href="#nudges-tags" className="text-blue-600 hover:underline">Nudges, Tags, and Routines</a></li>
                <li><a href="#when-to-escalate" className="text-blue-600 hover:underline">When to Escalate</a></li>
                <li><a href="#get-started" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="why-talkai-journal" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <NotebookPen className="w-8 h-8 text-blue-600" />
                Why TalkAI for Journaling
              </h2>
              <p className="text-lg mb-6">
                TalkAI turns journaling into a low‑effort, high‑impact habit. Voice‑first check‑ins capture emotion fast,
                while smart tagging and summaries highlight patterns. You’ll spend less time writing and more time learning
                what actually helps.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 text-base">Instant Capture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">Speak your check‑in—TalkAI structures it automatically.</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-800 text-base">Emotion Awareness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">Tag feelings and triggers to make patterns obvious.</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800 text-base">Actionable Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">Weekly summaries surface what helps—and what doesn’t.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="2-minute-flow" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Timer className="w-8 h-8 text-blue-600" />
                The 2‑Minute Voice Flow
              </h2>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <ol className="list-decimal list-inside space-y-3">
                    <li><strong>State mood (1–10)</strong> and your top emotion.</li>
                    <li><strong>Name one trigger</strong> or context that influenced your mood.</li>
                    <li><strong>Note one coping skill</strong> you used or will try next.</li>
                    <li><strong>Celebrate one win</strong>—even a tiny one.</li>
                  </ol>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">Example script</p>
                  <p>
                    “I felt <em>[emotion]</em> because <em>[trigger]</em>. I used <em>[coping skill]</em>. One thing I’m proud of is
                    <em>[win]</em>.”
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="what-to-track" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ListChecks className="w-8 h-8 text-blue-600" />
                What to Track Daily
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Core Fields</CardTitle>
                    <CardDescription>Keep it lightweight and repeatable</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>• Mood score (1–10)</li>
                      <li>• Primary emotion</li>
                      <li>• One trigger or context</li>
                      <li>• One coping skill</li>
                      <li>• One win or gratitude</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Optional Add‑Ons</CardTitle>
                    <CardDescription>Only if helpful—never mandatory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>• Sleep quality</li>
                      <li>• Energy (0–10)</li>
                      <li>• Context tags: work, family, social, health</li>
                      <li>• Notes (1–2 sentences)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="weekly-review" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Star className="w-8 h-8 text-blue-600" />
                Weekly Review & Insights
              </h2>
              <p className="mb-6">
                Every 7 days, spend 5 minutes reviewing your logs. Look for repeated triggers, best‑performing coping skills,
                and time‑of‑day patterns. Decide on one small experiment for the coming week.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800 text-base">Top Triggers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">What events or contexts reliably lower mood?</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 text-base">Best Coping Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">Which skills raise mood 2+ points within a day?</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-800 text-base">Time Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">Are mornings or evenings consistently higher/lower?</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="nudges-tags" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Tag className="w-8 h-8 text-blue-600" />
                Nudges, Tags, and Routines
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Smart reminders:</strong> Schedule prompts around typical stress peaks (e.g., after work).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Tags that matter:</strong> work, sleep, family, social, health—keep them consistent for clean insights.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Habit first, detail second:</strong> Aim for daily consistency over completeness.</span>
                </li>
              </ul>
            </section>

            <section id="when-to-escalate" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                When to Escalate
              </h2>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <p className="text-yellow-800">
                    If your mood stays ≤3 for 3+ days, or safety concerns arise, consider crisis resources and contacting a
                    licensed professional. TalkAI is supportive but not a substitute for professional care.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="get-started" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Try a 7‑Day TalkAI Journaling Challenge</h3>
                  <p className="mb-6">Two minutes a day. Track mood, name one trigger, one coping skill, and one win.</p>
                  <Link
                    href="/auth"
                    className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
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
                  <Badge variant="secondary" className="w-fit mb-2">Basics</Badge>
                  <CardTitle>
                    <Link href="/blog/what-is-ai-therapy" className="hover:text-blue-600">
                      What is AI Therapy? A Complete Guide
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Understand how AI therapy works and when to use it.</p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Stress</Badge>
                  <CardTitle>
                    <Link href="/blog/how-to-manage-stress-with-ai" className="hover:text-blue-600">
                      How to Manage Stress with AI Therapy
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Evidence‑based techniques to reduce stress with TalkAI.</p>
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
