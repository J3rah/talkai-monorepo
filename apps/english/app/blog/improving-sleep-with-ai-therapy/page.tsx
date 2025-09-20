import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, Moon, Bed, Coffee } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Improving Sleep with AI Therapy: Complete Guide to Better Rest',
  description: 'Learn how AI therapy can help you improve sleep quality, overcome insomnia, and develop healthy sleep habits. Discover TalkAI\'s sleep-focused therapy techniques.',
  keywords: [
    'sleep improvement',
    'AI therapy for sleep',
    'insomnia treatment',
    'better sleep habits',
    'sleep hygiene',
    'AI sleep therapy',
    'sleep disorders',
    'sleep quality',
    'sleep anxiety',
    'restful sleep'
  ],
  openGraph: {
    title: 'Improving Sleep with AI Therapy: Complete Guide',
    description: 'Learn how AI therapy can help you improve sleep quality and overcome insomnia with TalkAI.',
    type: 'article',
    images: ['/og-sleep-improvement.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Improving Sleep with AI Therapy',
    description: 'Learn how AI therapy can help you improve sleep quality and overcome insomnia.',
    images: ['/twitter-sleep-improvement.png'],
  },
};

export default function SleepImprovementPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                Sleep Health
              </Badge>
              <Badge variant="outline">Mental Health</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Improving Sleep with AI Therapy: A Complete Guide to Better Rest
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how AI therapy can help you overcome sleep problems, develop healthy sleep habits, 
              and achieve the restful sleep you deserve with TalkAI's sleep-focused therapy techniques.
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">The Importance of Quality Sleep</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Quality sleep is fundamental to our physical and mental well-being. Poor sleep can affect everything 
                from our mood and cognitive function to our immune system and overall health. AI therapy offers 
                innovative approaches to address sleep issues and improve sleep quality.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">How AI Therapy Helps with Sleep</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                      <Moon className="w-5 h-5" />
                      Sleep Pattern Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-indigo-700 dark:text-indigo-300">
                      AI analyzes your sleep patterns and identifies factors affecting your sleep quality.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                      <Bed className="w-5 h-5" />
                      Personalized Sleep Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 dark:text-purple-300">
                      Create customized sleep improvement strategies based on your unique needs and lifestyle.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Common Sleep Problems and Solutions</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Insomnia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Difficulty falling or staying asleep can be addressed through cognitive behavioral therapy for insomnia (CBT-I) 
                      techniques delivered by AI.
                    </p>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                      <li>• Sleep restriction therapy</li>
                      <li>• Stimulus control</li>
                      <li>• Relaxation techniques</li>
                      <li>• Cognitive restructuring</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Sleep Anxiety</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Anxiety about sleep can create a vicious cycle. AI therapy helps break this pattern through 
                      anxiety management techniques.
                    </p>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                      <li>• Anxiety reduction strategies</li>
                      <li>• Mindfulness practices</li>
                      <li>• Progressive muscle relaxation</li>
                      <li>• Thought challenging</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">AI-Powered Sleep Improvement Tools</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <CardHeader>
                    <CardTitle className="text-blue-800 dark:text-blue-200">Guided Sleep Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                      Access guided relaxation and sleep preparation sessions designed to help you fall asleep naturally.
                    </p>
                    <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                      <li>• Sleep meditation</li>
                      <li>• Breathing exercises</li>
                      <li>• Progressive relaxation</li>
                      <li>• Sleep stories</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
                  <CardHeader>
                    <CardTitle className="text-green-800 dark:text-green-200">Sleep Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      Monitor your sleep patterns and identify factors that affect your sleep quality.
                    </p>
                    <ul className="space-y-1 text-sm text-green-600 dark:text-green-400">
                      <li>• Sleep diary</li>
                      <li>• Pattern analysis</li>
                      <li>• Progress tracking</li>
                      <li>• Sleep quality metrics</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Sleep Therapy</h2>
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200">
                <CardHeader>
                  <CardTitle className="text-indigo-800 dark:text-indigo-200">Ready to Improve Your Sleep?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                    Start your journey to better sleep with TalkAI's AI-powered sleep therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Start Free Trial
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
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