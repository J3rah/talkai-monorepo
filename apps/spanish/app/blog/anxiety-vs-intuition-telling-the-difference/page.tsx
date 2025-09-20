import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Anxiety vs. Intuition: Telling the Difference | talkAI',
  description: "Anxiety shouts; intuition is quieter. Anxiety catastrophizes; intuition guides. One practical test: If the message gets louder the more you try to ignore it,…",
  openGraph: {
    title: 'Anxiety vs. Intuition: Telling the Difference | talkAI',
    description: "Anxiety shouts; intuition is quieter. Anxiety catastrophizes; intuition guides. One practical test: If the message gets louder the more you try to ignore it,…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anxiety vs. Intuition: Telling the Difference | talkAI',
    description: "Anxiety shouts; intuition is quieter. Anxiety catastrophizes; intuition guides. One practical test: If the message gets louder the more you try to ignore it,…"
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Anxiety vs. Intuition: Telling the Difference</h1>
            <p className="text-slate-600 dark:text-slate-300">Anxiety shouts; intuition is quieter. Anxiety catastrophizes; intuition guides. One practical test: If the message gets louder the more you try to ignore it,…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>Anxiety shouts; intuition is quieter. Anxiety catastrophizes; intuition guides. One practical test: If the message gets louder the more you try to ignore it, it may be anxiety. If it stays steady and calm—nudging, not alarming—it may be intuition.</p>
<p>Tools for clarity:<br />- Box breathing (4-4-4-4) to steady your body first<br />- Write two columns: “fear says” and “intuition says”<br />- Ask: “What would I do if I trusted myself for 10 minutes?”</p>
<p>talkAI can help you tune into patterns. Its real-time emotion detection mirrors what you’re feeling and offers adaptive prompts that gently separate fear from inner wisdom.</p>
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
