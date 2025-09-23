import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Multilingual Empathy: Building for Culture, Not Just Language | talkAI',
  description: 'Mental health is cultural. Learn how we design AI therapy beyond translation, considering idioms, family contexts, stigma, and cultural norms for truly empathetic support.',
  openGraph: {
    title: 'Multilingual Empathy: Building for Culture, Not Just Language | talkAI',
    description: 'Mental health is cultural. Learn how we design AI therapy beyond translation, considering idioms, family contexts, stigma, and cultural norms for truly empathetic support.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multilingual Empathy: Building for Culture, Not Just Language | talkAI',
    description: 'Mental health is cultural. Learn how we design AI therapy beyond translation, considering idioms, family contexts, stigma, and cultural norms for truly empathetic support.'
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
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Global</Badge>
              <Badge variant="outline">Culture</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Multilingual Empathy: Building for Culture, Not Just Language</h1>
            <p className="text-slate-600 dark:text-slate-300">Mental health is cultural. Words carry different weights across languages 🌍. We design prompts, examples, and tone carefully—beyond translation.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>What Matters Beyond Translation 🗣️</h2>
            
            <h3>Idioms and Metaphors</h3>
            <p>Mental health concepts vary across cultures:</p>
            <ul>
              <li>"Nerves" vs "anxiety" - different emotional connotations</li>
              <li>"Feeling blue" vs "feeling heavy" - cultural metaphors for sadness</li>
              <li>"Heart problems" vs "mind problems" - how cultures conceptualize mental health</li>
            </ul>

            <h3>Family and Community Contexts</h3>
            <p>Cultural understanding shapes how we approach:</p>
            <ul>
              <li>Family dynamics and generational differences</li>
              <li>Community support systems and social roles</li>
              <li>Collective vs individual approaches to mental health</li>
              <li>Respect for elders and authority figures</li>
            </ul>

            <h3>Stigma and Help‑Seeking Norms</h3>
            <p>Different cultures have varying attitudes toward:</p>
            <ul>
              <li>Mental health treatment and therapy</li>
              <li>Emotional expression and vulnerability</li>
              <li>Professional vs family/community support</li>
              <li>Privacy and confidentiality expectations</li>
            </ul>

            <h2>How AI Can Help 🌐</h2>
            
            <h3>Switch Languages Mid‑Chat</h3>
            <p>Users can switch between languages without losing context, maintaining continuity in their therapeutic journey.</p>

            <h3>Localized Coping Strategies</h3>
            <p>AI suggests culturally appropriate coping methods:</p>
            <ul>
              <li>Meditation practices rooted in local traditions</li>
              <li>Community-based support resources</li>
              <li>Family-friendly communication strategies</li>
              <li>Religious or spiritual coping mechanisms</li>
            </ul>

            <h3>Respectful Tone Matching</h3>
            <p>AI adapts communication style to match cultural expectations:</p>
            <ul>
              <li>Formal vs informal address patterns</li>
              <li>Direct vs indirect communication styles</li>
              <li>Emotional expression norms</li>
              <li>Respect for cultural hierarchies</li>
            </ul>

            <h2>Real‑World Examples</h2>
            
            <h3>Latinx Communities</h3>
            <p>Understanding "familismo" - the importance of family in decision-making and support systems.</p>

            <h3>Asian Communities</h3>
            <p>Recognizing "face" - maintaining dignity and avoiding shame in family and community contexts.</p>

            <h3>Indigenous Communities</h3>
            <p>Honoring traditional healing practices alongside modern therapeutic approaches.</p>

            <h2>Design Principles for Cultural Sensitivity</h2>
            
            <h3>Community‑Informed Design</h3>
            <p>Work with cultural consultants and community members to ensure appropriate representation.</p>

            <h3>Flexible Frameworks</h3>
            <p>Create adaptable therapeutic approaches that can be customized for different cultural contexts.</p>

            <h3>Ongoing Learning</h3>
            <p>Continuously update cultural understanding based on user feedback and community input.</p>

            <h2>Challenges and Considerations</h2>
            
            <h3>Avoiding Stereotypes</h3>
            <p>Cultural sensitivity doesn't mean assuming all members of a culture think the same way.</p>

            <h3>Balancing Tradition and Innovation</h3>
            <p>Respect traditional approaches while introducing evidence‑based modern techniques.</p>

            <h3>Privacy Across Cultures</h3>
            <p>Understand different cultural expectations around privacy and confidentiality.</p>

            <h2>Our Investment in Research</h2>
            <p>We're investing in research‑backed multilingual experiences that go beyond simple translation to create truly empathetic, culturally aware support.</p>

            <p>Learn about our approach: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a> 🌐</p>

            <h2>Key Takeaways</h2>
            <ul>
              <li>Mental health support must consider cultural context, not just language</li>
              <li>Idioms, family dynamics, and stigma vary significantly across cultures</li>
              <li>AI can adapt tone and strategies to match cultural expectations</li>
              <li>Community input is essential for culturally sensitive design</li>
              <li>Cultural competence is an ongoing learning process</li>
            </ul>

            <h2>Looking Forward</h2>
            <p>The future of AI therapy is culturally informed, linguistically flexible, and respectful of diverse approaches to mental health and healing.</p>
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
