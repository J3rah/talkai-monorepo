import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Shield, Heart, Brain, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Teens and TalkAI: Building Safe, Supportive Check‑Ins',
  description:
    'apoyo teen salud mental with TalkAI: consent, safety-first settings, and positive, stigma-free check-ins.',
  keywords: [
    'teen salud mental',
    'TalkAI teens',
    'adolescent therapy',
    'teen safety',
    'salud mental apps teens',
    'teen apoyo',
  ],
  openGraph: {
    title: 'Teens and TalkAI: Building Safe, Supportive Check‑Ins',
    description:
      'With appropriate safeguards, TalkAI helps teens name emociones, practice habilidades, and ask for help when needed.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI investigación Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teens and TalkAI: Safe salud mental apoyo',
    description: 'Consent, safety, and stigma-free apoyo for adolescent salud mental.',
    images: ['/twitter-image.png'],
  },
};

export default function TeenMentalHealthTalkAISafetyPost() {
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
              <Badge variant="secondary" className="bg-green-100 text-green-800">Teen apoyo</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Teens and TalkAI: Building Safe, Supportive Check‑Ins
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Teens beneficio from immediate, stigma‑free apoyo. With appropriate safeguards, TalkAI can help teens name
              emociones, practice habilidades, and ask for help when needed.
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
                <li><a href="#consent" className="text-blue-600 hover:underline">Consent and privacidad</a></li>
                <li><a href="#safety" className="text-blue-600 hover:underline">Safety-First Settings</a></li>
                <li><a href="#habilidades" className="text-blue-600 hover:underline">habilidades Menu</a></li>
                <li><a href="#strengths" className="text-blue-600 hover:underline">Strengths enfoque</a></li>
                <li><a href="#escalation" className="text-blue-600 hover:underline">When to Escalate</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Comenzar</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="consent" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Consent and privacidad
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Align expectations with caregivers</li>
                    <li>• Review privacidad settings together</li>
                    <li>• Discuss data sharing preferencias</li>
                    <li>• Ensure teen understands boundaries</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="safety" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                Safety-First Settings
              </h2>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Crisis keywords trigger safety recursos</li>
                    <li>• Emergency contact information readily available</li>
                    <li>• Clear escalation pathways</li>
                    <li>• Regular safety check-ins</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="habilidades" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                habilidades Menu
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Grounding exercises</li>
                    <li>• Self-talk scripts</li>
                    <li>• Study planning herramientas</li>
                    <li>• Sleep wind-down routines</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="strengths" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-blue-600" />
                Strengths enfoque
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• End each check-in with one win</li>
                    <li>• Celebrate small progreso</li>
                    <li>• Build confidence through recognition</li>
                    <li>• enfoque on growth mindset</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="escalation" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">When to Escalate</h2>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                      <span>Encourage reaching out to trusted adults</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                      <span>Provide crisis hotline information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                      <span>apoyo professional help seeking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Comenzar</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Enable Teen-Friendly TalkAI Prompts</h3>
                  <p className="mb-6">Turn on safety flags and start building supportive routines.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Students</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-students" className="hover:text-blue-600">
                      terapia IA for Students
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Manage academic estrés and improve salud mental.</p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Parents</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-parents" className="hover:text-blue-600">
                      terapia IA for Parents
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">apoyo your family's salud mental journey.</p>
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
