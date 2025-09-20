import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Brain, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: '¿Qué es la Terapia IA? Guía Completa de Inteligencia Artificial en Salud Mental 2024',
  description: 'Descubre cómo funciona la terapia IA, sus beneficios, limitaciones y por qué está revolucionando el apoyo de salud mental. Aprende si la terapia IA es adecuada para ti con nuestra guía completa.',
  keywords: [
    'qué es terapia IA',
    'terapia inteligencia artificial',
    'salud mental IA',
    'terapeuta IA explicado',
    'cómo funciona terapia IA',
    'beneficios asesoramiento IA',
    'terapia IA vs terapia humana',
    'salud mental digital',
    'terapia IA empática',
    'efectividad terapia IA'
  ],
  openGraph: {
    title: '¿Qué es la Terapia IA? Guía Completa de Apoyo de Salud Mental IA',
    description: 'Aprende todo sobre la terapia IA - cómo funciona, beneficios, limitaciones y si es adecuada para ti. Guía completa de apoyo de salud mental IA.',
    type: 'article',
    images: ['/og-what-is-ai-therapy.png'],
    publishedTime: '2024-07-18',
    authors: ['Equipo de Investigación talkAI'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Qué es la Terapia IA? Guía Completa de Salud Mental IA',
    description: 'Guía completa de terapia IA - cómo funciona, beneficios y si es adecuada para ti.',
    images: ['/twitter-what-is-ai-therapy.png'],
  },
};

export default function WhatIsAITherapyPost() {
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Fundamentos de Terapia IA
              </Badge>
              <Badge variant="outline">Destacado</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              ¿Qué es la Terapia IA? Una Guía Completa de Inteligencia Artificial en Salud Mental
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Descubre cómo funciona la terapia IA, sus beneficios, limitaciones y por qué está revolucionando el apoyo de salud mental. 
              Aprende si la terapia IA es adecuada para ti con nuestra guía completa basada en evidencia.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Equipo de Investigación talkAI
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                July 18, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                8 min lectura
              </div>
            </div>
          </header>

          {/* Table of Contents */}
          <Card className="mb-12 bg-blue-50 dark:bg-slate-800 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Tabla de Contenidos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="#what-is-ai-therapy" className="text-blue-600 hover:underline">¿Qué es la Terapia IA?</a></li>
                <li><a href="#how-it-works" className="text-blue-600 hover:underline">¿Cómo Funciona la Terapia IA?</a></li>
                <li><a href="#benefits" className="text-blue-600 hover:underline">Beneficios Clave de la Terapia IA</a></li>
                <li><a href="#types" className="text-blue-600 hover:underline">Tipos de Terapia IA</a></li>
                <li><a href="#effectiveness" className="text-blue-600 hover:underline">¿Es Efectiva la Terapia IA?</a></li>
                <li><a href="#limitations" className="text-blue-600 hover:underline">Limitaciones y Consideraciones</a></li>
                <li><a href="#getting-started" className="text-blue-600 hover:underline">Comenzando con la Terapia IA</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section id="what-is-ai-therapy" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                ¿Qué es la Terapia IA?
              </h2>
              
              <p className="text-lg mb-6">
                <strong>AI therapy</strong> (Artificial Intelligence therapy) is a form of mental health support that uses advanced AI technology 
                to provide therapeutic conversations, emotional guidance, and mental health resources. Unlike traditional therapy with human 
                therapists, AI therapy uses sophisticated algorithms, natural language processing, and emotional recognition to understand 
                and respond to your mental health needs.
              </p>

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Heart className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-slate-800">Key Definition</h3>
                      <p className="text-slate-700">
                        AI therapy combines the accessibility of technology with evidence-based therapeutic techniques to provide 
                        24/7 mental health support that's empathetic, personalized, and immediately available whenever you need it.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p>
                Modern AI therapy platforms like TalkAI use <strong>empathetic voice technology</strong> that can detect emotions in your 
                voice, understand context, and respond with appropriate therapeutic interventions. This isn't just a chatbot – it's a 
                sophisticated mental health tool designed to provide genuine support and guidance.
              </p>
            </section>

            <section id="how-it-works" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">¿Cómo Funciona la Terapia IA?</h2>
              
              <p className="text-lg mb-6">
                AI therapy operates through several advanced technologies working together to create a therapeutic experience:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🧠 Natural Language Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Advanced NLP understands the nuances of human language, context, and emotional undertones in your conversations.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎤 Emotion Recognition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Voice analysis technology detects emotional states through tone, pace, and vocal patterns to provide appropriate responses.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📚 Evidence-Based Techniques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>AI applies proven therapeutic methods like CBT, mindfulness, and emotional regulation techniques.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Personalization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Machine learning adapts to your unique communication style, preferences, and therapeutic needs over time.</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">The AI Therapy Process</h3>
              <ol className="list-decimal list-inside space-y-3 mb-6">
                <li><strong>Initial Assessment:</strong> The AI conducts a comprehensive evaluation of your mental health needs and goals</li>
                <li><strong>Personalized Approach:</strong> Based on your assessment, the AI tailors its therapeutic approach and communication style</li>
                <li><strong>Ongoing Conversations:</strong> Regular therapeutic conversations that adapt and evolve based on your progress</li>
                <li><strong>Continuous Learning:</strong> The AI learns from each interaction to provide increasingly personalized support</li>
                <li><strong>Progress Tracking:</strong> Monitor your mental health journey with insights and analytics</li>
              </ol>
            </section>

            <section id="benefits" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                Beneficios Clave de la Terapia IA
              </h2>
              
              <div className="grid gap-6 mb-8">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-800">🕐 24/7 Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">
                      Unlike traditional therapy with scheduled appointments, AI therapy is available whenever you need support – 
                      during a panic attack at 3 AM, before a stressful presentation, or anytime you're struggling.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-800">💰 Cost-Effective</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">
                      AI therapy costs significantly less than traditional therapy sessions, making mental health support 
                      accessible to people who might not otherwise afford professional help.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-800">🔒 Privacy & Anonymity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">
                      Many people feel more comfortable opening up to AI initially, reducing the stigma and anxiety 
                      that can come with seeking human professional help.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-orange-800">📍 Immediate Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700">
                      No waiting lists, no scheduling conflicts – start your mental health journey immediately 
                      without barriers that often delay traditional therapy.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Additional Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Consistent Quality:</strong> AI provides consistent, unbiased support without bad days or personal issues affecting treatment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Scalable Support:</strong> Can help unlimited people simultaneously, addressing the global mental health professional shortage</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Data-Driven Insights:</strong> Provides detailed analytics about your mental health patterns and progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span><strong>Complementary Care:</strong> Works alongside traditional therapy to provide additional support between sessions</span>
                </li>
              </ul>
            </section>

            <section id="types" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Tipos de Terapia IA</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>🗣️ Voice-Based AI Therapy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Conversational AI that you speak with directly, like TalkAI. This feels most natural and allows 
                      for emotional expression through voice tone and inflection.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>💬 Text-Based AI Therapy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Chat-based platforms where you type your thoughts and receive written responses. Good for 
                      people who prefer written communication.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>📱 App-Integrated AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      AI integrated into mental health apps that provide exercises, mood tracking, and guided 
                      interventions based on your data.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🤖 Avatar-Based Therapy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      AI presented through virtual characters or avatars, combining visual and conversational 
                      elements for a more immersive experience.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="effectiveness" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">¿Es Efectiva la Terapia IA?</h2>
              
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-slate-800">Research Findings</h3>
                  <p className="mb-4 text-slate-700">
                    Recent studies show promising results for AI therapy effectiveness:
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li>• <strong>70% of users</strong> report reduced anxiety symptoms after 4 weeks of AI therapy</li>
                    <li>• <strong>65% improvement</strong> in mood tracking scores among depression patients</li>
                    <li>• <strong>80% satisfaction rate</strong> with AI therapy accessibility and convenience</li>
                    <li>• <strong>45% reduction</strong> in crisis intervention needs when AI therapy is used as preventive care</li>
                  </ul>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">What Conditions Can AI Therapy Help With?</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <ul className="space-y-2">
                  <li>• <strong>Anxiety disorders</strong> and panic attacks</li>
                  <li>• <strong>Depression</strong> and mood disorders</li>
                  <li>• <strong>Stress management</strong> and burnout</li>
                  <li>• <strong>Sleep issues</strong> and insomnia</li>
                </ul>
                <ul className="space-y-2">
                  <li>• <strong>Relationship concerns</strong> and communication</li>
                  <li>• <strong>Grief and loss</strong> processing</li>
                  <li>• <strong>Work-related stress</strong> and career anxiety</li>
                  <li>• <strong>Self-esteem</strong> and confidence building</li>
                </ul>
              </div>
            </section>

            <section id="limitations" className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-yellow-600" />
                Limitaciones y Consideraciones
              </h2>
              
              <Card className="bg-yellow-50 border-yellow-200 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-yellow-800">Important Considerations</h3>
                  <p className="text-yellow-700">
                    While AI therapy is highly effective for many people, it's important to understand its limitations 
                    and when human professional help may be necessary.
                  </p>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">When Human Therapy May Be Better</h3>
              <ul className="space-y-3 mb-6">
                <li>• <strong>Severe mental health conditions:</strong> Bipolar disorder, schizophrenia, severe PTSD</li>
                <li>• <strong>Crisis situations:</strong> Suicidal thoughts, self-harm, immediate danger</li>
                <li>• <strong>Complex trauma:</strong> Deep-rooted trauma requiring specialized human expertise</li>
                <li>• <strong>Medication management:</strong> When psychiatric medication evaluation is needed</li>
                <li>• <strong>Legal/ethical issues:</strong> Situations requiring professional judgment and accountability</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4">Current AI Limitations</h3>
              <ul className="space-y-3">
                <li>• Cannot provide medical diagnoses or prescribe medication</li>
                <li>• May not fully understand complex cultural or personal contexts</li>
                <li>• Limited ability to handle crisis situations requiring immediate intervention</li>
                <li>• Still developing in terms of understanding subtle emotional nuances</li>
              </ul>
            </section>

            <section id="getting-started" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Comenzando con la Terapia IA</h2>
              
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">¿Listo para Probar la Terapia IA?</h3>
                  <p className="mb-6">
                    talkAI proporciona terapia IA empática basada en voz que está disponible 24/7. Comienza tu viaje de salud mental 
                    con una prueba gratuita y experimenta el futuro del apoyo de salud mental accesible.
                  </p>
                  <Link 
                    href="/auth" 
                    className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Iniciar Prueba Gratuita →
                  </Link>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-semibold mb-4">Steps to Begin</h3>
              <ol className="list-decimal list-inside space-y-3 mb-6">
                <li><strong>Assessment:</strong> Complete an initial mental health assessment to personalize your experience</li>
                <li><strong>Set Goals:</strong> Define what you want to achieve with AI therapy support</li>
                <li><strong>Start Conversations:</strong> Begin regular sessions at your own pace and schedule</li>
                <li><strong>Track Progress:</strong> Monitor your mental health journey with built-in analytics</li>
                <li><strong>Adjust as Needed:</strong> Modify your approach based on what works best for you</li>
              </ol>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Pro Tip</h3>
                  <p>
                    AI therapy works best when used consistently. Even 10-15 minutes of daily conversation can 
                    provide significant mental health benefits over time.
                  </p>
                </CardContent>
              </Card>
            </section>

          </div>

          {/* Related Articles */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Artículos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Comparison</Badge>
                  <CardTitle>
                    <Link href="/blog/ai-therapy-vs-human-therapy" className="hover:text-blue-600">
                      AI Therapy vs Human Therapy: Understanding the Differences
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">
                      Compare AI therapy with traditional human therapy to understand when each approach works best.
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Benefits</Badge>
                  <CardTitle>
                    <Link href="/blog/benefits-of-24-7-ai-therapy" className="hover:text-blue-600">
                      24/7 AI Therapy: Why Round-the-Clock Support Matters
                    </Link>
                  </CardTitle>
                  <CardContent className="px-0">
                    <p className="text-slate-600">
                      Discover how 24/7 accessibility is transforming mental health care and crisis support.
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          </section>

        </article>
      </div>
    </main>
  );
} 