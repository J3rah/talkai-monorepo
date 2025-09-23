import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Safety First: Knowing AI\'s Boundaries (and Yours) | talkAI',
  description: 'AI is support—not a substitute—for crisis care. Learn about AI therapy boundaries, when to escalate to human care, and how to use AI safely for mental health support.',
  openGraph: {
    title: 'Safety First: Knowing AI\'s Boundaries (and Yours) | talkAI',
    description: 'AI is support—not a substitute—for crisis care. Learn about AI therapy boundaries, when to escalate to human care, and how to use AI safely for mental health support.',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safety First: Knowing AI\'s Boundaries (and Yours) | talkAI',
    description: 'AI is support—not a substitute—for crisis care. Learn about AI therapy boundaries, when to escalate to human care, and how to use AI safely for mental health support.'
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
              <Badge variant="secondary" className="bg-red-100 text-red-800">Safety</Badge>
              <Badge variant="outline">Boundaries</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Safety First: Knowing AI's Boundaries (and Yours)</h1>
            <p className="text-slate-600 dark:text-slate-300">AI is support—not a substitute—for crisis care 🚨. We train models to recognize when to step back and route you to people who can help.</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Our Clear Boundaries 🚫</h2>
            
            <h3>Not for Emergencies or Imminent Risk</h3>
            <p>AI therapy is not appropriate for crisis situations, suicidal thoughts, or situations requiring immediate intervention.</p>

            <h3>No Diagnostics or Medication Advice</h3>
            <p>AI cannot diagnose mental health conditions or provide medical advice. Only licensed professionals can make clinical assessments.</p>

            <h3>Encourages Connection with Licensed Professionals</h3>
            <p>We actively encourage users to seek professional help when appropriate and maintain relationships with human therapists.</p>

            <h2>When to Seek Immediate Help 🆘</h2>
            
            <h3>Crisis Situations</h3>
            <p>If you're experiencing thoughts of self-harm or suicide, please seek immediate help:</p>
            <ul>
              <li><strong>United States:</strong> Call or text 988 (Suicide & Crisis Lifeline)</li>
              <li><strong>United Kingdom:</strong> Call 116 123 (Samaritans)</li>
              <li><strong>Canada:</strong> Call 1-833-456-4566 (Crisis Services Canada)</li>
              <li><strong>Australia:</strong> Call 13 11 14 (Lifeline)</li>
            </ul>

            <h3>Emergency Situations</h3>
            <p>Call your local emergency number (911, 999, 000, etc.) if you or someone else is in immediate danger.</p>

            <h3>Medical Emergencies</h3>
            <p>For medical emergencies, contact emergency services or go to your nearest emergency room.</p>

            <h2>How We Design for Safety 🛡️</h2>
            
            <h3>Clear Scope of Practice</h3>
            <p>Our AI is designed with clear limitations and will redirect users to appropriate resources when needed.</p>

            <h3>Escalation Protocols</h3>
            <p>When AI detects concerning patterns or crisis language, it provides crisis resources and encourages professional help.</p>

            <h3>User Education</h3>
            <p>We provide clear information about when AI therapy is appropriate and when human intervention is necessary.</p>

            <h2>Signs You Should Seek Professional Help 👩‍⚕️</h2>
            
            <ul>
              <li>Thoughts of self-harm or suicide</li>
              <li>Severe depression or anxiety that interferes with daily life</li>
              <li>Substance abuse or addiction issues</li>
              <li>Trauma or PTSD symptoms</li>
              <li>Relationship or family conflicts requiring mediation</li>
              <li>Work or school performance significantly declining</li>
              <li>Sleep or eating patterns severely disrupted</li>
            </ul>

            <h2>How to Use AI Therapy Safely ✅</h2>
            
            <h3>As a Complement to Professional Care</h3>
            <p>Use AI therapy to supplement, not replace, professional mental health care.</p>

            <h3>For Skill Building and Practice</h3>
            <p>Practice coping strategies, mood tracking, and emotional regulation between therapy sessions.</p>

            <h3>For Daily Support and Reflection</h3>
            <p>Use AI for daily check-ins, journaling, and maintaining therapeutic momentum.</p>

            <h3>With Clear Expectations</h3>
            <p>Understand that AI provides support and guidance, not clinical treatment or crisis intervention.</p>

            <h2>Building Your Support Network</h2>
            <p>AI therapy works best when combined with:</p>
            <ul>
              <li>A licensed therapist or counselor</li>
              <li>Trusted friends and family members</li>
              <li>Support groups or communities</li>
              <li>Healthcare providers for physical health</li>
              <li>Crisis resources for emergencies</li>
            </ul>

            <h2>Our Safety Design Principles</h2>
            <p>Read how we design for safety and escalation: <a href="/about" className="text-blue-600 hover:text-blue-800 underline">About TalkAI</a></p>

            <h2>Remember</h2>
            <p>Your safety is our top priority. AI therapy is designed to support your mental health journey, but it's not a replacement for professional care or crisis intervention. When in doubt, reach out to a human professional.</p>

            <h2>Key Takeaways</h2>
            <ul>
              <li>AI therapy has clear boundaries and limitations</li>
              <li>It's not appropriate for crisis situations or emergencies</li>
              <li>Always seek professional help for serious mental health concerns</li>
              <li>AI works best as a complement to human care</li>
              <li>Know your local crisis resources and emergency numbers</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> If you're in crisis, please call your local emergency number or crisis hotline. AI therapy is not appropriate for emergency situations.
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
