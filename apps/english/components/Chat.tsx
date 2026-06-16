"use client";

import { useVoice } from "@humeai/voice-react";
import { VoiceProvider } from "./VoiceProvider";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef, useState, useEffect } from "react";
import supabase from "@/supabaseClient";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

interface Message {
  type: string;
  timestamp: string;
}

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [therapistName, setTherapistName] = useState("Talk Therapist");
  const [triggerStartCall, setTriggerStartCall] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
  const [hasStartedSession, setHasStartedSession] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  // Debug: Monitor triggerStartCall state changes
  useEffect(() => {
    console.log('🔥 Chat: triggerStartCall state changed to:', triggerStartCall);
  }, [triggerStartCall]);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const defaultConfigId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425';

  // Auto-trigger the StartCall modal for authenticated users (only once and when not connected)
  useEffect(() => {
    // Only check if we haven't auto-triggered yet
    if (hasAutoTriggered) {
      console.log('🚫 Skipping auto-trigger: already triggered');
      return;
    }
    
    // If we have an access token, assume user is authenticated and auto-trigger
    if (accessToken) {
      console.log('🚀 Auto-triggering StartCall modal for authenticated user');
      setTriggerStartCall(true);
      setHasAutoTriggered(true);
    }
  }, [accessToken, hasAutoTriggered]);

  // Fetch initial therapist name
  useEffect(() => {
    const fetchTherapistName = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Therapist name fetch timeout')), 5000) // Increased timeout to 5 seconds
        );
        
        const authPromise = supabase.auth.getUser();
        const { data: { user } } = await Promise.race([authPromise, timeoutPromise]) as any;
        if (!user) return;

        const profilePromise = supabase
          .from('profiles')
          .select('therapist_name')
          .eq('id', user.id)
          .single();

        const { data: profile } = await Promise.race([profilePromise, timeoutPromise]) as any;

        if (profile?.therapist_name) {
          setTherapistName(profile.therapist_name);
        }
      } catch (error) {
        console.warn('Therapist name fetch failed, using default:', error);
        // Keep default "Talk Therapist" name on timeout/error
      }
    };

    fetchTherapistName();
  }, []);

  if (!accessToken) {
    return null;
  }

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-full"
      }
    >
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={selectedConfigId || defaultConfigId}
      >
        {/* Voice status tracker to prevent re-triggering */}
        <VoiceConnectionTracker 
          onConnectionStart={() => {
            console.log('🔗 Voice connection detected, disabling auto-trigger');
            setHasStartedSession(true);
            setUserHasInteracted(true);
          }} 
        />
        
        {/* Header - hidden when session is connected or for authenticated users */}
        <HeaderSection onStartSession={() => {
          console.log('🔥 Chat: Start Session button clicked, setting triggerStartCall to true');
          setTriggerStartCall(true);
          setUserHasInteracted(true);
        }} hideForAuthUsers={true} />
        
        <Messages ref={ref} therapistName={therapistName} voiceConfigId={selectedConfigId} />
        <Controls />
        <StartCall 
          onVoiceSelect={(configId) => {
            console.log('Voice selected in Chat component:', configId);
            setSelectedConfigId(configId);
            setHasStartedSession(true);
            setUserHasInteracted(true);
          }}
          onTherapistNameChange={(name) => {
            console.log('Therapist name changed:', name);
            setTherapistName(name);
          }}
          hideFixedButton={true}
          triggerOpen={triggerStartCall}
          onDialogChange={(open) => {
            console.log('🔥 Chat: StartCall dialog change, open:', open);
            if (open) {
              // Mark as interacted when user sees the modal content
              setUserHasInteracted(true);
            }
            if (!open) {
              // Reset triggerStartCall when modal closes
              setTriggerStartCall(false);
              setHasStartedSession(true);
              setUserHasInteracted(true);
            }
          }}
        />
      </VoiceProvider>
    </div>
  );
}

// Component to track voice connection status
function VoiceConnectionTracker({ onConnectionStart }: { onConnectionStart: () => void }) {
  const { status } = useVoice();
  
  useEffect(() => {
    if (status.value === "connecting" || status.value === "connected") {
      console.log('🔥 Voice connection status:', status.value);
      onConnectionStart();
    }
  }, [status.value, onConnectionStart]);
  
  return null;
}

function HeaderSection({ onStartSession, hideForAuthUsers }: { onStartSession: () => void; hideForAuthUsers: boolean }) {
  const { status } = useVoice();
  const searchParams = useSearchParams();
  
  // Check if we're in trial mode
  const isTrialMode = searchParams.get('trial') === 'true';

  // Handle start session click
  const handleStartSession = () => {
    if (isTrialMode) {
      // In trial mode, trigger the StartCall dialog
      onStartSession();
      return;
    }
    
    // For authenticated users, just trigger the StartCall dialog
    onStartSession();
  };
  
  // Hide header when session is connected
  if (status.value === "connected") {
    return null;
  }

  // Hide header for authenticated users (since modal auto-triggers)
  if (hideForAuthUsers && !isTrialMode) {
    return null;
  }

  return (
    <>
      {/* Just the Start Session button - all text removed */}
      <div className="flex justify-center pb-4 pt-8">
        <Button
          onClick={handleStartSession}
          className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-primary/80 hover:text-primary-foreground"
        >
          {isTrialMode ? 'Start Free Trial' : 'Start Session'}
        </Button>
      </div>
    </>
  );
}
