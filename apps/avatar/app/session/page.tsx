'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, AvatarSession, AvatarMessage } from '@/lib/supabaseClient';
import { HumeClient, HumeMessage, HumeEmotion, getHumeAccessToken } from '@/lib/humeClient';
import { HeyGenClient } from '@/lib/heygenClient';
import AvatarPlayer from '@/components/AvatarPlayer';
import EmotionVisualizer from '@/components/EmotionVisualizer';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import TranscriptView from '@/components/TranscriptView';
import SessionControls from '@/components/SessionControls';
import { Button } from '@/components/ui/button';
import { throttle, debounce } from '@/lib/utils';

export default function SessionPage() {
  const router = useRouter();
  
  // State management
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [messages, setMessages] = useState<HumeMessage[]>([]);
  const [currentEmotions, setCurrentEmotions] = useState<HumeEmotion[]>([]);
  const [audioData, setAudioData] = useState<Float32Array | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentSession, setCurrentSession] = useState<AvatarSession | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [saveChatHistory, setSaveChatHistory] = useState(false);

  // Refs for clients
  const humeClientRef = useRef<HumeClient | null>(null);
  const heygenClientRef = useRef<HeyGenClient | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push('/auth');
        return;
      }

      setUser(session.user);

      // Check if user wants to save chat history
      const { data: profile } = await supabase
        .from('profiles')
        .select('save_chat_history')
        .eq('id', session.user.id)
        .single();

      setSaveChatHistory(profile?.save_chat_history || false);
      
      setIsInitializing(false);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/auth');
    }
  };

  // Initialize session
  const initializeSession = async () => {
    if (!user) return;

    try {
      setError(null);
      console.log('🚀 Initializing avatar session...');

      // Step 1: Get Hume access token
      const humeToken = await getHumeAccessToken();
      
      // Step 2: Initialize Hume client
      const humeConfig = {
        configId: process.env.NEXT_PUBLIC_HUME_CONFIG_ID || '',
        accessToken: humeToken,
        onMessage: handleHumeMessage,
        onEmotion: handleEmotionUpdate,
        onAudio: handleHumeAudio,
        onConnect: () => {
          console.log('✅ Hume connected');
          setIsConnected(true);
          sessionStartTimeRef.current = Date.now();
          startTimer();
        },
        onDisconnect: () => {
          console.log('🔌 Hume disconnected');
          setIsConnected(false);
        },
        onError: (err) => {
          console.error('Hume error:', err);
          setError(err.message);
        },
      };

      humeClientRef.current = new HumeClient(humeConfig);
      await humeClientRef.current.connect();
      await humeClientRef.current.startAudioCapture();

      // Step 3: Initialize HeyGen client
      const heygenConfig = {
        apiKey: process.env.HEYGEN_API_KEY || '',
        avatarId: process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID || '',
        voiceId: process.env.HEYGEN_VOICE_ID,
        quality: 'high' as const,
        onConnect: () => {
          console.log('✅ HeyGen connected');
        },
        onDisconnect: () => {
          console.log('🔌 HeyGen disconnected');
        },
        onError: (err) => {
          console.error('HeyGen error:', err);
          setShowFallback(true);
        },
      };

      heygenClientRef.current = new HeyGenClient(heygenConfig);
      await heygenClientRef.current.connect();

      // Step 4: Create session in database
      if (saveChatHistory) {
        await createDatabaseSession();
      }

      console.log('🎉 Session initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize session:', error);
      setError('Failed to initialize session. Please try again.');
      setShowFallback(true);
    }
  };

  // Create database session
  const createDatabaseSession = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: `Avatar Session - ${new Date().toLocaleString()}`,
        status: 'active',
        voice_config_id: process.env.NEXT_PUBLIC_HUME_CONFIG_ID,
        avatar_id: process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create session:', error);
    } else {
      setCurrentSession(data);
      console.log('📝 Session created:', data.id);
    }
  };

  // Handle Hume message
  const handleHumeMessage = useCallback((message: HumeMessage) => {
    console.log('📨 Hume message:', message.type);
    setMessages((prev) => [...prev, message]);

    // Save to database if enabled
    if (saveChatHistory && currentSession) {
      saveMessageToDatabase(message);
    }
  }, [saveChatHistory, currentSession]);

  // Handle emotion updates
  const handleEmotionUpdate = useCallback(
    throttle((emotions: HumeEmotion[]) => {
      console.log('😊 Emotions updated:', emotions[0]);
      setCurrentEmotions(emotions);

      // Save emotion metrics if enabled
      if (saveChatHistory && currentSession) {
        saveEmotionMetrics(emotions);
      }
    }, 500),
    [saveChatHistory, currentSession]
  );

  // Handle audio from Hume (to send to HeyGen for lip-sync)
  const handleHumeAudio = useCallback(async (audioData: ArrayBuffer) => {
    if (heygenClientRef.current) {
      await heygenClientRef.current.sendAudio(audioData);
    }
  }, []);

  // Save message to database
  const saveMessageToDatabase = async (message: HumeMessage) => {
    if (!currentSession) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        chat_session_id: currentSession.id,
        role: message.role,
        content: message.content || '',
        emotion_data: message.emotions || [],
      });

    if (error) {
      console.error('Failed to save message:', error);
    }
  };

  // Save emotion metrics
  const saveEmotionMetrics = debounce(async (emotions: HumeEmotion[]) => {
    if (!currentSession || emotions.length === 0) return;

    const metrics = emotions.map((emotion) => ({
      session_id: currentSession.id,
      emotion_type: emotion.name,
      score: emotion.score,
      timestamp: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('emotion_metrics')
      .insert(metrics);

    if (error) {
      console.error('Failed to save emotion metrics:', error);
    }
  }, 2000);

  // Timer management
  const startTimer = () => {
    if (timerIntervalRef.current) return;

    timerIntervalRef.current = setInterval(() => {
      if (sessionStartTimeRef.current && !isPaused) {
        const elapsed = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        setSessionDuration(elapsed);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Control handlers
  const handleMuteToggle = () => {
    if (!humeClientRef.current) return;
    setIsMuted(!isMuted);
    // Implement mute logic
  };

  const handlePauseToggle = async () => {
    if (!heygenClientRef.current) return;
    
    if (isPaused) {
      await heygenClientRef.current.resume();
    } else {
      await heygenClientRef.current.pause();
    }
    
    setIsPaused(!isPaused);
  };

  const handleEndSession = async () => {
    console.log('🛑 Ending session...');
    
    // Stop timer
    stopTimer();
    
    // Disconnect clients
    if (humeClientRef.current) {
      humeClientRef.current.disconnect();
    }
    
    if (heygenClientRef.current) {
      await heygenClientRef.current.disconnect();
    }

    // Update session status in database
    if (currentSession) {
      await supabase
        .from('chat_sessions')
        .update({
          status: 'completed',
          duration_seconds: sessionDuration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentSession.id);
    }

    // Navigate to home
    router.push('/');
  };

  // Start session on mount
  useEffect(() => {
    if (!isInitializing && user && !isConnected) {
      initializeSession();
    }

    return () => {
      // Cleanup on unmount
      stopTimer();
      if (humeClientRef.current) {
        humeClientRef.current.disconnect();
      }
      if (heygenClientRef.current) {
        heygenClientRef.current.disconnect();
      }
    };
  }, [isInitializing, user]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p>Initializing session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">TalkAI Avatar Session</h1>
          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Avatar + Emotion Visualizer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Avatar Player */}
          <div className="relative">
            <AvatarPlayer
              heygenClient={heygenClientRef.current}
              currentEmotion={currentEmotions}
              showFallback={showFallback}
              className="w-full"
            />

            {/* Emotion Visualizer Overlay */}
            {currentEmotions.length > 0 && (
              <div className="absolute bottom-4 left-4">
                <EmotionVisualizer
                  emotions={currentEmotions}
                  size="medium"
                />
              </div>
            )}
          </div>

          {/* Waveform */}
          <div className="bg-card rounded-lg p-4">
            <WaveformVisualizer
              audioData={audioData}
              isActive={isConnected && !isPaused}
              barCount={48}
            />
          </div>
        </div>

        {/* Right Column: Transcript */}
        <div className="bg-card rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Conversation</h2>
          </div>
          <TranscriptView messages={messages} className="h-[calc(100vh-280px)]" />
        </div>
      </div>

      {/* Bottom Controls */}
      <SessionControls
        isConnected={isConnected}
        isMuted={isMuted}
        isPaused={isPaused}
        sessionDuration={sessionDuration}
        onMuteToggle={handleMuteToggle}
        onPauseToggle={handlePauseToggle}
        onEndSession={handleEndSession}
      />
    </div>
  );
}

