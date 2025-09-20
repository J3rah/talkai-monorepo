import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield, Users, MessageCircle, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapy for Relationships: Improving Communication and Connection',
  description: 'Discover how AI therapy can help improve relationships, enhance communication skills, and build stronger connections with others.',
  keywords: [
    'relationship therapy',
    'AI therapy for relationships',
    'communication skills',
    'couples therapy',
    'relationship counseling',
    'emotional intelligence',
    'conflict resolution',
    'relationship advice',
    'marriage counseling',
    'interpersonal skills'
  ],
  openGraph: {
    title: 'AI Therapy for Relationships: Improving Communication',
    description: 'Learn how AI therapy can help improve relationships and enhance communication skills.',
    type: 'article',
    images: ['/og-relationships.png'],
    publishedTime: '2024-12-19',
    authors: ['TalkAI Research Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapy for Relationships',
    description: 'Learn how AI therapy can help improve relationships and communication.',
    images: ['/twitter-relationships.png'],
  },
};

export default function RelationshipsPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                Relationships
              </Badge>
              <Badge variant="outline">Communication</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              AI Therapy for Relationships: Improving Communication and Connection
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how AI therapy can help improve relationships, enhance communication skills, 
              and build stronger connections with others through personalized guidance and support.
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">The Role of AI Therapy in Relationship Health</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Healthy relationships are fundamental to our well-being. AI therapy offers unique opportunities 
                to improve communication, resolve conflicts, and build stronger connections with others.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Key Benefits of AI Therapy for Relationships</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-pink-50 dark:bg-pink-950 border-pink-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-800 dark:text-pink-200">
                      <MessageCircle className="w-5 h-5" />
                      Communication Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-pink-700 dark:text-pink-300">
                      Learn effective communication techniques and active listening skills.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                      <HeartHandshake className="w-5 h-5" />
                      Conflict Resolution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 dark:text-purple-300">
                      Develop healthy conflict resolution strategies and emotional regulation.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Getting Started with AI Relationship Therapy</h2>
              <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-800 dark:text-pink-200">Ready to Improve Your Relationships?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-pink-700 dark:text-pink-300 mb-4">
                    Start your journey to better relationships with TalkAI's AI-powered therapy platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Start Free Trial
                    </Link>
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
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