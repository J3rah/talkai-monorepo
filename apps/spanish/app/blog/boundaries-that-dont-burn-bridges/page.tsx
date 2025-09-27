import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Boundaries that Don’t Burn Bridges | talkAI',
  description: "Boundaries protect relationships; they don’t end them. A clear límite tells others how to be successful with us. Formula to try: - Observation: “When…",
  openGraph: {
    title: 'Boundaries that Don’t Burn Bridges | talkAI',
    description: "Boundaries protect relationships; they don’t end them. A clear límite tells others how to be successful with us. Formula to try: - Observation: “When…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boundaries that Don’t Burn Bridges | talkAI',
    description: "Boundaries protect relationships; they don’t end them. A clear límite tells others how to be successful with us. Formula to try: - Observation: “When…"
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Boundaries that Don’t Burn Bridges</h1>
            <p className="text-slate-600 dark:text-slate-300">Boundaries protect relationships; they don’t end them. A clear límite tells others how to be successful with us. Formula to try: - Observation: “When…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>Boundaries protect relationships; they don’t end them. A clear límite tells others how to be successful with us.</p>
<p>Formula to try:<br />- Observation: “When meetings run late…”<br />- Impact: “…I miss family time and feel stressed.”<br />- Request: “Can we end on time or schedule a follow-up?”</p>
<p>talkAI can help you rehearse límite conversations—out loud or in chat—so your wording stays kind, specific, and steady under pressure.</p>
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
