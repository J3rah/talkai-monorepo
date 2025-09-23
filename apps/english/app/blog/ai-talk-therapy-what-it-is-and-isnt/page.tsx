import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Rise of AI Talk Therapy: What It Is and What It Isn\'t | talkAI',
  description: 'AI talk therapy pairs proven therapeutic techniques with 24/7, judgment‑free support. Learn what it is, what it isn\'t, and how it complements human care.',
  openGraph: {
    title: 'The Rise of AI Talk Therapy: What It Is and What It Isn\'t | talkAI',
    description: 'AI talk therapy pairs proven therapeutic techniques with 24/7, judgment‑free support. Learn what it is, what it isn\'t, and how it complements human care.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Rise of AI Talk Therapy: What It Is and What It Isn\'t | talkAI',
    description: 'AI talk therapy pairs proven therapeutic techniques with 24/7, judgment‑free support. Learn what it is, what it isn\'t, and how it complements human care.'
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">AI Therapy</Badge>
              <Badge variant="outline">Basics</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">The Rise of AI Talk Therapy: What It Is and What It Isn't</h1>
            <p className="text-slate-600 dark:text-slate-300">AI talk therapy pairs proven therapeutic techniques with 24/7, judgment‑free support. Think of it like a smart, compassionate journal that talks back—grounded in evidence‑based methods such as CBT, motivational interviewing, and mindfulness.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>What AI Talk Therapy Is 🤝</h2>
            <p>AI talk therapy is a powerful complement to traditional mental health care, offering:</p>
            <ul>
              <li><strong>Always‑on support</strong> for reflection, coping, and skill‑building 🌙</li>
              <li>A <strong>private space</strong> to process thoughts before, between, or after human sessions</li>
              <li>A <strong>structured guide</strong> for techniques like thought reframing and exposure ladders</li>
              <li><strong>Consistency</strong> that helps build healthy habits and coping strategies</li>
            </ul>

            <h2>What AI Talk Therapy Isn't 🚫</h2>
            <p>It's crucial to understand the boundaries:</p>
            <ul>
              <li><strong>Not a replacement</strong> for licensed therapists, crisis counseling, or medical care</li>
              <li><strong>Not a diagnostic tool</strong> or prescriber of medications</li>
              <li><strong>Not a substitute</strong> for community, connection, or emergency support</li>
              <li><strong>Not appropriate for crisis situations</strong> (dial your local emergency number in a crisis)</li>
            </ul>

            <h2>Key Benefits</h2>
            <h3>Low Friction 🧘</h3>
            <p>No scheduling, no waiting rooms, no stigma. Access support when you need it most.</p>

            <h3>Consistency 📅</h3>
            <p>Daily micro‑check‑ins improve outcomes by building momentum and self-awareness.</p>

            <h3>Personalization 🎯</h3>
            <p>Remembers patterns, helps set habits, and adapts to your communication style.</p>

            <h2>Safety and Privacy First</h2>
            <p>Curious how we think about safety, privacy, and scope? We design AI therapy with clear boundaries and user control at the center.</p>

            <p>Learn more about our mission and approach: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a> 💙</p>

            <h2>Further Reading</h2>
            <ul>
              <li><a href="https://www.nimh.nih.gov/health/topics/psychotherapies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">CBT Overview — NIMH</a></li>
              <li><a href="https://www.who.int/health-topics/mental-health" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">WHO: Mental Health Basics</a></li>
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