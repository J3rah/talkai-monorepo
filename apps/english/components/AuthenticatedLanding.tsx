"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AutoReload from "@/components/AutoReload";
import ConfettiHeart, { ConfettiStars } from "@/components/ConfettiHeart";
import { expressionLabels } from "@/utils/expressionLabels";
import supabase from "@/supabaseClient";
import Link from "next/link";
import AuthAwareButtons from "@/components/AuthAwareButtons";

interface UserData {
  fullName: string;
  totalSessions: number;
  lastSessionDate: string | null;
  lastSessionTitle: string | null;
  sessionsThisMonth: number;
  durationThisMonthSeconds: number;
  topEmotion: string | null;
  avgEmotionIntensity: number;
}

export default function AuthenticatedLanding() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper formatters
  const formatDuration = (seconds: number) => {
    const hours = Math.floor((seconds || 0) / 3600);
    const minutes = Math.floor(((seconds || 0) % 3600) / 60);
    if (hours <= 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    let isMounted = true;
    let overallTimeoutId: NodeJS.Timeout;

    // Failsafe: stop showing spinner if auth check stalls > 10s
    overallTimeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('AuthenticatedLanding: Overall timeout reached, stopping loading state');
        setLoading(false);
      }
    }, 10000); // 10 second maximum timeout

    const checkAuthAndFetchData = async () => {
      try {
        console.log('🔍 AuthenticatedLanding: Starting auth check...');
        
        // Simple, direct auth check - let Supabase handle session restoration
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (sessionError) {
          console.error('❌ AuthenticatedLanding: Session error:', sessionError);
          setLoading(false);
          return;
        }
        
        let currentUser = session?.user || null;
        
        // If no session, try getUser() as fallback for OAuth redirects
        if (!currentUser) {
          console.log('🔍 AuthenticatedLanding: No session user, trying getUser()...');
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (!userError && user) {
            console.log('✅ AuthenticatedLanding: Found user via getUser():', user.id);
            currentUser = user;
          } else {
            console.log('ℹ️ AuthenticatedLanding: No authenticated user found, showing public view');
            setLoading(false);
            return;
          }
        } else {
          console.log('✅ AuthenticatedLanding: User authenticated:', currentUser.id);
        }
        
        if (!isMounted) return;
        setUser(currentUser);

        // Fetch user data
        const userId = currentUser.id;
        let fullName = currentUser.email?.split('@')[0] || 'there';
        let totalSessions = 0;
        let lastSessionDate: string | null = null;
        let lastSessionTitle: string | null = null;
        let sessionsThisMonth = 0;
        let durationThisMonthSeconds = 0;
        let topEmotion: string | null = null;
        let avgEmotionIntensity = 0;

        try {
          const monthStartIso = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
          const [profileResult, sessionsCountResult, lastSessionResult, monthlyTherapyResult, emotionsResult] = await Promise.all([
            supabase.from('profiles').select('full_name').eq('id', userId).single(),
            supabase.from('chat_sessions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
            supabase.from('chat_sessions').select('id, title, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(1),
            supabase.from('therapy_sessions').select('duration, created_at').eq('user_id', userId).gte('created_at', monthStartIso),
            supabase
              .from('emotion_metrics')
              .select(`emotion_type, intensity, created_at, chat_sessions!inner ( user_id )`)
              .eq('chat_sessions.user_id', userId)
              .order('created_at', { ascending: false })
              .limit(100)
          ]);

          if (!profileResult.error && profileResult.data?.full_name) {
            fullName = profileResult.data.full_name;
          }
          if (!sessionsCountResult.error && typeof sessionsCountResult.count === 'number') {
            totalSessions = sessionsCountResult.count;
          }
          if (!lastSessionResult.error && Array.isArray(lastSessionResult.data) && lastSessionResult.data.length > 0) {
            lastSessionDate = lastSessionResult.data[0].created_at;
            lastSessionTitle = lastSessionResult.data[0].title || null;
          }
          if (!monthlyTherapyResult.error && Array.isArray(monthlyTherapyResult.data)) {
            sessionsThisMonth = monthlyTherapyResult.data.length;
            durationThisMonthSeconds = monthlyTherapyResult.data.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);
          }
          if (!emotionsResult.error && Array.isArray(emotionsResult.data)) {
            const emotions = emotionsResult.data as Array<{ emotion_type: string; intensity: number; }>; 
            if (emotions.length > 0) {
              const counts: Record<string, { total: number; count: number }> = {};
              emotions.forEach(e => {
                if (!counts[e.emotion_type]) counts[e.emotion_type] = { total: 0, count: 0 };
                counts[e.emotion_type].total += e.intensity || 0;
                counts[e.emotion_type].count += 1;
              });
              const aggregated = Object.entries(counts).map(([key, val]) => ({
                emotion: key,
                avg: val.total / Math.max(val.count, 1)
              })).sort((a, b) => b.avg - a.avg);
              if (aggregated.length > 0) {
                topEmotion = expressionLabels[aggregated[0].emotion] || aggregated[0].emotion;
                avgEmotionIntensity = Math.round(aggregated[0].avg * 100) / 100;
              }
            }
          }

          if (isMounted) {
            setUserData({
              fullName,
              totalSessions,
              lastSessionDate,
              lastSessionTitle,
              sessionsThisMonth,
              durationThisMonthSeconds,
              topEmotion,
              avgEmotionIntensity
            });
          }
        } catch (e) {
          console.warn('Error fetching user data, using defaults:', e);
          // Set default user data if fetch fails
          if (isMounted) {
            setUserData({
              fullName: currentUser.email?.split('@')[0] || 'there',
              totalSessions: 0,
              lastSessionDate: null,
              lastSessionTitle: null,
              sessionsThisMonth: 0,
              durationThisMonthSeconds: 0,
              topEmotion: null,
              avgEmotionIntensity: 0
            });
          }
        }

        if (isMounted) {
          clearTimeout(overallTimeoutId);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ AuthenticatedLanding: Error in checkAuthAndFetchData:', error);
        if (isMounted) {
          clearTimeout(overallTimeoutId);
          // If auth check failed, show unauthenticated state
          setUser(null);
          setUserData(null);
          setLoading(false);
        }
      }
    };

    checkAuthAndFetchData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setUserData(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' && session) {
        checkAuthAndFetchData();
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(overallTimeoutId);
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col bg-gradient-to-br from-blue-400 to-purple-400 dark:bg-black dark:bg-none">
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show unauthenticated landing
  if (!user || !userData) {
    return (
      <div className="flex flex-col bg-gradient-to-br from-blue-400 to-purple-400 dark:bg-black dark:bg-none">
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-6xl mb-8">
            Empathetic AI Therapy
          </h1>
          <Badge className="mb-6 px-5 py-2.5 text-lg font-semibold text-white bg-white/5 border border-white/70 rounded-full inline-flex items-center gap-2 shadow-[0_0_10px_0_rgba(255,255,255,0.25)]">
            <ConfettiStars className="focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded" />
            YOU are The heart of talkAI
            <ConfettiHeart className="ml-1" />
          </Badge>
          <div className="text-lg sm:text-xl text-white/90 mb-10 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🧠</span>
              <span>Understands your emotions in real time</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💝</span>
              <span>Helps you feel heard, supported, and empowered</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💬</span>
              <span>Talk or type—get support in real time</span>
            </div>
          </div>
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
        </div>
      </div>
    );
  }

  // Authenticated personalized view
  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-400 to-purple-400 dark:bg-black dark:bg-none">
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-6xl mb-8">
          {`Welcome back ${userData.fullName}`}
        </h1>
        <Badge className="mb-6 px-5 py-2.5 text-lg font-semibold text-white bg-white/5 border border-white/70 rounded-full inline-flex items-center gap-2 shadow-[0_0_10px_0_rgba(255,255,255,0.25)]">
          <ConfettiStars className="focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded" />
          Great to see you again
          <ConfettiHeart className="ml-1" />
        </Badge>

        {/* Go to Sessions Button */}
        <div className="mb-10">
          <Link href="/sessions">
            <Button className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
              🚀 Start Session
            </Button>
          </Link>
        </div>

        {/* Personalized Tiles */}
        <div className="grid sm:grid-cols-3 gap-6 text-left w-full">
          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-cyan-600 dark:text-cyan-300">Last Session</CardTitle>
              <CardDescription className="text-white/80 text-center">
                {userData.lastSessionDate ? (
                  <>
                    <span className="text-base font-medium text-yellow-700 dark:text-yellow-200">{formatDate(userData.lastSessionDate)}</span>
                    {userData.lastSessionTitle ? <span className="block mt-1 text-sm text-green-700 dark:text-green-200">{userData.lastSessionTitle}</span> : null}
                  </>
                ) : <span className="text-gray-600 dark:text-gray-300">No sessions yet</span>}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-pink-600 dark:text-pink-300">Emotional Insight</CardTitle>
              <CardDescription className="text-white/80 text-center">
                {userData.topEmotion ? (
                  <>
                    <span className="text-base font-medium text-purple-700 dark:text-purple-200">Top emotion: {userData.topEmotion}</span>
                    <span className="block mt-1 text-sm text-blue-700 dark:text-blue-200">Avg intensity: {userData.avgEmotionIntensity.toFixed(2)}</span>
                  </>
                ) : <span className="text-gray-600 dark:text-gray-300">No emotion data yet</span>}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-violet-600 dark:text-violet-300">Your Activity</CardTitle>
              <CardDescription className="text-white/80 text-center">
                <span className="text-base font-medium text-purple-700 dark:text-purple-200">Total sessions: {userData.totalSessions}</span>
                <span className="block mt-1 text-sm text-fuchsia-700 dark:text-fuchsia-200">This month: {userData.sessionsThisMonth} • {formatDuration(userData.durationThisMonthSeconds)}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
