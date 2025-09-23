'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { VoiceProvider } from '@/components/VoiceProvider';
import Messages from '@/components/Messages';
import Controls from '@/components/Controls';
import Rechat from '@/components/Rechat';
import { useVoice } from '@humeai/voice-react';
import supabase from '@/supabaseClient';
// Removed unused import getClientAccessToken
import ResumptionContext from '@/contexts/ResumptionContext';
import AutoReload from "@/components/AutoReload";

function ChatContent({ 
  showRechatModal, 
  previousSessionId, 
  onVoiceSelect, 
  shouldShowChat,
  isResuming
}: { 
  showRechatModal: boolean;
  previousSessionId: string | null;
  onVoiceSelect: (configId: string) => void;
  shouldShowChat: boolean;
  isResuming: boolean;
}) {
  const [resumptionFailed, setResumptionFailed] = React.useState(false);
  
  // Listen for resumption failures
  React.useEffect(() => {
    if (showRechatModal && !isResuming && previousSessionId) {
      // If we're showing the modal but not resuming anymore, it likely failed
      setResumptionFailed(true);
    } else {
      setResumptionFailed(false);
    }
  }, [showRechatModal, isResuming, previousSessionId]);

  const handleManualResumption = () => {
    console.log('🔄 Manual resumption triggered by user');
    setResumptionFailed(false);
    // Force a page reload to restart the resumption process with fresh audio context
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-col flex-1">
        {shouldShowChat ? (
          <main className="flex-1 flex flex-col">
            <Messages sessionId={previousSessionId} />
            <Controls />
          </main>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              {resumptionFailed ? (
                <>
                  <p className="text-lg font-medium">Audio Initialization Issue</p>
                  <p className="text-muted-foreground max-w-md">
                    Session resumption encountered an audio initialization problem. 
                    This sometimes happens due to browser audio context restrictions.
                  </p>
                  <button 
                    onClick={handleManualResumption}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Try Resume Again
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">Preparing Chat</p>
                  <p className="text-muted-foreground">Setting up your conversation...</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {showRechatModal && (
        <Rechat 
          onVoiceSelect={onVoiceSelect} 
          previousSessionId={previousSessionId || ''} 
          isResuming={isResuming}
        />
      )}
    </div>
  );
}

function VoiceConnection({
  showRechatModal,
  previousSessionId,
  onVoiceSelect,
  isResuming,
  wasRecentlyResumed,
  setIsResuming,
  setWasRecentlyResumed,
  setShowRechatModal,
  setShouldShowChat,
  onResumptionFallback
}: {
  showRechatModal: boolean;
  previousSessionId: string | null;
  onVoiceSelect: (configId: string) => void;
  isResuming: boolean;
  wasRecentlyResumed: boolean;
  setIsResuming: (value: boolean) => void;
  setWasRecentlyResumed: (value: boolean) => void;
  setShowRechatModal: (value: boolean) => void;
  setShouldShowChat: (value: boolean) => void;
  onResumptionFallback: () => void;
}) {
  const { status } = useVoice();

  React.useEffect(() => {
    console.log('🔗 Connection status changed:', status.value);
    console.log('🎭 Current modal state:', { showRechatModal, isResuming, wasRecentlyResumed });
    console.log('📊 DETAILED STATUS INFO:', {
      statusValue: status.value,
      statusType: typeof status.value,
      statusObject: status,
      microphoneActive: '(check browser indicators)',
      timestamp: new Date().toISOString()
    });
    
    if (status.value === 'connected') {
      console.log('🎊🎊🎊 STATUS SHOWS CONNECTED! 🎊🎊🎊');
      console.log('✅ Connection established, closing Rechat modal');
      setShowRechatModal(false);
      console.log('🧹 Clearing resumption state');
      
      // Set wasRecentlyResumed BEFORE clearing isResuming for resumption scenarios
      if (isResuming) {
        console.log('🕒 Setting wasRecentlyResumed flag for post-resumption grace period');
        setWasRecentlyResumed(true);
      }
      setIsResuming(false);
      
      // Clear the recently resumed flag after a longer grace period for audio stabilization
      if (wasRecentlyResumed || isResuming) {
        console.log('🕒 Starting extended grace period for audio stabilization');
        setTimeout(() => {
          console.log('🕒 Clearing recently resumed flag after extended grace period');
          setWasRecentlyResumed(false);
        }, 30000); // 30 second grace period for audio stabilization
      }
      
      // Restore session ID to localStorage if it's missing
      if (previousSessionId) {
        const currentSessionId = localStorage.getItem('currentChatSessionId');
        if (!currentSessionId) {
          console.log('🔧 Restored session ID:', previousSessionId);
          localStorage.setItem('currentChatSessionId', previousSessionId);
        }

        // If VoiceProvider stored Hume IDs temporarily before we restored sessionId,
        // apply them now so the database stays in sync
        const pendingChatId = sessionStorage.getItem('pendingHumeChatId');
        const pendingChatGroupId = sessionStorage.getItem('pendingHumeChatGroupId');
        if (pendingChatId && pendingChatGroupId && typeof window !== 'undefined' && (window as any).applyPendingHumeIds) {
          console.log('🔄 Applying pending Hume IDs after session restoration');
          (window as any).applyPendingHumeIds(previousSessionId)
            .catch((err: any) => console.error('❌ Failed to apply pending Hume IDs:', err));
        }
      }
      
      console.log('✅ Chat should now be visible');
      setShouldShowChat(true);

      // (Auto-unmute now handled inside Controls component to avoid invalid hook usage)
    } else if (status.value === 'error') {
      if (isResuming || wasRecentlyResumed) {
        console.log('⚠️ Error during/after resumption, implementing recovery strategy...', {
          isCurrentlyResuming: isResuming,
          wasRecentlyResumed: wasRecentlyResumed,
          errorType: 'connection_error'
        });
        
        // Much more aggressive timeout for resumption - if it doesn't work quickly, abandon it
        setTimeout(() => {
          console.log('❌ Resumption failed, forcing fallback to new session');
          onResumptionFallback();
        }, 5000); // Much shorter - 5 seconds total
      } else {
        console.log('❌ Connection error in new session, showing error state');
        setShouldShowChat(false);
        setShowRechatModal(true);
      }
    } else if (status.value === 'disconnected' || status.value === 'connecting') {
      console.log('⏳ Connection state:', status.value, '- ensuring chat is visible');
      
      // Don't show chat as visible during resumption attempts that are failing
      if (isResuming && status.value === 'disconnected') {
        console.log('🔄 Resumption in progress, keeping modal visible');
        setShouldShowChat(false);
      } else {
        setShouldShowChat(true);
      }
    }
  }, [status.value, isResuming, wasRecentlyResumed, setShowRechatModal, setIsResuming, setShouldShowChat, previousSessionId, setWasRecentlyResumed, onResumptionFallback]);

  return (
    <ChatContent
      showRechatModal={showRechatModal}
      previousSessionId={previousSessionId}
      onVoiceSelect={onVoiceSelect}
      shouldShowChat={!showRechatModal}
      isResuming={isResuming}
    />
  );
}

function ChatPage() {
  // ============ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY LOGIC ============
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [resumedChatGroupId, setResumedChatGroupId] = React.useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showRechatModal, setShowRechatModal] = React.useState(false);
  const [shouldShowChat, setShouldShowChat] = React.useState(false);
  const [previousSessionId, setPreviousSessionId] = React.useState<string | null>(null);
  
  // Local resumption state management (instead of using non-existent useResumption hook)
  const [isResuming, setIsResuming] = React.useState(false);
  const [wasRecentlyResumed, setWasRecentlyResumed] = React.useState(false);
  
  // Add countdown state for 65-second delay
  const [resumptionCountdown, setResumptionCountdown] = React.useState<number | null>(null);

  // FIXED: Move voice provider debugging hooks to top level
  const [voiceProviderKey] = React.useState(() => {
    // Use a completely stable key that never changes during development
    // This prevents VoiceProvider remounting during Hot Refresh
    const stableKey = 'voice-provider-stable-session';
    
    console.log('🔧 Using stable VoiceProvider key:', stableKey);
    return stableKey;
  });
  
  // Add a ref to track if we've already rendered the VoiceProvider
  const voiceProviderRenderedRef = React.useRef(false);
  
  // Memoize the VoiceProvider props to prevent remounting
  const voiceProviderProps = React.useMemo(() => {
    if (!accessToken) return null;
    
    // Ensure we always have a valid voice config
    let finalConfigId = selectedVoice;
    
    // Check for fallback voice config if selectedVoice is not set
    if (!finalConfigId) {
      const fallbackConfig = typeof window !== 'undefined' ? sessionStorage.getItem('fallbackVoiceConfig') : null;
      if (fallbackConfig) {
        console.log('🔄 Using fallback voice config in props:', fallbackConfig);
        finalConfigId = fallbackConfig;
      } else {
        // Ultimate fallback to default male voice
        console.log('🎤 Using ultimate fallback to male voice config');
        finalConfigId = '0ea8bb7d-ef50-4174-ae64-be7a621db425';
      }
    }
    
    // Create a stable auth object that only changes when the actual token value changes
    const authObject = {
      type: "accessToken" as const,
      value: accessToken
    };
    
    const props = {
      auth: authObject,
      resumedChatGroupId: resumedChatGroupId || undefined,
      configId: finalConfigId
    };
    
    // Log when props actually change (only after first render)
    if (voiceProviderRenderedRef.current) {
      console.log('🔧 VoiceProvider props changed:', {
        hasAccessToken: !!accessToken,
        resumedChatGroupId,
        selectedVoice,
        finalConfigId,
        timestamp: new Date().toISOString()
      });
    }
    
    return props;
  }, [accessToken, resumedChatGroupId, selectedVoice]);
  
  // Track when VoiceProvider is being rendered
  React.useEffect(() => {
    if (voiceProviderProps && !voiceProviderRenderedRef.current) {
      voiceProviderRenderedRef.current = true;
      console.log('🔧 VoiceProvider first render detected');
    }
  }, [voiceProviderProps]);

  // More stable check for access token changes using string comparison
  const prevAccessTokenValueRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    const currentTokenValue = accessToken;
    const prevTokenValue = prevAccessTokenValueRef.current;
    
    if (prevTokenValue !== currentTokenValue) {
      console.log('🔧 Access token changed:', {
        from: prevTokenValue ? 'exists' : 'null',
        to: currentTokenValue ? 'exists' : 'null',
        same: prevTokenValue === currentTokenValue,
        currentKey: voiceProviderKey,
        actualValueChanged: true
      });
      prevAccessTokenValueRef.current = currentTokenValue;
    }
  }, [accessToken, voiceProviderKey]);

  // Add cleanup when navigating away from chat page - MOVED TO TOP LEVEL
  React.useEffect(() => {
    // Only set up cleanup if we have voiceProviderProps AND we're not in initial loading state
    if (!voiceProviderProps || isLoading) {
      return;
    }

    const handleBeforeUnload = () => {
      // Clean up any active voice sessions when leaving the page
      console.log('🧹 Chat page unloading - cleaning up voice session');
      localStorage.removeItem('previousSessionIdToResume');
      sessionStorage.removeItem('resumptionTriggered');
      sessionStorage.removeItem('hotRefreshSessionId');
    };

    const handleVisibilityChange = () => {
      // Only run cleanup if the page is actually hidden and we have an active session
      if (document.hidden && voiceProviderProps && !isLoading) {
        console.log('🧹 Chat page hidden - user likely navigated away');
        // Don't immediately disconnect as this could be a tab switch
        // But prepare for cleanup after a delay
        setTimeout(() => {
          if (document.hidden) {
            console.log('🧹 Page still hidden after delay - cleaning up session data');
            localStorage.removeItem('previousSessionIdToResume');
            sessionStorage.removeItem('resumptionTriggered');
          }
        }, 5000); // 5 second delay
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Don't call handleBeforeUnload() on component unmount as it clears resumption data
      // Only clean up when the user actually leaves the page (beforeunload event)
    };
  }, [voiceProviderProps, isLoading]);

  // ============ END HOOKS SECTION ============

  // Debug functions
  React.useEffect(() => {
    console.log('🔧 DEBUG: Added window.debugSessionResumption() function');
    console.log('🔧 DEBUG: Usage: debugSessionResumption("your-session-id")');
    console.log('🔧 DEBUG: Added window.debugSocketDisconnection() function for socket issues');
    console.log('🔧 DEBUG: Added window.emergencyDisconnect() function to force stop voice sessions');
    
    (window as any).debugSessionResumption = (sessionId: string) => {
      console.log('🔍 Debug resumption for session:', sessionId);
      localStorage.setItem('previousSessionIdToResume', sessionId);
      window.location.reload();
    };
    
    (window as any).debugSocketDisconnection = () => {
      console.log('🔍 Debug socket disconnection logs');
      // Add socket debugging logic here
    };

    // EMERGENCY DISCONNECT: Force stop all voice sessions
    (window as any).emergencyDisconnect = () => {
      console.log('🚨 EMERGENCY DISCONNECT: Forcing stop of all voice sessions');
      
      // Stop speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('🔇 Stopped speech synthesis');
      }
      
      // Stop all WebRTC audio streams
      navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
          stream.getTracks().forEach(track => {
            track.stop();
            console.log('🔇 Stopped WebRTC audio track');
          });
        })
        .catch(() => console.log('🔇 No active WebRTC streams'));
      
      // Clear voice-related localStorage (preserve auth)
      const authKeys = ['supabase.auth.token', 'sb-', 'auth.'];
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !authKeys.some(authKey => key.includes(authKey))) {
          // Only remove non-auth keys
          if (key.includes('session') || key.includes('voice') || key.includes('chat') || key.includes('resumption')) {
            toRemove.push(key);
          }
        }
      }
      toRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear session storage
      sessionStorage.clear();
      
      console.log('✅ Emergency disconnect complete');
      console.log('📍 Navigate away from /chat page to complete cleanup');
    };
    
    // Hot Refresh detection and session preservation
    const preservedSessionId = sessionStorage.getItem('hotRefreshSessionId');
    if (preservedSessionId && !localStorage.getItem('previousSessionIdToResume')) {
      console.log('🔥 Hot Refresh detected - restoring session ID:', preservedSessionId);
      localStorage.setItem('previousSessionIdToResume', preservedSessionId);
    }
  }, []);

  // Add cleanup for cached tokens
  React.useEffect(() => {
    const cleanup = () => {
      // Clear cached tokens when the page is about to be unloaded
      // This prevents stale tokens from persisting too long
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('humeAccessToken');
        console.log('🧹 Cleared cached access token on page unload');
      }
    };
    
    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);

  // Fetch access token
  React.useEffect(() => {
    // Check if we already have a cached access token
    const cachedToken = typeof window !== 'undefined' ? sessionStorage.getItem('humeAccessToken') : null;
    if (cachedToken && !accessToken) {
      console.log('🔍 Using cached access token from sessionStorage');
      setAccessToken(cachedToken);
      return;
    }
    
    // Skip if we already have an access token
    if (accessToken) {
      console.log('🔍 Access token already exists, skipping fetch');
      return;
    }
    
    console.log('🔑 Fetching access token for chat...');
    
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('/api/access-token');
        console.log('🔍 Access token API response status:', response.status, response.ok);
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('🔍 Access token API response data:', responseData);
          console.log('🔍 Access token field value:', responseData.accessToken);
          console.log('🔍 Access token type:', typeof responseData.accessToken);
          
          // Cache the token in sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('humeAccessToken', responseData.accessToken);
            console.log('💾 Cached access token in sessionStorage');
          }
          
          setAccessToken(responseData.accessToken);
          console.log('✅ Access token fetched successfully: Token received');
          console.log('🔍 Access token set to state:', responseData.accessToken ? 'has value' : 'is null/undefined');
        } else {
          console.error('❌ Failed to fetch access token:', response.status);
          setError('Failed to get access token. Please refresh the page.');
        }
      } catch (err) {
        console.error('❌ Error fetching access token:', err);
        setError('Network error. Please check your connection and refresh.');
      }
    };

    fetchAccessToken();
  }, []); // Empty dependency array to prevent re-fetching

  // Fetch resumption data once access token is available
  React.useEffect(() => {
    if (!accessToken) {
      console.log('⏳ Waiting for access token before checking resumption data...');
      return;
    }

    const fetchResumptionData = async () => {
      try {
        console.log('🚀 Starting fetchResumptionData with accessToken');
        
        // Check for preserved voice config from fallback FIRST
        const fallbackVoiceConfig = sessionStorage.getItem('fallbackVoiceConfig');
        if (fallbackVoiceConfig) {
          console.log('🔄 Found preserved voice config from fallback (early check):', fallbackVoiceConfig);
          setSelectedVoice(fallbackVoiceConfig);
          // Don't remove it yet - let the normal flow handle cleanup
        } else if (!selectedVoice) {
          // Set default voice config if none is selected and no fallback
          console.log('🎤 Setting default voice config (male voice)');
          setSelectedVoice('0ea8bb7d-ef50-4174-ae64-be7a621db425'); // Default to male voice
        }
        
        const prevSessionId = localStorage.getItem('previousSessionIdToResume');
        if (prevSessionId) {
          console.log('🔍 Checking resumption data for session:', prevSessionId);
          
          // Implement timeout for the entire resumption data fetch operation
          const fetchTimeout = setTimeout(() => {
            console.log('⏰ Resumption data fetch taking too long, proceeding with fresh session');
            localStorage.removeItem('previousSessionIdToResume');
            setIsLoading(false);
            setShowRechatModal(false);
          }, 180000); // 180 second timeout - longer than 120s countdown
          
          // Create a reasonable timeout to prevent infinite loading
          const safetyTimeout = setTimeout(() => {
            console.log('🚨 Safety timeout triggered - falling back to new session');
            localStorage.removeItem('previousSessionIdToResume');
            setIsLoading(false);
            setShowRechatModal(false);
          }, 30000); // 30 second timeout
          
          try {
            console.log('📡 Fetching session data for resumption...');
            
            // Query for the session data
            const { data: sessionData, error: sessionError } = await supabase
              .from('chat_sessions')
              .select(`
                id,
                hume_chat_group_id,
                title,
                created_at,
                status,
                user_id
              `)
              .eq('id', prevSessionId)
              .maybeSingle();
            
            clearTimeout(fetchTimeout);
            clearTimeout(safetyTimeout);
            
            console.log('✅ Database query result:', {
              hasData: !!sessionData,
              hasError: !!sessionError,
              errorCode: sessionError && typeof sessionError === 'object' && 'code' in sessionError ? sessionError.code : undefined,
              errorMessage: sessionError?.message || (typeof sessionError === 'string' ? sessionError : 'Unknown error'),
              sessionData: sessionData ? {
                id: sessionData.id,
                hasHumeChatGroupId: !!sessionData.hume_chat_group_id,
                status: sessionData.status,
                created: sessionData.created_at
              } : null
            });
            
            if (sessionError) {
              console.error('❌ Database error fetching session:', sessionError);
              throw new Error(`Database error: ${sessionError.message}`);
            }
            
            // Handle case where session doesn't exist at all
            if (!sessionData) {
              console.log('❌ Session not found in database - likely stale localStorage data');
              console.log('🧹 Clearing stale resumption data and starting fresh session');
              localStorage.removeItem('previousSessionIdToResume');
              localStorage.removeItem('currentChatSessionId');
              setShowRechatModal(false);
              setIsLoading(false);
              return;
            }
            
            // Handle case where session exists but has no Hume chat group ID
            if (!sessionData.hume_chat_group_id) {
              console.log('⚠️ Session exists but has no Hume chat group ID:', {
                sessionId: sessionData.id,
                status: sessionData.status,
                created: sessionData.created_at,
                title: sessionData.title
              });
              console.log('💡 This session was likely created but never got Hume metadata');
              console.log('🔧 Possible causes:');
              console.log('   - Session ended before VoiceProvider could store Hume IDs');
              console.log('   - Database error during Hume ID storage');
              console.log('   - VoiceProvider crash or Hot Refresh during initialization');
              console.log('🧹 Clearing resumption data - this session cannot be resumed');
              localStorage.removeItem('previousSessionIdToResume');
              setShowRechatModal(false);
              setIsLoading(false);
              return;
            }
            
            // Session exists and has Hume chat group ID - proceed with resumption
            console.log('✅ Found resumable session:', {
              sessionId: sessionData.id,
              chatGroupId: sessionData.hume_chat_group_id,
              title: sessionData.title,
              created: sessionData.created_at
            });
            
            console.log('🎤 Fetching original voice configuration for resumption...');
            
            // Get user's voice configuration
            let user = null;
            try {
              const { data: { user: userData } } = await supabase.auth.getUser();
              user = userData;
            } catch (authError: any) {
              if (authError?.message === 'Auth session missing!') {
                console.log('No auth session - skipping voice config fetch');
                // Continue without user data
              } else {
                console.error('Auth error:', authError);
                throw authError; // Re-throw other auth errors
              }
            }
            
            if (user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('voice_config_id')
                .eq('id', user.id)
                .single();
            
              console.log('✅ Found voice config in profile:', profile?.voice_config_id);
            
            if (profile?.voice_config_id) {
              // Check if the voice config exists in our environment
              const envVoiceConfigs = Object.values({
                male: process.env.NEXT_PUBLIC_HUME_MALE_CONFIG_ID,
                female: process.env.NEXT_PUBLIC_HUME_FEMALE_CONFIG_ID,
                calm: process.env.NEXT_PUBLIC_HUME_CALM_CONFIG_ID,
                energetic: process.env.NEXT_PUBLIC_HUME_ENERGETIC_CONFIG_ID,
                professional: process.env.NEXT_PUBLIC_HUME_PROFESSIONAL_CONFIG_ID,
                friendly: process.env.NEXT_PUBLIC_HUME_FRIENDLY_CONFIG_ID,
                sass: process.env.NEXT_PUBLIC_HUME_SASS_CONFIG_ID,
                jacksparrow: process.env.NEXT_PUBLIC_HUME_JACKSPARROW_CONFIG_ID
              }).filter(Boolean);

              // Whopper
              
              console.log('🔍 Environment voice configs check:', {
                envVoiceConfigs,
                profileConfigId: profile.voice_config_id,
                isMatch: envVoiceConfigs.includes(profile.voice_config_id)
              });
              
              if (envVoiceConfigs.includes(profile.voice_config_id)) {
                console.log('✅ Voice config is valid, using for resumption:', profile.voice_config_id);
                setSelectedVoice(profile.voice_config_id);
                
                // PRESERVE VOICE CONFIG for potential fallback
                console.log('💾 Preserving voice config for potential fallback');
                sessionStorage.setItem('fallbackVoiceConfig', profile.voice_config_id);
              } else {
                console.log('⚠️ Original voice config not found in environment, using fallback');
                console.log('Available configs:', envVoiceConfigs);
                console.log('Profile config:', profile.voice_config_id);
                
                // Use the first available config as fallback instead of skipping resumption
                const fallbackConfig = envVoiceConfigs[0] || '0ea8bb7d-ef50-4174-ae64-be7a621db425';
                console.log('🔄 Using fallback voice config:', fallbackConfig);
                setSelectedVoice(fallbackConfig);
                
                // PRESERVE FALLBACK VOICE CONFIG for potential future fallback
                console.log('💾 Preserving fallback voice config');
                sessionStorage.setItem('fallbackVoiceConfig', fallbackConfig);
              }
            } else {
              // No voice config in profile, preserve default for fallback
              console.log('💾 No voice config in profile, preserving default for fallback');
              sessionStorage.setItem('fallbackVoiceConfig', '0ea8bb7d-ef50-4174-ae64-be7a621db425');
            }
            }
            
            // Check if session is completed and fix it
            if (sessionData.status === 'completed') {
              console.log('⚠️ Session is marked as completed, updating to active for resumption...');
              try {
                const { error: updateError } = await supabase
                  .from('chat_sessions')
                  .update({ 
                    status: 'active',
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', prevSessionId);
                
                if (updateError) {
                  console.error('❌ Could not update session status:', updateError);
                } else {
                  console.log('✅ Session status updated to completed');
                }
              } catch (statusFixError) {
                console.log('⚠️ Could not fix session status (continuing anyway):', statusFixError);
              }
            }
            
            console.log('🔄 Setting up session resumption...');
            localStorage.setItem('currentChatSessionId', prevSessionId);
            console.log('💾 Set currentChatSessionId for resumption:', prevSessionId);
            
            console.log('🔄 Setting up resumption directly - chat groups auto-expire after 5 minutes of inactivity');
            setError(null);
            
            // Step 1: Clear any existing resumption data to prevent conflicts
            sessionStorage.removeItem('e0717RetryCount');
            sessionStorage.removeItem('e0717RetryAttempt');
            
            // Step 2: Set up immediate resumption after chat group verification
            console.log('✅ Proceeding with resumption after chat group verification');
            setResumedChatGroupId(sessionData.hume_chat_group_id);
            setPreviousSessionId(prevSessionId);
            setIsResuming(true);
            setShowRechatModal(true);
            setIsLoading(false);
          } catch (error) {
            console.error('❌ Error fetching resumption data:', error);
            
            if (error instanceof Error && error.message === 'Database query timeout') {
              console.log('⏰ Database query timed out, clearing resumption data');
              setError('Database connection timeout. Please try again.');
            } else {
              console.log('💥 Unexpected error during resumption data fetch');
            }
            
            localStorage.removeItem('previousSessionIdToResume');
            setShowRechatModal(false);
          }
        } else {
          console.log('🆕 No resumption data found, starting new session');
          
          // Check if there's a preserved voice config from fallback
          const fallbackVoiceConfig = sessionStorage.getItem('fallbackVoiceConfig');
          if (fallbackVoiceConfig) {
            console.log('🔄 Found preserved voice config from fallback:', fallbackVoiceConfig);
            setSelectedVoice(fallbackVoiceConfig);
            sessionStorage.removeItem('fallbackVoiceConfig'); // Clean up after use
          }
          
          setShowRechatModal(false);
        }
      } catch (error) {
        console.error('❌ Critical error in fetchResumptionData:', error);
        setError('Failed to initialize chat. Please refresh the page.');
      } finally {
        console.log('🏁 fetchResumptionData completed');
        setIsLoading(false);
      }
    };

    fetchResumptionData();
  }, [accessToken]);

  const handleVoiceSelect = (configId: string) => {
    setSelectedVoice(configId);
  };

  const resumptionContextValue = React.useMemo(() => ({
    isResuming,
    wasRecentlyResumed,
    setIsResuming,
    setWasRecentlyResumed
  }), [isResuming, wasRecentlyResumed]);

  // Fallback handler for when resumption fails critically
  const handleResumptionFallback = () => {
    console.log('🔄 handleResumptionFallback: Falling back to new session.');
    
    // PRESERVE the voice config before clearing everything
    const currentVoiceConfig = selectedVoice || sessionStorage.getItem('fallbackVoiceConfig');
    if (currentVoiceConfig) {
      console.log('💾 Preserving voice config before fallback:', currentVoiceConfig);
      sessionStorage.setItem('fallbackVoiceConfig', currentVoiceConfig);
    }
    
    // Clear all resumption state immediately
    localStorage.removeItem('previousSessionIdToResume');
    sessionStorage.removeItem('resumptionTriggered');
    sessionStorage.removeItem('resumptionStartTime');
    localStorage.removeItem('currentChatSessionId');
    setIsResuming(false);
    setWasRecentlyResumed(false);
    setResumedChatGroupId(null);
    setPreviousSessionId(null);
    
    // Force a clean restart
    console.log('🔄 Forcing page reload for clean session start with preserved voice config');
    window.location.replace('/chat');
  };

  return (
    <div className="h-full w-full">
      <AutoReload />

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Initializing...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      ) : voiceProviderProps ? (
        <ResumptionContext.Provider value={resumptionContextValue}>
          <VoiceProvider {...voiceProviderProps}>
            <VoiceConnection
              showRechatModal={showRechatModal}
              previousSessionId={previousSessionId}
              onVoiceSelect={handleVoiceSelect}
              isResuming={isResuming}
              wasRecentlyResumed={wasRecentlyResumed}
              setIsResuming={setIsResuming}
              setWasRecentlyResumed={setWasRecentlyResumed}
              setShowRechatModal={setShowRechatModal}
              setShouldShowChat={setShouldShowChat}
              onResumptionFallback={handleResumptionFallback}
            />
          </VoiceProvider>
        </ResumptionContext.Provider>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Preparing Voice Connection...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with proper client-side only rendering
export default dynamic(() => Promise.resolve(ChatPage), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
}); 