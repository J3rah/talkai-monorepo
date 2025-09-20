import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Heart, MessageSquare, Users, CheckCircle, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tackling Loneliness: TalkAI Prompts That Spark Connection',
  description:
    'Use TalkAI to plan tiny connection steps—reach-outs, shared moments, and community micro‑goals.',
  keywords: [
    'loneliness help',
    'social connection',
    'TalkAI loneliness',
    'building friendships',
    'social anxiety',
    'community building',
  ],
  openGraph: {
    title: 'Tackling Loneliness: TalkAI Prompts That Spark Connection',
    description:
      'Loneliness changes when connection becomes a daily habit. TalkAI helps you take one small step at a time.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tackling Loneliness with TalkAI',
    description: 'Tiny connection steps that build real relationships over time.',
    images: ['/twitter-image.png'],
  },
};

export default function LonelinessConnectionPromptsTalkAIPost() {
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
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">Connection</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Tackling Loneliness: TalkAI Prompts That Spark Connection
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Loneliness changes when connection becomes a daily habit. TalkAI helps you take one small step at a time—no
              social marathon required.
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
                6 min read
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
                <li><a href="#daily-reach" className="text-blue-600 hover:underline">Daily Reach-Out</a></li>
                <li><a href="#shared-activity" className="text-blue-600 hover:underline">Shared Activity</a></li>
                <li><a href="#script-help" className="text-blue-600 hover:underline">Script Help</a></li>
                <li><a href="#community" className="text-blue-600 hover:underline">Community</a></li>
                <li><a href="#reframe" className="text-blue-600 hover:underline">Reframe</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="daily-reach" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                Daily Reach-Out
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">One message or voice note to someone you trust:</p>
                  <ul className="space-y-2">
                    <li>• Share a small win</li>
                    <li>• Ask about their day</li>
                    <li>• Send a funny meme</li>
                    <li>• Express appreciation</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="shared-activity" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Shared Activity
              </h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">Coffee, walk, or online group</p>
                  <p>Micro-goals count—start with what feels comfortable.</p>
                </CardContent>
              </Card>
            </section>

            <section id="script-help" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Script Help</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Use these conversation starters:</p>
                  <ul className="space-y-2">
                    <li>• "Can we catch up for 10 minutes this week?"</li>
                    <li>• "I'd love to hear about your project"</li>
                    <li>• "Want to grab coffee sometime?"</li>
                    <li>• "How are you doing lately?"</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="community" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Community</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Tag three low-effort spaces to try this month:</p>
                  <ul className="space-y-2">
                    <li>• Local meetup groups</li>
                    <li>• Online communities</li>
                    <li>• Hobby classes</li>
                    <li>• Volunteer opportunities</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="reframe" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                Reframe
              </h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>“Connection is built, not found.”</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Track feelings after interactions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Celebrate small connection wins</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Turn on TalkAI's “One Connection a Day” Reminder</h3>
                  <p className="mb-6">Build connection habits that fit your comfort level.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Relationships</Badge>
                  <CardTitle>
                    <Link href="/blog/couples-check-ins-talkai" className="hover:text-blue-600">
                      Couples Micro-Check-Ins
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Build connection through structured conversations.</p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Social Anxiety</Badge>
                  <CardTitle>
                    <Link href="/blog/social-anxiety-exposure-plans-talkai" className="hover:text-blue-600">
                      Social Anxiety Exposure Plans
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Gradual exposure that builds confidence.</p>
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
