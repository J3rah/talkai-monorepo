import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star } from 'lucide-react';
import AutoReload from '@/components/AutoReload';
import ConfettiHeart, { ConfettiStars } from '@/components/ConfettiHeart';

const Chat = dynamic(() => import("@/components/Chat"));
const TrialChat = dynamic(() => import("@/components/TrialChat"));
const AuthAwareButtons = dynamic(() => import("@/components/AuthAwareButtons"));
const AuthenticatedLanding = dynamic(() => import("@/components/AuthenticatedLanding"));

export const metadata: Metadata = {
  title: 'TalkAI - Your AI Therapist | 24/7 Mental Health Support',
  description: 'Experience the future of mental health support with TalkAI. Our empathetic AI therapist provides 24/7 emotional support through voice conversations. Start your free trial and improve your wellbeing today.',
  keywords: [
    'AI therapist',
    'mental health support',
    'empathetic AI',
    'voice therapy',
    'emotional AI',
    'AI counseling',
    'mental wellness',
    'therapy chatbot',
    'stress relief',
    'anxiety support'
  ],
  openGraph: {
    title: 'TalkAI - Your AI Therapist | 24/7 Mental Health Support',
    description: 'Experience the future of mental health support with empathetic AI therapy. Available 24/7 for voice conversations and emotional support.',
    type: 'website',
    url: '/landing',
    images: [
      {
        url: '/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'TalkAI Homepage - AI Therapist for Mental Health Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalkAI - Your AI Therapist | 24/7 Mental Health Support',
    description: 'Experience the future of mental health support with empathetic AI therapy. Available 24/7 for voice conversations.',
    images: ['/twitter-homepage.png'],
  },
  alternates: {
    canonical: '/landing',
  },
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ trial?: string }>;
}) {
  const { trial } = await searchParams;
  const isTrialMode = trial === 'true';
  
  // If trial mode, show trial chat with conditional header
  if (isTrialMode) {
    return (
      <>
        <AutoReload />
        <div className={"flex flex-col"}>
          <TrialChat accessToken={""} />
        </div>
      </>
    );
  }

  // For regular landing page, show the AuthenticatedLanding component
  // which will handle both authenticated and unauthenticated states
  return (
    <>
      <AutoReload />
      <AuthenticatedLanding />
    </>
  );
}