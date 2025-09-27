import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Shield, Lock, Eye, Server, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'terapia IA privacidad & seguridad: How Your salud mental Data Stays Protected',
  description: 'Learn about the robust privacidad and seguridad measures protecting your salud mental conversations with terapia IA platforms. completo guide to data protection and confidencialidad.',
  keywords: [
    'terapia IA privacidad',
    'terapia IA seguridad',
    'salud mental data protection',
    'terapia IA confidencialidad',
    'secure terapia IA',
    'terapia IA data safety',
    'salud mental privacidad',
    'terapia IA encryption',
    'HIPAA terapia IA',
    'secure salud mental AI'
  ],
  openGraph: {
    title: 'terapia IA privacidad & seguridad: Your salud mental Data is Protected',
    description: 'integral guide to how terapia IA platforms protect your most sensitive conversations and personal data.',
    type: 'article',
    images: ['/og-ai-therapy-privacidad.png'],
    publishedTime: '2024-07-11',
    authors: ['TalkAI seguridad Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terapia IA privacidad: Your salud mental Data is Safe',
    description: 'Learn how avanzado seguridad measures protect your terapia IA conversations and personal information.',
    images: ['/twitter-ai-therapy-privacidad.png'],
  },
};

export default function AITherapyPrivacySecurityPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                privacidad
              </Badge>
              <Badge variant="outline">seguridad</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              terapia IA privacidad & seguridad: How Your salud mental Data Stays Protected
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Learn about the robust privacidad and seguridad measures protecting your salud mental conversations with terapia IA platforms. 
              Understand how your most sensitive data remains confidential and secure.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                TalkAI seguridad Team
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                July 11, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                8 min lectura
              </div>
            </div>
          </header>

          {/* Trust Message */}
          <Card className="mb-12 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-green-200" />
                <h2 className="text-2xl font-bold mb-4">Your privacidad is Our Priority</h2>
                <p className="text-lg text-green-100 max-w-3xl mx-auto">
                  We understand that salud mental conversations are among your most private and sensitive communications. 
                  Every design decision prioritizes the protection and confidencialidad of your personal data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Why privacidad Matters in terapia IA</h2>
              
              <p className="text-lg mb-6">
                salud mental therapy involves sharing your most intimate thoughts, fears, and experiences. Whether you're 
                discussing trauma, relationship issues, or personal struggles, you need absolute confidence that your 
                conversations remain private and secure.
              </p>

              <Card className="bg-yellow-50 border-yellow-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-yellow-800">The Trust Factor</h3>
                  <p className="text-yellow-700 mb-3">
                    investigación shows that privacidad concerns are the #1 barrera preventing people from seeking salud mental apoyo. 
                    When people know their data is protected, they're more likely to:
                  </p>
                  <ul className="space-y-1 text-yellow-700">
                    <li>• Share honestly about their struggles</li>
                    <li>• Discuss sensitive topics without fear</li>
                    <li>• Continue therapy consistently</li>
                    <li>• Experience better terapéutico outcomes</li>
                  </ul>
                </CardContent>
              </Card>

              <p>
                terapia IA platforms must earn and maintain this trust through transparent privacidad practices, robust seguridad 
                measures, and unwavering commitment to data protection.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Lock className="w-8 h-8 text-blue-600" />
                integral seguridad Framework
              </h2>
              
              <p className="text-lg mb-6">
                Modern terapia IA platforms implement multiple layers of seguridad to protect your data at every etapa – 
                from the moment you speak to long-term storage and eventual deletion.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Data Protection Layers</h3>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="w-6 h-6 text-green-600" />
                      1. End-to-End Encryption
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      All conversations are encrypted using military-grade AES-256 encryption before leaving your device. 
                      This means your voice data is scrambled into unreadable code that only authorized systems can decrypt.
                    </p>
                    <div className="bg-slate-50 p-4 rounded text-sm">
                      <strong>What this means:</strong> Even if someone intercepted your data during transmission, 
                      they would only see meaningless encrypted code, not your actual conversations.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Server className="w-6 h-6 text-blue-600" />
                      2. Secure Cloud Infrastructure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      Data is stored on enterprise-grade cloud servers with multiple seguridad certifications including 
                      SOC 2 Type II, ISO 27001, and HIPAA compliance where applicable.
                    </p>
                    <div className="bg-slate-50 p-4 rounded text-sm">
                      <strong>seguridad features:</strong> 24/7 monitoring, intrusion detection, automated amenaza response, 
                      and regular seguridad audits by third-party experts.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Eye className="w-6 h-6 text-purple-600" />
                      3. Access Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      Strict access controls ensure that only essential systems can proceso your data, and human access 
                      is limited to emergency situations with proper authorization and logging.
                    </p>
                    <div className="bg-slate-50 p-4 rounded text-sm">
                      <strong>Access principios:</strong> Minimum necessary access, role-based permissions, 
                      regular access reviews, and integral audit trails.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Data Handling and Storage Policies</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">✅ What We Do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Encrypt all data in transit and at rest</li>
                      <li>• Use anonymized identifiers instead of personal info</li>
                      <li>• Implement automatic data deletion policies</li>
                      <li>• Conduct regular seguridad audits</li>
                      <li>• Provide transparent privacidad policies</li>
                      <li>• Allow users to delete their data anytime</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">❌ What We Never Do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Sell your personal data to third parties</li>
                      <li>• Share conversations with advertisers</li>
                      <li>• Use your data to train AI without consent</li>
                      <li>• Store unnecessary personal information</li>
                      <li>• Access your data without proper authorization</li>
                      <li>• Retain data longer than necessary</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Data Lifecycle Management</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📥 Data Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Principle:</strong> Collect only what's necessary for providing therapy services. 
                      No unnecessary personal information is gathered or stored.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💾 Data Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Principle:</strong> proceso data only for terapéutico purposes using secure, 
                      encrypted systems with minimal human involvement.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🗃️ Data Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Principle:</strong> Store data securely with automatic deletion policies. 
                      Users maintain control over their data retention preferencias.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🗑️ Data Deletion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Principle:</strong> Permanent deletion upon user request or automatic deletion 
                      after specified retention periods. No data recuperación after deletion.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">privacidad by Design</h2>
              
              <p className="text-lg mb-6">
                Leading terapia IA platforms build privacidad protection into every aspect of their system design, 
                not as an afterthought but as a fundamental principle.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎭 Data Minimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>enfoque:</strong> Collect and store only essential data for therapy services
                    </p>
                    <p className="text-sm">
                      Many platforms use técnicas like "differential privacidad" to extract perspectivas 
                      from user patterns without storing individual identifying information.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔒 Zero-conocimiento Architecture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>enfoque:</strong> Systems designed so platform operators cannot access raw user data
                    </p>
                    <p className="text-sm">
                      avanzado platforms use encryption keys that only you control, ensuring that 
                      even platform employees cannot read your conversations.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">⏰ Automatic Deletion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>enfoque:</strong> Built-in data expiration and deletion policies
                    </p>
                    <p className="text-sm">
                      Conversations are automatically deleted after specified periods unless 
                      you explicitly choose to retain them for continuity of care.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔐 Local Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>enfoque:</strong> proceso data on your device when possible
                    </p>
                    <p className="text-sm">
                      Some processing happens locally on your device, meaning sensitive data 
                      never leaves your personal device at all.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Regulatory Compliance and estándares</h2>
              
              <p className="text-lg mb-6">
                Reputable terapia IA platforms comply with strict regulatory estándares designed to protect sensitive health information.
              </p>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">🏥 HIPAA Compliance (US)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      The Health Insurance Portability and Accountability Act sets strict estándares for protecting 
                      sensitive patient health information in the United States.
                    </p>
                    <div className="bg-blue-50 p-4 rounded">
                      <strong>HIPAA requisitos Include:</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Administrative safeguards (access controls, training)</li>
                        <li>• Physical safeguards (secure facilities, device controls)</li>
                        <li>• Technical safeguards (encryption, audit logs)</li>
                        <li>• Business associate agreements with vendors</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">🇪🇺 GDPR Compliance (Europe)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      The General Data Protection Regulation provides integral data protection rights 
                      for individuals in the European Union.
                    </p>
                    <div className="bg-green-50 p-4 rounded">
                      <strong>GDPR Rights Include:</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Right to access your personal data</li>
                        <li>• Right to rectification (correct inaccurate data)</li>
                        <li>• Right to erasure ("right to be forgotten")</li>
                        <li>• Right to data portability</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">🔒 SOC 2 Type II Certification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">
                      SOC 2 audits evaluate the efectividad of seguridad controls over a period of time, 
                      ensuring consistent protection of customer data.
                    </p>
                    <div className="bg-purple-50 p-4 rounded">
                      <strong>SOC 2 criterios:</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• seguridad (protection against unauthorized access)</li>
                        <li>• disponibilidad (systems are available for operation)</li>
                        <li>• Processing integrity (data is processed accurately)</li>
                        <li>• confidencialidad (sensitive information is protected)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Your privacidad Rights and Controls</h2>
              
              <p className="text-lg mb-6">
                You maintain control over your data and privacidad settings. Here's what you can typically control 
                in a privacidad-focused terapia IA platform:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Data Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• View all data stored about you</li>
                      <li>• Download your conversation history</li>
                      <li>• See how your data is being used</li>
                      <li>• Access privacidad dashboard</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">⚙️ privacidad Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Choose data retention periods</li>
                      <li>• Opt out of data analysis</li>
                      <li>• Control conversation storage</li>
                      <li>• Set automatic deletion preferencias</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🗑️ Data Deletion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Delete individual conversations</li>
                      <li>• Delete entire account and all data</li>
                      <li>• Request immediate data purging</li>
                      <li>• Verify deletion completion</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📝 Consent Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Granular consent options</li>
                      <li>• Withdraw consent anytime</li>
                      <li>• Update privacidad preferencias</li>
                      <li>• Review consent history</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Questions to Ask Your terapia IA Provider</h2>
              
              <p className="text-lg mb-6">
                When choosing an terapia IA platform, ask these important questions to ensure your privacidad is protected:
              </p>

              <Card className="bg-slate-50 border-slate-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Essential privacidad Questions</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Data Protection:</strong> "What encryption methods do you use? Where is my data stored? 
                      Who has access to my conversations?"
                    </div>
                    <div>
                      <strong>Data Use:</strong> "How do you use my data? Is it used to train AI models? 
                      Do you share data with third parties?"
                    </div>
                    <div>
                      <strong>Data Retention:</strong> "How long do you keep my data? Can I choose retention periods? 
                      How do I delete my data permanently?"
                    </div>
                    <div>
                      <strong>Compliance:</strong> "Are you HIPAA compliant? Do you follow GDPR? 
                      What certifications do you have?"
                    </div>
                    <div>
                      <strong>Transparency:</strong> "Can I see your privacidad policy in plain language? 
                      Will you notify me of any data breaches or policy changes?"
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Red Flags to Avoid</h3>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <ul className="space-y-2 text-red-700 text-sm">
                    <li>• Vague or confusing privacidad policies</li>
                    <li>• No mention of encryption or seguridad measures</li>
                    <li>• Requests for unnecessary personal information</li>
                    <li>• No clear data deletion options</li>
                    <li>• Lack of regulatory compliance certifications</li>
                    <li>• No response to privacidad-related questions</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                mejores prácticas for Users
              </h2>
              
              <p className="text-lg mb-6">
                While terapia IA platforms implement robust seguridad measures, you can take additional steps 
                to protect your privacidad:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔐 Account seguridad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Log out after each session</li>
                      <li>• Don't share account credentials</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📱 Device seguridad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Keep your device updated</li>
                      <li>• Use device lock screens</li>
                      <li>• Use private/incognito mode</li>
                      <li>• Clear browser data regularly</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌐 Network seguridad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Use secure Wi-Fi networks</li>
                      <li>• Avoid public Wi-Fi for therapy</li>
                      <li>• Consider using a VPN</li>
                      <li>• Keep router firmware updated</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">👥 Social privacidad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Use therapy in private spaces</li>
                      <li>• Be mindful of who can hear you</li>
                      <li>• Consider using headphones</li>
                      <li>• Don't discuss therapy details publicly</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Building Trust Through Transparency</h2>
              
              <p className="text-lg mb-6">
                The best terapia IA platforms understand that trust is earned through consistent, transparent privacidad practices. 
                They go beyond compliance requisitos to ensure users feel genuinely secure.
              </p>

              <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-green-200" />
                    <h3 className="text-2xl font-semibold mb-4">Your salud mental Deserves the Best Protection</h3>
                    <p className="mb-6 text-lg">
                      When choosing terapia IA, prioritize platforms that demonstrate unwavering commitment to your privacidad. 
                      Your sanación journey should be supported by technology you can trust completely.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        href="/privacidad" 
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        Read Our privacidad Policy →
                      </Link>
                      <Link 
                        href="/auth" 
                        className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                      >
                        Try Secure terapia IA
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