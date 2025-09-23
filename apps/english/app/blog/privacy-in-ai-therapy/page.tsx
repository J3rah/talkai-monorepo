import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Private by Design: How We Think About Mental Health Data | talkAI',
  description: 'Your story is yours. Mental health data deserves the highest standard of protection. Learn about our privacy commitments, data minimization, and user control principles.',
  openGraph: {
    title: 'Private by Design: How We Think About Mental Health Data | talkAI',
    description: 'Your story is yours. Mental health data deserves the highest standard of protection. Learn about our privacy commitments, data minimization, and user control principles.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private by Design: How We Think About Mental Health Data | talkAI',
    description: 'Your story is yours. Mental health data deserves the highest standard of protection. Learn about our privacy commitments, data minimization, and user control principles.'
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
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Privacy</Badge>
              <Badge variant="outline">Security</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Private by Design: How We Think About Mental Health Data</h1>
            <p className="text-slate-600 dark:text-slate-300">Your story is yours 🔐. Mental health data deserves the highest standard of protection. Our privacy commitments: data minimization, user control, encryption and strict access controls.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Our Privacy Commitments 🛡️</h2>
            
            <h3>Data Minimization</h3>
            <p>We collect the least we need to provide effective support. No unnecessary data harvesting or profiling.</p>

            <h3>User Control</h3>
            <p>Export and delete options, clear consent flows, and transparent data practices give you full control over your information.</p>

            <h3>Encryption and Access Controls</h3>
            <p>End-to-end encryption protects your conversations, and strict access controls ensure only authorized systems can process your data.</p>

            <h2>What We Never Do 🚫</h2>
            <ul>
              <li><strong>Never sell</strong> your personal conversations. Period.</li>
              <li><strong>Never share</strong> your data with advertisers or third parties</li>
              <li><strong>Never use</strong> your conversations for training without explicit consent</li>
              <li><strong>Never access</strong> your data without your permission</li>
            </ul>

            <h2>Designing for "Quiet by Default" 🤫</h2>
            <p>We design for privacy by default. You choose what to share with a human therapist or keep for yourself. Your AI conversations remain private unless you explicitly choose to share them.</p>

            <h2>Questions to Ask Any Provider ⚠️</h2>
            <p>When evaluating any mental health AI service, ask:</p>
            <ul>
              <li><strong>What data is stored?</strong> For how long? ⏱️</li>
              <li><strong>Where is it stored</strong> and who can access it?</li>
              <li><strong>Is training opt‑in</strong> or opt‑out?</li>
              <li><strong>Can I delete everything</strong> easily?</li>
              <li><strong>What happens</strong> to my data if I stop using the service?</li>
            </ul>

            <h2>Transparency in Practice</h2>
            <p>We believe in clear, understandable privacy policies. No legal jargon, no hidden practices. You should know exactly how your data is handled.</p>

            <h2>Learn More About Our Principles</h2>
            <p>See our detailed approach to privacy and security: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a> 🔒</p>

            <h2>Helpful Resources</h2>
            <ul>
              <li><a href="https://www.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FTC: Protecting Personal Health Records</a></li>
              <li><a href="https://www.nist.gov/privacy-framework" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">NIST: Privacy Framework</a></li>
            </ul>

            <h2>Your Rights Matter</h2>
            <p>Mental health data is among the most sensitive personal information. It deserves the highest standard of protection, transparency, and user control. We're committed to setting that standard.</p>
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
