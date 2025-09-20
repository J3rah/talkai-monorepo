import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Breaking the Overwhelm Cycle with Tiny Wins | talkAI',
  description: "Overwhelm freezes action. The antidote is reducing the \"unit of work\" until it becomes doable. Try the 3-minute method: - Pick one micro-task (open the doc,…",
  openGraph: {
    title: 'Breaking the Overwhelm Cycle with Tiny Wins | talkAI',
    description: "Overwhelm freezes action. The antidote is reducing the \"unit of work\" until it becomes doable. Try the 3-minute method: - Pick one micro-task (open the doc,…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Breaking the Overwhelm Cycle with Tiny Wins | talkAI',
    description: "Overwhelm freezes action. The antidote is reducing the \"unit of work\" until it becomes doable. Try the 3-minute method: - Pick one micro-task (open the doc,…"
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Breaking the Overwhelm Cycle with Tiny Wins</h1>
            <p className="text-slate-600 dark:text-slate-300">Overwhelm freezes action. The antidote is reducing the \"unit of work\" until it becomes doable. Try the 3-minute method: - Pick one micro-task (open the doc,…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>Overwhelm freezes action. The antidote is reducing the "unit of work" until it becomes doable.</p>
<p>Try the 3-minute method:<br />- Pick one micro-task (open the doc, send one email, drink water)<br />- Do it for 3 minutes<br />- Celebrate the completion (yes, really)</p>
<p>Small steps compound. talkAI can coach you through tiny next actions, reflect your progress, and track emotional momentum—so getting started gets easier each time.</p>
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
