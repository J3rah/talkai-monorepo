import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapists vs Human Therapists: A Helpful Partnership | talkAI',
  description: 'It\'s not either/or. It\'s both/and. AI excels at consistency and availability; humans excel at nuance and relational attunement. Together they create better outcomes.',
  openGraph: {
    title: 'AI Therapists vs Human Therapists: A Helpful Partnership | talkAI',
    description: 'It\'s not either/or. It\'s both/and. AI excels at consistency and availability; humans excel at nuance and relational attunement. Together they create better outcomes.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapists vs Human Therapists: A Helpful Partnership | talkAI',
    description: 'It\'s not either/or. It\'s both/and. AI excels at consistency and availability; humans excel at nuance and relational attunement. Together they create better outcomes.'
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
              <Badge variant="secondary" className="bg-green-100 text-green-800">Partnership</Badge>
              <Badge variant="outline">AI vs Human</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">AI Therapists vs Human Therapists: A Helpful Partnership</h1>
            <p className="text-slate-600 dark:text-slate-300">It's not either/or. It's both/and 🧩. AI excels at consistency, availability, and structured exercises. Humans excel at nuance, relational attunement, and complex case formulation.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>When AI Shines ✨</h2>
            <p>AI therapy assistants are particularly effective for:</p>
            <ul>
              <li><strong>Habit scaffolding</strong> and daily accountability 📅</li>
              <li><strong>Structured CBT worksheets</strong> and mood tracking</li>
              <li><strong>Gentle reminders</strong>, motivational nudges, and exposure practice</li>
              <li><strong>Consistent availability</strong> for micro-sessions and check-ins</li>
              <li><strong>Pattern recognition</strong> across multiple interactions</li>
            </ul>

            <h2>When Human Expertise Is Essential 👩‍⚕️</h2>
            <p>Licensed therapists remain irreplaceable for:</p>
            <ul>
              <li><strong>Complex trauma</strong>, comorbidities, or diagnostic questions</li>
              <li><strong>Crisis planning</strong>, safety assessments, and treatment decisions</li>
              <li><strong>Relationship dynamics</strong> and deep narrative work</li>
              <li><strong>Cultural sensitivity</strong> and personalized treatment planning</li>
              <li><strong>Medication management</strong> and coordination with healthcare providers</li>
            </ul>

            <h2>The Best of Both Worlds 🌟</h2>
            <h3>Between Sessions</h3>
            <p>Use AI for skill practice, mood tracking, and maintaining therapeutic momentum when your therapist isn't available.</p>

            <h3>Informed Sessions</h3>
            <p>Bring summaries from AI chats to inform therapy, reducing session time on "catch‑up" and increasing time on insights and planning.</p>

            <h3>Continuity of Care</h3>
            <p>AI can help maintain therapeutic gains between sessions, ensuring consistent progress and skill reinforcement.</p>

            <h2>Real-World Example</h2>
            <p>Sarah uses AI therapy daily for CBT exercises and mood tracking. During her weekly therapy sessions, she and her therapist review patterns, adjust strategies, and dive deeper into underlying issues. The AI handles the daily practice; the human therapist provides the clinical insight and personalized care.</p>

            <h2>Our Approach to Hybrid Care</h2>
            <p>See how we scope AI responsibly and design for human-AI collaboration: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a> 🔒</p>

            <h2>Key Takeaways</h2>
            <ul>
              <li>AI excels at consistency and structured practice</li>
              <li>Humans excel at complex clinical judgment and relationship building</li>
              <li>The most effective approach combines both strengths</li>
              <li>Clear boundaries and scope of practice are essential</li>
            </ul>
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
