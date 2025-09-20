import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, HeartCrack, Flower, Sunrise } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapy for Grief: Coping with Loss and Finding Healing',
  description: 'Learn how AI therapy can help you navigate grief, process loss, and find healing during difficult times.',
  keywords: [
    'grief therapy',
    'AI therapy for grief',
    'coping with loss',
    'bereavement support',
    'grief counseling',
    'loss processing',
    'healing from grief',
    'emotional healing',
    'grief support',
    'bereavement therapy'
  ],
  openGraph: {
    title: 'AI Therapy for Grief',
    description: 'Learn how AI therapy can help you navigate grief and find healing.',
    type: 'article',
    images: ['/og-grief.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapy for Grief',
    description: 'Learn how AI therapy can help you navigate grief and find healing.',
    images: ['/twitter-grief.png'],
  },
};

export default function GriefPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                Grief Support
              </Badge>
              <Badge variant="outline">Healing</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              AI Therapy for Grief: Coping with Loss and Finding Healing
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how AI therapy can help you navigate grief, process loss, 
              and find healing during difficult times with compassionate, accessible support.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                TalkAI Research Team
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                December 19, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                10 min read
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Understanding Grief and Loss</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Grief is a natural response to loss, but it can be overwhelming and isolating. AI therapy provides 
                a safe space to process emotions and find healthy ways to cope with loss.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">AI Therapy Solutions for Grief</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-800 dark:text-violet-200">
                      <HeartCrack className="w-5 h-5" />
                      Emotional Processing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-violet-700 dark:text-violet-300">
                      Process complex emotions and find healthy ways to express grief.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-pink-50 dark:bg-pink-950 border-pink-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-800 dark:text-pink-200">
                      <Flower className="w-5 h-5" />
                      Healing Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-pink-700 dark:text-pink-300">
                      Navigate the healing process and find meaning after loss.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Grief Therapy</h2>
              <Card className="bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 border-violet-200">
                <CardHeader>
                  <CardTitle className="text-violet-800 dark:text-violet-200">Ready to Begin Your Healing Journey?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-violet-700 dark:text-violet-300 mb-4">
                    Start your journey toward healing with TalkAI's compassionate AI therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Start Free Trial
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
} 