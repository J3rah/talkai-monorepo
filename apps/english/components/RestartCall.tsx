"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { useState, useEffect, useCallback } from "react";
import supabase from "@/supabaseClient";
import { useRouter } from "next/navigation";

interface RestartCallProps {
  onVoiceSelect: (configId: string) => void;
}

export default function RestartCall({ onVoiceSelect }: RestartCallProps) {
  const router = useRouter();
  const { connect, disconnect, status } = useVoice();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  const handleConnect = useCallback(async () => {
    if (isConnecting || hasAttemptedConnection) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    setHasAttemptedConnection(true);

    // Set a timeout for the connection attempt
    const connectionTimeout = setTimeout(() => {
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionError('Connection timed out. Please try again.');
        if (connectionAttempts >= 3) {
          router.push('/dashboard');
        }
      }
    }, 10000); // 10 second timeout

    try {
      console.log('Attempting to restore session...');
      await (connect as any)();
      console.log('Session restored successfully');
      clearTimeout(connectionTimeout);
      setIsRestoringSession(false);
      setConnectionAttempts(0);
      
      // Add a small delay before navigating
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/landing');
    } catch (error) {
      console.error('Failed to restore session:', error);
      clearTimeout(connectionTimeout);
      
      if (isRestoringSession && connectionAttempts < 3) {
        setConnectionAttempts(prev => prev + 1);
        // Add exponential backoff with a minimum delay
        const delay = Math.max(1000 * Math.pow(2, connectionAttempts), 1000);
        setTimeout(() => {
          setHasAttemptedConnection(false);
          handleConnect();
        }, delay);
      } else {
        setIsRestoringSession(false);
        setConnectionError('Failed to restore session. Please try again.');
        router.push('/dashboard');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [connect, isConnecting, isRestoringSession, connectionAttempts, router, hasAttemptedConnection]);

  // Check for restored session on mount and auto-connect
  useEffect(() => {
    const initializeSession = async () => {
      const restoredSession = localStorage.getItem('restoredSession');
      if (restoredSession && !isInitialized) {
        const { sessionId } = JSON.parse(restoredSession);
        if (sessionId) {
          setIsRestoringSession(true);
          setCurrentSessionId(sessionId);
          localStorage.setItem('currentTherapySessionId', sessionId);
          setStartTime(Date.now());
          setIsInitialized(true);
          
          // Add a small delay before attempting to connect
          await new Promise(resolve => setTimeout(resolve, 1000));
          handleConnect();
        }
      }
    };

    initializeSession();
  }, [isInitialized, handleConnect]);

  // Handle connection status changes
  useEffect(() => {
    if (status.value === "connected") {
      setIsRestoringSession(false);
      setConnectionAttempts(0);
      setConnectionError(null);
    } else if (status.value === "disconnected" && isRestoringSession && !isConnecting && !hasAttemptedConnection) {
      // Add a small delay before attempting to reconnect
      setTimeout(() => {
        handleConnect();
      }, 1000);
    }
  }, [status.value, isRestoringSession, isConnecting, handleConnect, hasAttemptedConnection]);

  // Prevent disconnection during session restoration
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRestoringSession) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRestoringSession]);

  useEffect(() => {
    const updateSessionDuration = async () => {
      if (status.value !== "connected" && currentSessionId && startTime && !isRestoringSession) {
        try {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          const { error } = await supabase
            .from('therapy_sessions')
            .update({
              duration,
              status: 'completed'
            })
            .eq('id', currentSessionId);

          if (error) throw error;
          localStorage.removeItem('currentTherapySessionId');
          setCurrentSessionId(null);
          setStartTime(null);
        } catch (error) {
          console.error('Error updating therapy session:', error);
        }
      }
    };

    updateSessionDuration();
  }, [status.value, currentSessionId, startTime, isRestoringSession]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        {isConnecting ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg">Restoring your session...</p>
            {connectionAttempts > 0 && (
              <p className="text-sm text-gray-500">Attempt {connectionAttempts} of 3</p>
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
            <p className="text-lg">Session restored successfully!</p>
            <p className="text-sm text-gray-500">Redirecting to chat...</p>
          </div>
        )}
      </div>
    </div>
  );
} 