import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CBT Skills You Can Practice with an AI Assistant | talkAI',
  description: 'Cognitive Behavioral Therapy works best with repetition and feedback. Learn how an AI guide can help you practice thought records, cognitive restructuring, and behavioral activation.',
  openGraph: {
    title: 'CBT Skills You Can Practice with an AI Assistant | talkAI',
    description: 'Cognitive Behavioral Therapy works best with repetition and feedback. Learn how an AI guide can help you practice thought records, cognitive restructuring, and behavioral activation.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CBT Skills You Can Practice with an AI Assistant | talkAI',
    description: 'Cognitive Behavioral Therapy works best with repetition and feedback. Learn how an AI guide can help you practice thought records, cognitive restructuring, and behavioral activation.'
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
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">CBT</Badge>
              <Badge variant="outline">Skills Practice</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">CBT Skills You Can Practice with an AI Assistant</h1>
            <p className="text-slate-600 dark:text-slate-300">Cognitive Behavioral Therapy works best with repetition and feedback 🔁. An AI guide can help you practice core CBT exercises consistently between therapy sessions.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Core CBT Exercises 🧠</h2>
            
            <h3>Thought Records</h3>
            <p>Identify automatic thoughts and examine evidence for and against them:</p>
            <ul>
              <li>What's the triggering situation?</li>
              <li>What thoughts automatically come up?</li>
              <li>What evidence supports this thought?</li>
              <li>What evidence contradicts it?</li>
              <li>What's a more balanced perspective?</li>
            </ul>

            <h3>Cognitive Restructuring</h3>
            <p>Test alternative interpretations and challenge cognitive distortions:</p>
            <ul>
              <li>All-or-nothing thinking</li>
              <li>Catastrophizing</li>
              <li>Mind reading</li>
              <li>Personalization</li>
            </ul>

            <h3>Behavioral Activation</h3>
            <p>Schedule mood‑lifting actions and track their impact:</p>
            <ul>
              <li>Identify pleasurable activities</li>
              <li>Plan specific times to do them</li>
              <li>Track mood before and after</li>
              <li>Adjust based on what works</li>
            </ul>

            <h3>Exposure Ladders</h3>
            <p>Small steps toward feared situations 🪜:</p>
            <ul>
              <li>Start with least anxiety-provoking situation</li>
              <li>Practice until comfortable</li>
              <li>Move to next level</li>
              <li>Track progress and celebrate wins</li>
            </ul>

            <h3>Values Alignment</h3>
            <p>Actions that reflect what matters to you:</p>
            <ul>
              <li>Identify your core values</li>
              <li>Choose actions that align with them</li>
              <li>Notice when actions conflict with values</li>
              <li>Make adjustments accordingly</li>
            </ul>

            <h2>How to Use AI for Daily CBT Practice ☀️</h2>
            
            <h3>5‑Minute Morning Check‑In</h3>
            <p>Start your day with a quick mood assessment and intention setting.</p>

            <h3>Thought Record After Stressful Moments</h3>
            <p>When something triggers you, pause and work through a thought record with your AI assistant.</p>

            <h3>Weekly Reflection</h3>
            <p>Review what worked, what didn't, and what you want to try next week.</p>

            <h2>Example AI-Guided Session</h2>
            <blockquote>
              <p><strong>You:</strong> "I'm feeling anxious about my presentation tomorrow."</p>
              <p><strong>AI:</strong> "Let's work through this together. What's the worst thing you're imagining might happen?"</p>
              <p><strong>You:</strong> "I'll forget everything and embarrass myself."</p>
              <p><strong>AI:</strong> "That sounds really scary. Have you given presentations before? How did those go?"</p>
            </blockquote>

            <h2>Benefits of AI-Guided CBT Practice</h2>
            <ul>
              <li><strong>Consistency:</strong> Available 24/7 for practice</li>
              <li><strong>Patience:</strong> Never judges or rushes you</li>
              <li><strong>Structure:</strong> Guides you through proven frameworks</li>
              <li><strong>Tracking:</strong> Helps you see patterns over time</li>
              <li><strong>Privacy:</strong> Practice without fear of judgment</li>
            </ul>

            <h2>Getting Started</h2>
            <p>Want a gentle, structured starting point? Try our approach: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a> ✅</p>

            <h2>Remember</h2>
            <p>AI-guided CBT practice is a complement to, not a replacement for, professional therapy. Always work with a licensed therapist for complex issues, crisis situations, or diagnostic concerns.</p>

            <h2>Further Reading</h2>
            <ul>
              <li><a href="https://www.nhs.uk/mental-health/talking-therapies-and-counselling/types-of-therapy/cognitive-behavioural-therapy-cbt/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">NHS: Cognitive Behavioural Therapy (CBT)</a></li>
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
