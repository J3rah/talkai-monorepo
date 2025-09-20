import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, X, Users, Bot, DollarSign, Calendar, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapy vs Human Therapy: Complete Comparison Guide 2024 | Which is Better?',
  description: 'Compare AI therapy with traditional human therapy. Understand the advantages, limitations, and when to choose each approach for optimal mental health support.',
  keywords: [
    'AI therapy vs human therapy',
    'AI therapist vs human therapist',
    'artificial intelligence therapy comparison',
    'digital therapy vs traditional therapy',
    'AI counseling vs human counseling',
    'online therapy comparison',
    'AI therapy benefits',
    'human therapy advantages',
    'mental health technology',
    'therapy options comparison'
  ],
  openGraph: {
    title: 'AI Therapy vs Human Therapy: Which is Better for You?',
    description: 'Comprehensive comparison of AI therapy and human therapy. Learn the pros, cons, and when to choose each approach.',
    type: 'article',
    images: ['/og-ai-vs-human-therapy.png'],
    publishedTime: '2024-07-17',
    authors: ['Dr. Sarah Chen'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapy vs Human Therapy: Complete Comparison',
    description: 'Which therapy approach is right for you? Compare AI and human therapy options.',
    images: ['/twitter-ai-vs-human-therapy.png'],
  },
};

export default function AIvsHumanTherapyPost() {
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
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Comparison
              </Badge>
              <Badge variant="outline">Featured</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              AI Therapy vs Human Therapy: Understanding the Differences and Benefits
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Compare AI therapy with traditional human therapy to understand the advantages, limitations, and when to choose 
              each approach for optimal mental health support. Make an informed decision about your mental health journey.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dr. Sarah Chen
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                July 17, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                10 min read
              </div>
            </div>
          </header>

          {/* Quick Comparison */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Quick Comparison Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-semibold mb-2">AI Therapy</h3>
                  <p className="text-sm text-slate-600">
                    Available 24/7, cost-effective, immediate access, consistent quality, privacy-focused
                  </p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">Human Therapy</h3>
                  <p className="text-sm text-slate-600">
                    Deep empathy, complex problem-solving, medical expertise, personalized treatment, cultural understanding
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">The Mental Health Landscape Today</h2>
              
              <p className="text-lg mb-6">
                Mental health support has evolved dramatically in recent years. While traditional human therapy remains the gold standard 
                for many conditions, AI therapy has emerged as a powerful complementary tool that addresses many barriers to mental healthcare. 
                Understanding when to use each approach – or how to combine them – is crucial for optimal mental health outcomes.
              </p>

              <Card className="bg-yellow-50 border-yellow-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">The Mental Health Crisis</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>1 in 4 people</strong> worldwide will experience mental health issues</li>
                    <li>• <strong>70% of people</strong> with mental health conditions receive no treatment</li>
                    <li>• Average wait time for therapy appointments: <strong>6-8 weeks</strong></li>
                    <li>• <strong>Cost barriers</strong> prevent 45% of people from seeking help</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Detailed Comparison: AI Therapy vs Human Therapy</h2>
              
              {/* Accessibility */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Accessibility & Availability
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        AI Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Available 24/7, 365 days a year</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Instant access, no waiting lists</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Works from anywhere with internet</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">No geographical limitations</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Human Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Limited to business hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Often has waiting lists (6-8 weeks)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">In-person and online options</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">May be limited by location</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Cost */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Cost & Affordability
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        AI Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">$20-50/month for unlimited access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Often includes free trial periods</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">No insurance requirements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Scales with usage</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Human Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">$100-300+ per session</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">May be covered by insurance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Insurance often limits sessions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Additional costs for specialization</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Treatment Quality */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  Treatment Quality & Approach
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        AI Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Consistent, evidence-based responses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">No therapist burnout or bad days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Data-driven insights and tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Limited emotional nuance understanding</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Human Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Deep empathy and emotional connection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Complex problem-solving abilities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Cultural and contextual understanding</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Quality varies by therapist</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Privacy & Comfort */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  Privacy & Comfort
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        AI Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Complete anonymity if desired</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Reduced stigma and social anxiety</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Use from comfort of home</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">No fear of judgment</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Human Therapy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Professional confidentiality</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">May involve insurance records</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Human connection and warmth</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Some people feel judged initially</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">When to Choose AI Therapy</h2>
              
              <Card className="bg-blue-50 border-blue-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">AI Therapy is Ideal For:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li>• <strong>Immediate support needs</strong> (anxiety attacks, stress)</li>
                      <li>• <strong>Mild to moderate</strong> mental health conditions</li>
                      <li>• <strong>Budget-conscious</strong> individuals</li>
                      <li>• <strong>Busy schedules</strong> requiring flexibility</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• <strong>Privacy-focused</strong> people</li>
                      <li>• <strong>Tech-comfortable</strong> users</li>
                      <li>• <strong>Supplemental support</strong> between human sessions</li>
                      <li>• <strong>Initial exploration</strong> of therapy</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Perfect Use Cases for AI Therapy</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌙 Late-Night Anxiety</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      When anxiety strikes at 2 AM, AI therapy provides immediate coping strategies and emotional support 
                      without waiting for morning appointments.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💼 Workplace Stress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Quick stress management techniques between meetings, without scheduling conflicts or privacy concerns 
                      in office environments.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📚 Student Mental Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Affordable mental health support for students dealing with academic pressure, social anxiety, 
                      and transition challenges.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔄 Ongoing Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Daily check-ins and mood tracking for people maintaining mental wellness or between 
                      traditional therapy sessions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">When to Choose Human Therapy</h2>
              
              <Card className="bg-green-50 border-green-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-green-800">Human Therapy is Essential For:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li>• <strong>Severe mental health conditions</strong> (bipolar, schizophrenia)</li>
                      <li>• <strong>Crisis situations</strong> (suicidal thoughts, self-harm)</li>
                      <li>• <strong>Complex trauma</strong> and PTSD</li>
                      <li>• <strong>Medication management</strong> needs</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• <strong>Relationship therapy</strong> (couples, family)</li>
                      <li>• <strong>Eating disorders</strong> and addiction</li>
                      <li>• <strong>Legal/ethical situations</strong> requiring professional judgment</li>
                      <li>• <strong>Cultural-specific</strong> therapy needs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-red-800">⚠️ When AI Therapy Isn't Enough</h3>
                  <p className="text-red-700 mb-3">
                    If you're experiencing any of these situations, seek immediate human professional help:
                  </p>
                  <ul className="space-y-2 text-red-700">
                    <li>• Thoughts of suicide or self-harm</li>
                    <li>• Hearing voices or experiencing hallucinations</li>
                    <li>• Severe depression preventing daily functioning</li>
                    <li>• Substance abuse or addiction issues</li>
                    <li>• Domestic violence or abuse situations</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">The Hybrid Approach: Combining Both</h2>
              
              <p className="text-lg mb-6">
                Many mental health professionals now recommend a <strong>hybrid approach</strong> that combines the strengths 
                of both AI and human therapy for optimal outcomes.
              </p>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Hybrid Approach Benefits:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li>• <strong>Continuous support</strong> between human sessions</li>
                      <li>• <strong>Cost optimization</strong> - fewer expensive human sessions needed</li>
                      <li>• <strong>Better preparation</strong> for human therapy sessions</li>
                      <li>• <strong>Consistent progress tracking</strong> and insights</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• <strong>Crisis prevention</strong> through early intervention</li>
                      <li>• <strong>Skill practice</strong> and reinforcement</li>
                      <li>• <strong>Reduced dependency</strong> on human therapist availability</li>
                      <li>• <strong>Enhanced self-awareness</strong> through data insights</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Sample Hybrid Treatment Plan</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Week 1-2: Assessment & Foundation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Start with human therapist for assessment and treatment plan. Use AI therapy daily for 
                      mood tracking and initial coping skill practice.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Week 3-6: Active Treatment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Bi-weekly human sessions for complex issues. Daily AI support for stress management, 
                      anxiety coping, and therapy homework reinforcement.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Week 7+: Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Monthly human check-ins for progress review. AI therapy as primary support for 
                      ongoing maintenance and crisis prevention.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Making Your Decision: Key Questions</h2>
              
              <Card className="bg-slate-50 dark:bg-slate-800 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Ask Yourself:</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">🎯 What's your primary goal?</h4>
                      <p className="text-sm text-slate-600">
                        Immediate relief, ongoing support, skill building, or deep therapeutic work?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">💰 What's your budget?</h4>
                      <p className="text-sm text-slate-600">
                        Can you afford $100-300/session, or do you need a more affordable option?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">⏰ How urgent is your need?</h4>
                      <p className="text-sm text-slate-600">
                        Do you need help immediately, or can you wait for an appointment?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">🤝 What's your comfort level?</h4>
                      <p className="text-sm text-slate-600">
                        Are you comfortable with technology, or do you prefer human interaction?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">📊 How severe are your symptoms?</h4>
                      <p className="text-sm text-slate-600">
                        Mild stress/anxiety, or complex conditions requiring medical expertise?
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">The Future of Mental Health Care</h2>
              
              <p className="text-lg mb-6">
                The future of mental health care isn't about choosing between AI and human therapy – it's about intelligent 
                integration of both approaches to create more accessible, effective, and personalized mental health support.
              </p>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Ready to Start Your Mental Health Journey?</h3>
                  <p className="mb-6">
                    Whether you choose AI therapy, human therapy, or a combination of both, taking the first step 
                    is what matters most. TalkAI provides accessible, empathetic AI support available 24/7.
                  </p>
                  <Link 
                    href="/auth" 
                    className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors mr-4"
                  >
                    Try AI Therapy Free →
                  </Link>
                  <Link 
                    href="/mental-health-resources" 
                    className="inline-block border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Find Human Therapists
                  </Link>
                </CardContent>
              </Card>
            </section>

          </div>

          

        </article>
      </div>
    </main>
  );
} 