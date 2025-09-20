"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RestartCall from "@/components/RestartCall";
import { VoiceProvider } from "@/components/VoiceProvider";
import { getClientAccessToken } from "@/utils/getClientAccessToken";

interface EmotionData {
  name: string;
  score: number;
}

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  emotion_data: EmotionData[] | null;
  created_at: string;
}

interface ChatSession {
  id: string;
  title: string;
  summary: string;
  created_at: string;
}

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [hasResumeSupport, setHasResumeSupport] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getClientAccessToken();
      setAccessToken(token);
    };
    fetchAccessToken();
  }, []);

  useEffect(() => {
    const getSessionId = async () => {
      const { id } = await params;
      setSessionId(id);
    };
    getSessionId();
  }, [params]);

  useEffect(() => {
    if (!sessionId) return;
    
    const fetchSession = async () => {
      try {
        // Fetch session details including Hume chat group ID
        const { data: sessionData, error: sessionError } = await supabase
          .from('chat_sessions')
          .select('*, hume_chat_group_id')
          .eq('id', sessionId)
          .single();

        if (sessionError) throw sessionError;
        setSession(sessionData);
        
        // Check if session supports resumability
        setHasResumeSupport(!!sessionData.hume_chat_group_id);

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_session_id', sessionId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleContinueSession = async () => {
    try {
      if (!session?.id) {
        throw new Error('Session ID not found');
      }
      
      setIsRestoring(true);
      
      console.log('🔄 Attempting to continue session:', session.id);
      
      // If session doesn't support resumability, start a new session
      if (!hasResumeSupport) {
        console.log('📝 Legacy session detected, starting new session instead');
        router.push('/chat');
        return;
      }
      
      // Fetch the session data to get Hume chat group ID
      const { data: sessionData, error } = await supabase
        .from('chat_sessions')
        .select('hume_chat_group_id, title, created_at')
        .eq('id', session.id)
        .single();

      if (error) {
        console.error('❌ Error fetching session data:', error);
        throw new Error('Failed to fetch session data');
      }

      console.log('📊 Session data for continuation:', sessionData);

      if (!sessionData?.hume_chat_group_id) {
        throw new Error('This session cannot be resumed. It may have been created before the resumability feature was available, or the session data is incomplete.');
      }
      
      console.log('✅ Found Hume chat group ID, preparing for resumption:', sessionData.hume_chat_group_id);
      
      // Store session data in localStorage for resumption
      localStorage.setItem('previousSessionIdToResume', session.id);
      
      // Add a small delay to ensure localStorage is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🚀 Redirecting to chat page for session resumption');
      
      // Redirect to chat page which will handle the resumption
      router.push('/chat');
    } catch (error) {
      console.error('❌ Error continuing session:', error);
      setIsRestoring(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Unable to continue session: ${errorMessage}`);
    }
  };

  if (loading || !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
        <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isRestoring ? (
        <VoiceProvider auth={{ type: "accessToken", value: accessToken! }}>
          <RestartCall onVoiceSelect={() => {}} />
        </VoiceProvider>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-gray-500">
                Created on {new Date(session.created_at).toLocaleDateString()}
              </p>
              {hasResumeSupport ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Resumable
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  📜 Legacy Session
                </span>
              )}
            </div>
            {session.summary && (
              <p className="mt-4 text-gray-700">{session.summary}</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary/10 ml-auto"
                    : "bg-gray-100"
                } max-w-[80%]`}
              >
                <p className="text-sm text-gray-500 mb-1">
                  {message.role === "user" ? "You" : "Assistant"}
                </p>
                <p>{message.content}</p>
                {message.role === "user" && message.emotion_data && Array.isArray(message.emotion_data) && message.emotion_data.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Emotions detected:</p>
                    <ul className="list-disc list-inside">
                      {message.emotion_data.map((emotion, index) => (
                        <li key={index}>
                          {emotion.name}: {Math.round(emotion.score * 100)}%
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleContinueSession}
                disabled={isRestoring || !session.id}
                className="relative"
              >
                {isRestoring ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {hasResumeSupport ? 'Resuming Session...' : 'Starting New Session...'}
                  </>
                ) : hasResumeSupport ? (
                  'Resume Session'
                ) : (
                  'Start New Session'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                disabled={isRestoring}
              >
                Return to Dashboard
              </Button>
            </div>
            {!hasResumeSupport && (
              <p className="text-sm text-gray-500">
                💡 This is a legacy session that cannot be resumed. Clicking "Start New Session" will begin a fresh conversation.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
} 