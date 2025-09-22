"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef, useEffect, useRef, useState, useCallback, useMemo } from "react";
import supabase from "@/supabaseClient";
import { generateSessionName } from "@/utils/sessionUtils";
import { shouldTriggerConfetti, triggerEmotionConfetti } from "@/utils/confetti";
import { getVoiceConfigurationById, getAgentInfoFromVoiceConfig } from "@/utils/voiceConfigUtils";
import SessionMessagesContext from '@/contexts/SessionMessagesContext';

// Flag to control optional initial greeting message
const ENABLE_INITIAL_GREETING = false;

interface MessagesProps {
  sessionId?: string | null;
  therapistName?: string;
  voiceConfigId?: string | null;
}

interface ChatMessage {
  type: "user_message" | "assistant_message";
  message: {
    content: string;
    role: string;
  };
  models?: {
    prosody?: {
      scores?: Record<string, number>;
    };
  };
}

const isChatMessage = (msg: unknown): msg is ChatMessage => {
  return (
    typeof msg === 'object' && msg !== null &&
    ('type' in msg) && ((msg as any).type === "user_message" || (msg as any).type === "assistant_message") &&
    typeof (msg as any).message?.content === "string" &&
    typeof (msg as any).message?.role === "string"
  );
};

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  MessagesProps
>(function Messages({ sessionId, therapistName, voiceConfigId }, _ref) {
  const { messages, status } = useVoice();
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const hasFetchedInitialRef = useRef(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevMessagesRef = useRef(messages);
  const scrollTimeoutRef = useRef<number | NodeJS.Timeout | null>(null);
  const sessionCreationRef = useRef<boolean>(false);
  const sessionCreationPromiseRef = useRef<Promise<void> | null>(null);

  // Add state to track if data saving is allowed
  const [isDataSavingAllowed, setIsDataSavingAllowed] = useState(true);

  // Add state for agent name from voice configuration
  const [agentName, setAgentName] = useState<string>("Talk Therapist");
  
  // Add state to track voice configuration info for session creation
  const [voiceConfigInfo, setVoiceConfigInfo] = useState<{
    configId: string;
    displayName: string;
    characterName: string;
  } | null>(null);

  // Character name mapping for voices
  const getCharacterName = (displayName: string, internalName: string): string => {
    // Map voice configurations to character names
    const characterMap: Record<string, string> = {
      'Male Voice': 'Zander',
      'Female Voice': 'Mia',
      'Calm Voice': 'Zen',
      'Energetic Voice': 'Spark',
      'Professional Voice': 'Dr. Williams',
      'Friendly Voice': 'Alex',
      'Sass': 'Sass',
      'The Pirate': 'Captain Jack',
    };

    // Try display name first, then internal name
    return characterMap[displayName] || characterMap[internalName] || displayName;
  };

  // Known configId -> display name fallback map (used if DB lookup fails)
  const CONFIG_ID_TO_DISPLAY: Record<string, string> = {
    // Trial defaults
    '793d1f15-4bf9-4beb-a4ab-a62caff84e70': 'Male Voice',
    '3a451da2-a50a-42c2-83fa-13c79f027643': 'Female Voice',
    // Legacy/defaults from StartCall
    '0ea8bb7d-ef50-4174-ae64-be7a621db425': 'Male Voice',
    '8a80af40-ec14-4da0-afeb-d11008491410': 'Energetic Voice',
    'a608626e-23e0-4070-8e24-dc880d34000b': 'The Pirate',
  };

  // Fetch voice configuration and set agent name
  useEffect(() => {
    const fetchAgentName = async () => {
      // Prefer a persisted configId from session storage (set by StartCall/TrialStartCall)
      let configId: string | null = voiceConfigId || null;
      let characterNameFromStorage: string | null = null;
      try {
        if (!configId) configId = sessionStorage.getItem('currentVoiceConfigId');
        characterNameFromStorage = sessionStorage.getItem('currentVoiceCharacterName');
      } catch (_ignoredError) {
        /* no-op */
      }
      if (!configId) return;

      // Get mapped display name for fallback
      const mappedDisplay = CONFIG_ID_TO_DISPLAY[configId];
      
      // Immediate best-effort fallback based on known config IDs (prevents flashing "Talk Therapist")
      // But prioritize custom therapist name if available
      if (therapistName && therapistName !== "Talk Therapist") {
        console.log('✅ Messages: Using custom therapist name (immediate):', therapistName);
        setAgentName(therapistName);
      } else if (characterNameFromStorage) {
        console.log('✅ Messages: Using character name from sessionStorage:', characterNameFromStorage);
        setAgentName(characterNameFromStorage);
      } else if (mappedDisplay) {
        const mappedCharacter = getCharacterName(mappedDisplay, mappedDisplay);
        if (mappedCharacter && mappedCharacter !== agentName) {
          setAgentName(mappedCharacter);
        }
      }
      
      try {
        console.log('🎵 Messages: Fetching voice configuration for configId:', configId);
        const voiceConfig = await getVoiceConfigurationById(configId);
        
        // Store voice configuration info for session creation
        if (voiceConfig) {
          const agentInfo = getAgentInfoFromVoiceConfig(voiceConfig);
          setVoiceConfigInfo({
            configId: agentInfo.configId,
            displayName: agentInfo.displayName,
            characterName: agentInfo.characterName
          });
        }
        
        // Prioritize voice configuration character name over custom therapist name
        if (voiceConfig?.character_name) {
          console.log('✅ Messages: Using character name from database:', voiceConfig.character_name, 'for voice config:', voiceConfig.display_name);
          setAgentName(voiceConfig.character_name);
        } else if (voiceConfig?.display_name) {
          const characterName = getCharacterName(voiceConfig.display_name, voiceConfig.internal_name);
          console.log('✅ Messages: Using character name from mapping:', characterName, 'from voice config:', voiceConfig.display_name);
          setAgentName(characterName);
        } else if (therapistName && therapistName !== "Talk Therapist") {
          console.log('✅ Messages: Using custom therapist name:', therapistName);
          setAgentName(therapistName);
        } else {
          console.log('⚠️ Messages: Voice config not found, using fallback mapping or therapist name');
          if (mappedDisplay) {
            const characterName = getCharacterName(mappedDisplay, mappedDisplay);
            setAgentName(characterName);
            // Set fallback voice config info
            setVoiceConfigInfo({
              configId: configId,
              displayName: mappedDisplay,
              characterName: characterName
            });
          } else {
            setAgentName(therapistName || "Talk Therapist");
          }
        }
      } catch (error) {
        console.error('❌ Messages: Error fetching voice configuration:', error);
        
        // Prioritize custom therapist name even in error case
        if (therapistName && therapistName !== "Talk Therapist") {
          console.log('✅ Messages: Using custom therapist name (error fallback):', therapistName);
          setAgentName(therapistName);
        } else if (mappedDisplay) {
          const characterName = getCharacterName(mappedDisplay, mappedDisplay);
          setAgentName(characterName);
        } else {
          setAgentName(therapistName || "Talk Therapist");
        }
      }
    };

    fetchAgentName();
  }, [therapistName, voiceConfigId]);

  // Check if data saving is allowed based on user subscription and preferences
  const checkDataSavingPermission = useCallback(async (userId: string) => {
    try {
      console.log('🔍 Checking data saving permission for user:', userId);
      
      // Get user profile with subscription status and data saving preference
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, data_saving_preference')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile for data saving check:', error);
        // Default to allowing data saving if we can't fetch profile
        setIsDataSavingAllowed(true);
        return true;
      }

      const subscriptionStatus = profile?.subscription_status || 'calm';
      // Keep the raw preference so we can distinguish between an explicit false and undefined (not set)
      const dataSavingPreference = profile?.data_saving_preference;

      console.log('📊 Data saving check results:', {
        subscriptionStatus,
        dataSavingPreference,
        userId
      });

      // Rules:
      // 1. Calm users: Never save data (regardless of preference)
      // 2. Centered/Grounded users: Save by default, unless the user has explicitly opted-out (data_saving_preference === false)
      let allowSaving = false;

      if (subscriptionStatus === 'calm') {
        allowSaving = false;
        console.log('🚫 Data saving disabled: Calm tier users cannot save data');
      } else if (subscriptionStatus === 'centered' || subscriptionStatus === 'grounded') {
        // If preference is undefined (not set) or true, allow saving. Only block when explicitly false.
        allowSaving = dataSavingPreference !== false;
        console.log(`${allowSaving ? '✅' : '🚫'} Data saving ${allowSaving ? 'enabled' : 'disabled'} for ${subscriptionStatus} tier. Explicit preference = ${dataSavingPreference}`);
      } else {
        allowSaving = false;
        console.log('🚫 Data saving disabled: Unknown subscription status');
      }

      setIsDataSavingAllowed(allowSaving);
      return allowSaving;
    } catch (error) {
      console.error('Error in checkDataSavingPermission:', error);
      // Default to allowing data saving on error
      setIsDataSavingAllowed(true);
      return true;
    }
  }, []);

  // Initialize data saving permission when component mounts
  useEffect(() => {
    const initializeDataSaving = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await checkDataSavingPermission(user.id);
      }
    };
    
    initializeDataSaving();
  }, [checkDataSavingPermission]);

  // Fetch therapist name from user profile
  useEffect(() => {
    const fetchTherapistName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('therapist_name')
          .eq('id', user.id)
          .single();

        if (profile?.therapist_name) {
          therapistName = profile.therapist_name;
        }
      } catch (error) {
        console.error('Error fetching therapist name:', error);
      }
    };

    fetchTherapistName();
  }, []);

  // Enhanced debug logging for messages
  useEffect(() => {
    if (messages.length !== prevMessagesRef.current.length) {
      console.log('Messages array length changed:', {
        previous: prevMessagesRef.current.length,
        current: messages.length
      });
    }

    messages.forEach((msg, index) => {
      const prevMsg = prevMessagesRef.current[index];
      if (!prevMsg || JSON.stringify(prevMsg) !== JSON.stringify(msg)) {
        if (isChatMessage(msg)) {
          console.log(`Message ${index} updated:`, {
            type: msg.type,
            content: msg.message.content,
            role: msg.message.role,
            models: msg.models,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log(`System message ${index}:`, msg);
        }
      }
    });

    prevMessagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = () => {
    if (!messagesRef.current) return;
    
    const scrollContainer = messagesRef.current;
    const scrollHeight = scrollContainer.scrollHeight;
    const height = scrollContainer.clientHeight;
    const maxScrollTop = scrollHeight - height;
    
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      scrollContainer.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth'
      });
    });
  };

  // Create a new chat session when the first message is received
  useEffect(() => {
    const createChatSession = async () => {
      // NOTE: Resumption logic should only be handled by the chat page (/chat) when explicitly triggered
      // This Messages component should always create new sessions unless told otherwise via props
      
      // Find the first actual chat message (not system messages)
      const chatMessages = messages.filter(msg => isChatMessage(msg));
      const hasFirstChatMessage = chatMessages.length >= 1;
      
      console.log('Session creation check:', {
        totalMessages: messages.length,
        chatMessages: chatMessages.length,
        hasFirstChatMessage,
        currentSessionId,
        sessionCreationInProgress: sessionCreationRef.current
      });

      if (hasFirstChatMessage && !currentSessionId && !sessionCreationRef.current) {
        console.log('🚀 Starting session creation process...');
        sessionCreationRef.current = true;
        
        // If there's already a session creation in progress, wait for it
        if (sessionCreationPromiseRef.current) {
          console.log('⏳ Session creation already in progress, waiting...');
          await sessionCreationPromiseRef.current;
          return;
        }

        sessionCreationPromiseRef.current = (async () => {
          try {
            console.log('🔐 Checking authentication...');
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              console.log('❌ No authenticated user found, cannot create session');
              return;
            }
            console.log('✅ User authenticated:', user.id);

            // Check if data saving is allowed for this user
            const canSaveData = await checkDataSavingPermission(user.id);
            if (!canSaveData) {
              console.log('🚫 Session creation skipped: Data saving not allowed for this user');
              // Don't create a session ID, but allow the chat to continue without saving
              return;
            }

            // Get the current therapy session ID from localStorage
            const therapySessionId = localStorage.getItem('currentTherapySessionId');
            console.log('📝 Current therapy session ID:', therapySessionId);

            // NOTE: Hume identifiers (hume_chat_id, hume_chat_group_id) are now handled 
            // separately by VoiceProvider when chat_metadata is received
            // This prevents race conditions and ensures proper timing

            console.log('💾 Creating chat session in database...');
            
            // Clear any old session ID from localStorage to prevent confusion
            localStorage.removeItem('currentChatSessionId');
            console.log('🧹 Cleared old currentChatSessionId from localStorage');
            
            // Create session and link with therapy session in parallel
            const sessionPayloadBase: any = {
              title: generateSessionName(),
              summary: 'Started a new therapy session'
              // Hume IDs will be updated separately by VoiceProvider when metadata arrives
            };

            const attemptInsert = async (payload: any) => {
              return await supabase
                .from('chat_sessions')
                .insert(payload)
                .select()
                .single();
            };

            // First try including user_id explicitly
            let sessionResult = await attemptInsert({ ...sessionPayloadBase, user_id: user.id });

            // If that fails (common with strict RLS), retry without user_id so DB default/auth.uid() can populate it
            if (sessionResult.error) {
              console.warn('❌ Session creation failed (with user_id). Retrying without user_id...', {
                message: sessionResult.error?.message,
                details: (sessionResult as any).error?.details,
                hint: (sessionResult as any).error?.hint,
              });
              const { user_id, ...withoutUserId } = { ...sessionPayloadBase, user_id: user.id };
              sessionResult = await attemptInsert(withoutUserId);
            }

            const therapyUpdateResult = therapySessionId ? 
              await supabase
                .from('therapy_sessions')
                .update({ chat_session_id: null })
                .eq('id', therapySessionId)
              : { error: null } as any;

            if (sessionResult.error) {
              console.log('❌ Session creation failed:', sessionResult.error);
              throw sessionResult.error;
            }

            console.log('✅ Chat session created successfully:', sessionResult.data.id);
            console.log('📊 Session details:', {
              id: sessionResult.data.id,
              user_id: sessionResult.data.user_id,
              title: sessionResult.data.title,
              created_at: sessionResult.data.created_at
            });
            setCurrentSessionId(sessionResult.data.id);
            
            // Store session ID in localStorage for Controls component
            localStorage.setItem('currentChatSessionId', sessionResult.data.id);
            console.log('💾 Stored currentChatSessionId in localStorage:', sessionResult.data.id);

            // Apply any pending Hume chat IDs that were received before session creation
            if (typeof window !== 'undefined' && (window as any).applyPendingHumeIds) {
              console.log('🔄 Checking for pending Hume chat IDs to apply...');
              console.log('📝 Current sessionStorage contents:', {
                pendingHumeChatId: sessionStorage.getItem('pendingHumeChatId'),
                pendingHumeChatGroupId: sessionStorage.getItem('pendingHumeChatGroupId')
              });
              try {
                await (window as any).applyPendingHumeIds(sessionResult.data.id);
              } catch (error) {
                console.error('❌ Error applying pending Hume chat IDs:', error);
              }
            } else {
              console.log('⚠️ applyPendingHumeIds function not available or window not defined');
            }

            // Update therapy session with chat session ID if needed
            if (therapySessionId && !therapyUpdateResult.error) {
              console.log('🔗 Linking therapy session to chat session...');
              const linkResult = await supabase
                .from('therapy_sessions')
                .update({ chat_session_id: sessionResult.data.id })
                .eq('id', therapySessionId);
              
              if (linkResult.error) {
                console.log('❌ Failed to link sessions:', linkResult.error);
              } else {
                console.log('✅ Sessions linked successfully');
              }
            }
          } catch (error) {
            console.error('❌ Error creating chat session:', error);
          } finally {
            sessionCreationRef.current = false;
            sessionCreationPromiseRef.current = null;
          }
        })();

        await sessionCreationPromiseRef.current;
      }
    };

    createChatSession();
  }, [messages.length, currentSessionId]); // Changed: Use messages.length instead of messages array to reduce re-renders

  // Save messages and emotion metrics
  useEffect(() => {
    const saveMessageAndMetrics = async () => {
      if (!currentSessionId || messages.length === 0) return;

      // Check if data saving is allowed before attempting to save
      if (!isDataSavingAllowed) {
        console.log('🚫 Message saving skipped: Data saving not allowed for this user');
        return;
      }

      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type !== 'user_message' && lastMessage.type !== 'assistant_message') return;

      const maxRetries = 3;
      let retryCount = 0;

      const saveWithRetry = async () => {
        try {
          console.log('Attempting to save message:', {
            sessionId: currentSessionId,
            type: lastMessage.type,
            content: lastMessage.message.content,
            hasEmotionData: !!lastMessage.models?.prosody?.scores,
            dataSavingAllowed: isDataSavingAllowed
          });

          // Save the message
          const { data: messageData, error: messageError } = await supabase
            .from('chat_messages')
            .insert({
              chat_session_id: currentSessionId,
              role: lastMessage.message.role,
              content: lastMessage.message.content,
              emotion_data: lastMessage.models?.prosody?.scores || {}
            })
            .select()
            .single();

          if (messageError) {
            console.error('Error saving message:', messageError);
            throw messageError;
          }

          console.log('Successfully saved message:', messageData.id);

          // Save emotion metrics if available
          if (lastMessage.models?.prosody?.scores) {
            const emotionEntries = Object.entries(lastMessage.models.prosody.scores);
            const metrics = emotionEntries.map(([emotion_type, value]) => ({
              chat_session_id: currentSessionId,
              emotion_type,
              intensity: value,
              confidence: value
            }));

            const { data: metricsData, error: metricsError } = await supabase
              .from('emotion_metrics')
              .insert(metrics)
              .select();

            if (metricsError) {
              console.error('Error saving emotion metrics:', metricsError);
              throw metricsError;
            }

            console.log('Successfully saved emotion metrics:', {
              count: metricsData.length,
              emotions: Object.keys(lastMessage.models.prosody.scores)
            });
          }

          return true;
        } catch (error) {
          console.error(`Save attempt ${retryCount + 1} failed:`, error);
          return false;
        }
      };

      // Retry logic
      while (retryCount < maxRetries) {
        const success = await saveWithRetry();
        if (success) break;

        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`Retrying save (attempt ${retryCount + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        }
      }

      if (retryCount === maxRetries) {
        console.error('Failed to save message after all retry attempts');
        // Here you could implement a fallback mechanism, like storing in localStorage
        // or showing a user notification
      }
    };

    saveMessageAndMetrics();
  }, [messages, currentSessionId, isDataSavingAllowed]);

  // Check for positive emotions and trigger confetti
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    
    // Only check user messages for positive emotions
    if (lastMessage.type !== 'user_message') return;
    
    const emotionScores = lastMessage.models?.prosody?.scores;
    if (!emotionScores) return;

    // Convert emotion scores to a plain object for compatibility (same pattern as Expressions component)
    const scores = Object.fromEntries(
      Object.entries(emotionScores as unknown as Record<string, number>).map(([key, value]) => [key, Number(value)])
    );

    // Check if positive emotions are detected
    if (shouldTriggerConfetti(scores)) {
      console.log('🎉 Positive emotions detected! Triggering confetti...', scores);
      
      // Find the strongest positive emotion to customize confetti
      const positiveEmotions = ['happiness', 'joy', 'excitement'];
      const strongestEmotion = positiveEmotions.reduce((strongest, emotion) => {
        const score = scores[emotion.toLowerCase()] || 0;
        const strongestScore = scores[strongest.toLowerCase()] || 0;
        return score > strongestScore ? emotion : strongest;
      });

      // Trigger confetti with a slight delay for better UX
      setTimeout(() => {
        triggerEmotionConfetti(strongestEmotion);
      }, 500);
    }
  }, [messages]);

  // Fetch prior chat messages when resuming an existing session
  useEffect(() => {
    const fetchInitialMessages = async () => {
      if (!sessionId || hasFetchedInitialRef.current) return;

      try {
        console.log('📥 Fetching initial messages for resumed session:', sessionId);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('role, content, created_at')
          .eq('chat_session_id', sessionId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('❌ Error fetching initial messages:', error);
          return;
        }

        const formatted = (data || []).map((m: any) => ({
          type: m.role === 'user' ? 'user_message' : 'assistant_message',
          message: { content: m.content, role: m.role },
        })) as ChatMessage[];

        setInitialMessages(formatted);
        console.log(`✅ Loaded ${formatted.length} initial messages`);
      } catch (err) {
        console.error('❌ Unexpected error fetching initial messages:', err);
      } finally {
        hasFetchedInitialRef.current = true;
      }
    };

    fetchInitialMessages();
  }, [sessionId]);

  // Combine initial messages with live messages for rendering
  const combinedMessages = useMemo(() => [...initialMessages, ...messages], [initialMessages, messages]);

2  // Optional initial greeting – disabled by flag
  useEffect(() => {
    if (!ENABLE_INITIAL_GREETING) return;
    if (status?.value !== 'connected') return;

    const timer = setTimeout(() => {
      const hasAnyChat = combinedMessages.some(isChatMessage);
      if (!hasAnyChat) {
        const displayName = therapistName && therapistName !== 'Talk Therapist' ? therapistName : agentName;
        const greeting = `Hello! I'm ${displayName}. How are you doing today?`;
        setInitialMessages((prev) => [
          ...prev,
          {
            type: 'assistant_message',
            message: { content: greeting, role: 'assistant' },
          },
        ]);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [status?.value, combinedMessages.length, therapistName, agentName, ENABLE_INITIAL_GREETING]);

  // Optimize message rendering with memo
  const renderMessage = useCallback((msg: unknown, index: number) => {
    if (!isChatMessage(msg)) return null;

    // Use combinedMessages length to determine the last item in the full list
    const isLastMessage = index === combinedMessages.length - 1;
    return (
      <motion.div
        key={msg.type + index}
        ref={isLastMessage ? messagesEndRef : null}
        className={cn(
          "w-[80%]",
          "bg-card",
          "border border-border rounded",
          "p-4",
          msg.type === "user_message" ? "ml-auto" : "mr-auto"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.1 }}
      >
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            {msg.type === "user_message" ? "You" : agentName}
          </div>
          <div className="text-foreground">
            {msg.message.content}
          </div>
          {msg.type === "user_message" && (() => {
            // Support multiple possible locations for prosody/emotion scores as the SDK evolves
            const rawScores: Record<string, number> | undefined =
              // 1. Current SDK (nested under models.prosody.scores)
              (msg.models?.prosody?.scores as Record<string, number> | undefined) ??
              // 2. Some SDKs may attach directly on `prosody.scores`
              ((msg as any).prosody?.scores as Record<string, number> | undefined) ??
              // 3. Fallback: flat `scores` key
              ((msg as any).scores as Record<string, number> | undefined) ??
              // 4. Alternate naming conventions
              ((msg as any).emotion_scores as Record<string, number> | undefined);

            if (!rawScores) return null;

            // Ensure numeric values
            const normalized = Object.fromEntries(
              Object.entries(rawScores).map(([k, v]) => [k, Number(v)])
            );

            return <Expressions scores={normalized} />;
          })()}
        </div>
      </motion.div>
    );
  }, [combinedMessages, agentName]);

  // Optimized scroll handling
  useEffect(() => {
    if (!shouldAutoScroll) return;

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Immediate scroll
    scrollToBottom();

    // Single delayed scroll attempt with shorter delay
    scrollTimeoutRef.current = setTimeout(scrollToBottom, 25); // Further reduced delay

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, shouldAutoScroll]);

  // Handle scroll events to detect user scroll
  useEffect(() => {
    const scrollContainer = messagesRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isAtBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset auto-scroll when component mounts
  useEffect(() => {
    setShouldAutoScroll(true);
  }, []);

  // Filter and map only chat messages for context
  const chatMessagesForContext = useMemo(() => {
    return combinedMessages
      .filter(isChatMessage)
      .map(m => ({ 
        role: m.message.role as 'user' | 'assistant' | 'system', 
        content: m.message.content 
      }));
  }, [combinedMessages]);

  return (
    <SessionMessagesContext.Provider value={chatMessagesForContext}>
    <motion.div
      layoutScroll
      className="grow rounded-md overflow-auto p-4 h-full"
      ref={messagesRef}
      style={{ 
        overflowY: "auto",
        scrollBehavior: "smooth",
        maxHeight: "calc(100vh - 200px)" // Add max height to ensure scrolling works in modal
      }}
    >
      <motion.div
        className="max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24 items-center"
      >
        <AnimatePresence mode="popLayout">
          {combinedMessages.map(renderMessage)}
        </AnimatePresence>
      </motion.div>
    </motion.div>
    </SessionMessagesContext.Provider>
  );
});

export default Messages;
