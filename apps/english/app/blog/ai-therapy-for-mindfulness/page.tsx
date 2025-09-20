import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, Leaf, Eye, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapy for Mindfulness: Enhancing Meditation and Present-Moment Awareness',
  description: 'Discover how AI therapy can enhance your mindfulness practice, improve meditation techniques, and help you develop present-moment awareness.',
  keywords: [
    'mindfulness therapy',
    'AI therapy for meditation',
    'mindfulness practice',
    'meditation techniques',
    'present moment awareness',
    'mindful living',
    'meditation guidance',
    'mindfulness training',
    'consciousness development',
    'mental clarity'
  ],
  openGraph: {
    title: 'AI Therapy for Mindfulness',
    description: 'Learn how AI therapy can enhance your mindfulness practice and meditation techniques.',
    type: 'article',
    images: ['/og-mindfulness.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapy for Mindfulness',
    description: 'Learn how AI therapy can enhance your mindfulness practice and meditation techniques.',
    images: ['/twitter-mindfulness.png'],
  },
};

export default function MindfulnessPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-lime-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-lime-100 text-lime-800">
                Mindfulness
              </Badge>
              <Badge variant="outline">Meditation</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              AI Therapy for Mindfulness: Enhancing Meditation and Present-Moment Awareness
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how AI therapy can enhance your mindfulness practice, improve meditation techniques, 
              and help you develop deeper present-moment awareness for better mental health.
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">The Power of Mindfulness and AI Therapy</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Mindfulness is a powerful tool for mental health, and AI therapy can enhance your practice 
                by providing personalized guidance, tracking progress, and offering support when you need it most.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">AI Therapy Solutions for Mindfulness</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-lime-50 dark:bg-lime-950 border-lime-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lime-800 dark:text-lime-200">
                      <Leaf className="w-5 h-5" />
                      Guided Meditation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lime-700 dark:text-lime-300">
                      Access personalized guided meditation sessions tailored to your needs.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 dark:bg-green-950 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <Eye className="w-5 h-5" />
                      Present Awareness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 dark:text-green-300">
                      Develop deeper present-moment awareness and mental clarity.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Mindfulness Therapy</h2>
              <Card className="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-950 dark:to-green-950 border-lime-200">
                <CardHeader>
                  <CardTitle className="text-lime-800 dark:text-lime-200">Ready to Enhance Your Mindfulness Practice?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lime-700 dark:text-lime-300 mb-4">
                    Begin your journey toward deeper mindfulness and mental clarity with TalkAI's AI-powered therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
                    >
                      Start Free Trial
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-lime-600 text-lime-600 rounded-lg hover:bg-lime-50 transition-colors"
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