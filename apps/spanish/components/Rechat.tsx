"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import supabase from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { PostgrestError } from "@supabase/supabase-js";
import { generateContinuationSessionName } from "@/utils/sessionUtils";

interface RechatProps {
  onVoiceSelect: (configId: string) => void;
  previousSessionId: string;
  isResuming?: boolean;
  onConnected?: () => void;
}

export default function Rechat({ onVoiceSelect, previousSessionId, isResuming = false, onConnected }: RechatProps) {
  const router = useRouter();
  const { connect, disconnect, status, unmute, resumeAssistant } = useVoice();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasCalledOnConnected, setHasCalledOnConnected] = useState(false);
  const MAX_RETRIES = 3;
  // Guard to prevent duplicate setup calls in React StrictMode (dev)
  const hasInitializedRef = useRef(false);

  const fetchWithRetry = async <T,>(query: () => Promise<{ data: T | null; error: PostgrestError | null }>, retryDelay = 1000) => {
    try {
      return await query();
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchWithRetry(query, retryDelay * 2);
      }
      throw error;
    }
  };

  // Create a new session when component mounts
  useEffect(() => {
    if (hasInitializedRef.current) return; // prevent duplicate execution
    hasInitializedRef.current = true;

    const handleSessionSetup = async () => {
      try {
        if (isResuming) {
          // For resumption, validate the session has required Hume IDs
          console.log('🔄 Resuming existing session:', previousSessionId);
          
          const { data: sessionData, error: sessionError } = await fetchWithRetry(() => 
            Promise.resolve(supabase
              .from('chat_sessions')
              .select('id, hume_chat_id, hume_chat_group_id, title, status')
              .eq('id', previousSessionId)
              .single())
          );

          if (sessionError) {
            console.error('❌ Error fetching session for resumption:', sessionError);
            throw new Error('Could not load session data');
          }

          if (!sessionData) {
            throw new Error('Session not found');
          }

          console.log('📋 Session data for resumption:', {
            id: sessionData.id,
            hasHumeChatId: !!sessionData.hume_chat_id,
            hasHumeChatGroupId: !!sessionData.hume_chat_group_id,
            title: sessionData.title,
            status: sessionData.status
          });

          // Check if session has required Hume IDs for resumption
          if (!sessionData.hume_chat_id || !sessionData.hume_chat_group_id) {
            console.warn('⚠️ Session missing Hume chat IDs - cannot resume:', {
              humeChatId: sessionData.hume_chat_id,
              humeChatGroupId: sessionData.hume_chat_group_id
            });
            throw new Error('Session data incomplete - cannot resume chat');
          }

          setCurrentSessionId(previousSessionId);
          localStorage.setItem('currentChatSessionId', previousSessionId);
          setStartTime(Date.now());
          
          console.log('✅ Session validated for resumption, connecting...');
          // Add a small delay before connecting
          await new Promise(resolve => setTimeout(resolve, 1000));
          handleConnect();
          return;
        }

        // For new continuation sessions, create a new database record
        console.log('🆕 Creating new continuation session from:', previousSessionId);
        
        // Get the previous session's data
        const { data: previousSession, error: fetchError } = await fetchWithRetry(() => 
          Promise.resolve(supabase
            .from('chat_sessions')
            .select('*')
            .eq('id', previousSessionId)
            .single())
        );

        if (fetchError) {
          console.error('Error fetching previous session:', fetchError);
          throw new Error('Failed to fetch previous session');
        }

        if (!previousSession) {
          throw new Error('Previous session not found');
        }

        // Create a new session
        const { data: newSession, error: createError } = await fetchWithRetry(() => 
          Promise.resolve(supabase
            .from('chat_sessions')
            .insert({
              user_id: previousSession.user_id,
              title: generateContinuationSessionName(previousSession.title),
              summary: previousSession.summary,
              previous_session_id: previousSessionId,
              created_at: new Date().toISOString(),
              status: 'in_progress'
            })
            .select()
            .single())
        );

        if (createError) {
          console.error('Error creating new session:', createError);
          throw new Error('Failed to create new session');
        }

        if (!newSession) {
          throw new Error('Failed to create new session');
        }

        setCurrentSessionId(newSession.id);
        localStorage.setItem('currentChatSessionId', newSession.id);
        setStartTime(Date.now());
        
        // Add a small delay before connecting
        await new Promise(resolve => setTimeout(resolve, 1000));
        handleConnect();
      } catch (error) {
        console.error('Error in session setup:', error);
        setConnectionError(error instanceof Error ? error.message : 'Failed to start session. Please try again.');
      }
    };

    handleSessionSetup();
  }, [previousSessionId, isResuming]);

  const handleConnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const message = isResuming ? 'Resuming session...' : 'Starting new session...';
      console.log(message);
      
      // Simple connection with minimal delay
      if (isResuming) {
        console.log('🔄 Attempting resumption...');
        // Small delay to ensure component is ready
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      await (connect as any)({});
      const successMessage = isResuming ? 'Session resumed successfully' : 'Session started successfully';
      console.log(successMessage);
      // Notify parent immediately to close overlay/show chat
      try { 
        if (onConnected) {
          setHasCalledOnConnected(true);
          onConnected(); 
        }
      } catch {}
      
      // Let the Controls component or user interaction unmute / resume to avoid premature socket usage
      
      // For resumption, stay on current page
      if (isResuming) {
        console.log('🔄 Resumption complete, staying on chat page');
        return;
      }
      
      // For new sessions, redirect to home
      router.push('/');
    } catch (error) {
      console.error('Connection failed:', error);
      
      if (isResuming) {
        // If resumption fails, fall back to new session
        console.log('❌ Resumption failed, falling back to new session');
        setConnectionError('Could not resume session. Starting new session...');
        localStorage.removeItem('previousSessionIdToResume');
        // Reload the page to start fresh
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setConnectionError('Failed to start session. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle connection status changes
  useEffect(() => {
    if (status.value === "connected") {
      setConnectionError(null);
    }
  }, [status.value]);

  // Update session when disconnected
  useEffect(() => {
    const updateSession = async () => {
      if (status.value !== "connected" && currentSessionId && startTime) {
        try {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          const { error } = await fetchWithRetry(() => 
            Promise.resolve(supabase
              .from('chat_sessions')
              .update({
                duration,
                status: 'completed'
              })
              .eq('id', currentSessionId))
          );

          if (error) throw error;
          localStorage.removeItem('currentChatSessionId');
          setCurrentSessionId(null);
          setStartTime(null);
        } catch (error) {
          console.error('Error updating chat session:', error);
        }
      }
    };

    updateSession();
  }, [status.value, currentSessionId, startTime]);

  // Don't render if we've successfully called onConnected - parent will handle the UI
  if (hasCalledOnConnected) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        {isConnecting ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg">{isResuming ? 'Resuming session...' : 'Starting new session...'}</p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500">Retry attempt {retryCount} of {MAX_RETRIES}</p>
            )}
          </div>
        ) : connectionError ? (
          <div className="space-y-4">
            <p className="text-lg text-red-500">{connectionError}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">{isResuming ? 'Session resumed successfully!' : 'Session started successfully!'}</p>
            <p className="text-sm text-gray-500">Redirecting to chat...</p>
          </div>
        )}
      </div>
    </div>
  );
} 