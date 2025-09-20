import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Healing is Nonlinear: How to Track Progress You Can’t Always Feel | talkAI',
  description: "Progress often looks like spirals, not straight lines. Two steps forward, one sideways. Tracking helps you see what your body can’t always feel. What to track:…",
  openGraph: {
    title: 'Healing is Nonlinear: How to Track Progress You Can’t Always Feel | talkAI',
    description: "Progress often looks like spirals, not straight lines. Two steps forward, one sideways. Tracking helps you see what your body can’t always feel. What to track:…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healing is Nonlinear: How to Track Progress You Can’t Always Feel | talkAI',
    description: "Progress often looks like spirals, not straight lines. Two steps forward, one sideways. Tracking helps you see what your body can’t always feel. What to track:…"
  }
};

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Mental Health</Badge>
              <Badge variant="outline">Guides</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Healing is Nonlinear: How to Track Progress You Can’t Always Feel</h1>
            <p className="text-slate-600 dark:text-slate-300">Progress often looks like spirals, not straight lines. Two steps forward, one sideways. Tracking helps you see what your body can’t always feel. What to track:…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>Progress often looks like spirals, not straight lines. Two steps forward, one sideways. Tracking helps you see what your body can’t always feel.</p>
<p>What to track:<br />- Triggers and recovery time<br />- Self-talk tone<br />- Quality of rest and connection</p>
<p>talkAI gives private, secure space to reflect, with adaptive prompts and simple insights that make change visible—and keep you encouraged when the path curves.</p>
          </div>

          <div className="mt-10">
            <Link href="/auth" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Support →
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
