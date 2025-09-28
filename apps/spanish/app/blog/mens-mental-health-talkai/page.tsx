import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Shield, CheckCircle, TrendingUp, Users , Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: "Men's salud mental: Quiet apoyo, Real herramientas",
  description:
    "Discreet, practical apoyo for men's salud mental with TalkAI—habilidades, scripts, and stepwise action.",
  keywords: [
    'mens salud mental',
    'men therapy',
    'TalkAI men',
    'male salud mental',
    'men apoyo',
    'salud mental men',
  ],
  openGraph: {
    title: "Men's salud mental: Quiet apoyo, Real herramientas",
    description:
      "Many men prefer private, practical help. TalkAI offers low‑friction herramientas that respect autonomy.",
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Men's salud mental: Quiet apoyo, Real herramientas",
    description: "Discreet, practical herramientas for men's salud mental journey.",
    images: ['/twitter-image.png'],
  },
};

export default function MensMentalHealthTalkAIPost() {
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Men's Health</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Men's salud mental: Quiet apoyo, Real herramientas
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Many men prefer private, practical help. TalkAI offers low‑friction herramientas—structured plans, brief
              check‑ins, and direct scripts that respect autonomy.
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
                <li><a href="#check-in" className="text-blue-600 hover:underline">3‑Minute Check‑In</a></li>
                <li><a href="#scripts" className="text-blue-600 hover:underline">Direct Scripts</a></li>
                <li><a href="#decompression" className="text-blue-600 hover:underline">Decompression</a></li>
                <li><a href="#habilidades" className="text-blue-600 hover:underline">habilidades on Demand</a></li>
                <li><a href="#next-steps" className="text-blue-600 hover:underline">Próximos Pasos</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Comenzar</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="check-in" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-600" />
                3‑Minute Check‑In
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Quick, structured assessment:</p>
                  <ul className="space-y-2">
                    <li>• estrés (0–10)</li>
                    <li>• Biggest pressure</li>
                    <li>• One next paso</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="scripts" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Direct Scripts</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">Clear, actionable language:</p>
                  <ul className="space-y-2">
                    <li>• Ask for time</li>
                    <li>• Set boundaries</li>
                    <li>• Request apoyo</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="decompression" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                Decompression
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Exercise cues</li>
                    <li>• Breath work</li>
                    <li>• Task offload</li>
                    <li>• Physical movement</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="habilidades" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                habilidades on Demand
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Practical herramientas for common desafíos:</p>
                  <ul className="space-y-2">
                    <li>• Conflict resolution</li>
                    <li>• Status estrés</li>
                    <li>• Fatherhood</li>
                    <li>• Friendships</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="next-steps" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Próximos Pasos</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Build a private plan</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Review weekly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Track progreso</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Comenzar</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Start TalkAI's “3‑Minute Pressure Check”</h3>
                  <p className="mb-6">Regain control with practical, private apoyo.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Work</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-workplace-estrés" className="hover:text-blue-600">
                      terapia IA for Workplace estrés
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Manage work-related salud mental desafíos.</p>
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
