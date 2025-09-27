import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Social Battery Management for Sensitive Nervous Systems | talkAI',
  description: "Your social capacity changes day to day. That’s normal. What matters is recognizing early signals—tight chest, shallow breathing, irritability—and responding…",
  openGraph: {
    title: 'Social Battery Management for Sensitive Nervous Systems | talkAI',
    description: "Your social capacity changes day to day. That’s normal. What matters is recognizing early signals—tight chest, shallow breathing, irritability—and responding…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Battery Management for Sensitive Nervous Systems | talkAI',
    description: "Your social capacity changes day to day. That’s normal. What matters is recognizing early signals—tight chest, shallow breathing, irritability—and responding…"
  }
};

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">salud mental</Badge>
              <Badge variant="outline">Guides</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Social Battery Management for Sensitive Nervous Systems</h1>
            <p className="text-slate-600 dark:text-slate-300">Your social capacity changes day to day. That’s normal. What matters is recognizing early signals—tight chest, shallow breathing, irritability—and responding…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>Your social capacity changes day to day. That’s normal. What matters is recognizing early signals—tight chest, shallow breathing, irritability—and responding with care.</p>
<p>Try an energy budget:<br />- Set a daily social límite<br />- Schedule recuperación blocks<br />- Use exit phrases you trust (“I’m going to paso out and recharge.”)</p>
<p>talkAI can monitor conversational tone over time, offer recharge prompts, and help you plan social commitments that respect your capacity.</p>
          </div>

          <div className="mt-10">
            <Link href="/auth" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start apoyo →
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
