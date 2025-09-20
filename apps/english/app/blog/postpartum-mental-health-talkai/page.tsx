import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Baby, Heart, Moon, CheckCircle, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Postpartum Support: Gentle Routines with TalkAI',
  description:
    'Use TalkAI to build tiny postpartum routines: rest cues, emotion naming, partner check-ins, and self-kindness scripts.',
  keywords: [
    'postpartum mental health',
    'postpartum depression',
    'TalkAI postpartum',
    'new parent support',
    'postpartum routine',
    'maternal mental health',
  ],
  openGraph: {
    title: 'Postpartum Support: Gentle Routines with TalkAI',
    description:
      'Postpartum life is intense. TalkAI keeps routines small and compassionate to support mood, rest, and connection.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Postpartum Support with TalkAI',
    description: 'Tiny routines for intense times—rest, emotions, and connection.',
    images: ['/twitter-image.png'],
  },
};

export default function PostpartumMentalHealthTalkAIPost() {
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
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">Postpartum</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Postpartum Support: Gentle Routines with TalkAI
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Postpartum life is intense. TalkAI keeps routines small and compassionate to support mood, rest, and
              connection in a chaotic season.
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
                <li><a href="#daily-routine" className="text-blue-600 hover:underline">3‑Part Daily</a></li>
                <li><a href="#normalize" className="text-blue-600 hover:underline">Normalize & Validate</a></li>
                <li><a href="#partner" className="text-blue-600 hover:underline">Partner Check‑In</a></li>
                <li><a href="#sleep" className="text-blue-600 hover:underline">Sleep Aids</a></li>
                <li><a href="#support" className="text-blue-600 hover:underline">Support Map</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="daily-routine" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Baby className="w-8 h-8 text-blue-600" />
                3‑Part Daily
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Hydration check</li>
                    <li>• 5‑minute rest</li>
                    <li>• 2‑minute feelings check</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="normalize" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Normalize & Validate</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="italic">“This is hard and temporary. I'm doing enough. My feelings are valid.”</p>
                </CardContent>
              </Card>
            </section>

            <section id="partner" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Partner Check‑In
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Daily prompt: “What do you need most today?”</p>
                  <ul className="space-y-2">
                    <li>• Rest</li>
                    <li>• Help</li>
                    <li>• Reassurance</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="sleep" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Moon className="w-8 h-8 text-blue-600" />
                Sleep Aids
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Nighttime wind‑down script</li>
                    <li>• 3AM self‑talk</li>
                    <li>• Gentle breathing exercises</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="support" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Support Map</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Add contacts and resources for quick access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Include crisis resources</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Professional support contacts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Start TalkAI's 2‑Minute Postpartum Daily</h3>
                  <p className="mb-6">Build gentle routines that support your mental health during this intense season.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Parents</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-parents" className="hover:text-blue-600">
                      AI Therapy for Parents
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Manage parenting stress and build stronger family relationships.</p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Sleep</Badge>
                  <CardTitle>
                    <Link href="/blog/improving-sleep-with-ai-therapy" className="hover:text-blue-600">
                      Improving Sleep with AI Therapy
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Develop healthy sleep habits and overcome insomnia.</p>
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
