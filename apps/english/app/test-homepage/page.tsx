import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import React from "react";
import AutoReload from "@/components/AutoReload";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import ConfettiHeart, { ConfettiStars } from "@/components/ConfettiHeart";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

const TrialChat = dynamic(() => import("@/components/TrialChat"), {
  ssr: false,
});

const LandingPage = dynamic(() => import("@/components/LandingPage"), {
  ssr: false,
});

// Client component for auth-aware buttons
const AuthAwareButtons = dynamic(() => import("@/components/AuthAwareButtons"), {
  ssr: false,
});

export default async function TestHomePage({
  searchParams,
}: {
  searchParams: { trial?: string };
}) {
  const isTrialMode = searchParams.trial === 'true';
  
  // Check authentication
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;
  
  // Fetch Hume access token only when it will be required
  let accessToken: string | null = null;
  if (isTrialMode || isAuthenticated) {
    try {
      accessToken = await getHumeAccessToken();
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  }

  // If trial mode, show trial chat with conditional header
  if (isTrialMode) {
    return (
      <>
        <AutoReload />
        <div className={"grow flex flex-col"}>
          <TrialChat accessToken={accessToken ?? ""} />
        </div>
      </>
    );
  }

  // If the user is not authenticated and not in trial mode, show custom landing hero
  if (!isAuthenticated) {
    return (
      <>
        <AutoReload />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-purple-400 dark:bg-black dark:bg-none">
          <div className="flex-grow flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
            <Badge className="group mb-6 px-5 py-2.5 text-lg font-semibold text-white hover:text-cyan-300 bg-white/5 border border-white/70 hover:border-cyan-400 rounded-full inline-flex items-center gap-2 transition-colors duration-200 shadow-[0_0_10px_0_rgba(255,255,255,0.25)]">
              <ConfettiStars className="focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded group" />
              The Heart of talkAI
              <ConfettiHeart className="ml-1" />
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-6xl mb-6">
              Empathetic AI Therapy
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-10">
              <ConfettiHeart className="inline-block align-middle mr-1" />ificial Intelligence that understands your emotions in real time. Experience personalized conversations designed to help you feel heard, supported, and empowered.
            </p>
            <AuthAwareButtons />

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-3 gap-6 text-left w-full">
              <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Emotion Detection</CardTitle>
                  <CardDescription className="text-white/80 text-center">
                    Real-time analysis of your emotional state through voice & conversation patterns.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Personalized Responses</CardTitle>
                  <CardDescription className="text-white/80 text-center">
                    AI adapts its approach based on your unique emotional needs.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Safe & Private</CardTitle>
                  <CardDescription className="text-white/80 text-center">
                    Conversations are secure & confidential, giving you a safe space to share.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Feature List */}
            <div className="mt-16 w-full max-w-2xl mx-auto">
              <ul className="space-y-6 text-white/90 text-lg">
                <li className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 mb-0">
                    <span className="text-2xl align-middle">📣</span>
                    <span className="font-semibold align-middle">Choose Your Therapeutic Guide:</span>
                  </div>
                  <span className="block text-white/70 text-base mt-2">Find the voice that helps you heal. Tailored tones for every journey*</span>
                </li>
                <li className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 mb-0">
                    <span className="text-2xl align-middle">🧬</span>
                    <span className="font-semibold align-middle">Real-time Emotion Analysis:</span>
                  </div>
                  <span className="block text-white/70 text-base mt-2">Advanced AI detects emotions in your voice as you speak</span>
                </li>
                <li className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 mb-0">
                    <span className="text-2xl align-middle">🧠</span>
                    <span className="font-semibold align-middle">Adaptive Responses:</span>
                  </div>
                  <span className="block text-white/70 text-base mt-2">Therapy sessions that adjust to your emotional state</span>
                </li>
                <li className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 mb-0">
                    <span className="text-2xl align-middle">🔒</span>
                    <span className="font-semibold align-middle">Complete Privacy:</span>
                  </div>
                  <span className="block text-white/70 text-base mt-2">Your conversations are encrypted and confidential</span>
                </li>
                <li className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 mb-0">
                    <span className="text-2xl align-middle">📊</span>
                    <span className="font-semibold align-middle">Emotional Insights:</span>
                  </div>
                  <span className="block text-white/70 text-base mt-2">Track your emotional patterns over time</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs text-white font-bold">*With paid subscriptions. Free plan includes Male and Female default voices</span>
            </div>

            {/* User Reviews */}
            <div className="mt-20 w-full text-left">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">What our users say:</h2>
              <div className="overflow-hidden w-full">
                <div className="flex gap-6 animate-marquee">
                  {[
                    { name: "Alex R.", review: "TalkAI helped me process my feelings in a safe space. The AI felt surprisingly empathetic!" },
                    { name: "Sam K.", review: "I love the emotion detection feature—seeing my mood reflected back to me was eye-opening." },
                    { name: "Jordan P.", review: "The personalized responses make every session feel tailored. Highly recommended." },
                    { name: "Taylor G.", review: "Safe, private, and available anytime. TalkAI has become part of my self-care routine." },
                  ].flatMap(r => [r, r]).map((r, idx) => (
                    <Card key={idx} className="min-w-[260px] flex-shrink-0 bg-white/10 backdrop-blur-sm text-white border-white/20 p-6 text-center transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
                          {r.name.split(' ')[0][0]}
                        </div>
                        <div className="font-medium">{r.name}</div>
                      </div>
                      <div className="flex items-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={18} className="text-yellow-400" fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">"{r.review}"</p>
                    </Card>
                  ))}
                </div>
              </div>
              <style>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                  animation: marquee 25s linear infinite;
                }
              `}</style>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Regular authenticated session
  return (
    <>
      <AutoReload />
      <div className={"grow flex flex-col"}>
        <Chat accessToken={accessToken ?? ""} />
      </div>
    </>
  );
} 