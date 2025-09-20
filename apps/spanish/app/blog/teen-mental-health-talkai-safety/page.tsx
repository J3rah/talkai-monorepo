import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Shield, Heart, Brain, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Teens and TalkAI: Building Safe, Supportive Check‑Ins',
  description:
    'Support teen mental health with TalkAI: consent, safety-first settings, and positive, stigma-free check-ins.',
  keywords: [
    'teen mental health',
    'TalkAI teens',
    'adolescent therapy',
    'teen safety',
    'mental health apps teens',
    'teen support',
  ],
  openGraph: {
    title: 'Teens and TalkAI: Building Safe, Supportive Check‑Ins',
    description:
      'With appropriate safeguards, TalkAI helps teens name emotions, practice skills, and ask for help when needed.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teens and TalkAI: Safe Mental Health Support',
    description: 'Consent, safety, and stigma-free support for adolescent mental health.',
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
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">Teen Support</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Teens and TalkAI: Building Safe, Supportive Check‑Ins
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Teens benefit from immediate, stigma‑free support. With appropriate safeguards, TalkAI can help teens name
              emotions, practice skills, and ask for help when needed.
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
                <li><a href="#consent" className="text-blue-600 hover:underline">Consent and Privacy</a></li>
                <li><a href="#safety" className="text-blue-600 hover:underline">Safety-First Settings</a></li>
                <li><a href="#skills" className="text-blue-600 hover:underline">Skills Menu</a></li>
                <li><a href="#strengths" className="text-blue-600 hover:underline">Strengths Focus</a></li>
                <li><a href="#escalation" className="text-blue-600 hover:underline">When to Escalate</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="consent" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Consent and Privacy
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Align expectations with caregivers</li>
                    <li>• Review privacy settings together</li>
                    <li>• Discuss data sharing preferences</li>
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
                    <li>• Crisis keywords trigger safety resources</li>
                    <li>• Emergency contact information readily available</li>
                    <li>• Clear escalation pathways</li>
                    <li>• Regular safety check-ins</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="skills" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                Skills Menu
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• Grounding exercises</li>
                    <li>• Self-talk scripts</li>
                    <li>• Study planning tools</li>
                    <li>• Sleep wind-down routines</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="strengths" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-blue-600" />
                Strengths Focus
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li>• End each check-in with one win</li>
                    <li>• Celebrate small progress</li>
                    <li>• Build confidence through recognition</li>
                    <li>• Focus on growth mindset</li>
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
                      <span>Support professional help seeking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Enable Teen-Friendly TalkAI Prompts</h3>
                  <p className="mb-6">Turn on safety flags and start building supportive routines.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Students</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-students" className="hover:text-blue-600">
                      AI Therapy for Students
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Manage academic stress and improve mental health.</p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Parents</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-for-parents" className="hover:text-blue-600">
                      AI Therapy for Parents
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Support your family's mental health journey.</p>
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
