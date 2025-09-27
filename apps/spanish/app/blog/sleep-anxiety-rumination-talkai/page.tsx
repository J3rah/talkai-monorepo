import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Moon, Clock3, CheckCircle, Brain, Coffee } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nighttime ansiedad: TalkAI Scripts for Rumination Relief',
  description:
    'Calm racing thoughts with TalkAI bedtime scripts: schedule worry, downshift the body, and practice compassionate self-talk.',
  keywords: [
    'sleep ansiedad',
    'nighttime rumination',
    'insomnia help',
    'TalkAI sleep',
    'bedtime routine',
    'ansiedad at night',
  ],
  openGraph: {
    title: 'Nighttime ansiedad: TalkAI Scripts for Rumination Relief',
    description:
      'Nighttime ansiedad feeds on unstructured thinking. TalkAI offers a simple night routine that moves thoughts out of your head.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nighttime ansiedad: TalkAI Scripts for Rumination Relief',
    description: 'Schedule worry, downshift, and choose rest—simple scripts for sleep.',
    images: ['/twitter-image.png'],
  },
};

export default function SleepAnxietyRuminationTalkAIPost() {
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
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Sleep & ansiedad</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Nighttime ansiedad: TalkAI Scripts for Rumination Relief
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Nighttime ansiedad feeds on unstructured thinking. TalkAI offers a simple night routine that moves thoughts
              out of your head and calms your body.
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
                <li><a href="#worry-schedule" className="text-blue-600 hover:underline">Worry Scheduling</a></li>
                <li><a href="#downshift" className="text-blue-600 hover:underline">Body Downshift</a></li>
                <li><a href="#self-talk" className="text-blue-600 hover:underline">Self-Talk Script</a></li>
                <li><a href="#reset" className="text-blue-600 hover:underline">If Awake &gt;20 Min</a></li>
                <li><a href="#trackers" className="text-blue-600 hover:underline">Trackers</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="worry-schedule" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                Worry Scheduling
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Park concerns in a “tomorrow list”:</p>
                  <ul className="space-y-2">
                    <li>• Write down 3 main worries</li>
                    <li>• Assign them to tomorrow</li>
                    <li>• Trust they'll be there</li>
                    <li>• Close the list</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="downshift" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Moon className="w-8 h-8 text-blue-600" />
                Body Downshift
              </h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• 4‑7‑8 breathing</li>
                    <li>• Body scan</li>
                    <li>• Warm light cues</li>
                    <li>• Progressive relaxation</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="self-talk" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Self-Talk Script</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="italic">“I choose rest now. Thinking resumes at 8AM. My body necesidades sleep to proceso and heal.”</p>
                </CardContent>
              </Card>
            </section>

            <section id="reset" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Clock3 className="w-8 h-8 text-blue-600" />
                If Awake &gt;20 Min
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Reset—dim light</li>
                    <li>• Gentle movement</li>
                    <li>• Read something light</li>
                    <li>• Try again in 30 minutes</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="trackers" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Trackers</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Note caffeine timing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Screen use before bed</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>estrés peaks during day</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Save TalkAI's “Night Reset” Script</h3>
                  <p className="mb-6">One‑tap bedtime apoyo for ansiedad relief.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Sleep</Badge>
                  <CardTitle>
                    <Link href="/blog/improving-sleep-with-ai-therapy" className="hover:text-blue-600">
                      Improving Sleep with terapia IA
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Develop healthy sleep habits and overcome insomnia.</p>
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
