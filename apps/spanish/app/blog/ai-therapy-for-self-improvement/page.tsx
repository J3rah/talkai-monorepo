import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, TrendingUp, Target, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapy for Self-Improvement: Personal Growth and Development',
  description: 'Discover how AI therapy can support your personal growth journey, build confidence, and achieve your self-improvement goals.',
  keywords: [
    'self-improvement',
    'AI therapy for personal growth',
    'personal development',
    'confidence building',
    'goal achievement',
    'self-help',
    'mental wellness',
    'personal transformation',
    'growth mindset',
    'self-actualization'
  ],
  openGraph: {
    title: 'AI Therapy for Self-Improvement',
    description: 'Learn how AI therapy can support your personal growth and development.',
    type: 'article',
    images: ['/og-self-improvement.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapy for Self-Improvement',
    description: 'Learn how AI therapy can support your personal growth and development.',
    images: ['/twitter-self-improvement.png'],
  },
};

export default function SelfImprovementPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Personal Growth
              </Badge>
              <Badge variant="outline">Self-Improvement</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              AI Therapy for Self-Improvement: Personal Growth and Development
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how AI therapy can support your personal growth journey, build confidence, 
              and help you achieve your self-improvement goals with personalized guidance and support.
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">The Power of AI Therapy for Personal Growth</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Personal growth is a lifelong journey that requires self-awareness, goal-setting, and consistent effort. 
                AI therapy provides the tools and support needed to accelerate your self-improvement journey.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Key Areas for Self-Improvement</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <TrendingUp className="w-5 h-5" />
                      Goal Achievement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Set and achieve meaningful personal and professional goals with AI guidance.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 dark:bg-green-950 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <Star className="w-5 h-5" />
                      Confidence Building
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 dark:text-green-300">
                      Build self-confidence and develop a positive self-image through AI therapy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Self-Improvement</h2>
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200">Ready to Start Your Growth Journey?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    Begin your self-improvement journey with TalkAI's AI-powered therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Start Free Trial
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
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