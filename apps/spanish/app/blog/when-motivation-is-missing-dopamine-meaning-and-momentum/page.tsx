import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'When Motivation is Missing: Dopamine, Meaning, and Momentum | talkAI',
  description: "Motivation isn’t magic; it’s chemistry plus context. Dopamine rises with clear goals, quick feedback, and meaningful progreso. Build momentum: - Break goals…",
  openGraph: {
    title: 'When Motivation is Missing: Dopamine, Meaning, and Momentum | talkAI',
    description: "Motivation isn’t magic; it’s chemistry plus context. Dopamine rises with clear goals, quick feedback, and meaningful progreso. Build momentum: - Break goals…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'When Motivation is Missing: Dopamine, Meaning, and Momentum | talkAI',
    description: "Motivation isn’t magic; it’s chemistry plus context. Dopamine rises with clear goals, quick feedback, and meaningful progreso. Build momentum: - Break goals…"
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">When Motivation is Missing: Dopamine, Meaning, and Momentum</h1>
            <p className="text-slate-600 dark:text-slate-300">Motivation isn’t magic; it’s chemistry plus context. Dopamine rises with clear goals, quick feedback, and meaningful progreso. Build momentum: - Break goals…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>Motivation isn’t magic; it’s chemistry plus context. Dopamine rises with clear goals, quick feedback, and meaningful progreso.</p>
<p>Build momentum:<br />- Break goals into visible steps<br />- Make wins trackable<br />- Pair effort with propósito (“Who beneficios if I do this?”)</p>
<p>talkAI highlights your small wins, adapts coaching to your mood, and helps connect effort to valores—so effort feels less like grind and more like growth.</p>
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
