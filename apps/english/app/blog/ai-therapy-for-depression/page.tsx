import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Heart, Sun, Shield, Zap, Cloud } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapy for Depression: 24/7 Support When You Need It Most | TalkAI',
  description: 'Discover how AI therapy provides continuous support for depression, offering coping strategies and emotional guidance available 24/7. Evidence-based treatment that works.',
  keywords: [
    'AI therapy for depression',
    'artificial intelligence depression treatment',
    'AI depression therapy',
    'digital depression treatment',
    'AI therapy depression support',
    'depression AI therapist',
    'online depression therapy AI',
    'AI mental health depression',
    'depression management AI',
    'AI counseling for depression'
  ],
  openGraph: {
    title: 'AI Therapy for Depression: 24/7 Support & Evidence-Based Treatment',
    description: 'Learn how AI therapy provides continuous, empathetic support for depression with proven techniques available anytime.',
    type: 'article',
    images: ['/og-ai-therapy-depression.png'],
    publishedTime: '2024-07-13',
    authors: ['Dr. James Wilson'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapy for Depression: Hope is Always Available',
    description: 'Discover 24/7 AI therapy support for depression with evidence-based techniques and continuous care.',
    images: ['/twitter-ai-therapy-depression.png'],
  },
};

export default function AITherapyForDepressionPost() {
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Conditions
              </Badge>
              <Badge variant="outline">Hope & Healing</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              AI Therapy for Depression: Comprehensive Support When You Need It Most
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover how AI therapy provides continuous support for depression, offering evidence-based coping strategies 
              and emotional guidance available 24/7. Learn why AI therapy is becoming a cornerstone of modern depression treatment.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dr. James Wilson
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                July 13, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                11 min read
              </div>
            </div>
          </header>

          {/* Hope Message */}
          <Card className="mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <Sun className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                <h2 className="text-2xl font-bold mb-4">You Are Not Alone</h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                  Depression affects 280 million people worldwide, but with AI therapy, support is always available. 
                  Recovery is possible, and help is just a conversation away.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Cloud className="w-8 h-8 text-gray-600" />
                Understanding Depression in Today's World
              </h2>
              
              <p className="text-lg mb-6">
                Depression is more than just feeling sad – it's a complex mental health condition that affects how you think, 
                feel, and handle daily activities. In our always-connected yet often isolating world, depression has become 
                increasingly common, affecting people of all ages and backgrounds.
              </p>

              <Card className="bg-gray-50 border-gray-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">The Reality of Depression</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>280 million people</strong> worldwide have depression</li>
                      <li>• <strong>Only 30%</strong> receive adequate treatment</li>
                      <li>• <strong>Depression symptoms</strong> can vary greatly between individuals</li>
                    </ul>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>6-8 week</strong> average wait for therapy appointments</li>
                      <li>• <strong>$200-400</strong> typical cost per therapy session</li>
                      <li>• <strong>Depression episodes</strong> don't follow business hours</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <p>
                This is where <strong>AI therapy for depression</strong> offers a revolutionary solution. By providing immediate, 
                empathetic support whenever depression symptoms arise, AI therapy bridges the gap between crisis and care, 
                offering hope and healing when it's needed most.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                How AI Therapy Supports Depression Recovery
              </h2>
              
              <p className="text-lg mb-6">
                AI therapy for depression combines evidence-based therapeutic approaches with the accessibility and consistency 
                that depression treatment requires. It's designed to provide continuous support during the ups and downs of recovery.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Core Treatment Approaches</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🧠 Cognitive Behavioral Therapy (CBT)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Identifies and challenges negative thought patterns that fuel depression.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Example:</strong> "I notice you're having thoughts of worthlessness. Let's examine the evidence..."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌱 Behavioral Activation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Helps increase engagement in meaningful activities to improve mood.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Example:</strong> "Let's identify one small activity that used to bring you joy..."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💭 Mindfulness-Based Cognitive Therapy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Combines mindfulness practices with cognitive therapy techniques.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Example:</strong> "Notice these thoughts like clouds passing through your mind..."
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Solution-Focused Therapy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">
                      Focuses on solutions and strengths rather than just problems.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Example:</strong> "Tell me about a time when you felt more hopeful. What was different?"
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Why AI Therapy Works for Depression</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Consistent Availability:</strong> Depression can hit at any time – AI is there at 3 AM or during a difficult weekend</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>No Judgment:</strong> Share your darkest thoughts without fear of being judged or misunderstood</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Gentle Progress:</strong> Meets you where you are, whether you're in a crisis or working on maintenance</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Personalized Support:</strong> Learns your specific triggers, patterns, and what helps you most</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Real Stories of Hope and Recovery</h2>
              
              <p className="text-lg mb-6">
                These anonymized stories show how AI therapy has helped real people navigate their depression journey.
              </p>

              <div className="space-y-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Maria, 34 - Major Depressive Episode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-3">
                      <strong>Situation:</strong> Lost job, going through divorce, stopped eating and sleeping regularly
                    </p>
                    <p className="text-green-700 mb-3">
                      <strong>AI Support:</strong> Daily check-ins, meal reminders, sleep hygiene guidance, gradual activity planning
                    </p>
                    <p className="text-green-700">
                      <strong>Progress:</strong> After 8 weeks, established daily routines, started job searching, improved sleep. 
                      "The AI never judged me for staying in bed all day. It just gently encouraged tiny steps forward."
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">David, 28 - Chronic Depression</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-3">
                      <strong>Situation:</strong> Long-term depression, medication side effects, isolation from friends
                    </p>
                    <p className="text-blue-700 mb-3">
                      <strong>AI Support:</strong> Cognitive restructuring, social skills practice, motivation for daily activities
                    </p>
                    <p className="text-blue-700">
                      <strong>Progress:</strong> Reconnected with 3 old friends, started exercising, mood improved significantly. 
                      "Having someone available 24/7 meant I never had to suffer alone through the dark hours."
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800">Elena, 19 - Depression with Anxiety</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 mb-3">
                      <strong>Situation:</strong> College depression, academic struggles, social withdrawal, panic attacks
                    </p>
                    <p className="text-purple-700 mb-3">
                      <strong>AI Support:</strong> Study stress management, social anxiety help, depression coping skills
                    </p>
                    <p className="text-purple-700">
                      <strong>Progress:</strong> GPA improved, made new friends, anxiety attacks reduced by 70%. 
                      "The AI helped me realize that depression lies to you. It taught me to question those negative thoughts."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Daily Support Features for Depression</h2>
              
              <p className="text-lg mb-6">
                AI therapy for depression isn't just about crisis intervention – it's about building sustainable habits 
                and coping strategies for long-term wellbeing.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌅 Morning Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Gentle wake-up encouragement</li>
                      <li>• Daily intention setting</li>
                      <li>• Energy level assessment</li>
                      <li>• Small achievable goal planning</li>
                      <li>• Morning routine support</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">☀️ Daytime Check-ins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Mood tracking and patterns</li>
                      <li>• Activity encouragement</li>
                      <li>• Thought challenging exercises</li>
                      <li>• Social connection reminders</li>
                      <li>• Self-care prompts</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌆 Evening Reflection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Daily wins celebration</li>
                      <li>• Gratitude practice</li>
                      <li>• Tomorrow preparation</li>
                      <li>• Relaxation techniques</li>
                      <li>• Sleep hygiene support</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌙 Crisis Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Immediate coping strategies</li>
                      <li>• Grounding techniques</li>
                      <li>• Safety planning</li>
                      <li>• Emergency resource connections</li>
                      <li>• Hope reminders</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-600" />
                Different Types of Depression AI Helps With
              </h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Major Depressive Disorder (MDD)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <strong>Symptoms:</strong> Persistent sadness, loss of interest, sleep issues, fatigue, worthlessness
                    </p>
                    <p>
                      <strong>AI Approach:</strong> Comprehensive CBT, behavioral activation, mood tracking, crisis support
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Persistent Depressive Disorder (Dysthymia)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <strong>Symptoms:</strong> Chronic low mood lasting 2+ years, low energy, hopelessness
                    </p>
                    <p>
                      <strong>AI Approach:</strong> Long-term support strategies, gradual mood improvement, consistency building
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Seasonal Affective Disorder (SAD)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <strong>Symptoms:</strong> Depression related to seasonal changes, typically fall/winter
                    </p>
                    <p>
                      <strong>AI Approach:</strong> Light therapy reminders, seasonal coping strategies, activity planning
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Postpartum Depression</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">
                      <strong>Symptoms:</strong> Depression after childbirth, overwhelming fatigue, difficulty bonding
                    </p>
                    <p>
                      <strong>AI Approach:</strong> New parent support, sleep schedule help, bonding encouragement
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Building Your Recovery Plan</h2>
              
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Your First Week with AI Therapy</h3>
                  <div className="space-y-3">
                    <div>
                      <strong>Day 1-2:</strong> Complete depression assessment, establish safety plan, learn basic coping skills
                    </div>
                    <div>
                      <strong>Day 3-4:</strong> Begin daily check-ins, practice thought challenging, start activity tracking
                    </div>
                    <div>
                      <strong>Day 5-7:</strong> Develop routine structure, identify support systems, set small weekly goals
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Creating Sustainable Habits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Goal Setting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Start with micro-goals (make bed, brush teeth)</li>
                      <li>• Gradually increase activity levels</li>
                      <li>• Focus on consistency over perfection</li>
                      <li>• Celebrate small wins daily</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔄 Routine Building</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Establish regular sleep schedule</li>
                      <li>• Create structured daily activities</li>
                      <li>• Include social connection time</li>
                      <li>• Build in self-care moments</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-500" />
                Safety and Crisis Support
              </h2>
              
              <Card className="bg-red-50 border-red-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-red-800">🚨 When to Seek Immediate Help</h3>
                  <div className="text-red-700">
                    <p className="mb-3">If you're experiencing any of these, please contact emergency services or a crisis hotline immediately:</p>
                    <ul className="space-y-2">
                      <li>• Thoughts of suicide or self-harm</li>
                      <li>• Plans to hurt yourself or others</li>
                      <li>• Feeling like you might act on harmful thoughts</li>
                      <li>• Severe psychotic symptoms (hearing voices, delusions)</li>
                    </ul>
                    <div className="mt-4 p-3 bg-red-100 rounded">
                      <strong>Crisis Resources:</strong>
                      <br />• National Suicide Prevention Lifeline: 988
                      <br />• Crisis Text Line: Text HOME to 741741
                      <br />• Emergency Services: 911
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-lg mb-6">
                AI therapy is designed to support you through depression, but it works best as part of a comprehensive 
                treatment approach. Many people find success combining AI therapy with traditional therapy and/or medication.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Hope and Healing Await</h2>
              
              <p className="text-lg mb-6">
                Depression can make everything feel hopeless, but recovery is possible. AI therapy offers a new path 
                forward – one where support is always available, judgment is nonexistent, and healing happens at your own pace.
              </p>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Sun className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                    <h3 className="text-2xl font-semibold mb-4">Your Journey to Wellness Starts Now</h3>
                    <p className="mb-6 text-lg">
                      You don't have to face depression alone. TalkAI provides compassionate, evidence-based support 
                      available whenever you need it – day or night, good days and difficult ones.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        href="/auth" 
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        Start Your Healing Journey →
                      </Link>
                      <Link 
                        href="/mental-health-resources" 
                        className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                      >
                        Crisis Resources
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