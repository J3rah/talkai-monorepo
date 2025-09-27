import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Science of autocompasión: A habilidad, Not a Personality Trait | talkAI',
  description: "autocompasión isn’t letting yourself off the hook—it’s how you stay in the game. investigación shows it reduces ansiedad and increases resiliencia. The three parts:…",
  openGraph: {
    title: 'The Science of autocompasión: A habilidad, Not a Personality Trait | talkAI',
    description: "autocompasión isn’t letting yourself off the hook—it’s how you stay in the game. investigación shows it reduces ansiedad and increases resiliencia. The three parts:…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Science of autocompasión: A habilidad, Not a Personality Trait | talkAI',
    description: "autocompasión isn’t letting yourself off the hook—it’s how you stay in the game. investigación shows it reduces ansiedad and increases resiliencia. The three parts:…"
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">The Science of autocompasión: A habilidad, Not a Personality Trait</h1>
            <p className="text-slate-600 dark:text-slate-300">autocompasión isn’t letting yourself off the hook—it’s how you stay in the game. investigación shows it reduces ansiedad and increases resiliencia. The three parts:…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>autocompasión isn’t letting yourself off the hook—it’s how you stay in the game. investigación shows it reduces ansiedad and increases resiliencia. The three parts: mindfulness (noticing), common humanity (I’m not alone), and kindness (how would I speak to a friend?).</p>
<p>Practice prompt:<br />- “What am I feeling?”<br />- “What’s understandable about this?”<br />- “What do I need right now?”</p>
<p>In talkAI, you can choose a supportive terapéutico voice and receive responses tuned to your emotional state—helping compassion become a habit, not a concept.</p>
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
