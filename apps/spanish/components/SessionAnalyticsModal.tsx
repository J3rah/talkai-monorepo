"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import supabase from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { Clock, MessageCircle, Heart, TrendingUp, Download, Share2, Pencil } from "lucide-react";
import { triggerSessionCompleteConfetti } from "@/utils/confetti";

interface SessionAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionDuration: number;
  sessionId: string | null;
  liveMessages?: { role: string; content: string }[];
}

interface EmotionData {
  emotion_type: string;
  intensity: number;
  count: number;
}

interface SessionStats {
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  topEmotions: EmotionData[];
  emotionTrends: Array<{
    time: string;
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  }>;
}

const EMOTION_COLORS = {
  joy: '#22c55e',
  sadness: '#3b82f6',
  anger: '#ef4444',
  fear: '#f59e0b',
  surprise: '#8b5cf6',
  disgust: '#f97316',
  love: '#ec4899',
  gratitude: '#10b981',
  excitement: '#f59e0b',
  calmness: '#06b6d4',
  confidence: '#8b5cf6',
  anxiety: '#ef4444',
  contentment: '#22c55e',
  disappointment: '#6b7280',
  empathy: '#ec4899',
  hope: '#22c55e',
  relief: '#06b6d4',
  admiration: '#8b5cf6'
};

export default function SessionAnalyticsModal({ 
  isOpen, 
  onClose, 
  sessionDuration,
  sessionId,
  liveMessages
}: SessionAnalyticsModalProps) {
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string>('loading');
  const [feedbackNotes, setFeedbackNotes] = useState<string[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);
  const [savingFeedback, setSavingFeedback] = useState<boolean>(false);
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user subscription status when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserSubscriptionStatus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchSessionAnalytics();
    }
  }, [isOpen]);

  // Trigger confetti when modal opens (1-2 seconds after session ends)
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti 1 second after modal opens (so total 2 seconds after session ends)
      const confettiTimer = setTimeout(() => {
        console.log('🎉 Session complete! Triggering spectacular celebratory confetti...');
        triggerSessionCompleteConfetti();
      }, 1000);

      return () => clearTimeout(confettiTimer);
    }
  }, [isOpen]);

  const fetchUserSubscriptionStatus = async () => {
    try {
      let { data: { user } } = await supabase.auth.getUser();

      // Fallback: If getUser() returns null (can happen right after page reload), try getSession()
      if (!user) {
        console.warn('SessionAnalyticsModal: getUser returned null, trying getSession');
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user ?? null;
      }

      if (!user) {
        console.error('SessionAnalyticsModal: Unable to determine current user. Falling back to calm.');
        setUserSubscriptionStatus('calm');
        return;
      }

      let attempts = 0;
      const MAX_ATTEMPTS = 3;
      let profile: any = null;
      let error: any = null;

      while (attempts < MAX_ATTEMPTS && !profile) {
        const { data, error: err } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (err) {
          error = err;
          console.error(`SessionAnalyticsModal: Profile fetch attempt ${attempts + 1} error:`, err);
        } else {
          profile = data;
        }

        if (!profile) {
          attempts += 1;
          // small delay before retrying
          await new Promise(res => setTimeout(res, 300));
        }
      }

      if (profile && profile.subscription_status) {
        console.log('SessionAnalyticsModal: fetched subscription_status =', profile.subscription_status);
        setUserSubscriptionStatus(profile.subscription_status);
      } else {
        console.error('SessionAnalyticsModal: Could not fetch subscription_status after retries, falling back to calm');
        setUserSubscriptionStatus('calm');
      }
    } catch (err) {
      console.error('SessionAnalyticsModal: Unexpected error fetching subscription status:', err);
      setUserSubscriptionStatus('calm');
    }
  };

  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1500;

  const fetchSessionAnalytics = async (attempt: number = 0): Promise<void> => {
    if (!sessionId) {
      // For users without session data, still show loading briefly then set to null
      // This allows premium users to see the analytics section even without data
      setTimeout(async () => {
        setLoading(false);
        setSessionStats(null);
        // If we have live messages, attempt therapist feedback from them
        if (liveMessages && liveMessages.length > 0) {
          try {
            setFeedbackLoading(true);
            const transcriptPayload = liveMessages.slice(-100);
            const res = await fetch('/api/generate-feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: transcriptPayload })
            });
            const json = await res.json();
            if (Array.isArray(json)) setFeedbackNotes(json);
          } catch (e) {
            console.warn('Feedback generation (live only) failed:', e);
          } finally {
            setFeedbackLoading(false);
          }
        }
      }, 1000);
      return;
    }
    
    setLoading(true);
    try {
      // Fetch messages and emotion data
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('role, emotion_data, created_at')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if ((messages?.length ?? 0) === 0 && attempt < MAX_RETRIES) {
        console.log(`SessionAnalyticsModal: los mensajes aún no están listos (intento ${attempt + 1}). Reintentando en ${RETRY_DELAY_MS}ms…`);
        setTimeout(() => fetchSessionAnalytics(attempt + 1), RETRY_DELAY_MS);
        return;
      }

      // Fetch emotion metrics
      const { data: emotions, error: emotionsError } = await supabase
        .from('emotion_metrics')
        .select('emotion_type, intensity, confidence')
        .eq('chat_session_id', sessionId);

      if (emotionsError) throw emotionsError;

      // Process the data
      const userMessages = messages?.filter(m => m.role === 'user').length || 0;
      const assistantMessages = messages?.filter(m => m.role === 'assistant').length || 0;

      // Process emotions for top emotions chart
      const emotionCounts: Record<string, { total: number; count: number }> = {};
      
      emotions?.forEach(emotion => {
        if (!emotionCounts[emotion.emotion_type]) {
          emotionCounts[emotion.emotion_type] = { total: 0, count: 0 };
        }
        emotionCounts[emotion.emotion_type].total += emotion.intensity;
        emotionCounts[emotion.emotion_type].count += 1;
      });

      const topEmotions = Object.entries(emotionCounts)
        .map(([emotion_type, data]) => ({
          emotion_type: emotion_type.charAt(0).toUpperCase() + emotion_type.slice(1),
          intensity: data.total / data.count,
          count: data.count
        }))
        .sort((a, b) => b.intensity - a.intensity)
        .slice(0, 8);

      // Process emotion trends over time
      const emotionTrends: Array<{
        time: string;
        joy: number;
        sadness: number;
        anger: number;
        fear: number;
        surprise: number;
        disgust: number;
      }> = [];

      if (messages && messages.length > 0) {
        const timeSlots = Math.min(10, messages.length);
        const messagesPerSlot = Math.ceil(messages.length / timeSlots);

        for (let i = 0; i < timeSlots; i++) {
          const slotMessages = messages.slice(i * messagesPerSlot, (i + 1) * messagesPerSlot);
          const timePoint = {
            time: `${Math.round((i + 1) * (sessionDuration / timeSlots / 60))}m`,
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            surprise: 0,
            disgust: 0
          };

          let emotionCounts = { joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0, disgust: 0 };
          let totalEmotions = 0;

          slotMessages.forEach(msg => {
            if (msg.emotion_data && typeof msg.emotion_data === 'object') {
              Object.entries(msg.emotion_data).forEach(([emotion, value]) => {
                if (emotion in emotionCounts) {
                  emotionCounts[emotion as keyof typeof emotionCounts] += Number(value);
                  totalEmotions++;
                }
              });
            }
          });

          // Average the emotions for this time slot
          if (totalEmotions > 0) {
            timePoint.joy = Number((emotionCounts.joy / totalEmotions).toFixed(3));
            timePoint.sadness = Number((emotionCounts.sadness / totalEmotions).toFixed(3));
            timePoint.anger = Number((emotionCounts.anger / totalEmotions).toFixed(3));
            timePoint.fear = Number((emotionCounts.fear / totalEmotions).toFixed(3));
            timePoint.surprise = Number((emotionCounts.surprise / totalEmotions).toFixed(3));
            timePoint.disgust = Number((emotionCounts.disgust / totalEmotions).toFixed(3));
          }

          emotionTrends.push(timePoint);
        }
      }

      setSessionStats({
        totalMessages: messages?.length || 0,
        userMessages,
        assistantMessages,
        topEmotions,
        emotionTrends
      });
      // Therapist feedback generation: prefer liveMessages, else DB messages (with content fetch)
      try {
        const sourceMsgs = (liveMessages && liveMessages.length > 0)
          ? liveMessages
          : (await (async () => {
              const { data: fullMsgs } = await supabase
                .from('chat_messages')
                .select('role, content')
                .eq('chat_session_id', sessionId)
                .order('created_at', { ascending: true });
              return (fullMsgs || []).map((m: any) => ({ role: m.role, content: m.content || '' }));
            })());
        if (sourceMsgs && sourceMsgs.length > 0) {
          setFeedbackLoading(true);
          const transcriptPayload = sourceMsgs.slice(-100);
          const res = await fetch('/api/generate-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: transcriptPayload })
          });
          const json = await res.json();
          if (Array.isArray(json)) setFeedbackNotes(json);
        }
      } catch (e) {
        console.warn('Feedback generation failed:', e);
      } finally {
        setFeedbackLoading(false);
      }
    } catch (error) {
      console.error('Error fetching session analytics:', error);
      // Even on error, set loading to false so users can see the fallback
      setLoading(false);
      setSessionStats(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getSubscriptionMessage = () => {
    switch (userSubscriptionStatus) {
      case 'calm':
        return "As a Calm tier user, detailed analytics aren't available, but your conversations are still private and meaningful.";
      case 'centered':
        return "As a Centered tier user, you have access to detailed session analytics and insights.";
      case 'grounded':
        return "As a Grounded tier user, you have access to all premium features including detailed analytics and session downloads.";
      case 'loading':
        return "Fetching your subscription details...";
      default:
        return "Your session has been completed successfully.";
    }
  };

  const handleViewFullSession = () => {
    if (sessionId) {
      router.push(`/session/${sessionId}`);
      handleClose();
    }
  };

  const handleNewSession = () => {
    router.push('/chat');
    handleClose();
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
    handleClose();
  };

  const handleSaveFeedback = async () => {
    if (!feedbackNotes || feedbackNotes.length === 0 || savingFeedback) return;
    setSavingFeedback(true);
    setSaveError(null);
    try {
      const content = `Retroalimentación del Terapeuta${sessionId ? ` (Sesión ${sessionId})` : ''}:\n\n` + feedbackNotes.map(n => `- ${n}`).join('\n');
      const res = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const json = await res.json();
      if (!res.ok || !json?.success || !json?.entry?.id) {
        throw new Error(json?.error || 'No se pudo guardar la entrada del diario');
      }
      const entryId = json.entry.id as string;
      setSaveSuccessId(entryId);
      // Intentar vincular la entrada al chat_session si existe la columna
      if (sessionId) {
        try {
          await supabase
            .from('chat_sessions')
            .update({ journal_entry_id: entryId })
            .eq('id', sessionId);
        } catch (_linkErr) {
          // Ignorar si la columna no existe o falla la actualización
        }
      }
    } catch (e: any) {
      setSaveError(e?.message || 'No se pudo guardar la entrada del diario');
    } finally {
      setSavingFeedback(false);
    }
  };

  const handleWriteReflection = () => {
    router.push('/journal/new');
    // Do not call onClose here because the parent onClose navigates elsewhere (dashboard), which overrides this.
  };

  // Don't show analytics modal for Calm tier users - they should only see a simple completion message
  if (!isOpen || userSubscriptionStatus === 'calm') return null;

  const handleClose = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Session Complete - Your Journey Summary
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="mt-3">Analyzing your session...</span>
          </div>
        ) : (sessionStats && (userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded')) ? (
          <div className="space-y-6">
            {/* Session Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{formatDuration(sessionDuration)}</div>
                <div className="text-sm text-muted-foreground">Session Duration</div>
              </Card>
              
              <Card className="p-4 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{sessionStats.totalMessages}</div>
                <div className="text-sm text-muted-foreground">Total Messages</div>
              </Card>
              
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{sessionStats.userMessages}</div>
                <div className="text-sm text-muted-foreground">Your Messages</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{sessionStats.topEmotions.length}</div>
                <div className="text-sm text-muted-foreground">Emotions Detected</div>
              </Card>
            </div>

            {/* Top Emotions Chart */}
            {sessionStats.topEmotions.length > 0 ? (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Your Emotional Journey</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionStats.topEmotions}>
                    <XAxis dataKey="emotion_type" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${(Number(value) * 100).toFixed(1)}%`,
                        'Intensity'
                      ]}
                    />
                    <Bar 
                      dataKey="intensity" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Emotion Data Available</h3>
                <p className="text-muted-foreground">
                  Emotion analysis wasn't captured for this session. Future sessions may include detailed emotional insights.
                </p>
              </Card>
            )}

            {/* Emotion Trends Over Time */}
            {sessionStats.emotionTrends.length > 0 && sessionStats.topEmotions.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Emotional Progression Throughout Session</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sessionStats.emotionTrends}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${(Number(value) * 100).toFixed(1)}%`,
                        name?.toString().charAt(0).toUpperCase() + name?.toString().slice(1)
                      ]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="joy" stroke={EMOTION_COLORS.joy} strokeWidth={2} />
                    <Line type="monotone" dataKey="sadness" stroke={EMOTION_COLORS.sadness} strokeWidth={2} />
                    <Line type="monotone" dataKey="anger" stroke={EMOTION_COLORS.anger} strokeWidth={2} />
                    <Line type="monotone" dataKey="fear" stroke={EMOTION_COLORS.fear} strokeWidth={2} />
                    <Line type="monotone" dataKey="surprise" stroke={EMOTION_COLORS.surprise} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Session Insights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Ideas de la Sesión</h3>
              <div className="space-y-3">
                {sessionStats.totalMessages > 0 ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>You shared {sessionStats.userMessages} thoughts during this session</span>
                      <span className="text-primary font-medium">
                        {sessionStats.userMessages > 5 ? "Great engagement!" : "Good start!"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Session lasted {formatDuration(sessionDuration)}</span>
                      <span className="text-primary font-medium">
                        {sessionDuration > 300 ? "Deep conversation" : "Good check-in"}
                      </span>
                    </div>
                    
                    {sessionStats.topEmotions.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span>Most prominent emotion: {sessionStats.topEmotions[0].emotion_type}</span>
                        <span className="text-primary font-medium">
                          {(sessionStats.topEmotions[0].intensity * 100).toFixed(1)}% intensity
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>This was a brief session</span>
                    <span className="text-primary font-medium">Every step counts!</span>
                  </div>
                )}
              </div>
            </Card>

            {/* NUEVO: Notas de Retroalimentación del Terapeuta */}
            {feedbackLoading ? (
              <Card className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <span className="mt-3 block">Generando retroalimentación del terapeuta…</span>
              </Card>
            ) : feedbackNotes.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Retroalimentación del Terapeuta</h3>
                <ul className="list-disc list-inside space-y-2">
                  {feedbackNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-3 justify-center items-center">
                  <Button onClick={handleSaveFeedback} disabled={savingFeedback || !!saveSuccessId}>
                    {saveSuccessId ? 'Guardado' : (savingFeedback ? 'Guardando…' : 'Guardar en Diario')}
                  </Button>
                  {saveSuccessId && (
                    <Button variant="outline" onClick={() => router.push(`/journal/${saveSuccessId}`)}>
                      Ver Entrada
                    </Button>
                  )}
                </div>
                {saveError && (
                  <div className="mt-2 text-sm text-destructive text-center">{saveError}</div>
                )}
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t justify-center">
              {sessionStats.totalMessages > 0 && (
                <Button onClick={handleViewFullSession} variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View Full Conversation
                </Button>
              )}
              
              <Button onClick={handleWriteReflection} variant="outline" className="flex-1">
                <Pencil className="w-4 h-4 mr-2" />
                Write Reflection
              </Button>

              <Button onClick={handleNewSession} className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
              
              <Button onClick={handleGoToDashboard} variant="outline" className="flex-1">
                <TrendingUp className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Session Complete!</h3>
            
            {/* Show session duration for all users */}
            <div className="mb-4">
              <Card className="p-4 max-w-sm mx-auto">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{formatDuration(sessionDuration)}</div>
                <div className="text-sm text-muted-foreground">Session Duration</div>
              </Card>
            </div>
            
            <p className="text-muted-foreground mb-2">
              Thank you for your therapy session!
            </p>
            
            <p className="text-sm text-muted-foreground mb-6">
              {sessionId 
                ? "Your conversation data wasn't captured for this session." 
                : getSubscriptionMessage()
              }
            </p>
            
            {/* Show upgrade message only for Calm users */}
            {userSubscriptionStatus === 'calm' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2 text-center">Want detailed session analytics?</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3 text-center">
                  Upgrade to Centered or Grounded to get:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 text-center list-none">
                  <li>• Emotion analysis and trends</li>
                  <li>• Session history and insights</li>
                  <li>• Conversation transcripts</li>
                  <li>• Progress tracking over time</li>
                </ul>
                <Button 
                  onClick={() => window.open('/subscription', '_blank')} 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                >
                  View Plans
                </Button>
              </div>
            )}

            {/* Show success message for Centered and Grounded users */}
            {(userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded') && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h4 className="font-medium text-green-900 dark:text-green-200 mb-2 text-center">
                  {userSubscriptionStatus === 'grounded' ? 'Grounded Plan' : 'Centered Plan'} Benefits
                </h4>
                <p className="text-sm text-green-800 dark:text-green-300 mb-3 text-center">
                  You're enjoying premium features:
                </p>
                <ul className="text-sm text-green-700 dark:text-green-400 space-y-1 text-center list-none">
                  <li>• Detailed emotion analysis and trends ✓</li>
                  <li>• Complete session history ✓</li>
                  <li>• Conversation transcripts ✓</li>
                  <li>• Progress tracking over time ✓</li>
                  {userSubscriptionStatus === 'grounded' && (
                    <li>• Download therapy sessions ✓</li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button onClick={handleWriteReflection} variant="outline">
                <Pencil className="w-4 h-4 mr-2" />
                Write Reflection
              </Button>

              <Button onClick={handleNewSession}>
                <Heart className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
              <Button onClick={handleGoToDashboard} variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 