import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, Briefcase, Target, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapy for Workplace Stress: Managing Work-Related Mental Health',
  description: 'Learn how AI therapy can help manage workplace stress, burnout, and work-related mental health challenges.',
  keywords: [
    'workplace stress',
    'AI therapy for work stress',
    'burnout treatment',
    'work-life balance',
    'professional stress',
    'workplace mental health',
    'stress management at work',
    'career counseling',
    'workplace wellness',
    'professional development'
  ],
  openGraph: {
    title: 'AI Therapy for Workplace Stress',
    description: 'Learn how AI therapy can help manage workplace stress and burnout.',
    type: 'article',
    images: ['/og-workplace-stress.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapy for Workplace Stress',
    description: 'Learn how AI therapy can help manage workplace stress and burnout.',
    images: ['/twitter-workplace-stress.png'],
  },
};

export default function WorkplaceStressPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Workplace Wellness
              </Badge>
              <Badge variant="outline">Professional Health</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              AI Therapy for Workplace Stress: Managing Work-Related Mental Health
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how AI therapy can help you manage workplace stress, prevent burnout, 
              and maintain a healthy work-life balance in today's demanding professional environment.
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
                12 min read
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Understanding Workplace Stress</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Workplace stress is a common challenge that can affect productivity, job satisfaction, and overall well-being. 
                AI therapy provides accessible support for managing work-related stress and maintaining mental health.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">AI Therapy Solutions for Workplace Stress</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <Briefcase className="w-5 h-5" />
                      Work-Life Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700 dark:text-orange-300">
                      Learn strategies to maintain healthy boundaries between work and personal life.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <Target className="w-5 h-5" />
                      Goal Setting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 dark:text-blue-300">
                      Set realistic professional goals and develop strategies to achieve them.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Workplace Therapy</h2>
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800 dark:text-orange-200">Ready to Manage Workplace Stress?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700 dark:text-orange-300 mb-4">
                    Start your journey to better workplace mental health with TalkAI's AI-powered therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Start Free Trial
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
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