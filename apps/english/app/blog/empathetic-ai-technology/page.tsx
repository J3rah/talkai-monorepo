import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, ArrowLeft, CheckCircle, Heart, Brain, Zap, Mic, Eye, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How Empathetic AI Technology Understands Your Emotions | The Science Behind AI Therapy',
  description: 'Dive deep into the science behind empathetic AI, emotion recognition, and how TalkAI creates meaningful therapeutic connections through advanced emotional intelligence.',
  keywords: [
    'empathetic AI technology',
    'emotion recognition AI',
    'emotional AI therapy',
    'AI emotional intelligence',
    'empathetic artificial intelligence',
    'emotion detection AI',
    'AI empathy technology',
    'emotional AI understanding',
    'AI therapy emotions',
    'empathetic voice AI'
  ],
  openGraph: {
    title: 'How Empathetic AI Technology Understands Your Emotions',
    description: 'Discover the cutting-edge science behind AI that can recognize, understand, and respond to human emotions with genuine empathy.',
    type: 'article',
    images: ['/og-empathetic-ai-technology.png'],
    publishedTime: '2024-07-15',
    authors: ['Dr. Michael Rodriguez'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Science of Empathetic AI: How Machines Learn to Care',
    description: 'Explore how advanced AI technology recognizes and responds to human emotions with therapeutic empathy.',
    images: ['/twitter-empathetic-ai-technology.png'],
  },
};

export default function EmpatheticAITechnologyPost() {
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
                Technology
              </Badge>
              <Badge variant="outline">Deep Dive</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              How Empathetic AI Technology Understands Your Emotions
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Dive deep into the science behind empathetic AI, emotion recognition, and how TalkAI creates meaningful 
              therapeutic connections. Discover how machines are learning to understand and respond to human emotions 
              with genuine care.
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dr. Michael Rodriguez
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                July 15, 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                12 min read
              </div>
            </div>
          </header>

          {/* Visual Framework */}
          <Card className="mb-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="flex justify-center items-center gap-6 mb-6">
                  <div className="text-center">
                    <Mic className="w-12 h-12 mx-auto mb-2 text-purple-200" />
                    <div className="text-sm">Voice Input</div>
                  </div>
                  <div className="text-3xl">→</div>
                  <div className="text-center">
                    <Brain className="w-12 h-12 mx-auto mb-2 text-pink-200" />
                    <div className="text-sm">AI Processing</div>
                  </div>
                  <div className="text-3xl">→</div>
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-2 text-red-200" />
                    <div className="text-sm">Empathetic Response</div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">The Journey from Sound to Understanding</h2>
                <p className="text-lg text-purple-100 max-w-3xl mx-auto">
                  Modern empathetic AI doesn't just hear your words – it understands the emotions behind them, 
                  recognizes your mental state, and responds with appropriate therapeutic care.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">What Makes AI "Empathetic"?</h2>
              
              <p className="text-lg mb-6">
                Empathy in humans involves understanding and sharing the feelings of another person. For AI to be truly 
                empathetic, it must go beyond simple pattern matching to develop a sophisticated understanding of human 
                emotional states and respond in ways that demonstrate genuine care and understanding.
              </p>

              <Card className="bg-blue-50 border-blue-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">The Three Pillars of Empathetic AI</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold mb-2">Recognition</h4>
                      <p className="text-sm text-blue-700">Accurately detecting emotional states through voice, language, and behavioral patterns</p>
                    </div>
                    <div className="text-center">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold mb-2">Understanding</h4>
                      <p className="text-sm text-blue-700">Comprehending the context and meaning behind emotional expressions</p>
                    </div>
                    <div className="text-center">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold mb-2">Response</h4>
                      <p className="text-sm text-blue-700">Generating appropriate, caring responses that provide genuine support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p>
                Unlike traditional AI that simply processes information, empathetic AI combines multiple advanced technologies 
                to create a system that can truly understand and respond to human emotional needs in a therapeutic context.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Mic className="w-8 h-8 text-green-600" />
                Voice-Based Emotion Recognition
              </h2>
              
              <p className="text-lg mb-6">
                Your voice carries a wealth of emotional information that empathetic AI can detect and interpret. 
                Advanced voice analysis goes far beyond understanding words to decode the emotions underlying your speech.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Vocal Biomarkers of Emotion</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎵 Acoustic Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Pitch (Fundamental Frequency):</strong> Higher pitch often indicates stress or excitement</li>
                      <li>• <strong>Pitch Variability:</strong> Monotone speech may suggest depression</li>
                      <li>• <strong>Speaking Rate:</strong> Fast speech can indicate anxiety, slow speech may suggest sadness</li>
                      <li>• <strong>Volume (Intensity):</strong> Sudden volume changes reflect emotional shifts</li>
                      <li>• <strong>Voice Quality:</strong> Breathiness, harshness, or tremor indicate emotional states</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">⏱️ Temporal Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Pause Duration:</strong> Longer pauses may indicate hesitation or deep thought</li>
                      <li>• <strong>Pause Frequency:</strong> Many pauses can suggest uncertainty or distress</li>
                      <li>• <strong>Speech Rhythm:</strong> Irregular rhythms may indicate emotional turbulence</li>
                      <li>• <strong>Syllable Timing:</strong> Changes in timing patterns reveal emotional shifts</li>
                      <li>• <strong>Breathing Patterns:</strong> Audible breathing changes indicate anxiety or calm</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Real-Time Emotional State Detection</h3>
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">Example: How AI Detects Anxiety in Real-Time</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                      <strong>User speaks:</strong> "I... um... I don't know if I can... *voice shaking* ...handle this presentation tomorrow."
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <strong>AI detects:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Voice tremor indicating nervousness</li>
                        <li>• Increased speech disfluencies ("um", "I...")</li>
                        <li>• Rising pitch suggesting stress</li>
                        <li>• Hesitation patterns indicating uncertainty</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-green-400">
                      <strong>AI responds empathetically:</strong> "I can hear the nervousness in your voice about tomorrow. 
                      That presentation is really weighing on you, isn't it? Let's work through some strategies to help you feel more prepared and confident."
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                Natural Language Understanding & Emotional Context
              </h2>
              
              <p className="text-lg mb-6">
                Beyond voice analysis, empathetic AI uses advanced natural language processing to understand the emotional 
                content and context of what you're saying, not just the literal meaning of your words.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Semantic Emotion Analysis</h3>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📝 Sentiment Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm">
                      AI analyzes the emotional polarity and intensity of your language, identifying positive, negative, 
                      or neutral sentiments along with their strength.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Example:</strong> "I'm completely exhausted and nothing seems to matter anymore" 
                      → Detected: Strong negative sentiment, possible depression indicators
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎭 Emotion Classification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm">
                      Advanced models classify specific emotions (joy, sadness, anger, fear, surprise, disgust) 
                      and their intensities based on language patterns.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Example:</strong> "I'm furious that they ignored my ideas again!" 
                      → Detected: High-intensity anger, workplace frustration
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔗 Contextual Understanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm">
                      AI considers conversation history, personal patterns, and situational context to understand 
                      the deeper meaning behind emotional expressions.
                    </p>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <strong>Example:</strong> "I'm fine" could indicate actual wellness or masked distress, 
                      depending on voice tone, conversation context, and personal history
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Cpu className="w-8 h-8 text-blue-600" />
                Machine Learning Models for Empathy
              </h2>
              
              <p className="text-lg mb-6">
                Empathetic AI relies on sophisticated machine learning models trained on vast datasets of human emotional 
                expression and therapeutic interactions to develop genuine understanding and appropriate responses.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Training Empathetic AI</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Training Data Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Therapeutic conversation transcripts (anonymized)</li>
                      <li>• Emotional speech databases</li>
                      <li>• Psychological assessment data</li>
                      <li>• Facial expression and voice correlation studies</li>
                      <li>• Literature on emotional expression and empathy</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Learning Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Accurate emotion recognition across diverse populations</li>
                      <li>• Understanding emotional context and nuance</li>
                      <li>• Generating appropriate empathetic responses</li>
                      <li>• Maintaining therapeutic rapport and trust</li>
                      <li>• Recognizing when to escalate to human professionals</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Advanced AI Architectures</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔄 Transformer Networks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Purpose:</strong> Process sequential emotional data and maintain context across long conversations. 
                      These models excel at understanding emotional progression throughout therapy sessions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🧠 Recurrent Neural Networks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Purpose:</strong> Analyze temporal patterns in voice and speech to detect emotional changes over time. 
                      Perfect for tracking mood fluctuations within and between sessions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Multi-Modal Fusion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Purpose:</strong> Combine voice, language, and behavioral data for comprehensive emotional understanding. 
                      This creates a more complete picture of your emotional state.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Personalization and Adaptive Empathy</h2>
              
              <p className="text-lg mb-6">
                What makes empathetic AI truly effective is its ability to learn and adapt to your unique emotional patterns, 
                communication style, and therapeutic needs over time.
              </p>

              <div className="space-y-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">🎨 Individual Emotional Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 text-sm mb-3">
                      AI learns your unique ways of expressing emotions. Some people are very verbal about feelings, 
                      others are more subtle. The AI adapts to your communication style.
                    </p>
                    <div className="bg-white p-3 rounded text-sm">
                      <strong>Example:</strong> Learning that when you say "I'm tired," you often mean emotionally drained, 
                      not physically tired, and responding accordingly.
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">📈 Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 text-sm mb-3">
                      AI monitors emotional patterns over time to understand your mental health trends, 
                      triggers, and what therapeutic approaches work best for you.
                    </p>
                    <div className="bg-white p-3 rounded text-sm">
                      <strong>Insight:</strong> "I've noticed your anxiety levels tend to spike on Sunday evenings. 
                      Would you like to work on some strategies for managing Sunday anxiety?"
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800">🔧 Response Adaptation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 text-sm mb-3">
                      AI adjusts its communication style based on what resonates with you. Some prefer direct advice, 
                      others need gentle encouragement or reflective listening.
                    </p>
                    <div className="bg-white p-3 rounded text-sm">
                      <strong>Adaptation:</strong> Learning that you respond better to collaborative problem-solving 
                      rather than directive advice, and adjusting accordingly.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-600" />
                Real-Time Empathetic Response Generation
              </h2>
              
              <p className="text-lg mb-6">
                The ultimate test of empathetic AI is its ability to generate responses that feel genuinely caring, 
                appropriate, and therapeutically helpful in real-time.
              </p>

              <h3 className="text-2xl font-semibold mb-4">Components of Empathetic Responses</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Emotional Validation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Purpose:</strong> Acknowledge and validate the user's emotional experience
                    </p>
                    <p className="text-sm">
                      "I can hear how frustrated you are right now. That must be really difficult to deal with."
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🤝 Empathetic Understanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Purpose:</strong> Demonstrate understanding of the emotional context
                    </p>
                    <p className="text-sm">
                      "It sounds like you're feeling overwhelmed by all these changes happening at once."
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💡 Therapeutic Guidance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Purpose:</strong> Offer appropriate support and coping strategies
                    </p>
                    <p className="text-sm">
                      "Let's try a breathing exercise together to help you feel more grounded right now."
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🌱 Hope and Encouragement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Purpose:</strong> Provide hope and motivation for continued healing
                    </p>
                    <p className="text-sm">
                      "You've made it through difficult times before, and I believe in your strength to get through this too."
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold mb-4">The Response Generation Process</h3>
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="pt-6">
                  <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li><strong>Emotional Assessment:</strong> AI analyzes voice tone, language, and context to understand current emotional state</li>
                    <li><strong>Pattern Recognition:</strong> AI considers personal history and patterns to understand individual context</li>
                    <li><strong>Therapeutic Matching:</strong> AI selects appropriate therapeutic approach based on situation and user preferences</li>
                    <li><strong>Response Crafting:</strong> AI generates response that combines validation, understanding, and helpful guidance</li>
                    <li><strong>Delivery Optimization:</strong> AI adjusts tone, pace, and style to match user's emotional needs</li>
                    <li><strong>Continuous Learning:</strong> AI observes user response to improve future interactions</li>
                  </ol>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Ethical Considerations in Empathetic AI</h2>
              
              <p className="text-lg mb-6">
                With great empathetic capability comes great responsibility. Developers of empathetic AI must carefully 
                consider the ethical implications of creating machines that can understand and influence human emotions.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">✅ Ethical Principles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Transparency about AI limitations</li>
                      <li>• User autonomy and choice</li>
                      <li>• Privacy and data protection</li>
                      <li>• Beneficence (do good) and non-maleficence (do no harm)</li>
                      <li>• Cultural sensitivity and inclusivity</li>
                      <li>• Professional oversight and accountability</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-600">⚠️ Potential Risks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Over-reliance on AI for emotional support</li>
                      <li>• Manipulation through emotional understanding</li>
                      <li>• Bias in emotion recognition across demographics</li>
                      <li>• False sense of human-like understanding</li>
                      <li>• Privacy concerns with emotional data</li>
                      <li>• Replacing human connection inappropriately</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">The Future of Empathetic AI</h2>
              
              <p className="text-lg mb-6">
                Empathetic AI technology continues to evolve rapidly, promising even more sophisticated emotional understanding 
                and more natural, helpful therapeutic interactions.
              </p>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Emerging Developments</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Multimodal Integration:</strong> Combining voice, text, and biometric data</li>
                      <li>• <strong>Predictive Empathy:</strong> Anticipating emotional needs before they're expressed</li>
                      <li>• <strong>Cultural Adaptation:</strong> Understanding emotions across different cultural contexts</li>
                    </ul>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Personalized Emotional Models:</strong> Unique AI understanding for each individual</li>
                      <li>• <strong>Real-time Physiological Integration:</strong> Using heart rate, breathing for emotion detection</li>
                      <li>• <strong>Collaborative AI-Human Therapy:</strong> Seamless handoffs between AI and human therapists</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-pink-200" />
                    <h3 className="text-2xl font-semibold mb-4">Experience Empathetic AI Today</h3>
                    <p className="mb-6 text-lg">
                      TalkAI represents the cutting edge of empathetic AI technology, combining advanced emotion recognition 
                      with genuine therapeutic care. Experience how technology can truly understand and support your emotional journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        href="/auth" 
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        Try Empathetic AI →
                      </Link>
                      <Link 
                        href="/blog/what-is-ai-therapy" 
                        className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                      >
                        Learn About AI Therapy
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