import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Power of Feeling Heard: Why Validation Heals | talkAI',
  description: "When someone truly hears us, our nervous system shifts from defense to connection. Validation isn’t about agreeing; it’s about acknowledging the truth of our…",
  openGraph: {
    title: 'The Power of Feeling Heard: Why Validation Heals | talkAI',
    description: "When someone truly hears us, our nervous system shifts from defense to connection. Validation isn’t about agreeing; it’s about acknowledging the truth of our…",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Power of Feeling Heard: Why Validation Heals | talkAI',
    description: "When someone truly hears us, our nervous system shifts from defense to connection. Validation isn’t about agreeing; it’s about acknowledging the truth of our…"
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">The Power of Feeling Heard: Why Validation Heals</h1>
            <p className="text-slate-600 dark:text-slate-300">When someone truly hears us, our nervous system shifts from defense to connection. Validation isn’t about agreeing; it’s about acknowledging the truth of our…</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
<p>When someone truly hears us, our nervous system shifts from defense to connection. Validation isn’t about agreeing; it’s about acknowledging the truth of our experience. That simple shift lowers stress, increases clarity, and opens the door to healthier action.</p>
<p>Practical ways to practice self-validation:<br />- Name your emotion without judging it (“I feel overwhelmed, and that makes sense.”)<br />- Describe what triggered it (“Deadlines piled up.”)<br />- Offer a supportive response (“I can take one small step now.”)</p>
<p>Gentle support helps the process. With talkAI, you can speak or type in real time and receive responses designed to validate your emotions while offering grounded next steps—always private and secure.</p>
<p>CTA idea: Try a 5-minute check-in with talkAI and notice how your body feels afterward.</p>
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
