"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone, Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useContext } from "react";
import SessionAnalyticsModal from "./SessionAnalyticsModal";
import { useResumption } from "@/contexts/ResumptionContext";
import supabase from "@/supabaseClient";
import { useRouter } from "next/navigation";
import TextInput from "./TextInput";
import SessionMessagesContext from '@/contexts/SessionMessagesContext';

export default function Controls() {
  const { status, unmute, mute, micFft, disconnect, isMuted, pauseAssistant, resumeAssistant } = useVoice();
  const { isResuming } = useResumption();
  const router = useRouter();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuteButtonDisabled, setIsMuteButtonDisabled] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [completedSessionDuration, setCompletedSessionDuration] = useState(0);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string>('loading');
  const liveMessages = useContext(SessionMessagesContext);
  
  const sessionStartTime = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const pauseStartTime = useRef<number | null>(null);
  const timerInterval = useRef<number | NodeJS.Timeout | null>(null);
  const lastStatusRef = useRef(status.value);
  const prevStatusRef = useRef({ status: '', isMuted: false, hasMicFft: false });

  // Fetch user subscription status when component mounts
  useEffect(() => {
    const fetchUserSubscriptionStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (profile?.subscription_status) {
          setUserSubscriptionStatus(profile.subscription_status);
        }
      } catch (error) {
        console.error('Error fetching user subscription status:', error);
        setUserSubscriptionStatus('calm'); // Default to calm on error
      }
    };

    fetchUserSubscriptionStatus();
  }, []);

  // Track current session ID from localStorage
  useEffect(() => {
    const sessionId = localStorage.getItem('currentChatSessionId');
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, []);

  // Update the ref whenever isPaused changes
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // ------- ❶ Handle starting/stopping the repeating timer -------
  useEffect(() => {
    // Debug: log every status change related to timer logic
    console.log('⏱️ [TimerEffect] status change detected:', status.value);

    if (status.value === 'connected') {
      // Establish the session start time if we don't have it yet
      if (!sessionStartTime.current) {
        sessionStartTime.current = Date.now();
        setSessionDuration(0);
        console.log('⏱️ [TimerEffect] Session start time recorded');
      }

      // Create (or recreate) the interval if it doesn't exist
      if (!timerInterval.current) {
        console.log('⏱️ [TimerEffect] Creating 1-second interval');
        timerInterval.current = setInterval(() => {
          if (!isPausedRef.current && sessionStartTime.current) {
            const elapsedSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
            setSessionDuration(elapsedSeconds);
            if (elapsedSeconds % 5 === 0) {
              console.log('⏱️ Session timer tick:', elapsedSeconds, 'seconds');
            }
          }
        }, 1000);
        localStorage.setItem('sessionActive', 'true');
      }
    } else {
      // Any state other than connected should clear the interval
      if (timerInterval.current) {
        console.log('⏱️ [TimerEffect] Clearing interval due to status:', status.value);
        clearInterval(timerInterval.current);
        timerInterval.current = null;
        localStorage.setItem('sessionActive', 'false');
      }
      // Reset start time so the next connection starts fresh
      if (status.value === 'disconnected') {
        sessionStartTime.current = null;
        pauseStartTime.current = null;
        setSessionDuration(0);
      }
    }

    // Cleanup on unmount (covers React.StrictMode double-mount in dev)
    return () => {
      if (timerInterval.current) {
        console.log('⏱️ [TimerEffect] Component unmount – clearing interval');
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, [status.value]);

  // ------- ❷ Handle disconnect cleanup / analytics -------
  useEffect(() => {
    if (status.value === "disconnected" && lastStatusRef.current === "connected") {
      // Session ended - calculate final duration and show analytics
      const finalDuration = Math.floor(sessionDuration);
      setCompletedSessionDuration(finalDuration);
      
      // Get the session ID and check trial mode
      const sessionId = localStorage.getItem('currentChatSessionId') || currentSessionId;
      const isTrialMode = new URLSearchParams(window.location.search).get('trial') === 'true';
      
      console.log('Controls: Session ended debug info:', {
        finalDuration,
        sessionId,
        isTrialMode,
        isResuming,
        shouldShowModal: finalDuration > 10 && sessionId && !isTrialMode && !isResuming
      });
      
      // Skip analytics and cleanup if we're resuming - this is just a connection transition
      if (isResuming) {
        console.log('Controls: Skipping session end cleanup during resumption');
        lastStatusRef.current = status.value;
        return;
      }

      // CRITICAL FIX: Update the database session status when session ends
      if (sessionId && !isTrialMode) {
        console.log('🔄 Controls: Updating session status to completed in database...');
        // Use dynamic import to avoid SSR issues
        import('@/supabaseClient').then(({ default: supabase }) => {
          supabase
            .from('chat_sessions')
            .update({
              duration: finalDuration,
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', sessionId)
            .then(({ error }) => {
              if (error) {
                console.error('❌ Controls: Failed to update session status:', error);
              } else {
                console.log('✅ Controls: Session status updated to completed');
              }
            });
        }).catch(err => {
          console.error('❌ Controls: Failed to import supabase client:', err);
        });
      }
      
      // Only show analytics modal if the session was meaningful (> 10 seconds)
      // Only show analytics modal for Centered and Grounded tier users
      const shouldShowModal = finalDuration > 10 && !isTrialMode && !isResuming && 
        (userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded');
      
      if (shouldShowModal) {
        console.log('Controls: Showing analytics modal in 1 second...');
        // Update currentSessionId if we got it from localStorage (for paid users)
        if (sessionId !== currentSessionId) {
          setCurrentSessionId(sessionId);
        }
        // For Calm users without sessionId, we'll still show the modal but with limited data
        // Add a small delay to ensure any session data is saved
        setTimeout(() => {
          console.log('Controls: Actually showing analytics modal now');
          setShowAnalyticsModal(true);
        }, 1000);
      } else {
        console.log('Controls: Not showing analytics modal because:', {
          durationTooShort: finalDuration <= 10,
          isTrialMode,
          isResuming,
          subscriptionTier: userSubscriptionStatus,
          hasAnalyticsAccess: userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded'
        });
      }
      
      sessionStartTime.current = null;
      pauseStartTime.current = null;
      setIsPaused(false);
      setIsMuteButtonDisabled(false);
      isPausedRef.current = false;
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      setSessionDuration(0);

      // Clear sessionActive flag
      localStorage.setItem('sessionActive', 'false');
    }

    // Update the last status reference
    lastStatusRef.current = status.value;

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [status.value, currentSessionId, isResuming]); // Added isResuming dependency

  // Auto-resume audio pipeline whenever connection is established
  useEffect(() => {
    if (status.value === 'connected') {
      // Give the socket a few hundred ms to stabilise
      setTimeout(() => {
        try {
          if (typeof unmute === 'function') unmute();
          if (typeof resumeAssistant === 'function') resumeAssistant();
        } catch (err) {
          console.warn('⚠️ Auto-unmute/resume failed:', err);
        }
      }, 300);
    }
  }, [status.value, unmute, resumeAssistant]);

  // Handle pause/resume functionality
  const handlePauseToggle = () => {
    if (isPaused) {
      // Resume the session
      if (pauseStartTime.current && sessionStartTime.current) {
        // Calculate how long we were paused
        const pauseDuration = Date.now() - pauseStartTime.current;
        // Adjust the session start time by adding the pause duration
        sessionStartTime.current += pauseDuration;
        pauseStartTime.current = null;
        console.log('⏱️ [PauseToggle] Session resumed, adjusted start time by', pauseDuration, 'ms');
      }
      resumeAssistant();
      unmute();
      setIsPaused(false);
      setIsMuteButtonDisabled(false); // Re-enable mute button
    } else {
      // Pause the session
      pauseStartTime.current = Date.now();
      console.log('⏱️ [PauseToggle] Session paused at', pauseStartTime.current);
      pauseAssistant();
      mute();
      setIsPaused(true);
      setIsMuteButtonDisabled(true); // Disable mute button
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnalyticsModalClose = () => {
    setShowAnalyticsModal(false);
    setCurrentSessionId(null);
    setCompletedSessionDuration(0);
    // Only clear the session ID from localStorage if we're not resuming
    if (!isResuming) {
      localStorage.removeItem('currentChatSessionId');
      console.log('Controls: Analytics modal closed, cleared session data');
    } else {
      console.log('Controls: Analytics modal closed, keeping session data during resumption');
    }
    router.push('/dashboard');
  };

  useEffect(() => {
    const statusObj = {
      status: status.value,
      isMuted,
      hasMicFft: !!micFft
    };
    
    if (JSON.stringify(prevStatusRef.current) !== JSON.stringify(statusObj)) {
      prevStatusRef.current = statusObj;
    }
  }, [status.value, isMuted, micFft]);

  const handleDisconnect = async () => {
    try {
      // Mute microphone first
      if (isMuted === false) {
        try {
          await mute();
          // Brief wait for microphone to stop
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Microphone cleanup failed, continuing with disconnect:', error);
        }
      }
      
      // Disconnect - letting Hume SDK handle audio cleanup
      await disconnect();
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  };

  return (
    <>
      {/* Text Input Component */}
      <TextInput
        isConnected={status.value === "connected"}
        isMuted={isMuted}
        onToggleMute={() => {
          if (isMuteButtonDisabled) return; // Prevent manual mute/unmute when paused
          if (isMuted) {
            unmute();
          } else {
            mute();
          }
        }}
        className="bottom-24 sm:bottom-28"
      />
      
      <div
        className={
          cn(
            "fixed left-0 w-full bottom-4 sm:bottom-4 p-2 sm:p-4 flex items-center justify-center z-40",
            "bg-gradient-to-t from-card via-card/90 to-card/0 backdrop-blur-sm"
          )
        }
      >
        <AnimatePresence>
          {(status.value === "connecting" || status.value === "connected") && (
            <motion.div
              initial={{
                y: "100%",
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: "100%",
                opacity: 0,
              }}
              className={
                "p-2 sm:p-4 bg-card border border-border rounded-lg shadow-lg flex items-center justify-between gap-2 sm:gap-4 w-full max-w-lg mx-auto backdrop-blur-sm"
              }
            >
              <Toggle
                pressed={!isMuted}
                onPressedChange={() => {
                  if (isMuteButtonDisabled || status.value !== 'connected') return; // Prevent manual mute/unmute when paused or not connected
                  if (isMuted) {
                    unmute();
                  } else {
                    mute();
                  }
                }}
                disabled={isMuteButtonDisabled || status.value !== 'connected'}
                className="shrink-0"
              >
                {isMuted ? (
                  <MicOff className={"size-4"} />
                ) : (
                  <Mic className={"size-4"} />
                )}
              </Toggle>

              {/* Session Timer */}
              <div className="flex flex-col items-center justify-center min-w-0">
                <div className="text-xs text-muted-foreground">Session</div>
                <div className="text-sm font-mono font-medium">
                  {formatTime(sessionDuration)}
                </div>
              </div>

              <div className={"relative grid h-8 w-24 sm:w-32 shrink grow-0"}>
                <MicFFT fft={micFft} className={"fill-current"} />
              </div>

              {/* Pause/Resume Button */}
              <Button
                className={"flex items-center gap-1 shrink-0"}
                onClick={handlePauseToggle}
                variant={isPaused ? "default" : "outline"}
                size="sm"
                disabled={status.value !== 'connected'}
              >
                <span>
                  {isPaused ? (
                    <Play className={"size-4"} />
                  ) : (
                    <Pause className={"size-4"} />
                  )}
                </span>
                <span className="hidden sm:inline">
                  {isPaused ? "Resume" : "Pause"}
                </span>
              </Button>

              <Button
                className={"flex items-center gap-1 shrink-0"}
                onClick={handleDisconnect}
                variant={"destructive"}
                size="sm"
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50"}
                    strokeWidth={2}
                    stroke={"currentColor"}
                  />
                </span>
                <span className="hidden sm:inline">End Call</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Removed duplicate footer text and ensured toolbar sits above site footer */}
      </div>

      {/* Session Analytics Modal */}
      <SessionAnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={handleAnalyticsModalClose}
        sessionDuration={completedSessionDuration}
        sessionId={currentSessionId}
        liveMessages={liveMessages}
      />
    </>
  );
}
