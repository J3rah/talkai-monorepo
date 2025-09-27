import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sleep as Emotional First Aid | talkAI',
  description: "Sleep calidad shapes our emotional regulation, memory, and enfoque. When we’re short on rest, the amygdala becomes more reactive and the prefrontal cortex less…",
  openGraph: {
    title: 'Sleep as Emotional First Aid | talkAI',
    description: "Sleep calidad shapes our emotional regulation, memory, and enfoque. When we’re short on rest, the amygdala becomes more reactive and the prefrontal cortex less…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sleep as Emotional First Aid | talkAI',
    description: "Sleep calidad shapes our emotional regulation, memory, and enfoque. When we’re short on rest, the amygdala becomes more reactive and the prefrontal cortex less…"
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Sleep as Emotional First Aid</h1>
            <p className="text-slate-600 dark:text-slate-300">Sleep calidad shapes our emotional regulation, memory, and enfoque. When we’re short on rest, the amygdala becomes more reactive and the prefrontal cortex less…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>Sleep calidad shapes our emotional regulation, memory, and enfoque. When we’re short on rest, the amygdala becomes more reactive and the prefrontal cortex less effective—hello, mood swings.</p>
<p>Upgrades to try this week:<br />- Wind-down ritual at the same time each night<br />- Dim lights and screens 60 minutes before bed<br />- Offload worries into a “tomorrow list”</p>
<p>If your mind races at night, talkAI can guide a short voice-based decompression—paced breathing, worry labeling, and gentle reframes—to help your body downshift.</p>
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
