"use client";

import { VoiceProvider as HumeVoiceProvider } from '@humeai/voice-react';
import { ReactNode, useEffect, useState } from 'react';
import supabase from "@/supabaseClient";

interface VoiceProviderProps {
  children: ReactNode;
  auth: {
    type: 'accessToken';
    value: string;
  };
  resumedChatGroupId?: string;
  configId?: string;
}

export function VoiceProvider({ children, auth, resumedChatGroupId, configId }: VoiceProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate auth token and browser compatibility before initializing
  useEffect(() => {
    const validateAndInit = async () => {
      try {
        if (!auth.value) {
          throw new Error('No auth token provided');
        }

        // Check for required browser APIs
        if (typeof window !== 'undefined') {
          if (!window.AudioContext && !(window as any).webkitAudioContext) {
            throw new Error('Browser does not support Web Audio API');
          }
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser does not support media devices API');
          }
        }
        
        // Add a small delay to ensure proper initialization
        setTimeout(() => {
          setIsReady(true);
        }, 100);
      } catch (err) {
        console.error('VoiceProvider initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize voice provider');
      }
    };

    validateAndInit();
  }, [auth.value]);

  // Helper to update Supabase with Hume chat IDs
  async function storeHumeChatIds(chatSessionId: string, humeChatId: string, humeChatGroupId: string) {
    try {
      console.log('🎯 Attempting to store Hume chat IDs:', {
        chatSessionId,
        humeChatId,
        humeChatGroupId,
        timestamp: new Date().toISOString()
      });

      const { error } = await supabase
        .from('chat_sessions')
        .update({
          hume_chat_id: humeChatId,
          hume_chat_group_id: humeChatGroupId,
        })
        .eq('id', chatSessionId);
      
      if (error) {
        console.error('❌ Failed to update chat session with Hume IDs:', error);
        throw error;
      }
      
      console.log('✅ Successfully stored Hume chat IDs for session:', chatSessionId);
    } catch (err) {
      console.error('❌ Error storing Hume chat IDs:', err);
      throw err;
    }
  }

  // Helper to store Hume chat IDs temporarily when session doesn't exist yet
  function storeTemporaryHumeIds(humeChatId: string, humeChatGroupId: string) {
    try {
      console.log('⏳ Storing Hume chat IDs temporarily (session not created yet):', {
        humeChatId,
        humeChatGroupId
      });
      sessionStorage.setItem('pendingHumeChatId', humeChatId);
      sessionStorage.setItem('pendingHumeChatGroupId', humeChatGroupId);
      console.log('✅ Temporarily stored Hume chat IDs in sessionStorage');
    } catch (err) {
      console.error('❌ Error storing temporary Hume chat IDs:', err);
    }
  }

  // Helper to apply pending Hume chat IDs when session is created
  async function applyPendingHumeIds(chatSessionId: string) {
    try {
      const pendingChatId = sessionStorage.getItem('pendingHumeChatId');
      const pendingChatGroupId = sessionStorage.getItem('pendingHumeChatGroupId');
      
      if (pendingChatId && pendingChatGroupId) {
        console.log('🔄 Applying pending Hume chat IDs to new session:', {
          chatSessionId,
          pendingChatId,
          pendingChatGroupId
        });
        
        await storeHumeChatIds(chatSessionId, pendingChatId, pendingChatGroupId);
        
        // Clean up temporary storage
        sessionStorage.removeItem('pendingHumeChatId');
        sessionStorage.removeItem('pendingHumeChatGroupId');
        console.log('🧹 Cleaned up temporary Hume chat IDs from sessionStorage');
      }
    } catch (err) {
      console.error('❌ Error applying pending Hume chat IDs:', err);
    }
  }

  // Expose the function globally so it can be called from Messages component
  useEffect(() => {
    (window as any).applyPendingHumeIds = applyPendingHumeIds;
    return () => {
      delete (window as any).applyPendingHumeIds;
    };
  }, []);

  // ===== Watchdog: retry applying pending Hume IDs for first 30 s =====
  useEffect(() => {
    // Only in the browser
    if (typeof window === 'undefined') return;

    const start = Date.now();
    const retryInterval = setInterval(async () => {
      const pendingChatId = sessionStorage.getItem('pendingHumeChatId');
      const pendingChatGroupId = sessionStorage.getItem('pendingHumeChatGroupId');
      const chatSessionId = localStorage.getItem('currentChatSessionId');

      if (pendingChatId && pendingChatGroupId && chatSessionId) {
        console.log('⏳ Watchdog: attempting to flush pending Hume IDs…');
        try {
          await applyPendingHumeIds(chatSessionId);
        } catch (err) {
          console.error('❌ Watchdog applyPendingHumeIds failed:', err);
        }
      }

      // Stop after 30 s
      if (Date.now() - start > 30000) {
        clearInterval(retryInterval);
      }
    }, 2000);

    return () => clearInterval(retryInterval);
  }, []);

  // Show loading state while initializing
  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Connecting voice service...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <HumeVoiceProvider
      auth={auth}
      configId={configId}
      resumedChatGroupId={resumedChatGroupId}
      onMessage={async (message) => {
        try {
          // Log message details for debugging
          console.log('🎙️ VoiceProvider received message:', {
            type: message.type,
            timestamp: new Date().toISOString(),
            hasContent: 'content' in (message as any),
            hasChatId: 'chatId' in (message as any),
            hasChatGroupId: 'chatGroupId' in (message as any)
          });
          
          // Store Hume chat IDs if chat_metadata is received
          if (message.type === 'chat_metadata') {
            const messageData = message as unknown as { chatId?: string; chatGroupId?: string };
            console.log('📋 Received chat_metadata:', {
              chatId: messageData.chatId,
              chatGroupId: messageData.chatGroupId,
              messageKeys: Object.keys(message)
            });

            const chatSessionId = localStorage.getItem('currentChatSessionId');
            console.log('🔍 Current chat session ID from localStorage:', chatSessionId);

            if (!messageData.chatId || !messageData.chatGroupId) {
              console.warn('⚠️ Missing Hume chat IDs in metadata:', {
                chatId: messageData.chatId,
                chatGroupId: messageData.chatGroupId
              });
              return;
            }

            if (!chatSessionId) {
              console.warn('⚠️ No currentChatSessionId found in localStorage when chat_metadata received');
              console.log('📝 Available localStorage keys:', Object.keys(localStorage));
              console.log('⏳ Storing Hume chat IDs temporarily for later application');
              storeTemporaryHumeIds(messageData.chatId, messageData.chatGroupId);
              return;
            }

            // Check if the session ID in localStorage is actually valid (not an old one)
            console.log('🔍 Checking if session ID in localStorage is current:', chatSessionId);
            console.log('📝 Hume chat IDs to store:', {
              chatId: messageData.chatId,
              chatGroupId: messageData.chatGroupId
            });
            
            // Verify that the session actually exists in the database
            try {
              const { data: sessionData, error: sessionError } = await supabase
                .from('chat_sessions')
                .select('id')
                .eq('id', chatSessionId)
                .single();
              
              if (sessionError || !sessionData) {
                console.warn('⚠️ Session ID in localStorage does not exist in database:', chatSessionId);
                console.log('⏳ Storing Hume chat IDs temporarily for later application');
                storeTemporaryHumeIds(messageData.chatId, messageData.chatGroupId);
                return;
              }
              
              console.log('✅ Session ID verified in database, proceeding with update');
            } catch (error) {
              console.error('❌ Error verifying session ID:', error);
              console.log('⏳ Storing Hume chat IDs temporarily for later application');
              storeTemporaryHumeIds(messageData.chatId, messageData.chatGroupId);
              return;
            }
            
            console.log('🚀 Storing Hume chat IDs for session:', chatSessionId);
            await storeHumeChatIds(chatSessionId, messageData.chatId, messageData.chatGroupId);
          }
        } catch (err) {
          console.error('❌ Error handling voice message:', err);
          // Don't throw error to prevent voice provider from breaking
        }
      }}
      onError={(error) => {
        console.error('VoiceProvider error:', error);
        try {
          (window as any).lastVoiceError = error;
          console.log('🔍 VoiceProvider error stored in window.lastVoiceError');
          console.log('🔍 Error (stringified):', JSON.stringify(error));
          
          // Handle specific error types with recovery attempts
          if (error.type === 'audio_error' && error.message?.includes('decodeAudioData')) {
            console.log('🔧 Audio context error detected, attempting recovery...');
            // The Hume SDK should handle this internally, but we log for debugging
          } else if (error.type === 'socket_error' && error.message?.includes('Socket is not open')) {
            console.log('🔧 Socket connection error, allowing Hume SDK to reconnect...');
            // The Hume SDK has built-in reconnection logic
          }
        } catch (e) {
          /* no-op if window is not available */
        }
        // Keep existing behaviour: do not set error state to avoid re-render loops
      }}
    >
      {children}
    </HumeVoiceProvider>
  );
} 