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
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    // Failsafe: stop showing spinner if auth check stalls > 8 s
    const overallTimeout = setTimeout(() => {
      console.warn('AuthenticatedLanding: overall auth/data timeout – falling back to unauthenticated view');
      setLoading(false);
    }, 8000);

    let isMounted = true;

    const checkAuthAndFetchData = async () => {
      try {
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);
        console.log('🔍 AuthenticatedLanding: User authenticated:', session.user.id);

        // Fetch user data
        const userId = session.user.id;
        let fullName = session.user.email?.split('@')[0] || 'there';
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
          console.error('Error fetching user data:', e);
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (isMounted) {
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

    // cleanup overall timeout
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(overallTimeout);
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col bg-gradient-to-br from-blue-400 to-purple-400 dark:bg-black dark:bg-none">
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Cargando tu experiencia personalizada...</p>
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
            Terapia IA Empática
          </h1>
          <Badge className="mb-6 px-5 py-2.5 text-lg font-semibold text-white bg-white/5 border border-white/70 rounded-full inline-flex items-center gap-2 shadow-[0_0_10px_0_rgba(255,255,255,0.25)]">
            <ConfettiStars className="focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded" />
            TÚ eres el corazón de talkAI
            <ConfettiHeart className="ml-1" />
          </Badge>
          <div className="text-lg sm:text-xl text-white/90 mb-10 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🧠</span>
              <span>Entiende tus emociones en tiempo real</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💝</span>
              <span>Te ayuda a sentirte escuchado, apoyado y empoderado</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💬</span>
              <span>Habla o escribe—obtén apoyo en tiempo real</span>
            </div>
          </div>
          <AuthAwareButtons />

          {/* Feature Grid */}
          <div className="grid sm:grid-cols-3 gap-6 text-left w-full">
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Detección de Emociones</CardTitle>
                <CardDescription className="text-white/80 text-center">
                  Análisis en tiempo real de tu estado emocional a través de patrones de voz y conversación.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Respuestas Personalizadas</CardTitle>
                <CardDescription className="text-white/80 text-center">
                  La IA adapta su enfoque basado en tus necesidades emocionales únicas.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Seguro y Privado</CardTitle>
                <CardDescription className="text-white/80 text-center">
                  Las conversaciones son seguras y confidenciales, dándote un espacio seguro para compartir.
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
          {`Bienvenido de vuelta ${userData.fullName}`}
        </h1>
        <Badge className="mb-6 px-5 py-2.5 text-lg font-semibold text-white bg-white/5 border border-white/70 rounded-full inline-flex items-center gap-2 shadow-[0_0_10px_0_rgba(255,255,255,0.25)]">
          <ConfettiStars className="focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded" />
          Es genial verte de nuevo
          <ConfettiHeart className="ml-1" />
        </Badge>

        {/* Go to Sessions Button */}
        <div className="mb-10">
          <Link href="/sessions">
            <Button className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
              🚀 Iniciar Sesión
            </Button>
          </Link>
        </div>

        {/* Personalized Tiles */}
        <div className="grid sm:grid-cols-3 gap-6 text-left w-full">
          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-cyan-600 dark:text-cyan-300">Última Sesión</CardTitle>
              <CardDescription className="text-white/80 text-center">
                {userData.lastSessionDate ? (
                  <>
                    <div className="text-base font-medium text-yellow-700 dark:text-yellow-200">{formatDate(userData.lastSessionDate)}</div>
                    {userData.lastSessionTitle ? <div className="mt-1 text-sm text-green-700 dark:text-green-200">{userData.lastSessionTitle}</div> : null}
                  </>
                ) : <span className="text-gray-600 dark:text-gray-300">Aún no hay sesiones</span>}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-pink-600 dark:text-pink-300">Perspectiva Emocional</CardTitle>
              <CardDescription className="text-white/80 text-center">
                {userData.topEmotion ? (
                  <>
                    <div className="text-base font-medium text-purple-700 dark:text-purple-200">Emoción principal: {userData.topEmotion}</div>
                    <div className="mt-1 text-sm text-blue-700 dark:text-blue-200">Intensidad promedio: {userData.avgEmotionIntensity.toFixed(2)}</div>
                  </>
                ) : <span className="text-gray-600 dark:text-gray-300">Aún no hay datos de emociones</span>}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:border-cyan-400 hover:scale-105">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-violet-600 dark:text-violet-300">Tu Actividad</CardTitle>
              <CardDescription className="text-white/80 text-center">
                <div className="text-base font-medium text-purple-700 dark:text-purple-200">Sesiones totales: {userData.totalSessions}</div>
                <div className="mt-1 text-sm text-fuchsia-700 dark:text-fuchsia-200">Este mes: {userData.sessionsThisMonth} • {formatDuration(userData.durationThisMonthSeconds)}</div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
