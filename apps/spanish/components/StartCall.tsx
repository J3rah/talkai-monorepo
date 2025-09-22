"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useState, useEffect, useMemo } from "react";
import supabase from "@/supabaseClient";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { getAvailableVoiceConfigurations, getFallbackVoiceConfigurations, VoiceConfigurationGroup, VoiceConfiguration } from "@/utils/voiceConfigUtils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Mic, User, Database, Rocket, Shield, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { getClientAccessToken } from "@/utils/getClientAccessToken";
import VoiceSamplePlayer from './VoiceSamplePlayer';
import { Tooltip } from './ui/tooltip';
import { t } from "@/lib/i18n";

interface StartCallProps {
  onVoiceSelect: (configId: string) => void;
  onTherapistNameChange?: (name: string) => void;
  hideFixedButton?: boolean;
  triggerOpen?: boolean;
  onDialogChange?: (open: boolean) => void;
}

export default function StartCall({ onVoiceSelect, onTherapistNameChange, hideFixedButton, triggerOpen, onDialogChange }: StartCallProps) {
  const { connect, disconnect, status, sendSessionSettings, sendAssistantInput } = useVoice();
  const [hasInjectedName, setHasInjectedName] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionConnected, setSessionConnected] = useState(false); 
  const [modalStep, setModalStep] = useState(1);
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfiguration | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [therapistName, setTherapistName] = useState("Talk Therapist");
  // Track the user's subscription tier. Initialise as 'loading' so UI can wait until we have real data
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string>('loading');
  const [voiceGroups, setVoiceGroups] = useState<VoiceConfigurationGroup[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [hasPrefetchedPrefs, setHasPrefetchedPrefs] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isDataSavingAllowed, setIsDataSavingAllowed] = useState(true);
  const [dataSavingPreference, setDataSavingPreference] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if data saving is allowed based on user subscription and preferences
  const checkDataSavingPermission = async (userId: string) => {
    try {
      console.log('StartCall: Checking data saving permission for user:', userId);
      
      // Get user profile with subscription status and data saving preference
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, data_saving_preference')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('StartCall: Error fetching user profile for data saving check:', error);
        // Default to allowing data saving if we can't fetch profile
        setIsDataSavingAllowed(true);
        return true;
      }

      const subscriptionStatus = profile?.subscription_status || 'calm';
      // Preserve the raw preference so we can detect an explicit opt-out (false) versus undefined
      const dataSavingPreference = profile?.data_saving_preference;

      console.log('StartCall: Data saving check results:', {
        subscriptionStatus,
        dataSavingPreference,
        userId
      });

      // Rules:
      // 1. Calm users: Never save data (regardless of preference)
      // 2. Centered/Grounded users: Save by default unless the user explicitly opted out (preference === false)
      let allowSaving = false;

      if (subscriptionStatus === 'calm') {
        allowSaving = false;
        console.log('StartCall: 🚫 Data saving disabled: Calm tier users cannot save data');
      } else if (subscriptionStatus === 'centered' || subscriptionStatus === 'grounded') {
        allowSaving = dataSavingPreference !== false;
        console.log(`StartCall: ${allowSaving ? '✅' : '🚫'} Data saving ${allowSaving ? 'enabled' : 'disabled'} for ${subscriptionStatus} tier. Explicit preference = ${dataSavingPreference}`);
      } else {
        allowSaving = false;
        console.log('StartCall: 🚫 Data saving disabled: Unknown subscription status');
      }

      setIsDataSavingAllowed(allowSaving);
      return allowSaving;
    } catch (error) {
      console.error('StartCall: Error in checkDataSavingPermission:', error);
      // Default to allowing data saving on error
      setIsDataSavingAllowed(true);
      return true;
    }
  };
  
  // -----------------------
  // Helper: fetch user preferences & voices
  // -----------------------
  const PREFETCH_MAX_RETRIES = 3;
  const PREFETCH_RETRY_DELAY = 1500;

  const fetchUserPreferences = async (attempt: number = 0): Promise<void> => {
    console.log('🎵 StartCall: fetchUserPreferences called');

    let subscriptionStatus: string = 'calm';
    let savedVoiceConfigId: string | null = null;
    let savedTherapistName: string | null = null;
    let savedDataSavingPreference: boolean = false;

    try {
      // Always fetch fresh user and profile with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('StartCall user fetch timeout')), 3000)
      );

      let { data: { user } } = await Promise.race([supabase.auth.getUser(), timeoutPromise]) as any;

      if (!user) {
        console.warn('🎵 StartCall: getUser returned null, trying getSession');
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user ?? null;
      }

        console.log('🎵 StartCall: User data:', user ? 'Found user' : 'No user');
        
        if (user) {
          console.log('🎵 StartCall: Fetching profile for user:', user.id);
          const { data: profile, error } = await supabase
            .from('profiles')
          .select('voice_config_id, voice_parameters, therapist_name, subscription_status, data_saving_preference, full_name')
            .eq('id', user.id)
            .single();

          console.log('🎵 StartCall: Profile query result:', { profile, error });

          if (profile) {
            subscriptionStatus = profile.subscription_status || 'calm';
            savedVoiceConfigId = profile.voice_config_id;
            savedTherapistName = profile.therapist_name;
            savedDataSavingPreference = profile.data_saving_preference || false;
          setUserName(profile.full_name || '');
        }
      }

      // Ensure we leave loading state
      setUserSubscriptionStatus(subscriptionStatus || 'calm');
      if (savedTherapistName) setTherapistName(savedTherapistName);
        setDataSavingPreference(savedDataSavingPreference);

      // Fetch voice configurations
        let groups: VoiceConfigurationGroup[] = [];
      try {
        const fetchedGroups = await getAvailableVoiceConfigurations(subscriptionStatus);
        // Remove deprecated voices
        const voicesToRemove = ['professional', 'friendly'];
        groups = fetchedGroups.map(g => ({
          ...g,
          voice_configurations: g.voice_configurations.filter(c => !voicesToRemove.includes(c.internal_name))
        })).filter(g => g.voice_configurations.length > 0);
      } catch (err) {
        console.warn('🎵 StartCall: Failed DB fetch, using fallback', err);
          groups = getFallbackVoiceConfigurations();
        }

        setVoiceGroups(groups);

      // Attempt to restore saved voice
        let foundVoice: VoiceConfiguration | null = null;
        if (savedVoiceConfigId) {
        for (const g of groups) {
          foundVoice = g.voice_configurations.find(c => c.hume_config_id === savedVoiceConfigId) || null;
            if (foundVoice) break;
          }
        }
      if (!foundVoice && groups[0]?.voice_configurations?.length) {
          foundVoice = groups[0].voice_configurations[0];
        }
      if (foundVoice) setSelectedVoice(foundVoice);

    } catch (err) {
      console.error('🎵 StartCall: fetchUserPreferences unexpected error', err);
      if (userSubscriptionStatus === 'loading') setUserSubscriptionStatus('calm');
        const fallbackGroups = getFallbackVoiceConfigurations();
        setVoiceGroups(fallbackGroups);
      if (fallbackGroups[0]?.voice_configurations?.length) {
          setSelectedVoice(fallbackGroups[0].voice_configurations[0]);
        }
      } finally {
        setIsLoadingVoices(false);
    }
  };

  // -----------------------
  const isTrialMode = useMemo(() => {
    const trialMode = searchParams.get('trial') === 'true';
    console.log('StartCall: isTrialMode =', trialMode);
    return trialMode;
  }, [searchParams]);

  // Check authentication status (skip in trial mode)
  useEffect(() => {
    const checkAuth = async () => {
      if (isTrialMode) {
        console.log('StartCall: Trial mode, skipping auth check');
        setIsAuthenticated(false);
        return;
      }

      try {
        // Timeout guard
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('StartCall auth check timeout')), 3000)
        );

        let { data: { user } } = await Promise.race([supabase.auth.getUser(), timeoutPromise]) as any;

        if (!user) {
          // Fallback if getUser failed right after navigation
          const { data: { session } } = await supabase.auth.getSession();
          user = session?.user ?? null;
        }

        setIsAuthenticated(!!user);
        if (user) {
          await checkDataSavingPermission(user.id);
        }

      } catch (error) {
        console.error('StartCall: auth check failed', error);
        
        // Handle auth errors gracefully
        if (error?.message?.includes('Invalid Refresh Token') || 
            error?.message?.includes('Refresh Token Not Found')) {
          console.warn('Refresh token error in StartCall, redirecting to auth...');
          window.location.href = '/auth?error=session_expired&message=Your session has expired. Please sign in again.';
          return;
        }
        
        setIsAuthenticated(false);
      }
    };
    if (isOpen && !isTrialMode && !hasPrefetchedPrefs) {
      console.log('🎵 StartCall: Modal opened for authenticated user, fetching preferences');
      fetchUserPreferences();
    } else if (isOpen && isTrialMode) {
      console.log('🎵 StartCall: Modal opened for trial mode, setting calm voices');
      setIsLoadingVoices(true);
      setUserSubscriptionStatus('calm');
      try {
        const groups = getFallbackVoiceConfigurations();
        setVoiceGroups(groups);
        if (groups.length > 0 && groups[0].voice_configurations.length > 0) {
          setSelectedVoice(groups[0].voice_configurations[0]);
        }
      } catch (error) {
        console.error('Error setting up trial voices:', error);
      } finally {
        setIsLoadingVoices(false);
      }
    }
  }, [isOpen, isTrialMode, hasPrefetchedPrefs]);

  // Prefetch user preferences on initial mount so Step 1 has data immediately
  useEffect(() => {
    if (isTrialMode) return; // skip for trial users
    if (hasPrefetchedPrefs) return;

    (async () => {
      await fetchUserPreferences();
      setHasPrefetchedPrefs(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrialMode]);

  // Check for restored session on mount and auto-connect
  useEffect(() => {
    const restoredSession = localStorage.getItem('restoredSession');
    if (restoredSession && status.value !== "connected" && !isConnecting) {
      const { sessionId } = JSON.parse(restoredSession);
      if (sessionId) {
        setIsRestoringSession(true);
        setCurrentSessionId(sessionId);
        localStorage.setItem('currentTherapySessionId', sessionId);
        setStartTime(Date.now());
        // Connect immediately without delay
        handleConnect();
      }
    }
  }, []);

  // Handle dialog open/close
  useEffect(() => {
    if (sessionConnected) return; // once connected, never reopen the main modal
    console.log('🚀 StartCall: triggerOpen useEffect called with:', { triggerOpen, isOpen });
    if (triggerOpen && !isOpen) {
      console.log('🚀 StartCall: Opening modal due to triggerOpen');
      setIsOpen(true);
      setModalStep(1); // Reset to first step
      onDialogChange?.(true);
    }
  }, [triggerOpen, isOpen, onDialogChange]);

  useEffect(() => {
    if (!isOpen) {
      setModalStep(1); // Reset to first step when dialog closes
    }
  }, [isOpen]);

  const handleStartSession = () => {
    setIsOpen(true);
    setModalStep(1);
  };

  const handleVoiceSelect = (config: VoiceConfiguration) => {
    console.log('🎵 StartCall: Selecting voice:', config.display_name, 'ID:', config.id);
    setSelectedVoice(config);
    if (config.hume_config_id) {
      console.log('✅ StartCall: Using config ID:', config.hume_config_id);
      try {
        // Persist the chosen voice so Messages can resolve the agent name immediately
        sessionStorage.setItem('currentVoiceConfigId', config.hume_config_id);
        if (config.display_name) sessionStorage.setItem('currentVoiceDisplayName', config.display_name);
        if (config.internal_name) sessionStorage.setItem('currentVoiceInternalName', config.internal_name);
        if (config.character_name) sessionStorage.setItem('currentVoiceCharacterName', config.character_name);
      } catch (e) {
        console.warn('StartCall: Failed to persist current voice selection to sessionStorage:', e);
      }
      onVoiceSelect(config.hume_config_id);
      // Move to next step based on user subscription
      if (userSubscriptionStatus === 'calm' || isTrialMode) {
        setModalStep(2); // Go to disclaimer for calm users
      } else {
        setModalStep(2); // Go to data saving preference for non-calm users
      }
    } else {
      console.error('❌ StartCall: No config ID available for voice:', config.internal_name);
    }
  };

  const handleNameSet = () => {
    onTherapistNameChange?.(therapistName);
    // For calm users, go to disclaimer step directly
    if (userSubscriptionStatus === 'calm' || isTrialMode) {
      setModalStep(2); // Go to disclaimer step
    } else {
      setModalStep(2); // Go to data saving preference step
    }
  };

  const handleDataPreferenceSet = async () => {
    // Save the data preference to the database for authenticated users
    if (!isTrialMode && isAuthenticated) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ data_saving_preference: dataSavingPreference })
            .eq('id', user.id);
          
          if (error) {
            console.error('Error saving data preference:', error);
          } else {
            console.log('Data saving preference updated:', dataSavingPreference);
            // Update the local state
            setIsDataSavingAllowed(dataSavingPreference);
          }
        }
      } catch (error) {
        console.error('Error updating data preference:', error);
      }
    }
    // Move to ready to begin step (step 3 for non-calm users)
    setModalStep(3);
  };

  const handleConnect = async () => {
    if (isConnecting) return;
    
    // For centered and grounded users, they already saw the disclaimer in step 4, so skip the popup
    if (userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded') {
      setIsConnecting(true);
      try {
        console.log('Attempting to connect...');
        
        // Get access token for authentication
        const accessToken = await getClientAccessToken();
        if (!accessToken) {
          throw new Error('Failed to get access token');
        }
        
        // Set a shorter timeout for connection
        const connectionTimeout = setTimeout(() => {
          if (isConnecting) {
            setIsConnecting(false);
            console.error('Connection timed out');
            if (connectionAttempts >= 2) { // Reduced max attempts
              setIsRestoringSession(false);
            }
          }
        }, 5000); // Reduced timeout to 5 seconds

        await connect({
          auth: { type: 'accessToken', value: accessToken },
          configId: selectedVoice?.hume_config_id,
          audioConstraints: {
            echoCancellation: true,
            noiseSuppression: true
          }
        } as any);
        clearTimeout(connectionTimeout);
        console.log('Connection successful');
        setSessionConnected(true); // permanently disable the main modal
        setIsOpen(false);
        setIsRestoringSession(false);
        setConnectionAttempts(0);
      } catch (error) {
        console.error('Failed to connect:', error);
        if (isRestoringSession && connectionAttempts < 2) { // Reduced max attempts
          setConnectionAttempts(prev => prev + 1);
          // Shorter retry delay
          setTimeout(() => {
            handleConnect();
          }, 500 * connectionAttempts); // Linear backoff instead of exponential
        } else {
          setIsRestoringSession(false);
        }
      } finally {
        setIsConnecting(false);
      }
      return;
    }
    
    // For calm users and trial users, show terms agreement popup first
    setShowTermsAgreement(true);
    setIsOpen(false); // Close the main modal
  };

  const handleTermsAgree = async () => {
    setShowTermsAgreement(false);
    setIsConnecting(true);
    try {
      console.log('Attempting to connect...');
      
      // Get access token for authentication
      const accessToken = await getClientAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get access token');
      }
      
      // Set a shorter timeout for connection
      const connectionTimeout = setTimeout(() => {
        if (isConnecting) {
          setIsConnecting(false);
          console.error('Connection timed out');
          if (connectionAttempts >= 2) { // Reduced max attempts
            setIsRestoringSession(false);
          }
        }
      }, 5000); // Reduced timeout to 5 seconds

      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: selectedVoice?.hume_config_id,
        audioConstraints: {
          echoCancellation: true,
          noiseSuppression: true
        }
      } as any);
      clearTimeout(connectionTimeout);
      console.log('Connection successful');
      setSessionConnected(true); // permanently disable the main modal
      setIsOpen(false);
      setIsRestoringSession(false);
      setConnectionAttempts(0);
    } catch (error) {
      console.error('Failed to connect:', error);
      if (isRestoringSession && connectionAttempts < 2) { // Reduced max attempts
        setConnectionAttempts(prev => prev + 1);
        // Shorter retry delay
        setTimeout(() => {
          handleTermsAgree();
        }, 500 * connectionAttempts); // Linear backoff instead of exponential
      } else {
        setIsRestoringSession(false);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle connection status changes
  useEffect(() => {
    if (status.value === "connected") {
      setIsRestoringSession(false);
      setConnectionAttempts(0);
      setSessionConnected(true); // safety: ensure flag set on connection status
    } else if (status.value === "disconnected" && isRestoringSession && !isConnecting) {
      // Connect immediately without delay
      handleConnect();
    }
  }, [status.value, isRestoringSession]);

  // Create therapy session immediately when connecting
  useEffect(() => {
    const createTherapySession = async () => {
      if (status.value === "connected" && !currentSessionId) {
        // Skip therapy session creation in trial mode
        if (isTrialMode) {
          console.log('StartCall: Trial mode, skipping therapy session creation');
          return;
        }

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Check if data saving is allowed for this user
          const canSaveData = await checkDataSavingPermission(user.id);
          if (!canSaveData) {
            console.log('StartCall: 🚫 Therapy session creation skipped: Data saving not allowed for this user');
            return;
          }

          const { data: session, error } = await supabase
            .from('therapy_sessions')
            .insert({
              user_id: user.id,
              status: 'in_progress',
              duration: 0
            })
            .select()
            .single();

          if (error) throw error;
          setCurrentSessionId(session.id);
          localStorage.setItem('currentTherapySessionId', session.id);
          setStartTime(Date.now());
        } catch (error) {
          console.error('Error creating therapy session:', error);
        }
      }
    };

    createTherapySession();
  }, [status.value, currentSessionId, isTrialMode]);

  useEffect(() => {
    const updateSessionDuration = async () => {
      if (status.value !== "connected" && currentSessionId && startTime && !isRestoringSession) {
        // Skip session duration update in trial mode
        if (isTrialMode) {
          console.log('StartCall: Trial mode, skipping session duration update');
          return;
        }

        // Additional check: only update if data saving is allowed
        if (!isDataSavingAllowed) {
          console.log('StartCall: 🚫 Session duration update skipped: Data saving not allowed');
          return;
        }

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
  }, [status.value, currentSessionId, startTime, isRestoringSession, isTrialMode, isDataSavingAllowed]);

  // Inject user name into session context on first connection
  useEffect(() => {
    if (status.value === "connected" && !hasInjectedName) {
      let cancelled = false;
      (async () => {
        try {
          // Small delay to ensure Hume pipeline is ready
          await new Promise(resolve => setTimeout(resolve, 350));

          // Add a timeout so we don't block greeting if profile fetch is slow
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('StartCall: name fetch timeout')), 1500)
          );

          const { data: { user } } = await Promise.race([supabase.auth.getUser(), timeoutPromise]) as any;
          let name = '';

          if (user) {
            try {
              const profilePromise = supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();
              const { data: profile } = await Promise.race([profilePromise, timeoutPromise]) as any;
              name = profile?.full_name || '';
            } catch (innerErr) {
              console.warn('StartCall: profile fetch slow/failed, using fallback greeting', innerErr);
            }
          }

          const greeting = name
            ? `Hello ${name}, how are you doing today?`
            : 'Hello! How are you doing today?';

          try {
            await sendSessionSettings({ context: { text: greeting, type: 'persistent' } });
          } catch (ctxErr) {
            console.warn('StartCall: sendSessionSettings failed, continuing with assistant input', ctxErr);
          }

          await sendAssistantInput(greeting);
          if (!cancelled) setHasInjectedName(true);
        } catch (error) {
          console.error('StartCall: Failed to inject user name into session context:', error);
          // Fallback: always send a basic greeting so the session starts
          try {
            const fallback = 'Hello! How are you doing today?';
            try {
              await sendSessionSettings({ context: { text: fallback, type: 'persistent' } });
            } catch {}
            await sendAssistantInput(fallback);
            if (!cancelled) setHasInjectedName(true);
          } catch (finalErr) {
            console.error('StartCall: Fallback greeting failed:', finalErr);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }
  }, [status.value, hasInjectedName, sendSessionSettings, sendAssistantInput]);

  // Helper function to get subscription access levels for a voice
  const getSubscriptionAccessLevels = (requiredPlan: string): string[] => {
    switch (requiredPlan) {
      case 'calm':
        return ['Calm', 'Centered', 'Grounded'];
      case 'centered':
        return ['Centered', 'Grounded'];
      case 'grounded':
        return ['Grounded'];
      default:
        return [requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)];
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Mic className="w-6 h-6" />;
      // case 2: return <User className="w-6 h-6" />; // COMMENTED OUT - therapist naming step
      case 2: return userSubscriptionStatus === 'calm' || isTrialMode ? <Shield className="w-6 h-6" /> : <Database className="w-6 h-6" />;
      case 3: return userSubscriptionStatus === 'calm' || isTrialMode ? <Rocket className="w-6 h-6" /> : <Shield className="w-6 h-6" />;
      case 4: return <Rocket className="w-6 h-6" />;
      default: return <Mic className="w-6 h-6" />;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return t('voiceSelection.chooseVoice');
      // case 2: return "Set Therapist Name"; // COMMENTED OUT - therapist naming step
      case 2: return userSubscriptionStatus === 'calm' || isTrialMode ? t('voiceSelection.medicalDisclaimer') : t('voiceSelection.dataSavingPreference');
      case 3: return userSubscriptionStatus === 'calm' || isTrialMode ? t('voiceSelection.readyToBegin') : t('voiceSelection.medicalDisclaimer');
      case 4: return t('voiceSelection.readyToBegin');
      default: return t('voiceSelection.chooseVoice');
    }
  };

  const renderModalContent = () => {
    // While we are still determining the user subscription tier, show a small spinner instead of defaulting to Calm
    if (userSubscriptionStatus === 'loading') {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      );
    }
    switch (modalStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('voiceSelection.chooseVoice')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {isTrialMode ? t('voiceSelection.selectTrialVoice') : ''}
                </p>
                {/* Plan indicator */}
                {userSubscriptionStatus === 'calm' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm mt-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    {t('voiceSelection.calmPlan')}
                  </div>
                )}
                {userSubscriptionStatus === 'centered' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mt-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {t('voiceSelection.centeredPlan')}
                  </div>
                )}
                {userSubscriptionStatus === 'grounded' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mt-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {userName ? t('voiceSelection.groundedPlanWithName', { name: userName }) : t('voiceSelection.groundedPlan')}
                  </div>
                )}
              </div>
            </div>

            {/* Voice Groups */}
            <div className="space-y-8">
              {isLoadingVoices ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                voiceGroups.map((group) => (
                  <div key={group.id} className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.display_name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.voice_configurations.map((config) => (
                        <Card
                          key={config.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] ${
                            selectedVoice?.id === config.id
                              ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 border-blue-200 shadow-lg'
                              : 'hover:border-gray-300 hover:shadow-md'
                          }`}
                          onClick={() => handleVoiceSelect(config)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{config.display_name}</CardTitle>
                              {selectedVoice?.id === config.id && (
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                              )}
                              {/* Only show voice sample player for Brit, Julian, Aven, The Pirate, Zander, Luna, Sass, Nia, Zora, Kai, and Energetic - others will be uncommented as TTS config IDs are added */}
                              {(config.internal_name === 'brit' || config.internal_name === 'julian' || config.internal_name === 'maleprotagonist' || config.internal_name === 'jacksparrow' || config.internal_name === 'male' || config.internal_name === 'female' || config.internal_name === 'sass' || config.internal_name === 'nia' || config.internal_name === 'zora' || config.internal_name === 'kai' || config.internal_name === 'energetic') && (

<VoiceSamplePlayer
                                  key={`${config.internal_name}-${config.hume_config_id}`}
                                  voiceConfigId={config.hume_config_id}
                                  voiceName={config.display_name}
                                  voiceParameters={config.parameters}
                                  className="text-xs"
                                />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Tooltip content={config.description} side="top">
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 cursor-help">
                              {config.description}
                            </p>
                            </Tooltip>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col items-start gap-1">
                                {getSubscriptionAccessLevels(config.required_plan).map((plan) => (
                                  <Badge key={plan} variant="secondary" className="text-xs">
                                    {plan}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Sparkles className="w-3 h-3" />
                                {t('voiceSelection.aiVoice')}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {/* Upgrade prompt */}
              {userSubscriptionStatus !== 'grounded' && (
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="text-center py-6">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('voiceSelection.upgradeTitle')}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('voiceSelection.upgradeDescription')}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/subscription', '_blank')}
                        className="bg-white hover:bg-gray-50"
                      >
                        {t('voiceSelection.viewPlans')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      // COMMENTED OUT - Therapist naming screen (was case 2)
      /*
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set Therapist Name</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {isTrialMode 
                    ? "Customize your AI therapist's name for this trial session"
                    : "Customize your AI therapist's name"
                  }
                </p>
              </div>
            </div>

            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Selected Voice</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVoice?.display_name}</p>
                  {selectedVoice?.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedVoice.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="therapist-name" className="text-sm font-medium">Therapist Name</Label>
                <Input
                  id="therapist-name"
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  placeholder="Enter therapist name"
                  className="h-12 text-center text-lg"
                />
                <p className="text-xs text-gray-500 text-center">
                  This is how your AI therapist will introduce themselves
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setModalStep(1)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNameSet}
                className="flex-1"
                disabled={!therapistName.trim()}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      */

      case 2:
        // For calm users: show disclaimer
        // For non-calm users: show data saving preference
        if (userSubscriptionStatus === 'calm' || isTrialMode) {
          return (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Disclaimer</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Please read and understand the following important information
                  </p>
                </div>
              </div>

              {/* Session Preview */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="py-4">
                  <div className="flex items-center justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-blue-600" />
                      <span>{selectedVoice?.display_name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer Content */}
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="py-6">
                  <p className="text-red-800 dark:text-red-200 font-medium leading-relaxed">
                    TalkAI is NOT a medical device, healthcare provider, or substitute for professional mental health care. 
                    This service is for informational and emotional support purposes only.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">By using this service, you understand that:</h3>
                <div className="space-y-3">
                  {[
                    "This AI cannot diagnose mental health conditions or provide medical advice",
                    "This service is not suitable for mental health emergencies or crisis situations", 
                    "If you are experiencing thoughts of self-harm, please contact emergency services (911) or the 988 Suicide & Crisis Lifeline immediately",
                    "For serious mental health conditions, please consult with licensed mental health professionals"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 dark:text-red-400 font-bold text-sm">•</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-muted/50 dark:bg-muted/30 border-border">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Emergency Resources</p>
                      <p className="text-muted-foreground text-sm">
                        If you're in crisis, call 911, contact the 988 Suicide & Crisis Lifeline, 
                        or visit your nearest emergency room. Do not use this service for emergencies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setModalStep(3)} // Go to ready to begin for calm users
                  className="flex-1"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          );
        } else {
          // Non-calm users: show data saving preference
          return (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Saving Preference</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Choose whether to save your conversation data for future reference
                  </p>
                </div>
              </div>

              {/* Session Preview */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="py-4">
                  <div className="flex items-center justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-blue-600" />
                      <span>{selectedVoice?.display_name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Saving Option */}
              <Card className={`border-2 cursor-pointer transition-all ${
                dataSavingPreference 
                  ? 'border-blue-300 bg-blue-50 dark:bg-blue-950' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setDataSavingPreference(!dataSavingPreference)}>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      dataSavingPreference 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      {dataSavingPreference && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Save Conversation Data</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Allow saving conversation data for future reference and analytics
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Explanation */}
              <Card className="bg-muted/50 dark:bg-muted/30 border-border">
                <CardContent className="py-4">
                  <h4 className="font-medium text-foreground mb-3">What this means:</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span><strong>Enabled:</strong> Your conversations will be saved for session history and analytics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span><strong>Disabled:</strong> No conversation data will be stored (privacy mode)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>You can change this preference anytime in your dashboard</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleDataPreferenceSet} // Save preference and go to disclaimer
                  className="flex-1"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          );
        }

      case 3:
        // For calm users: show ready to begin
        // For non-calm users: show disclaimer
        if (userSubscriptionStatus === 'calm' || isTrialMode) {
          return (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to Begin</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {isTrialMode ? 'Your free trial session is ready to start' : 'Your therapy session is ready to start'}
                  </p>
                </div>
              </div>

              {/* Session Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white">Session Overview</h3>
                
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                        <Mic className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Therapist</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVoice?.display_name}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Trial Features */}
              {isTrialMode && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="py-6">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-4 text-center">Trial Session Features</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                        <CheckCircle className="w-4 h-4" />
                        <span>5 minutes conversation</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                        <CheckCircle className="w-4 h-4" />
                        <span>Real-time emotion detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                        <CheckCircle className="w-4 h-4" />
                        <span>Personalized responses</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                        <CheckCircle className="w-4 h-4" />
                        <span>No account required</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleConnect}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0"
                  disabled={isConnecting}
                  size="lg"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Begin Session
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        } else {
          // Non-calm users: show disclaimer
          return (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Disclaimer</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Please read and understand the following important information
                  </p>
                </div>
              </div>

              {/* Session Preview */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="py-4">
                  <div className="flex items-center justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-blue-600" />
                      <span>{selectedVoice?.display_name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer Content */}
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="py-6">
                  <p className="text-red-800 dark:text-red-200 font-medium leading-relaxed">
                    TalkAI is NOT a medical device, healthcare provider, or substitute for professional mental health care. 
                    This service is for informational and emotional support purposes only.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">By using this service, you understand that:</h3>
                <div className="space-y-3">
                  {[
                    "This AI cannot diagnose mental health conditions or provide medical advice",
                    "This service is not suitable for mental health emergencies or crisis situations", 
                    "If you are experiencing thoughts of self-harm, please contact emergency services (911) or the 988 Suicide & Crisis Lifeline immediately",
                    "For serious mental health conditions, please consult with licensed mental health professionals"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 dark:text-red-400 font-bold text-sm">•</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-muted/50 dark:bg-muted/30 border-border">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Emergency Resources</p>
                      <p className="text-muted-foreground text-sm">
                        If you're in crisis, call 911, contact the 988 Suicide & Crisis Lifeline, 
                        or visit your nearest emergency room. Do not use this service for emergencies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setModalStep(4)} // Go to ready to begin for non-calm users
                  className="flex-1"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          );
        }

      case 4:
        // Only for non-calm users: show ready to begin
        if (userSubscriptionStatus === 'calm' || isTrialMode) {
          // Calm users shouldn't reach step 4, redirect to step 3
          setModalStep(3);
          return null;
        }
        
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to Begin</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Your therapy session is ready to start
                </p>
              </div>
            </div>

            {/* Session Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white">Session Overview</h3>
              
              <div className="grid gap-4">
                <Card>
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                      <Mic className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Therapist</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVoice?.display_name}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                      <Database className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Data Saving</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dataSavingPreference ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setModalStep(3)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleConnect}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0"
                disabled={isConnecting}
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Begin Session
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {!hideFixedButton && status.value !== "connected" && !isRestoringSession && !localStorage.getItem('restoredSession') && (
        <Button
          onClick={handleStartSession}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 md:top-1/2 md:bottom-auto md:-translate-y-1/2 transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          <Rocket className="w-4 h-4 mr-2" />
          {isTrialMode ? 'Start Free Trial' : 'Start Session'}
        </Button>
      )}

      {/* Enhanced Terms Agreement Dialog */}
      <Dialog open={showTermsAgreement} onOpenChange={setShowTermsAgreement}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-red-600">
              IMPORTANT MEDICAL DISCLAIMER
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Please read and agree to the following before starting your session
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-6">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="py-6">
                <p className="text-red-800 font-medium leading-relaxed">
                  TalkAI is NOT a medical device, healthcare provider, or substitute for professional mental health care. 
                  This service is for informational and emotional support purposes only.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">By using this service, you understand that:</h3>
              <div className="space-y-3">
                {[
                  "This AI cannot diagnose mental health conditions or provide medical advice",
                  "This service is not suitable for mental health emergencies or crisis situations", 
                  "If you are experiencing thoughts of self-harm, please contact emergency services (911) or the 988 Suicide & Crisis Lifeline immediately",
                  "For serious mental health conditions, please consult with licensed mental health professionals"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 dark:text-red-400 font-bold text-sm">•</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-muted/50 dark:bg-muted/30 border-border">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Emergency Resources</p>
                    <p className="text-muted-foreground text-sm">
                      If you're in crisis, call 911, contact the 988 Suicide & Crisis Lifeline, 
                      or visit your nearest emergency room. Do not use this service for emergencies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>
                By clicking "I Agree" below, you acknowledge that you have read and understood this disclaimer, 
                and you agree to our{" "}
                <a href="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setShowTermsAgreement(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTermsAgree}
              disabled={isConnecting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Starting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I Agree - Start Session
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Main Multi-Step Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          onDialogChange?.(false);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          {/* Accessibility header (visually hidden) */}
          <DialogHeader className="sr-only">
            <DialogTitle>Start Session</DialogTitle>
            <DialogDescription>Choose options and begin your session</DialogDescription>
          </DialogHeader>
          {/* Progress indicator */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Step {modalStep} of {userSubscriptionStatus === 'calm' || isTrialMode ? 3 : 4}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((modalStep / (userSubscriptionStatus === 'calm' || isTrialMode ? 3 : 4)) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(modalStep / (userSubscriptionStatus === 'calm' || isTrialMode ? 3 : 4)) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Modal content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderModalContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
