'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video, Mic, Brain, Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleStartSession = () => {
    router.push('/session');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white">
              TalkAI <span className="text-blue-400">Avatar</span>
            </h1>
            <p className="text-2xl text-white/90">
              Real-time AI Therapy with a Human Touch
            </p>
          </div>

          {/* Description */}
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience emotionally intelligent therapy with a lifelike avatar that sees,
            hears, and responds to your emotions in real-time.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              size="lg"
              onClick={handleStartSession}
              className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Start Avatar Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <FeatureCard
              icon={<Video className="h-8 w-8 text-blue-400" />}
              title="Lifelike Avatar"
              description="Powered by HeyGen's streaming technology for human-like video interactions"
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-purple-400" />}
              title="Emotional AI"
              description="Hume EVI analyzes your voice tone and emotions for empathetic responses"
            />
            <FeatureCard
              icon={<Mic className="h-8 w-8 text-indigo-400" />}
              title="Real-time Voice"
              description="Sub-second latency for natural, flowing conversations"
            />
          </div>

          {/* Trust Indicators */}
          <div className="pt-16 border-t border-white/20">
            <div className="flex items-center justify-center gap-4 text-white/60">
              <Shield className="h-5 w-5" />
              <p className="text-sm">
                Secure, private, and HIPAA-compliant therapy sessions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          <p>© 2024 TalkAI. All rights reserved.</p>
          <p className="mt-2">
            Powered by Hume AI, HeyGen, and ElevenLabs
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
}

