import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Five‑Minute Micro‑Sessions That Actually Stick | talkAI',
  description: 'Big changes come from tiny, consistent steps. Learn how 5-minute micro-sessions can create momentum, reduce friction, and build lasting mental health habits.',
  openGraph: {
    title: 'Five‑Minute Micro‑Sessions That Actually Stick | talkAI',
    description: 'Big changes come from tiny, consistent steps. Learn how 5-minute micro-sessions can create momentum, reduce friction, and build lasting mental health habits.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Five‑Minute Micro‑Sessions That Actually Stick | talkAI',
    description: 'Big changes come from tiny, consistent steps. Learn how 5-minute micro-sessions can create momentum, reduce friction, and build lasting mental health habits.'
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
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">Micro-Sessions</Badge>
              <Badge variant="outline">Habits</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Five‑Minute Micro‑Sessions That Actually Stick</h1>
            <p className="text-slate-600 dark:text-slate-300">Big changes come from tiny, consistent steps ⏳. Micro‑sessions are short, guided conversations designed to create momentum without overwhelming you.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>The 5‑Minute Template ⏱️</h2>
            
            <h3>60 Seconds: Mood Check</h3>
            <p>Quick emotional temperature reading:</p>
            <ul>
              <li>Rate your mood (1-10) or use emoji scale 🙂</li>
              <li>One sentence: "I'm feeling..."</li>
              <li>No judgment, just awareness</li>
            </ul>

            <h3>2 Minutes: Thought Reframing</h3>
            <p>Process a recent trigger or worry:</p>
            <ul>
              <li>What happened?</li>
              <li>What's my automatic thought?</li>
              <li>What's an alternative perspective?</li>
            </ul>

            <h3>1 Minute: Breath or Body Scan</h3>
            <p>Ground yourself in the present:</p>
            <ul>
              <li>Three deep breaths 🌬️</li>
              <li>Notice one thing you can hear</li>
              <li>Feel your feet on the floor</li>
            </ul>

            <h3>1 Minute: Tiny Action</h3>
            <p>One small step forward:</p>
            <ul>
              <li>Send one text 🚶</li>
              <li>Drink a glass of water</li>
              <li>Step outside for fresh air</li>
              <li>Write one sentence in your journal</li>
            </ul>

            <h2>Why Micro‑Sessions Work 🚀</h2>
            
            <h3>Reduces Friction</h3>
            <p>No perfectionism tax. Five minutes feels doable even on your worst days.</p>

            <h3>Leverages the "Fresh Start Effect"</h3>
            <p>Each session is a new beginning, building momentum for positive change.</p>

            <h3>Builds Self‑Efficacy</h3>
            <p>Quick wins create confidence and prove you can take action.</p>

            <h3>Creates Compound Growth</h3>
            <p>Small, consistent actions add up to meaningful progress over time.</p>

            <h2>Real‑World Example</h2>
            <blockquote>
              <p><strong>Monday Morning:</strong> "I'm feeling overwhelmed about this week (6/10). I'm worried I won't get everything done. Maybe I can prioritize and ask for help if needed. *breathes* I'll start by making my bed."</p>
            </blockquote>

            <h2>Tips for Success 💡</h2>
            
            <h3>Set a Timer</h3>
            <p>Use your phone's timer to keep sessions focused and prevent perfectionism.</p>

            <h3>Celebrate Completion</h3>
            <p>Yes, really. Acknowledge that you showed up for yourself.</p>

            <h3>Be Flexible</h3>
            <p>Some days you'll do all 5 minutes, others just 2. Both count.</p>

            <h3>Track Patterns</h3>
            <p>Notice what times of day work best for you.</p>

            <h2>Common Pitfalls to Avoid</h2>
            <ul>
              <li><strong>Overthinking:</strong> Don't analyze the process, just do it</li>
              <li><strong>Perfectionism:</strong> Done is better than perfect</li>
              <li><strong>All-or-nothing:</strong> Missing one day doesn't break the streak</li>
              <li><strong>Too ambitious:</strong> Start smaller if 5 minutes feels too long</li>
            </ul>

            <h2>Getting Started</h2>
            <p>Try micro‑sessions with our assistant any time: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a> 🚀</p>

            <h2>Remember</h2>
            <p>The goal isn't to solve everything in 5 minutes. It's to build a sustainable practice that supports your mental health consistently. Small steps, big impact.</p>

            <h2>Key Takeaways</h2>
            <ul>
              <li>Micro-sessions reduce friction and increase consistency</li>
              <li>The 5-minute format prevents overwhelm</li>
              <li>Quick wins build confidence and momentum</li>
              <li>Flexibility is key—some sessions will be shorter than others</li>
              <li>Celebrate showing up, not perfection</li>
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
