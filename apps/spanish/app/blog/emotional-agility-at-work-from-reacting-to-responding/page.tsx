import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Emotional Agility at Work: From Reacting to Responding | talkAI',
  description: "Agility is the space between stimulus and response. Build it by naming emotions quickly and choosing responses intentionally. The RAIN method: - Recognize:…",
  openGraph: {
    title: 'Emotional Agility at Work: From Reacting to Responding | talkAI',
    description: "Agility is the space between stimulus and response. Build it by naming emotions quickly and choosing responses intentionally. The RAIN method: - Recognize:…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emotional Agility at Work: From Reacting to Responding | talkAI',
    description: "Agility is the space between stimulus and response. Build it by naming emotions quickly and choosing responses intentionally. The RAIN method: - Recognize:…"
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Emotional Agility at Work: From Reacting to Responding</h1>
            <p className="text-slate-600 dark:text-slate-300">Agility is the space between stimulus and response. Build it by naming emotions quickly and choosing responses intentionally. The RAIN method: - Recognize:…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>Agility is the space between stimulus and response. Build it by naming emotions quickly and choosing responses intentionally.</p>
<p>The RAIN method:<br />- Recognize: “I’m angry and tense.”<br />- Allow: “This feeling can be here.”<br />- Investigate: “What value feels threatened?”<br />- Nurture: “How can I honor that value now?”</p>
<p>With voice or text, talkAI mirrors your emotional state and suggests grounded next steps—so you can lead with clarity, not reactivity.</p>
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
