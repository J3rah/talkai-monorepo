import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Teens and AI Companions: Guidance for Families | talkAI',
  description: 'With the right boundaries, AI companions can help teens practice coping skills and name emotions. Learn how families can guide healthy AI use for teen mental health.',
  openGraph: {
    title: 'Teens and AI Companions: Guidance for Families | talkAI',
    description: 'With the right boundaries, AI companions can help teens practice coping skills and name emotions. Learn how families can guide healthy AI use for teen mental health.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teens and AI Companions: Guidance for Families | talkAI',
    description: 'With the right boundaries, AI companions can help teens practice coping skills and name emotions. Learn how families can guide healthy AI use for teen mental health.'
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
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">Teens</Badge>
              <Badge variant="outline">Family</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Teens and AI Companions: Guidance for Families</h1>
            <p className="text-slate-600 dark:text-slate-300">AI companions can help teens practice coping skills and name emotions 🧩—with the right boundaries and adult guidance.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>How AI Can Help Teens 💙</h2>
            
            <h3>Emotion Labeling Practice</h3>
            <p>AI can help teens:</p>
            <ul>
              <li>Identify and name complex emotions</li>
              <li>Understand emotional triggers and patterns</li>
              <li>Practice emotional vocabulary in a safe space</li>
              <li>Learn to distinguish between different feelings</li>
            </ul>

            <h3>Coping Skills Building</h3>
            <p>Teens can practice:</p>
            <ul>
              <li>Breathing exercises and mindfulness techniques</li>
              <li>Problem-solving strategies for school and social situations</li>
              <li>Communication skills for difficult conversations</li>
              <li>Stress management techniques</li>
            </ul>

            <h3>Safe Self‑Expression</h3>
            <p>AI provides a judgment‑free space for teens to:</p>
            <ul>
              <li>Express thoughts and feelings without fear of criticism</li>
              <li>Explore identity questions and personal values</li>
              <li>Process social situations and relationships</li>
              <li>Practice difficult conversations</li>
            </ul>

            <h2>Family‑First Tips 👪</h2>
            
            <h3>Set Clear Expectations</h3>
            <p>Help teens understand:</p>
            <ul>
              <li>AI is support, not a replacement for people</li>
              <li>When to seek help from trusted adults</li>
              <li>How AI fits into their overall support system</li>
              <li>The importance of maintaining real relationships</li>
            </ul>

            <h3>Encourage Reflective Use</h3>
            <p>Ask questions like:</p>
            <ul>
              <li>"What did you learn from your AI conversation today?"</li>
              <li>"How did it help you think about your situation?"</li>
              <li>"What would you like to discuss with me about it?"</li>
              <li>"How can we use this insight together?"</li>
            </ul>

            <h3>Model Healthy Help‑Seeking</h3>
            <p>Demonstrate by:</p>
            <ul>
              <li>Encouraging conversations with school counselors</li>
              <li>Supporting relationships with trusted adults</li>
              <li>Being open about your own mental health practices</li>
              <li>Creating a family culture of emotional support</li>
            </ul>

            <h2>Safety Considerations 🛡️</h2>
            
            <h3>Avoid Late‑Night Doom‑Looping</h3>
            <p>Set boundaries around:</p>
            <ul>
              <li>Time limits for AI conversations</li>
              <li>No AI use before bedtime</li>
              <li>Gentle nudges to take breaks and rest 🌙</li>
              <li>Encouragement to engage in other activities</li>
            </ul>

            <h3>Crisis Resources</h3>
            <p>Ensure teens know:</p>
            <ul>
              <li><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</li>
              <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
              <li><strong>School counselor or trusted adult</strong></li>
              <li><strong>When to seek immediate help</strong></li>
            </ul>

            <h3>Digital Literacy</h3>
            <p>Teach teens about:</p>
            <ul>
              <li>Privacy settings and data protection</li>
              <li>Recognizing when AI responses seem off</li>
              <li>Balancing online and offline relationships</li>
              <li>Critical thinking about AI recommendations</li>
            </ul>

            <h2>Age‑Appropriate Boundaries</h2>
            
            <h3>Ages 13-15</h3>
            <p>More supervision, shorter sessions, focus on basic emotion recognition and simple coping strategies.</p>

            <h3>Ages 16-17</h3>
            <p>Increased independence, longer conversations, more complex problem-solving and relationship skills.</p>

            <h3>Age 18+</h3>
            <p>Full access with ongoing family support and encouragement to maintain human connections.</p>

            <h2>Warning Signs to Watch For</h2>
            <ul>
              <li>Excessive time spent with AI to the exclusion of human relationships</li>
              <li>Using AI to avoid difficult conversations with family or friends</li>
              <li>Increased anxiety or depression despite AI support</li>
              <li>Reliance on AI for all emotional support</li>
              <li>Changes in sleep, eating, or school performance</li>
            </ul>

            <h2>Creating a Supportive Environment</h2>
            <p>Build a family culture where:</p>
            <ul>
              <li>Mental health conversations are normalized</li>
              <li>Seeking help is encouraged, not stigmatized</li>
              <li>Technology use is balanced with face-to-face time</li>
              <li>Teens feel comfortable sharing their experiences</li>
            </ul>

            <h2>Our Family‑First Principles</h2>
            <p>We design with parent/guardian needs in mind, providing tools for supervision, conversation starters, and clear boundaries.</p>

            <p>Learn more: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a></p>

            <h2>Key Takeaways</h2>
            <ul>
              <li>AI can be a helpful tool for teen emotional development when used appropriately</li>
              <li>Family guidance and boundaries are essential for healthy AI use</li>
              <li>AI should complement, not replace, human relationships and support</li>
              <li>Parents should stay engaged and ask reflective questions</li>
              <li>Crisis resources and digital literacy are crucial for teen safety</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Remember:</strong> If your teen is in crisis, seek immediate professional help. AI companions are not appropriate for emergency situations.
                  </p>
                </div>
              </div>
            </div>
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
