import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Sparkles, Activity, Snowflake, Footprints, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Panic Rescue: Grounding Scripts You Can Speak with TalkAI',
  description:
    'Use TalkAI grounding scripts to ride out panic: orient, breathe, name, and re-engage—practical steps you can voice on the spot.',
  keywords: [
    'panic attack grounding',
    'panic rescue script',
    'anxiety grounding exercise',
    '5-4-3-2-1 senses',
    'breathing for panic',
    'CBT panic tools',
    'TalkAI panic help',
  ],
  openGraph: {
    title: 'Panic Rescue: Grounding Scripts You Can Speak with TalkAI',
    description:
      'TalkAI guides a fast grounding sequence to lower panic intensity and regain control—no memorization required.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panic Rescue: Grounding Scripts with TalkAI',
    description: 'Orient, breathe, name, and re-engage—voice-first scripts for panic moments.',
    images: ['/twitter-image.png'],
  },
};

export default function PanicRescuePost() {
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
              <Badge variant="secondary" className="bg-red-100 text-red-800">Anxiety & Panic</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Panic Rescue: Grounding Scripts You Can Speak with TalkAI
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              During panic, your body is in overdrive. TalkAI can guide a fast grounding sequence to lower intensity and
              help you regain control—no memorization required.
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
                <li><a href="#orienting" className="text-blue-600 hover:underline">Orienting (5-4-3-2-1)</a></li>
                <li><a href="#breathing" className="text-blue-600 hover:underline">Breathing (4-2-6)</a></li>
                <li><a href="#labeling" className="text-blue-600 hover:underline">Labeling the Wave</a></li>
                <li><a href="#cold-stimulus" className="text-blue-600 hover:underline">Cold Stimulus</a></li>
                <li><a href="#re-engage" className="text-blue-600 hover:underline">Re‑Engage</a></li>
                <li><a href="#aftercare" className="text-blue-600 hover:underline">Aftercare & Notes</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Save This Script</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="orienting" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-600" />
                Orienting (5‑4‑3‑2‑1)
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Use your senses to anchor in the present:</p>
                  <ul className="space-y-2">
                    <li>• 5 things you see</li>
                    <li>• 4 things you feel (touch)</li>
                    <li>• 3 things you hear</li>
                    <li>• 2 things you smell</li>
                    <li>• 1 thing you taste</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="breathing" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                Breathing (4‑2‑6)
              </h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">Script</p>
                  <p>“Inhale for 4… hold for 2… exhale for 6.” Repeat 6 rounds. Let TalkAI count for you.</p>
                </CardContent>
              </Card>
            </section>

            <section id="labeling" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Labeling the Wave</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Name the experience without judgment:</p>
                  <p className="italic">“This is a panic wave. It will crest and fall. I am safe in this moment.”</p>
                </CardContent>
              </Card>
            </section>

            <section id="cold-stimulus" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Snowflake className="w-8 h-8 text-blue-600" />
                Cold Stimulus
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Use a safe cold sensation to reset the system (e.g., cool water on hands).</p>
                  <p>Describe sensations aloud to TalkAI: temperature, texture, and how intensity shifts.</p>
                </CardContent>
              </Card>
            </section>

            <section id="re-engage" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Footprints className="w-8 h-8 text-blue-600" />
                Re‑Engage
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Choose a low‑effort action and narrate it:</p>
                  <ul className="space-y-2">
                    <li>• Walk to another room</li>
                    <li>• Gentle stretch</li>
                    <li>• Sip water</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="aftercare" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Aftercare & Notes</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Short debrief: what helped most? Tag the entry “panic.”</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Set a reminder to review patterns weekly.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Seek professional support for persistent or severe symptoms.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Save This Script</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">One‑Tap Panic Rescue</h3>
                  <p className="mb-6">Save the “Panic Rescue” grounding flow in TalkAI for instant access during spikes.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Basics</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-anxiety" className="hover:text-blue-600">
                      AI Therapy for Anxiety
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Evidence‑based techniques and success stories.</p>
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
                    <p className="text-slate-600">Nighttime downshift routines that calm the nervous system.</p>
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
