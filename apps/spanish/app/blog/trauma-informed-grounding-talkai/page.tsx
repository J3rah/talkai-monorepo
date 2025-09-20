import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Shield, Heart, CheckCircle, AlertTriangle, Anchor } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trauma‑Informed Grounding with TalkAI',
  description:
    'Gentle, trauma‑aware grounding with TalkAI: choice, pacing, and safety-first scripts.',
  keywords: [
    'trauma-informed grounding',
    'trauma therapy',
    'TalkAI trauma',
    'PTSD grounding',
    'trauma safety',
    'grounding exercises',
  ],
  openGraph: {
    title: 'Trauma‑Informed Grounding with TalkAI',
    description:
      'Trauma‑aware support is about choice and safety. TalkAI emphasizes consent, pacing, and grounding.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trauma-Informed Grounding with TalkAI',
    description: 'Choice, safety, and pacing—grounding that respects trauma history.',
    images: ['/twitter-image.png'],
  },
};

export default function TraumaInformedGroundingTalkAIPost() {
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
              <Badge variant="secondary" className="bg-red-100 text-red-800">Trauma Support</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Trauma‑Informed Grounding with TalkAI
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Trauma‑aware support is about choice and safety. TalkAI emphasizes consent, pacing, and grounding to help
              you stay within your window of tolerance.
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
                <li><a href="#consent" className="text-blue-600 hover:underline">Consent First</a></li>
                <li><a href="#menu" className="text-blue-600 hover:underline">Grounding Menu</a></li>
                <li><a href="#pacing" className="text-blue-600 hover:underline">Pacing</a></li>
                <li><a href="#anchors" className="text-blue-600 hover:underline">Safe Anchors</a></li>
                <li><a href="#safety" className="text-blue-600 hover:underline">Safety Plan</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="consent" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Consent First
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Always ask before offering support:</p>
                  <p className="italic">"Would you like grounding options now?"</p>
                  <p className="mt-4">Respect the answer—no is a complete sentence.</p>
                </CardContent>
              </Card>
            </section>

            <section id="menu" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-blue-600" />
                Grounding Menu
              </h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">Choose what feels safe:</p>
                  <ul className="space-y-2">
                    <li>• Senses (5-4-3-2-1)</li>
                    <li>• Breath (4-2-6)</li>
                    <li>• Movement (gentle stretch)</li>
                    <li>• Visualization</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="pacing" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Pacing</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Stop anytime</li>
                    <li>• Goal is regulation, not performance</li>
                    <li>• Honor your limits</li>
                    <li>• Take breaks as needed</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="anchors" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Anchor className="w-8 h-8 text-blue-600" />
                Safe Anchors
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Identify what feels grounding and safe:</p>
                  <ul className="space-y-2">
                    <li>• Safe object (stone, keychain)</li>
                    <li>• Calming phrase</li>
                    <li>• Safe place visualization</li>
                    <li>• Comforting texture</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="safety" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                Safety Plan
              </h2>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-1" />
                      <span>Crisis numbers handy</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-1" />
                      <span>Trusted contacts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-1" />
                      <span>Exit strategies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Customize Your Trauma-Safe Menu</h3>
                  <p className="mb-6">Build grounding options that respect your history and preferences.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Anxiety</Badge>
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

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Sleep</Badge>
                  <CardTitle>
                    <Link href="/blog/sleep-anxiety-rumination-talkai" className="hover:text-blue-600">
                      Nighttime Anxiety: TalkAI Scripts
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Calm racing thoughts with bedtime routines.</p>
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
