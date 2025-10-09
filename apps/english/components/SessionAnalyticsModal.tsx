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
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [savingFeedback, setSavingFeedback] = useState(false);
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

  const fetchUserSubscriptionStatus = async (attempt: number = 0) => {
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

      const { data: profile, error: err } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (err) {
        console.error(`SessionAnalyticsModal: Profile fetch attempt ${attempt + 1} error:`, err);
        if (attempt < 2) {
          console.log(`SessionAnalyticsModal: Retrying in 1.5s... (attempt ${attempt + 1})`);
          setTimeout(() => fetchUserSubscriptionStatus(attempt + 1), 1500);
          return;
        }
        setUserSubscriptionStatus('calm');
        return;
      }

      const subscriptionStatus = profile?.subscription_status || 'calm';
      
      // Check if we got 'calm' status but this might be due to race condition
      // Retry up to 3 times if we get 'calm' status, as it might be the default before the real status loads
      if (subscriptionStatus === 'calm' && attempt < 2) {
        console.log(`SessionAnalyticsModal: Got 'calm' status on attempt ${attempt + 1}, retrying in 1.5s...`);
        setTimeout(() => fetchUserSubscriptionStatus(attempt + 1), 1500);
        return;
      }

      console.log('SessionAnalyticsModal: fetched subscription_status =', subscriptionStatus);
      setUserSubscriptionStatus(subscriptionStatus);
    } catch (err) {
      console.error('SessionAnalyticsModal: Unexpected error fetching subscription status:', err);
      setUserSubscriptionStatus('calm');
    }
  };

  // Retry logic constants
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1500;

  const fetchSessionAnalytics = async (attempt: number = 0): Promise<void> => {
    if (!sessionId) {
      // For users without session data, still show loading briefly then set to null
      setTimeout(async () => {
        setLoading(false);
        setSessionStats(null);
        
        // Try to generate feedback from liveMessages even without sessionId
        if (liveMessages && liveMessages.length > 0) {
          try {
            console.log('SessionAnalyticsModal: Generating feedback from liveMessages for non-session user');
            const res = await fetch('/api/generate-feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: liveMessages.slice(-100) }),
            });
            
            if (res.ok) {
              const json = await res.json();
              if (json?.feedback && Array.isArray(json.feedback)) {
                setFeedbackNotes(json.feedback);
                console.log('SessionAnalyticsModal: Set feedback from liveMessages:', json.feedback);
              } else {
                setFeedbackNotes(["Great job taking time for yourself today. Reflect on what stood out and continue to practice self-compassion."]);
              }
            } else {
              setFeedbackNotes(["Great job taking time for yourself today. Reflect on what stood out and continue to practice self-compassion."]);
            }
          } catch (error) {
            console.error('SessionAnalyticsModal: Error generating feedback from liveMessages:', error);
            setFeedbackNotes(["Great job taking time for yourself today. Reflect on what stood out and continue to practice self-compassion."]);
          }
        } else {
          setFeedbackNotes(["Great job taking time for yourself today. Reflect on what stood out and continue to practice self-compassion."]);
        }
        setFeedbackLoading(false);
      }, 1000);
      return;
    }
    
    setLoading(true);
    try {
      // Fetch messages and emotion data
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('role, content, emotion_data, created_at')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // If no messages returned yet, Hume may still be persisting – retry a few times
      if ((messages?.length ?? 0) === 0 && attempt < MAX_RETRIES) {
        console.log(`SessionAnalyticsModal: messages not ready (attempt ${attempt + 1}). Retrying in ${RETRY_DELAY_MS}ms…`);
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

      // === NEW: Generate high-level feedback notes ===
      const generatedFeedback: string[] = [];

      if (userMessages > assistantMessages) {
        generatedFeedback.push(
          "Great engagement! You shared your thoughts actively, which helps the therapist understand you better."
        );
      } else if (userMessages < assistantMessages) {
        generatedFeedback.push(
          "Consider sharing a bit more in future sessions so the therapist can tailor guidance to your feelings."
        );
      }

      if (topEmotions.length > 0) {
        generatedFeedback.push(
          `Predominant emotion detected was ${topEmotions[0].emotion_type.toLowerCase()}. Reflect on any events or thoughts that might have influenced this emotion.`
        );
      }

      // Check for improvement of positive emotions over time
      if (emotionTrends.length > 1) {
        const first = emotionTrends[0];
        const last = emotionTrends[emotionTrends.length - 1];
        if (last.joy > first.joy) {
          generatedFeedback.push(
            "Your joy appears to have increased over the course of the session, indicating positive progress."
          );
        }
      }

      // If we couldn't fetch specific stats, still provide a generic reflection note
      if (generatedFeedback.length === 0) {
        generatedFeedback.push(
          "Thank you for taking the time to talk. Remember to breathe, reflect on your feelings, and be kind to yourself."
        );
      }

      setFeedbackNotes(generatedFeedback);

      // After computing stats, fetch therapist feedback
      try {
        console.log('SessionAnalyticsModal: liveMessages available:', liveMessages?.length || 0);
        console.log('SessionAnalyticsModal: messages from DB:', messages?.length || 0);
        
        const sourceMsgs = liveMessages && liveMessages.length > 0 ? liveMessages : messages?.map(m => ({ role: m.role, content: m.content || '' })) || [];
        console.log('SessionAnalyticsModal: Using sourceMsgs for feedback:', sourceMsgs.length);
        
        if (sourceMsgs.length > 0) {
          const transcriptPayload = sourceMsgs.slice(-100);
          console.log('SessionAnalyticsModal: Sending transcript to API:', transcriptPayload.length, 'messages');
          
          const res = await fetch('/api/generate-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: transcriptPayload }),
          });
          
          if (!res.ok) {
            throw new Error(`API responded with status: ${res.status}`);
          }
          
          const json = await res.json();
          console.log('SessionAnalyticsModal: API response:', json);
          
          if (json?.feedback && Array.isArray(json.feedback)) {
            setFeedbackNotes(json.feedback);
            console.log('SessionAnalyticsModal: Set feedback notes:', json.feedback);
          } else {
            console.warn('SessionAnalyticsModal: Invalid API response format:', json);
            setFeedbackNotes(["Great job taking time for yourself today. Reflect on what stood out and continue to practice self-compassion."]);
          }
        } else {
          console.warn('SessionAnalyticsModal: No messages available for feedback generation');
          setFeedbackNotes(["Great job taking time for yourself today. Reflect on what stood out and continue to practice self-compassion."]);
        }
        setFeedbackLoading(false);
      } catch (fbErr) {
        console.error('SessionAnalyticsModal: feedback API failed', fbErr);
        setFeedbackNotes(["Great job taking time for yourself today. Reflect on what stood out and continue to practice self-compassion."]);
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
      const content = `Therapist Feedback${sessionId ? ` (Session ${sessionId})` : ''}:\n\n` + feedbackNotes.map(n => `- ${n}`).join('\n');
      
      // Get the current session token to include in the request
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const res = await fetch('/api/therapist-feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({ content, sessionId })
      });
      const json = await res.json();
      if (!res.ok || !json?.success || !json?.entry?.id) {
        throw new Error(json?.error || 'Failed to save therapist feedback');
      }
      const entryId = json.entry.id as string;
      setSaveSuccessId(entryId);
    } catch (e: any) {
      setSaveError(e?.message || 'Failed to save journal entry');
    } finally {
      setSavingFeedback(false);
    }
  };

  const handleWriteReflection = () => {
    router.push('/journal/new');
    // Do not call onClose here because the parent onClose navigates elsewhere (dashboard), which overrides this.
  };

  const handleClose = () => {
    onClose();
    router.push('/dashboard');
  };

  // Don't show analytics modal if not open
  if (!isOpen) return null;

  // Show loading state while determining subscription status
  if (userSubscriptionStatus === 'loading') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Session Complete - Your Journey Summary
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="mt-4 text-lg">Loading your session summary...</span>
            <span className="mt-2 text-sm text-muted-foreground">Please wait while we fetch your subscription details</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
        ) : (userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded') ? (
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
                <div className="text-2xl font-bold">{sessionStats?.totalMessages || 0}</div>
                <div className="text-sm text-muted-foreground">Total Messages</div>
              </Card>
              
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{sessionStats?.userMessages || 0}</div>
                <div className="text-sm text-muted-foreground">Your Messages</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{sessionStats?.topEmotions?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Emotions Detected</div>
              </Card>
            </div>

            {/* Top Emotions Chart */}
            {(sessionStats?.topEmotions?.length || 0) > 0 ? (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Your Emotional Journey</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionStats?.topEmotions || []}>
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
            {(sessionStats?.emotionTrends?.length || 0) > 0 && (sessionStats?.topEmotions?.length || 0) > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Emotional Progression Throughout Session</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sessionStats?.emotionTrends || []}>
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
              <h3 className="text-lg font-semibold mb-4 text-center">Session Insights</h3>
              <div className="space-y-3">
                {(sessionStats?.totalMessages || 0) > 0 ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>You shared {sessionStats?.userMessages || 0} thoughts during this session</span>
                      <span className="text-primary font-medium">
                        {(sessionStats?.userMessages || 0) > 5 ? "Great engagement!" : "Good start!"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Session lasted {formatDuration(sessionDuration)}</span>
                      <span className="text-primary font-medium">
                        {sessionDuration > 300 ? "Deep conversation" : "Good check-in"}
                      </span>
                    </div>
                    
                    {(sessionStats?.topEmotions?.length || 0) > 0 && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span>Most prominent emotion: {sessionStats?.topEmotions?.[0]?.emotion_type}</span>
                        <span className="text-primary font-medium">
                          {((sessionStats?.topEmotions?.[0]?.intensity || 0) * 100).toFixed(1)}% intensity
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

            {/* NEW: Therapist Feedback Notes */}
            {!feedbackLoading && feedbackNotes.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Therapist Feedback</h3>
                <div className="space-y-4">
                  {feedbackNotes.map((note, idx) => {
                    // Check if this is a section header (ends with colon)
                    const isHeader = note.endsWith(':');
                    return isHeader ? (
                      <h4 key={idx} className="font-semibold text-base mt-4 mb-2 first:mt-0">
                        {note}
                      </h4>
                    ) : (
                      <div key={idx} className="flex items-start">
                        <span className="text-muted-foreground mr-2 mt-1">•</span>
                        <span className="text-sm leading-relaxed">{note}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-3 justify-center items-center">
                  <Button onClick={handleSaveFeedback} disabled={savingFeedback || !!saveSuccessId}>
                    {saveSuccessId ? 'Saved' : (savingFeedback ? 'Saving…' : 'Save to Journal')}
                  </Button>
                  {saveSuccessId && (
                    <Button variant="outline" onClick={() => router.push(`/journal/${saveSuccessId}`)}>
                      View Entry
                    </Button>
                  )}
                </div>
                {saveError && (
                  <div className="mt-2 text-sm text-destructive text-center">{saveError}</div>
                )}
              </Card>
            )}
            {feedbackLoading && (
              <Card className="p-6 max-w-md mx-auto mb-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                Generating therapist feedback...
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t justify-center">
              {sessionStats && (sessionStats?.totalMessages || 0) > 0 && (
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

            {/* NEW: Feedback card in fallback UI */}
            {feedbackNotes.length > 0 && (
              <Card className="p-6 max-w-md mx-auto mb-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Therapist Feedback</h3>
                <ul className="list-disc list-inside space-y-2 text-left">
                  {feedbackNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-3 justify-center items-center">
                  <Button onClick={handleSaveFeedback} disabled={savingFeedback || !!saveSuccessId}>
                    {saveSuccessId ? 'Saved' : (savingFeedback ? 'Saving…' : 'Save to Journal')}
                  </Button>
                  {saveSuccessId && (
                    <Button variant="outline" onClick={() => router.push(`/journal/${saveSuccessId}`)}>
                      View Entry
                    </Button>
                  )}
                </div>
                {saveError && (
                  <div className="mt-2 text-sm text-destructive text-center">{saveError}</div>
                )}
              </Card>
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