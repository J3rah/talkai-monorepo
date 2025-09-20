import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Therapy Blog - Mental Health Insights & AI Technology | TalkAI',
  description: 'Explore the latest insights on AI therapy, mental health support, and empathetic voice technology. Expert articles on AI counseling, emotional wellness, and the future of mental healthcare.',
  keywords: [
    'AI therapy blog',
    'mental health AI articles',
    'AI counseling insights',
    'empathetic AI technology',
    'AI therapy research',
    'mental health technology',
    'AI therapist articles',
    'emotional AI blog',
    'AI mental health support',
    'therapeutic AI insights'
  ],
  openGraph: {
    title: 'AI Therapy Blog - Mental Health Insights & Technology',
    description: 'Expert insights on AI therapy, mental health support, and the future of empathetic AI technology.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Therapy Blog - Mental Health Insights',
    description: 'Expert insights on AI therapy and mental health technology.',
    images: ['/twitter-image.png'],
  },
};

const blogPosts = [
  {
    slug: 'what-is-ai-therapy',
    title: 'What is AI Therapy? A Complete Guide to Artificial Intelligence in Mental Health',
    description: 'Discover how AI therapy works, its benefits, limitations, and why it\'s revolutionizing mental health support. Learn if AI therapy is right for you.',
    category: 'AI Therapy Basics',
    readTime: '8 min read',
    publishDate: '2024-07-18',
    author: 'TalkAI Research Team',
    featured: true,
    tags: ['AI Therapy', 'Mental Health', 'Technology', 'Beginner Guide']
  },
  {
    slug: 'ai-therapy-vs-human-therapy',
    title: 'AI Therapy vs Human Therapy: Understanding the Differences and Benefits',
    description: 'Compare AI therapy with traditional human therapy. Explore the advantages, limitations, and when to choose each approach for optimal mental health support.',
    category: 'Comparison',
    readTime: '10 min read',
    publishDate: '2024-07-17',
    author: 'Dr. Sarah Chen',
    featured: true,
    tags: ['AI vs Human', 'Therapy Comparison', 'Mental Health', 'Decision Guide']
  },
  {
    slug: 'how-to-manage-stress-with-ai',
    title: 'How to Manage Stress with AI Therapy: Complete Guide for 2024',
    description: 'Learn effective stress management techniques using AI therapy. Discover how TalkAI can help you reduce stress, anxiety, and improve your mental well-being.',
    category: 'Stress Management',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Stress Management', 'AI Therapy', 'Mental Health', 'Wellness']
  },
  {
    slug: 'improving-sleep-with-ai-therapy',
    title: 'Improving Sleep with AI Therapy: Complete Guide to Better Rest',
    description: 'Learn how AI therapy can help you improve sleep quality, overcome insomnia, and develop healthy sleep habits with TalkAI\'s sleep-focused therapy.',
    category: 'Sleep Health',
    readTime: '12 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Sleep Improvement', 'Insomnia', 'Sleep Hygiene', 'Mental Health']
  },
  {
    slug: 'ai-therapy-for-relationships',
    title: 'AI Therapy for Relationships: Improving Communication and Connection',
    description: 'Discover how AI therapy can help improve relationships, enhance communication skills, and build stronger connections with others.',
    category: 'Relationships',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Relationships', 'Communication', 'Family Therapy', 'Social Skills']
  },
  {
    slug: 'ai-therapy-for-workplace-stress',
    title: 'AI Therapy for Workplace Stress: Managing Work-Related Mental Health',
    description: 'Learn how AI therapy can help manage workplace stress, burnout, and work-related mental health challenges.',
    category: 'Workplace Wellness',
    readTime: '12 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Workplace Stress', 'Burnout', 'Work-Life Balance', 'Professional Health']
  },
  {
    slug: 'ai-therapy-for-self-improvement',
    title: 'AI Therapy for Self-Improvement: Personal Growth and Development',
    description: 'Discover how AI therapy can support your personal growth journey, build confidence, and achieve your self-improvement goals.',
    category: 'Personal Growth',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Self-Improvement', 'Personal Growth', 'Confidence Building', 'Goal Achievement']
  },
  {
    slug: 'ai-therapy-for-students',
    title: 'AI Therapy for Students: Managing Academic Stress and Mental Health',
    description: 'Learn how AI therapy can help students manage academic stress, improve mental health, and achieve academic success.',
    category: 'Student Wellness',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Student Mental Health', 'Academic Stress', 'College Wellness', 'Study Skills']
  },
  {
    slug: 'ai-therapy-for-parents',
    title: 'AI Therapy for Parents: Managing Parenting Stress and Mental Health',
    description: 'Learn how AI therapy can help parents manage stress, improve mental health, and build stronger family relationships.',
    category: 'Parenting Support',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Parenting Stress', 'Family Therapy', 'Parent Mental Health', 'Family Wellness']
  },
  {
    slug: 'ai-therapy-for-grief',
    title: 'AI Therapy for Grief: Coping with Loss and Finding Healing',
    description: 'Learn how AI therapy can help you navigate grief, process loss, and find healing during difficult times.',
    category: 'Grief Support',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Grief Therapy', 'Loss Processing', 'Bereavement Support', 'Healing']
  },
  {
    slug: 'ai-therapy-for-addiction-recovery',
    title: 'AI Therapy for Addiction Recovery: Supporting Recovery and Wellness',
    description: 'Learn how AI therapy can support addiction recovery, provide relapse prevention strategies, and promote long-term wellness.',
    category: 'Recovery Support',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Addiction Recovery', 'Relapse Prevention', 'Recovery Support', 'Wellness']
  },
  {
    slug: 'ai-therapy-for-trauma',
    title: 'AI Therapy for Trauma: Healing from PTSD and Emotional Wounds',
    description: 'Learn how AI therapy can help you heal from trauma, manage PTSD symptoms, and process emotional wounds in a safe, supportive environment.',
    category: 'Trauma Healing',
    readTime: '12 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Trauma Therapy', 'PTSD Treatment', 'Trauma Healing', 'Emotional Recovery']
  },
  {
    slug: 'ai-therapy-for-mindfulness',
    title: 'AI Therapy for Mindfulness: Enhancing Meditation and Present-Moment Awareness',
    description: 'Discover how AI therapy can enhance your mindfulness practice, improve meditation techniques, and help you develop present-moment awareness.',
    category: 'Mindfulness',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Mindfulness', 'Meditation', 'Present Awareness', 'Mental Clarity']
  },
  {
    slug: 'ai-therapy-for-confidence',
    title: 'AI Therapy for Confidence: Building Self-Esteem and Personal Power',
    description: 'Learn how AI therapy can help you build confidence, improve self-esteem, and develop the personal power to achieve your goals.',
    category: 'Confidence Building',
    readTime: '10 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Confidence Building', 'Self-Esteem', 'Personal Power', 'Self-Worth']
  },
  {
    slug: 'ai-therapy-for-life-transitions',
    title: 'AI Therapy for Life Transitions: Navigating Change and New Beginnings',
    description: 'Learn how AI therapy can help you navigate life transitions, manage change, and embrace new beginnings with confidence and resilience.',
    category: 'Life Transitions',
    readTime: '11 min read',
    publishDate: '2024-12-19',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Life Transitions', 'Change Management', 'New Beginnings', 'Resilience']
  },
  {
    slug: 'benefits-of-24-7-ai-therapy',
    title: '24/7 AI Therapy: Why Round-the-Clock Mental Health Support Matters',
    description: 'Explore how 24/7 AI therapy accessibility is transforming mental health care, providing immediate support when you need it most.',
    category: 'Benefits',
    readTime: '6 min read',
    publishDate: '2024-07-16',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['24/7 Support', 'Accessibility', 'Crisis Support', 'Mental Health']
  },
  {
    slug: 'empathetic-ai-technology',
    title: 'How Empathetic AI Technology Understands Your Emotions',
    description: 'Dive deep into the science behind empathetic AI, emotion recognition, and how TalkAI creates meaningful therapeutic connections.',
    category: 'Technology',
    readTime: '12 min read',
    publishDate: '2024-07-15',
    author: 'Dr. Michael Rodriguez',
    featured: false,
    tags: ['Empathetic AI', 'Emotion Recognition', 'Technology', 'Research']
  },
  {
    slug: 'ai-therapy-for-anxiety',
    title: 'AI Therapy for Anxiety: Evidence-Based Techniques and Success Stories',
    description: 'Learn how AI therapy specifically helps with anxiety disorders, featuring evidence-based techniques and real user success stories.',
    category: 'Conditions',
    readTime: '9 min read',
    publishDate: '2024-07-14',
    author: 'Dr. Lisa Thompson',
    featured: false,
    tags: ['Anxiety', 'Treatment', 'Success Stories', 'Evidence-Based']
  },
  {
    slug: 'ai-therapy-for-depression',
    title: 'AI Therapy for Depression: Comprehensive Support When You Need It Most',
    description: 'Discover how AI therapy provides continuous support for depression, offering coping strategies and emotional guidance available 24/7.',
    category: 'Conditions',
    readTime: '11 min read',
    publishDate: '2024-07-13',
    author: 'Dr. James Wilson',
    featured: false,
    tags: ['Depression', 'Support', 'Coping Strategies', 'Mental Health']
  },
  {
    slug: 'voice-ai-therapy-benefits',
    title: 'Voice AI Therapy: Why Speaking Out Loud Enhances Mental Health Treatment',
    description: 'Explore the unique benefits of voice-based AI therapy and how speaking aloud can improve therapeutic outcomes and emotional processing.',
    category: 'Technology',
    readTime: '7 min read',
    publishDate: '2024-07-12',
    author: 'Dr. Emily Foster',
    featured: false,
    tags: ['Voice Therapy', 'Speaking Benefits', 'Audio Therapy', 'Communication']
  },
  {
    slug: 'ai-therapy-privacy-security',
    title: 'AI Therapy Privacy & Security: How Your Mental Health Data Stays Protected',
    description: 'Learn about the robust privacy and security measures protecting your mental health conversations with AI therapy platforms.',
    category: 'Privacy',
    readTime: '8 min read',
    publishDate: '2024-07-11',
    author: 'TalkAI Security Team',
    featured: false,
    tags: ['Privacy', 'Security', 'Data Protection', 'Confidentiality']
  },
  {
    slug: 'talkai-journaling-daily-mood-tracker',
    title: 'TalkAI Journaling: A Daily Mood Tracker That Actually Sticks',
    description: "Build a sustainable journaling habit with TalkAI. Track mood, triggers, coping skills, and wins in minutes a day—no perfection required.",
    category: 'Habits & Tracking',
    readTime: '7 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Journaling', 'Mood Tracking', 'Habits', 'TalkAI']
  },
  {
    slug: 'panic-attack-grounding-scripts-talkai',
    title: 'Panic Rescue: Grounding Scripts You Can Speak with TalkAI',
    description: 'Use TalkAI grounding scripts to ride out panic: orient, breathe, name, and re-engage—practical steps you can voice on the spot.',
    category: 'Anxiety & Panic',
    readTime: '6 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Panic', 'Grounding', 'Breathing', 'Anxiety']
  },
  {
    slug: 'burnout-recovery-micro-coaching-talkai',
    title: 'From Burnout to Baseline: Micro‑Coaching with TalkAI',
    description: 'Recover from burnout with TalkAI micro‑coaching: capacity-based planning, energy pacing, and compassionate accountability.',
    category: 'Burnout Recovery',
    readTime: '7 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Burnout', 'Energy Pacing', 'Capacity Planning', 'Recovery']
  },
  {
    slug: 'social-anxiety-exposure-plans-talkai',
    title: 'Social Anxiety Steps: TalkAI Exposure Plans That Feel Safe',
    description: 'Gradual exposure with TalkAI: small challenges, safety scripts, and celebration rituals that build real-world confidence.',
    category: 'Social Anxiety',
    readTime: '7 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Social Anxiety', 'Exposure', 'Confidence', 'CBT']
  },
  {
    slug: 'financial-stress-coping-talkai',
    title: 'Financial Stress Coping: TalkAI Strategies for Money Anxiety',
    description: 'Learn practical TalkAI strategies to manage financial stress, reduce money anxiety, and build financial confidence.',
    category: 'Financial Wellness',
    readTime: '8 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Financial Stress', 'Money Anxiety', 'Financial Wellness', 'Stress Management']
  },
  {
    slug: 'caregiver-burnout-talkai',
    title: 'Caregiver Burnout Recovery: TalkAI Support for Exhausted Caregivers',
    description: 'Find TalkAI support for caregiver burnout recovery with practical strategies for self-care and boundary setting.',
    category: 'Caregiver Support',
    readTime: '9 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Caregiver Burnout', 'Self-Care', 'Boundaries', 'Recovery']
  },
  {
    slug: 'mens-mental-health-talkai',
    title: 'Men\'s Mental Health: TalkAI Support for Breaking the Silence',
    description: 'Discover TalkAI support for men\'s mental health challenges, breaking stigma and building emotional resilience.',
    category: 'Men\'s Health',
    readTime: '8 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Men\'s Mental Health', 'Stigma Breaking', 'Emotional Resilience', 'Support']
  },
  {
    slug: 'trauma-informed-grounding-talkai',
    title: 'Trauma-Informed Grounding: TalkAI Techniques for Safety',
    description: 'Learn trauma-informed grounding techniques with TalkAI for creating safety and managing trauma responses.',
    category: 'Trauma Healing',
    readTime: '10 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Trauma-Informed', 'Grounding', 'Safety', 'Trauma Recovery']
  },
  {
    slug: 'loneliness-connection-prompts-talkai',
    title: 'Loneliness to Connection: TalkAI Prompts for Building Relationships',
    description: 'Transform loneliness into connection with TalkAI prompts and strategies for building meaningful relationships.',
    category: 'Social Connection',
    readTime: '7 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Loneliness', 'Connection', 'Relationships', 'Social Skills']
  },
  {
    slug: 'sleep-anxiety-rumination-talkai',
    title: 'Sleep Anxiety & Rumination: TalkAI Solutions for Restful Nights',
    description: 'Break the cycle of sleep anxiety and rumination with TalkAI techniques for peaceful, restful sleep.',
    category: 'Sleep Health',
    readTime: '8 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Sleep Anxiety', 'Rumination', 'Sleep Quality', 'Mental Health']
  },
  {
    slug: 'adhd-focus-routines-talkai',
    title: 'ADHD Focus Routines: TalkAI Strategies for Better Concentration',
    description: 'Build effective focus routines for ADHD with TalkAI support, improving concentration and productivity.',
    category: 'ADHD Support',
    readTime: '9 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['ADHD', 'Focus', 'Routines', 'Productivity']
  },
  {
    slug: 'postpartum-mental-health-talkai',
    title: 'Postpartum Mental Health: TalkAI Support for New Parents',
    description: 'Find TalkAI support for postpartum mental health challenges, from baby blues to postpartum depression.',
    category: 'Postpartum Support',
    readTime: '10 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Postpartum', 'Mental Health', 'New Parents', 'Recovery']
  },
  {
    slug: 'teen-mental-health-talkai-safety',
    title: 'Teen Mental Health Safety: TalkAI Support for Adolescents',
    description: 'Safe TalkAI support for teen mental health challenges, promoting emotional wellness and resilience.',
    category: 'Teen Support',
    readTime: '8 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Teen Mental Health', 'Adolescent Support', 'Safety', 'Wellness']
  },
  {
    slug: 'couples-check-ins-talkai',
    title: 'Couples Check-Ins: TalkAI Tools for Relationship Health',
    description: 'Strengthen your relationship with TalkAI couples check-ins, improving communication and connection.',
    category: 'Relationships',
    readTime: '7 min read',
    publishDate: '2025-07-27',
    author: 'TalkAI Research Team',
    featured: false,
    tags: ['Couples', 'Check-Ins', 'Communication', 'Relationship Health']
  }
];

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category;
  const featuredPosts = blogPosts.filter(post => post.featured);
  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts.filter(post => !post.featured);
  const regularPosts = selectedCategory ? filteredPosts : blogPosts.filter(post => !post.featured);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            AI Therapy Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Expert insights on AI therapy, mental health support, and the future of empathetic technology. 
            Stay informed with the latest research and developments in AI-powered mental healthcare.
          </p>
        </div>

        {/* Featured Posts */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {post.category}
                    </Badge>
                    <Badge variant="outline">Featured</Badge>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {selectedCategory ? `${selectedCategory} Articles` : 'Browse by Category'}
            </h2>
            {selectedCategory && (
              <Link 
                href="/blog" 
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                ← Back to All Categories
              </Link>
            )}
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {Array.from(new Set(blogPosts.map(post => post.category))).map((category) => {
              const categoryPosts = blogPosts.filter(post => post.category === category);
              const getCategoryColor = (cat: string) => {
                switch(cat) {
                  case 'AI Therapy Basics': return 'bg-blue-100 text-blue-800';
                  case 'Comparison': return 'bg-purple-100 text-purple-800';
                  case 'Benefits': return 'bg-green-100 text-green-800';
                  case 'Technology': return 'bg-orange-100 text-orange-800';
                  case 'Conditions': return 'bg-red-100 text-red-800';
                  case 'Privacy': return 'bg-gray-100 text-gray-800';
                  case 'Stress Management': return 'bg-amber-100 text-amber-800';
                  case 'Sleep Health': return 'bg-indigo-100 text-indigo-800';
                  case 'Relationships': return 'bg-pink-100 text-pink-800';
                  case 'Workplace Wellness': return 'bg-teal-100 text-teal-800';
                  case 'Personal Growth': return 'bg-emerald-100 text-emerald-800';
                  case 'Student Wellness': return 'bg-cyan-100 text-cyan-800';
                  case 'Parenting Support': return 'bg-rose-100 text-rose-800';
                  case 'Grief Support': return 'bg-violet-100 text-violet-800';
                  case 'Recovery Support': return 'bg-lime-100 text-lime-800';
                  case 'Trauma Healing': return 'bg-red-100 text-red-800';
                  case 'Mindfulness': return 'bg-sky-100 text-sky-800';
                  case 'Confidence Building': return 'bg-yellow-100 text-yellow-800';
                  case 'Life Transitions': return 'bg-fuchsia-100 text-fuchsia-800';
                  case 'Habits & Tracking': return 'bg-stone-100 text-stone-800';
                  case 'Anxiety & Panic': return 'bg-orange-100 text-orange-800';
                  case 'Burnout Recovery': return 'bg-red-100 text-red-800';
                  case 'Social Anxiety': return 'bg-purple-100 text-purple-800';
                  case 'Financial Wellness': return 'bg-green-100 text-green-800';
                  case 'Caregiver Support': return 'bg-blue-100 text-blue-800';
                  case 'Men\'s Health': return 'bg-slate-100 text-slate-800';
                  case 'Social Connection': return 'bg-pink-100 text-pink-800';
                  case 'ADHD Support': return 'bg-indigo-100 text-indigo-800';
                  case 'Postpartum Support': return 'bg-rose-100 text-rose-800';
                  case 'Teen Support': return 'bg-cyan-100 text-cyan-800';
                  default: return 'bg-slate-100 text-slate-800';
                }
              };
              
              return (
                <Link key={category} href={`/blog?category=${encodeURIComponent(category)}`}>
                  <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group hover:scale-105">
                    <CardHeader className="text-center">
                      <Badge variant="secondary" className={`mx-auto mb-2 ${getCategoryColor(category)}`}>
                        {category}
                      </Badge>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{categoryPosts.length} Article{categoryPosts.length !== 1 ? 's' : ''}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
          </h2>
          <div className="grid gap-6">
            {regularPosts.map((post) => (
              <Card key={post.slug} className="group hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                        {post.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(post.publishDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {post.description}
                  </CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-4">
                Stay Updated on AI Therapy Insights
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mb-6">
                Get the latest articles on AI therapy, mental health technology, and empathetic AI delivered to your inbox.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-slate-900"
                />
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-blue-200 text-sm mt-4">
                Join 10,000+ readers who trust our insights. Unsubscribe anytime.
              </p>
            </CardHeader>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl mb-4">
                Ready to Experience AI Therapy?
              </CardTitle>
              <CardDescription className="text-green-100 text-lg mb-6">
                Start your journey with TalkAI today and discover the future of mental health support.
              </CardDescription>
              <Link 
                href="/auth" 
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Free Trial
              </Link>
            </CardHeader>
          </Card>
        </section>
      </div>
    </main>
  );
} 