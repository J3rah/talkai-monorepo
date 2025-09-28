"use client";

import { useVoice } from "@humeai/voice-react";
import { VoiceProvider } from "./VoiceProvider";
import Messages from "./Messages";
import Controls from "./Controls";
import TrialStartCall from "./TrialStartCall";
import { ComponentRef, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getClientAccessToken } from "@/utils/getClientAccessToken";
import { TrialTracker, trackConversionStep } from "@/utils/trialTracking";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Creative taglines for the therapy session
const taglines = [
  {
    title: "Therapy without a History **",
    description: "Begin a new therapy session with our AI assistant. Choose your preferred voice and start the session. ** We do not store your data unless you actually want us to **"
  },
  {
    title: "Your AI confidant awaits",
    description: "Experience judgment-free conversations with our empathetic AI therapist. Select your voice and begin."
  },
  {
    title: "Healing through Conversation",
    description: "Start your journey to emotional well-being with our AI companion. Choose your voice and let's talk."
  },
  {
    title: "A Safe Space to be Heard",
    description: "Connect with an AI therapist who's always ready to listen. Select your voice and start your session."
  },
  {
    title: "Talk Therapy, No Strings Attached **",
    description: "Begin a meaningful conversation with our understanding AI assistant. Choose your voice and start healing. ** We do not store your data unless you actually want us to **"
  },
  {
    title: "Lightweight Therapy, Always Here",
    description: "No appointments needed, no waiting rooms. Just pure, accessible support whenever you need it. Choose your voice and begin."
  },
  {
    title: "Instant Therapy for Everyday Struggles",
    description: "From daily stress to deeper concerns, get immediate support with our AI therapist. Select your voice and start your journey."
  },
  {
    title: "Unburden Anytime",
    description: "Release your thoughts and feelings in a safe, judgment-free space. Your AI therapist is ready to listen. Choose your voice and begin."
  }
];

interface Message {
  type: string;
  timestamp: string;
}

export default function TrialChat({
  accessToken: initialAccessToken,
}: {
  accessToken: string | null;
}) {
  console.log('=== TRIALCHAT COMPONENT RENDERING ===');
  console.log('TrialChat: initialAccessToken:', !!initialAccessToken);
  
  const timeout = useRef<number | null>(null);
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [therapistName, setTherapistName] = useState("Talk Therapist");
  const [triggerStartCall, setTriggerStartCall] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(initialAccessToken);
  const [trialStarted, setTrialStarted] = useState(false);
  const [trialTimeLeft, setTrialTimeLeft] = useState(300); // 5 minutes in seconds
  const [trialExpired, setTrialExpired] = useState(false);
  const [trialAlreadyUsed, setTrialAlreadyUsed] = useState(false);
  const [checkingTrialUsage, setCheckingTrialUsage] = useState(true);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const router = useRouter();
  const defaultConfigId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425';

  // Initialize trial tracking
  const [trialTracker] = useState(() => TrialTracker.getInstance());

  // Check if trial has already been used
  useEffect(() => {
    let mounted = true;
    
    const checkTrialUsage = async () => {
      try {
        console.log('TrialChat: Starting trial usage check...');
        const hasUsed = await trialTracker.hasUsedTrial();
        console.log('TrialChat: Trial usage check result:', hasUsed);
        if (mounted) {
          setTrialAlreadyUsed(hasUsed);
          setCheckingTrialUsage(false);
          console.log('TrialChat: Updated state - trialAlreadyUsed:', hasUsed, 'checkingTrialUsage: false');
        }
      } catch (error) {
        console.error('TrialChat: Error checking trial usage:', error);
        if (mounted) {
          // On error, allow trial to proceed
          setTrialAlreadyUsed(false);
          setCheckingTrialUsage(false);
          console.log('TrialChat: Error occurred, allowing trial to proceed');
        }
      }
    };

    console.log('TrialChat: Initiating trial usage check...');
    checkTrialUsage();
    
    return () => {
      mounted = false;
    };
  }, [trialTracker]);

  // Initialize trial tracking
  useEffect(() => {
    let mounted = true;
    
    const initializeTracking = async () => {
      try {
        console.log('TrialChat: Initializing trial tracking...');
        await trialTracker.initializeTrialSession();
        
        if (!mounted) return;
        
        const trialLength = trialTracker.getTrialLength();
        console.log('TrialChat: Trial length set to:', trialLength);
        setTrialTimeLeft(trialLength);
        
        // Track landing page view
        await trackConversionStep('trial_page_view');
        console.log('TrialChat: Landing page view tracked');
      } catch (error) {
        console.error('Error initializing trial tracking:', error);
      }
    };

    if (!trialAlreadyUsed && !checkingTrialUsage) {
      console.log('TrialChat: Starting trial initialization...');
      initializeTracking();
    } else {
      console.log('TrialChat: Skipping trial initialization - alreadyUsed:', trialAlreadyUsed, 'checking:', checkingTrialUsage);
    }
    
    return () => {
      mounted = false;
    };
  }, [trialTracker, trialAlreadyUsed, checkingTrialUsage]);

  // Get access token if not provided
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (!accessToken) {
        try {
          console.log('Fetching access token for trial...');
          const token = await getClientAccessToken();
          console.log('Access token fetched for trial:', !!token);
          setAccessToken(token);
        } catch (error) {
          console.error('Error fetching access token for trial:', error);
        }
      }
    };

    fetchAccessToken();
  }, [accessToken]);

  // Trial timer effect
  useEffect(() => {
    let interval: number | NodeJS.Timeout;
    
    console.log('Trial timer effect - trialStarted:', trialStarted, 'trialTimeLeft:', trialTimeLeft, 'trialExpired:', trialExpired);
    
    if (trialStarted && trialTimeLeft > 0 && !trialExpired) {
      console.log('Starting trial timer...');
      interval = setInterval(() => {
        setTrialTimeLeft((prev) => {
          console.log('Timer tick - previous:', prev, 'new:', prev - 1);
          if (prev <= 1) {
            console.log('Trial time expired, setting trialExpired to true');
            setTrialExpired(true);
            trialTracker.trackTrialExpiry();
            trackConversionStep('trial_expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        console.log('Clearing trial timer interval');
        clearInterval(interval);
      }
    };
  }, [trialStarted, trialTimeLeft, trialExpired, trialTracker]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrialStart = async () => {
    console.log('Trial started!');
    try {
      setTrialStarted(true);
      await trialTracker.trackTrialStart();
      await trackConversionStep('trial_started');
      console.log('Trial start tracking completed successfully');
    } catch (error) {
      console.error('Error tracking trial start:', error);
      // Continue with trial even if tracking fails
    }
  };

  const handleVoiceSelect = async (configId: string) => {
    console.log('Voice selected in TrialChat component:', configId);
    setSelectedConfigId(configId);
    
    // Extract voice name from config ID for tracking
    const voiceName = configId.includes('male') ? 'male' : 
                     configId.includes('female') ? 'female' : 'unknown';
    await trialTracker.trackVoiceSelection(voiceName);
  };

  const handleTherapistNameChange = async (name: string) => {
    console.log('Therapist name changed:', name);
    setTherapistName(name);
    await trialTracker.trackTherapistNameChange(name);
  };

  const handleSignupClick = async () => {
    await trialTracker.trackSignupClick();
    await trackConversionStep('signup_clicked');
    router.push('/subscription');
  };

  // Track trial completion when it naturally ends
  useEffect(() => {
    if (trialStarted && trialTimeLeft === 0 && !trialExpired) {
      trialTracker.trackTrialComplete();
      trackConversionStep('trial_completed');
    }
  }, [trialStarted, trialTimeLeft, trialExpired, trialTracker]);

  // Debug current state
  console.log('TrialChat: Current state:', {
    checkingTrialUsage,
    trialAlreadyUsed,
    accessToken: !!accessToken,
    trialExpired,
    trialStarted,
    trialTimeLeft
  });

  // If we're still checking trial usage, show loading
  if (checkingTrialUsage) {
    console.log('TrialChat: Checking trial usage, showing loading...');
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking trial eligibility...</p>
        </div>
      </div>
    );
  }

  // If trial has already been used, show upgrade message
  if (trialAlreadyUsed) {
    console.log('TrialChat: Trial already used, showing upgrade message...');
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Trial Already Used</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You've already experienced our free trial. Ready to unlock unlimited access to our empathic AI therapy?
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => router.push('/subscription')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            >
              View Subscription Plans
            </Button>
            <button
              onClick={() => router.push('/auth')}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If we don't have an access token, show loading
  if (!accessToken) {
    console.log('TrialChat: No access token, showing loading...');
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Preparing your trial session...</p>
        </div>
      </div>
    );
  }

  if (trialExpired) {
    console.log('TrialChat: Trial expired, showing conversion screen...');
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Trial Session Complete!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You've experienced our empathic AI therapy. Ready to continue your journey with unlimited access?
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/subscription')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          >
            View Subscription Plans
          </Button>
        </div>
      </div>
    );
  }

  console.log('TrialChat: Rendering main trial interface');
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
        {/* Header - hidden when session is connected */}
        <HeaderSection onStartSession={() => setTriggerStartCall(true)} />
        
        {/* Trial Timer */}
        {trialStarted && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-center">
            <p className="font-medium">
              Trial Time Remaining: {formatTime(trialTimeLeft)}
            </p>
          </div>
        )}

        <Messages ref={ref} therapistName={therapistName} voiceConfigId={selectedConfigId || defaultConfigId} />
        <Controls />
        <TrialStartCall 
          onVoiceSelect={handleVoiceSelect}
          onTherapistNameChange={handleTherapistNameChange}
          onTrialStart={handleTrialStart}
          trialTimeLeft={trialTimeLeft}
          trialExpired={trialExpired}
          hideFixedButton={true}
          triggerOpen={triggerStartCall}
          accessToken={accessToken}
          onDialogChange={(open) => {
            if (!open) setTriggerStartCall(false);
          }}
        />
      </VoiceProvider>
    </div>
  );
}

function HeaderSection({ onStartSession }: { onStartSession: () => void }) {
  const { status } = useVoice();
  
  // Random tagline selection on each render
  const [currentTagline] = useState(() => {
    return taglines[Math.floor(Math.random() * taglines.length)];
  });
  
  // Hide header when session is connected
  if (status.value === "connected") {
    return null;
  }

  return (
    <>
      {/* Tagline Section */}
      <div className="max-w-2xl mx-auto px-4 mb-6 mt-8">
        <h1 className="text-2xl font-bold text-center py-4">{currentTagline.title}</h1>
        <h2 className="text-center py-4">
          <p>{currentTagline.description}</p>
        </h2>
      </div>

      {/* Trial Call-to-Action */}
      <div className="max-w-2xl mx-auto px-4 mb-6 text-center">
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200 text-sm">
            ✨ <strong>Your 5-minute free trial is ready</strong> - No signup required, start immediately
          </p>
        </div>
      </div>

      <div className="mx-4 md:mx-8 lg:mx-16">
        <button
          onClick={onStartSession}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-xs md:px-3 md:py-1.5 md:max-w-xs md:mx-auto md:block"
        >
          Start Trial
        </button>
      </div>

      {/* Features Section */}
      <div className="max-w-2xl mx-auto px-4 mb-6 mt-8 text-center">
        <div className="grid grid-cols-1 gap-6 text-sm">
          <div className="text-center">
            <div className="flex items-center space-x-3 justify-center mb-2">
              <span className="text-lg">🎭</span>
              <span className="font-medium text-lg">Choose Your Therapeutic Guide Voice:</span>
            </div>
            <div className="text-base" style={{ color: '#71a3c1' }}>Find the voice that helps you heal. Tailored tones for every journey*</div>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-3 justify-center mb-2">
              <span className="text-lg">🎤</span>
              <span className="font-medium text-lg">Real-time Emotion Analysis:</span>
            </div>
            <div className="text-base" style={{ color: '#71a3c1' }}><b>Advanced AI detects emotions in your voice as you speak</b></div>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-3 justify-center mb-2">
              <span className="text-lg">🧠</span>
              <span className="font-medium text-lg">Adaptive Responses:</span>
            </div>
            <div className="text-base" style={{ color: '#71a3c1' }}>Therapy sessions that adjust to your emotional state</div>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-3 justify-center mb-2">
              <span className="text-lg">🔒</span>
              <span className="font-medium text-lg">Complete Privacy:</span>
            </div>
            <div className="text-base" style={{ color: '#71a3c1' }}>Your conversations are encrypted and confidential</div>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-3 justify-center mb-2">
              <span className="text-lg">📊</span>
              <span className="font-medium text-lg">Emotional Insights:</span>
            </div>
            <div className="text-base" style={{ color: '#71a3c1' }}>Track your emotional patterns over time</div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="text-center mt-6 text-gray-800 dark:text-gray-200 font-bold italic" style={{ fontSize: '13px' }}>
          *With <Link href="/subscription" className="underline hover:text-gray-700 dark:hover:text-gray-300">paid subscriptions</Link>. Free plan includes Male and Female default voices
        </div>
      </div>
    </>
  );
} 