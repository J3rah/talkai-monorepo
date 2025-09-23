import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Turning Session Feedback into a Richer Journal | talkAI',
  description: 'Therapy insights fade if they\'re not captured. Learn how AI can transform your feedback into a living, searchable journal that tracks patterns and progress over time.',
  openGraph: {
    title: 'Turning Session Feedback into a Richer Journal | talkAI',
    description: 'Therapy insights fade if they\'re not captured. Learn how AI can transform your feedback into a living, searchable journal that tracks patterns and progress over time.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turning Session Feedback into a Richer Journal | talkAI',
    description: 'Therapy insights fade if they\'re not captured. Learn how AI can transform your feedback into a living, searchable journal that tracks patterns and progress over time.'
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
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Journaling</Badge>
              <Badge variant="outline">Therapy</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Turning Session Feedback into a Richer Journal</h1>
            <p className="text-slate-600 dark:text-slate-300">Therapy insights fade if they're not captured 📓. AI can transform your feedback into a living, searchable journal that tracks patterns and progress over time.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>What AI Captures 📈</h2>
            
            <h3>Wins and Worries Over Time</h3>
            <p>Track your emotional patterns, breakthrough moments, and recurring challenges to see your progress clearly.</p>

            <h3>Triggers, Patterns, and Coping Strategies</h3>
            <p>Identify what sets off difficult emotions and which coping strategies actually work for you.</p>

            <h3>Values and Goals Evolution</h3>
            <p>See how your priorities and aspirations change and grow throughout your therapeutic journey.</p>

            <h2>Privacy‑First Journaling Tips 🔒</h2>
            
            <h3>Tag Your Entries</h3>
            <p>Organize your thoughts with categories like:</p>
            <ul>
              <li>"work" - Job-related stress and insights</li>
              <li>"sleep" - Sleep patterns and rest quality</li>
              <li>"social" - Relationship dynamics and social interactions</li>
              <li>"anxiety" - Anxiety triggers and management</li>
              <li>"breakthrough" - Significant realizations or progress</li>
            </ul>

            <h3>Export Monthly Summaries</h3>
            <p>Generate comprehensive summaries for your therapist, highlighting patterns and progress without sharing every detail.</p>

            <h3>Keep Sensitive Entries Private</h3>
            <p>Choose what to share with your therapist and what to keep for your own reflection and growth.</p>

            <h2>How AI Enhances Traditional Journaling</h2>
            
            <h3>Pattern Recognition</h3>
            <p>AI can spot trends you might miss, like "You tend to feel more anxious on Sundays" or "Your mood improves after exercise."</p>

            <h3>Guided Reflection</h3>
            <p>Ask questions like "What themes have been coming up lately?" or "How has my sleep affected my mood this week?"</p>

            <h3>Searchable History</h3>
            <p>Find specific insights or moments by searching keywords, dates, or emotional states.</p>

            <h2>Example Journal Entry Structure</h2>
            <blockquote>
              <p><strong>Date:</strong> March 15, 2024</p>
              <p><strong>Mood:</strong> 7/10 (better than yesterday)</p>
              <p><strong>Key Insight:</strong> I realized I'm avoiding difficult conversations because I'm afraid of conflict, not because I don't care.</p>
              <p><strong>Triggers:</strong> Work meeting where I didn't speak up about my concerns</p>
              <p><strong>Strategy Used:</strong> Deep breathing, then scheduled a follow-up conversation</p>
              <p><strong>Tags:</strong> work, communication, breakthrough</p>
            </blockquote>

            <h2>Benefits of Structured Journaling</h2>
            
            <h3>Better Therapy Sessions</h3>
            <p>Come prepared with specific examples and patterns to discuss with your therapist.</p>

            <h3>Increased Self‑Awareness</h3>
            <p>Regular reflection helps you understand your emotional patterns and triggers.</p>

            <h3>Progress Tracking</h3>
            <p>See how far you've come, even when it doesn't feel like progress in the moment.</p>

            <h3>Accountability</h3>
            <p>Consistent journaling creates accountability for your mental health practices.</p>

            <h2>Bring Your Own Structure</h2>
            <p>AI can suggest frameworks, but you're in control. Whether you prefer free-form writing, structured prompts, or a mix of both, the system adapts to your style.</p>

            <h2>Learn More About Our Journaling Philosophy</h2>
            <p>Discover how we approach privacy, structure, and personalization: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a> 🧭</p>

            <h2>Getting Started</h2>
            <p>Start simple. Even 2-3 sentences after each therapy session or significant moment can create valuable patterns over time.</p>

            <h2>Key Takeaways</h2>
            <ul>
              <li>Structured journaling captures insights that might otherwise be lost</li>
              <li>AI can help identify patterns and themes you might miss</li>
              <li>Privacy controls let you choose what to share with your therapist</li>
              <li>Consistent practice, even in small doses, creates valuable data</li>
              <li>Your journal is yours—structure it however works best for you</li>
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
