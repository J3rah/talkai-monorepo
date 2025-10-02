import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Shield, Lock, Eye, Server, FileText, Database, Key, Globe, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why You Can Trust talkAI: Security, Privacy, and Mental Health Protection | TalkAI',
  description: 'Learn about talkAI\'s comprehensive security framework protecting your mental health conversations. Enterprise-grade encryption, HIPAA-ready architecture, and privacy-first design.',
  keywords: [
    'talkAI security',
    'talkAI privacy',
    'mental health data protection',
    'AI therapy security',
    'encrypted therapy sessions',
    'HIPAA AI therapy',
    'secure mental health platform',
    'talkAI data encryption',
    'AI therapy confidentiality',
    'mental health privacy protection'
  ],
  openGraph: {
    title: 'Why You Can Trust talkAI: Security & Privacy at Our Core',
    description: 'Comprehensive security framework protecting your mental health conversations with enterprise-grade encryption and privacy-first design.',
    type: 'article',
    images: ['/og-talkai-security.png'],
    publishedTime: '2025-01-15',
    authors: ['TalkAI Security Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why You Can Trust talkAI: Security & Privacy Protection',
    description: 'Enterprise-grade security protecting your mental health conversations with AES-256 encryption and HIPAA-ready architecture.',
    images: ['/twitter-talkai-security.png'],
  },
};

export default function WhyYouCanTrustTalkAISecurityPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Security
              </Badge>
              <Badge variant="outline">Privacy</Badge>
              <Badge variant="outline">Trust</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Why You Can Trust talkAI: Security, Privacy, and Mental Health Protection at Our Core
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              At talkAI, trust isn't just important—it's essential. When you're sharing your deepest thoughts, emotions, 
              and mental health struggles with our AI therapy companion, we understand that privacy and security are paramount.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                TalkAI Security Team
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                January 15, 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                4 min read
              </div>
            </div>
          </header>

          {/* Trust Message */}
          <Card className="mb-12 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-green-200" />
                <h2 className="text-2xl font-bold mb-4">Your Mental Health Data is Sacred</h2>
                <p className="text-lg text-green-100 max-w-3xl mx-auto">
                  talkAI is not just a therapy platform—it's your secure, private space for mental health support built with 
                  enterprise-grade security, AES-256 encryption, and an unwavering commitment to never compromise your mental health privacy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Lock className="w-8 h-8 text-blue-600" />
                Authentication & User Security
              </h2>
              
              <p className="text-lg mb-6">
                We use <strong>Supabase Auth</strong>, a modern, enterprise-grade authentication system trusted by thousands of applications worldwide.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="w-6 h-6 text-blue-600" />
                      Authentication Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Google OAuth</strong> and email/password authentication</li>
                      <li>• <strong>Email verification</strong> is mandatory for all users</li>
                      <li>• <strong>Protected routes</strong> enforced with Next.js middleware</li>
                      <li>• <strong>Secure session management</strong> with encrypted cookies</li>
                      <li>• <strong>Automatic session refresh</strong> to maintain security</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-6 h-6 text-green-600" />
                      Password Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>bcrypt hashing</strong> with salt rounds</li>
                      <li>• <strong>Never stored</strong> in plain text</li>
                      <li>• <strong>Secure comparison</strong> prevents timing attacks</li>
                      <li>• <strong>Account lockout</strong> protection against brute force</li>
                      <li>• <strong>OAuth users</strong> get secure random passwords</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Database className="w-8 h-8 text-purple-600" />
                Data Encryption & Privacy-First Design
              </h2>
              
              <p className="text-lg mb-6">
                Your mental health conversations are protected using <strong>enterprise-grade encryption</strong> and privacy-first design principles.
              </p>

              <Card className="bg-blue-50 border-blue-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">Our Encryption Promise</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-blue-700">
                    <div>
                      <strong>AES-256 encryption</strong> for all sensitive data at rest
                    </div>
                    <div>
                      <strong>End-to-end encryption</strong> for voice conversations
                    </div>
                    <div>
                      <strong>Data only decrypted</strong> at runtime during AI response generation
                    </div>
                    <div>
                      <strong>No human at talkAI</strong> can view your personal conversations
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Mental Health Data Privacy</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">✅ Privacy by Default</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>By default, we don't save</strong> your conversation content</li>
                      <li>• <strong>Optional session saving</strong> with subscription plans</li>
                      <li>• <strong>Your data is never used</strong> to train AI models</li>
                      <li>• <strong>Complete data deletion</strong> available upon request</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8 text-orange-600" />
                Voice & Audio Security
              </h2>
              
              <p className="text-lg mb-6">
                Since talkAI specializes in voice-based therapy, we've implemented specialized security measures for audio data.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎤 Voice Security Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Real-time voice encryption</strong> during conversations</li>
                      <li>• <strong>Hume AI integration</strong> with secure API endpoints</li>
                      <li>• <strong>No voice data storage</strong> unless explicitly requested</li>
                      <li>• <strong>Secure WebRTC connections</strong> for real-time audio</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔒 Audio Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Audio processing</strong> happens in memory only</li>
                      <li>• <strong>Temporary processing</strong> for AI response generation</li>
                      <li>• <strong>No permanent storage</strong> of raw audio data</li>
                      <li>• <strong>Encrypted transmission</strong> to AI processing services</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Server className="w-8 h-8 text-teal-600" />
                Infrastructure-Level Security
              </h2>
              
              <p className="text-lg mb-6">
                Our deployment follows security best practices with enterprise-grade infrastructure and comprehensive protection measures.
              </p>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Globe className="w-6 h-6 text-blue-600" />
                      Hosting & Infrastructure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>Vercel hosting</strong> with enterprise-grade infrastructure
                      </div>
                      <div>
                        <strong>HTTPS everywhere</strong> with SSL/TLS encryption
                      </div>
                      <div>
                        <strong>Security headers</strong> including CSP and HSTS
                      </div>
                      <div>
                        <strong>DDoS protection</strong> and traffic filtering
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Database className="w-6 h-6 text-green-600" />
                      Database Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>Supabase PostgreSQL</strong> with enterprise-grade security
                      </div>
                      <div>
                        <strong>Row-level security (RLS)</strong> ensures data isolation
                      </div>
                      <div>
                        <strong>Encrypted connections</strong> to all database operations
                      </div>
                      <div>
                        <strong>Automated backups</strong> with encryption at rest
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-600" />
                Mental Health-Specific Protections
              </h2>
              
              <p className="text-lg mb-6">
                We understand the unique requirements of mental health platforms and have implemented specialized protections.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🏥 Healthcare Standards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>HIPAA-ready architecture</strong> with appropriate safeguards</li>
                      <li>• <strong>GDPR compliance</strong> for international users</li>
                      <li>• <strong>Therapeutic confidentiality</strong> built into architecture</li>
                      <li>• <strong>Professional resource integration</strong> for serious needs</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🚨 Crisis Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Crisis detection</strong> with appropriate resource referrals</li>
                      <li>• <strong>Emergency contact protocols</strong> for crisis situations</li>
                      <li>• <strong>24/7 emergency service</strong> referrals</li>
                      <li>• <strong>Clear crisis resource information</strong> always available</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Your Privacy Rights and Controls</h2>
              
              <p className="text-lg mb-6">
                You maintain complete control over your data and privacy settings. Here's what you can control with talkAI:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Data Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Choose data retention</strong> periods or auto-deletion</li>
                      <li>• <strong>Delete individual conversations</strong> at any time</li>
                      <li>• <strong>Delete entire account</strong> and all data</li>
                      <li>• <strong>Download your data</strong> for portability</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">⚙️ Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Control conversation storage</strong> preferences</li>
                      <li>• <strong>Set automatic deletion</strong> preferences</li>
                      <li>• <strong>Manage consent</strong> for data processing</li>
                      <li>• <strong>Access privacy dashboard</strong> for settings</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-indigo-600" />
                Security Best Practices
              </h2>
              
              <p className="text-lg mb-6">
                Every component of talkAI follows security best practices to ensure your mental health data remains protected.
              </p>

              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Technical Security</h3>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Environment variable management for all secrets</li>
                        <li>• Production/staging/dev environment isolation</li>
                        <li>• Debug logging disabled in production</li>
                        <li>• Regular security updates and vulnerability scanning</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Operational Security</h3>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Security headers enforced across all responses</li>
                        <li>• Rate limiting to prevent abuse</li>
                        <li>• Input validation and sanitization</li>
                        <li>• Comprehensive audit trails</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-green-200" />
                    <h2 className="text-3xl font-bold mb-4">Your Mental Health Deserves the Best Protection</h2>
                    <p className="text-lg text-green-100 max-w-3xl mx-auto mb-8">
                      We earn your trust not just by implementing security measures—but by understanding that when you're vulnerable 
                      and seeking mental health support, your privacy and security are non-negotiable.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-200 mb-2">AES-256</div>
                        <div className="text-sm">Encryption at Rest</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-200 mb-2">HIPAA-Ready</div>
                        <div className="text-sm">Healthcare Standards</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-200 mb-2">Zero-Knowledge</div>
                        <div className="text-sm">Privacy Architecture</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <Link 
                        href="/privacy" 
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        Read Our Privacy Policy →
                      </Link>
                      <Link 
                        href="/auth" 
                        className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                      >
                        Start Secure Therapy
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>

        </article>
      </div>
    </main>
  );
}
