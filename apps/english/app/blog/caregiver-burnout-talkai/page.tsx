import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, Heart, Shield, CheckCircle, Users, Timer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Caregiver Burnout: Sustainable Support with TalkAI',
  description:
    'Caregiving is hard. TalkAI helps you set boundaries, pace energy, and ask for help without guilt.',
  keywords: [
    'caregiver burnout',
    'caregiver support',
    'TalkAI caregivers',
    'caregiver mental health',
    'caregiver stress',
    'family caregiving',
  ],
  openGraph: {
    title: 'Caregiver Burnout: Sustainable Support with TalkAI',
    description:
      'Caregivers deserve care, too. TalkAI helps you right-size obligations and protect energy.',
    type: 'article',
    images: ['/og-image.png'],
    publishedTime: '2025-07-27',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caregiver Burnout: Sustainable Support with TalkAI',
    description: 'Set boundaries, pace energy, and ask for help without guilt.',
    images: ['/twitter-image.png'],
  },
};

export default function CaregiverBurnoutTalkAIPost() {
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
              <Badge variant="secondary" className="bg-green-100 text-green-800">Caregiver Support</Badge>
              <Badge variant="outline">New</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Caregiver Burnout: Sustainable Support with TalkAI
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Caregivers deserve care, too. TalkAI helps you right-size obligations and protect energy so you can care
              sustainably.
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
                <li><a href="#permission" className="text-blue-600 hover:underline">Permission Script</a></li>
                <li><a href="#capacity" className="text-blue-600 hover:underline">Capacity Planner</a></li>
                <li><a href="#help-request" className="text-blue-600 hover:underline">Help Request Scripts</a></li>
                <li><a href="#micro-rest" className="text-blue-600 hover:underline">Micro-Rest</a></li>
                <li><a href="#weekly-reset" className="text-blue-600 hover:underline">Weekly Reset</a></li>
                <li><a href="#cta" className="text-blue-600 hover:underline">Get Started</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section id="permission" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-blue-600" />
                Permission Script
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="italic">"I matter. My rest preserves my care. I cannot pour from an empty cup."</p>
                </CardContent>
              </Card>
            </section>

            <section id="capacity" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Timer className="w-8 h-8 text-blue-600" />
                Capacity Planner
              </h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <p className="mb-2 font-semibold">Daily structure:</p>
                  <ul className="space-y-2">
                    <li>• One priority</li>
                    <li>• One supportive action</li>
                    <li>• One rest block</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="help-request" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Help Request Scripts</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">Specific, time-bound, and easy to accept:</p>
                  <ul className="space-y-2">
                    <li>• "Can you sit with Mom for 2 hours Tuesday?"</li>
                    <li>• "I need help with grocery shopping this week"</li>
                    <li>• "Could you research respite care options?"</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="micro-rest" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Micro-Rest
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">5–10 minute restoration blocks with alarms:</p>
                  <ul className="space-y-2">
                    <li>• Deep breathing</li>
                    <li>• Stretching</li>
                    <li>• Music break</li>
                    <li>• Nature view</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="weekly-reset" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Weekly Reset</h2>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Identify energy drains</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Add or remove one commitment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span>Plan next week's rest</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cta" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get Started</h2>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Activate TalkAI's “Caregiver Capacity” Daily Check-In</h3>
                  <p className="mb-6">Protect your energy and care sustainably.</p>
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
                  <Badge variant="secondary" className="w-fit mb-2">Burnout</Badge>
                  <CardTitle>
                    <Link href="/blog/burnout-recovery-micro-coaching-talkai" className="hover:text-blue-600">
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
                  <Badge variant="secondary" className="w-fit mb-2">Chronic Pain</Badge>
                  <CardTitle>
                    <Link href="/blog/chronic-pain-mental-health-talkai" className="hover:text-blue-600">
                      Chronic Pain and Mood
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">Manage pain and mood with pacing and flare plans.</p>
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
