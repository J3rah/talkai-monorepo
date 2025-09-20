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

// Legacy voice configs for fallback - will be replaced by database
const legacyVoiceConfigs = [
  {
    id: "male",
    name: "Male",
    description: "A male therapeutic voice",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_MALE_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425',
    parameters: {
      speaking_rate: 1.0,
      pitch: 0.0
    },
    requiredPlan: "calm" // Available to all plans
  },
  {
    id: "female",
    name: "Female",
    description: "A female therapeutic voice",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_FEMALE_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425',
    parameters: {
      speaking_rate: 1.0,
      pitch: 0.0
    },
    requiredPlan: "calm" // Available to all plans
  },
  {
    id: "calm",
    name: "Calm",
    description: "A softer, more soothing voice",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_CALM_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425',
    parameters: {
      speaking_rate: 0.9,
      pitch: -0.2
    },
    requiredPlan: "centered" // Available to Centered and Grounded
  },
  {
    id: "energetic",
    name: "Energetic",
    description: "A more dynamic and engaging voice",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_ENERGETIC_CONFIG_ID || '8a80af40-ec14-4da0-afeb-d11008491410',
    parameters: {
      speaking_rate: 1.1,
      pitch: 0.2
    },
    requiredPlan: "centered" // Available to Centered and Grounded
  },
  {
    id: "professional",
    name: "Professional",
    description: "A clear and authoritative voice",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_PROFESSIONAL_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425',
    parameters: {
      speaking_rate: 1.0,
      pitch: 0.0
    },
    requiredPlan: "grounded" // Available to Grounded only
  },
  {
    id: "friendly",
    name: "Friendly",
    description: "A warm and approachable voice",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_FRIENDLY_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425',
    parameters: {
      speaking_rate: 1.0,
      pitch: 0.1
    },
    requiredPlan: "grounded" // Available to Grounded only
  },
  {
    id: "sass",
    name: "Sass",
    description: "A friendly, down-to-earth voice with a western charm",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_SASS_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425',
    parameters: {
      speaking_rate: 0.95,
      pitch: -0.1
    },
    requiredPlan: "grounded" // Available to Grounded only
  },
  {
    id: "jacksparrow",
    name: "The Pirate",
    description: "A charismatic and witty voice inspired by legendary pirates",
    base_voice: "ITO",
    configId: process.env.NEXT_PUBLIC_HUME_JACKSPARROW_CONFIG_ID || 'a608626e-23e0-4070-8e24-dc880d34000b',
    parameters: {
      speaking_rate: 0.95,
      pitch: 0.1
    },
    requiredPlan: "grounded" // Available to Grounded only
  }
  // {
  //   id: "freud",
  //   name: "Dr. Sigmond Freud",
  //   description: "A thoughtful, analytical voice inspired by Dr. Freud",
  //   base_voice: "ITO",
  //   configId: process.env.NEXT_PUBLIC_HUME_SIGMONDFREUD_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425',
  //   parameters: {
  //     speaking_rate: 0.95,
  //     pitch: -0.15
  //   },
  //   requiredPlan: "grounded" // Available to Grounded only
  // }
];

// Function to filter voices based on subscription plan
// Legacy function - now handled by database utilities

interface StartCallProps {
  onVoiceSelect: (configId: string) => void;
  onTherapistNameChange?: (name: string) => void;
  hideFixedButton?: boolean;
  triggerOpen?: boolean;
  onDialogChange?: (open: boolean) => void;
}

export default function StartCall({ onVoiceSelect, onTherapistNameChange, hideFixedButton, triggerOpen, onDialogChange }: StartCallProps) {
  const { connect, disconnect, status } = useVoice();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionConnected, setSessionConnected] = useState(false); // new flag
  const [modalStep, setModalStep] = useState(1);
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfiguration | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [therapistName, setTherapistName] = useState("Talk Therapist");
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string>('calm');
  const [voiceGroups, setVoiceGroups] = useState<VoiceConfigurationGroup[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isDataSavingAllowed, setIsDataSavingAllowed] = useState(true);
  const [dataSavingPreference, setDataSavingPreference] = useState(false);
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
      const dataSavingPreference = profile?.data_saving_preference || false;

      console.log('StartCall: Data saving check results:', {
        subscriptionStatus,
        dataSavingPreference,
        userId
      });

      // Rules:
              // 1. Calm users: Never save data (regardless of preference)
              // 2. Centered/Grounded users: Save only if preference is enabled
      let allowSaving = false;
      
              if (subscriptionStatus === 'calm') {
          allowSaving = false;
          console.log('StartCall: 🚫 Data saving disabled: Calm tier users cannot save data');
              } else if (subscriptionStatus === 'centered' || subscriptionStatus === 'grounded') {
        allowSaving = dataSavingPreference;
        console.log(`StartCall: ${allowSaving ? '✅' : '🚫'} Data saving ${allowSaving ? 'enabled' : 'disabled'}: ${subscriptionStatus} user preference set to ${dataSavingPreference}`);
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
  
  // Check if we're in trial mode - use useMemo to prevent infinite re-renders
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
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
        
        // Check data saving permission if user is authenticated
        if (user) {
          await checkDataSavingPermission(user.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [isTrialMode]);

  // Fetch user's saved voice preference, therapist name, and subscription status when modal opens (not just on mount)
  useEffect(() => {
    console.log('🎵 StartCall: Modal state changed. isOpen:', isOpen, 'isTrialMode:', isTrialMode);
    if (!isOpen) {
      // Reset voice groups when modal closes to force fresh fetch next open
      console.log('🎵 StartCall: Modal closed, resetting voice state');
      setVoiceGroups([]);
      setSelectedVoice(null);
      setIsLoadingVoices(true);
      return;
    }
    const fetchUserPreferences = async () => {
      console.log('🎵 StartCall: fetchUserPreferences called');
      setIsLoadingVoices(true);
      try {
        let subscriptionStatus = 'calm';
        let savedVoiceConfigId = null;
        let savedTherapistName = null;
        let savedDataSavingPreference = false;

        // Always fetch fresh user and profile
        const { data: { user } } = await supabase.auth.getUser();
        console.log('🎵 StartCall: User data:', user ? 'Found user' : 'No user');
        
        if (user) {
          console.log('🎵 StartCall: Fetching profile for user:', user.id);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('voice_config_id, voice_parameters, therapist_name, subscription_status, data_saving_preference')
            .eq('id', user.id)
            .single();

          console.log('🎵 StartCall: Profile query result:', { profile, error });

          if (profile) {
            subscriptionStatus = profile.subscription_status || 'calm';
            savedVoiceConfigId = profile.voice_config_id;
            savedTherapistName = profile.therapist_name;
            savedDataSavingPreference = profile.data_saving_preference || false;
          }
        }

        // Set user data
        setUserSubscriptionStatus(subscriptionStatus);
        if (savedTherapistName) {
          setTherapistName(savedTherapistName);
        }
        setDataSavingPreference(savedDataSavingPreference);

        // Fetch voice configurations from database
        console.log('🎵 StartCall: Fetching voice configurations for plan:', subscriptionStatus);
        let groups: VoiceConfigurationGroup[] = [];
        
        try {
          groups = await getAvailableVoiceConfigurations(subscriptionStatus);
          console.log('🎵 StartCall: Fetched voice groups from database:', groups.length);
        } catch (error) {
          console.warn('🎵 StartCall: Failed to fetch from database, using fallback:', error);
          groups = getFallbackVoiceConfigurations();
        }

        setVoiceGroups(groups);

        // Find and set the saved voice or default to first available
        let foundVoice: VoiceConfiguration | null = null;
        
        if (savedVoiceConfigId) {
          // Look for saved voice across all groups
          for (const group of groups) {
            foundVoice = group.voice_configurations.find(config => 
              config.hume_config_id === savedVoiceConfigId
            ) || null;
            if (foundVoice) break;
          }
        }

        // If no saved voice found, default to first available voice
        if (!foundVoice && groups.length > 0 && groups[0].voice_configurations.length > 0) {
          foundVoice = groups[0].voice_configurations[0];
        }

        if (foundVoice) {
          console.log('✅ StartCall: Setting selected voice:', foundVoice.display_name);
          setSelectedVoice(foundVoice);
        }

      } catch (error) {
        console.error('🎵 StartCall: Error fetching user preferences:', error);
        // Fallback to default configurations
        const fallbackGroups = getFallbackVoiceConfigurations();
        setVoiceGroups(fallbackGroups);
        if (fallbackGroups.length > 0 && fallbackGroups[0].voice_configurations.length > 0) {
          setSelectedVoice(fallbackGroups[0].voice_configurations[0]);
        }
      } finally {
        setIsLoadingVoices(false);
      }
    };
    if (isOpen && !isTrialMode) {
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
  }, [isOpen, isTrialMode]);

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
    onDialogChange?.(isOpen);
    if (!isOpen) {
      setModalStep(1); // Reset to first step when dialog closes
    }
  }, [isOpen, onDialogChange]);

  const handleStartSession = () => {
    setIsOpen(true);
    setModalStep(1);
  };

  const handleVoiceSelect = (config: VoiceConfiguration) => {
    console.log('🎵 StartCall: Selecting voice:', config.display_name, 'ID:', config.id);
    setSelectedVoice(config);
    if (config.hume_config_id) {
      console.log('✅ StartCall: Using config ID:', config.hume_config_id);
      onVoiceSelect(config.hume_config_id);
    } else {
      console.error('❌ StartCall: No config ID available for voice:', config.internal_name);
    }
    // Automatically move to next step
    console.log('🎵 StartCall: Moving to step 2');
    setModalStep(2);
  };

  const handleNameSet = () => {
    onTherapistNameChange?.(therapistName);
          // For calm users, skip data saving step since they can't save data
      if (userSubscriptionStatus === 'calm' || isTrialMode) {
      setModalStep(4); // Skip data saving preference step
    } else {
      setModalStep(3); // Go to data saving preference step
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
    // Move to final step
    setModalStep(4);
  };

  const handleConnect = async () => {
    if (isConnecting) return;
    
    // Show terms agreement popup first
    setShowTermsAgreement(true);
    setIsOpen(false); // Close the main modal
  };

  const handleTermsAgree = async () => {
    setShowTermsAgreement(false);
    setIsConnecting(true);
    try {
      console.log('Attempting to connect...');
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

      await (connect as any)();
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

  const renderModalContent = () => {
    switch (modalStep) {
      case 1:
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">
                Choose Your Voice
              </DialogTitle>
              <DialogDescription className="text-center">
                {isTrialMode ? 'Select a voice for your free trial session' : 'Select your preferred therapist voice'}
              </DialogDescription>
              {userSubscriptionStatus === 'calm' && (
                <div className="text-sm text-amber-600 mt-2">
                  You're on the Calm plan. Only Male and Female voices are available.
                </div>
              )}
                              {userSubscriptionStatus === 'centered' && (
                  <div className="text-sm text-blue-600 mt-2">
                    You're on the Centered plan. Upgrade to Grounded for all voices.
                  </div>
                )}
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {isLoadingVoices ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                voiceGroups.map((group) => (
                  <div key={group.id} className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-center">{group.display_name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground text-center">{group.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
                      {group.voice_configurations.map((config) => (
                        <div
                          key={config.id}
                          className={`relative p-3 sm:p-4 lg:p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 touch-manipulation min-h-[100px] sm:min-h-[120px] ${
                            selectedVoice?.id === config.id
                              ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => {
                            console.log('🎵 StartCall: Voice card clicked:', config.display_name);
                            handleVoiceSelect(config);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleVoiceSelect(config);
                            }
                          }}
                        >
                          {/* Selection indicator */}
                          {selectedVoice?.id === config.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          <h4 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 pr-6 sm:pr-8 text-center">{config.display_name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2 text-center">{config.description}</p>
                          <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block text-center w-full">
                            Plan: {config.required_plan.charAt(0).toUpperCase() + config.required_plan.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {userSubscriptionStatus !== 'grounded' && (
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl mx-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Want access to more voices?
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open('/subscription', '_blank');
                    }}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">
                Set Therapist Name
              </DialogTitle>
              <DialogDescription className="text-center">
                {isTrialMode 
                  ? "Customize your AI therapist's name for this trial session"
                  : "Customize your AI therapist's name"
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <span className="text-2xl">🎤</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected Voice: <span className="font-medium text-foreground">{selectedVoice?.display_name}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="therapist-name" className="text-center block">Therapist Name</Label>
                <Input
                  id="therapist-name"
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  placeholder="Enter therapist name"
                  className="text-center text-lg"
                />
              </div>

              <div className="flex gap-3 max-w-xs mx-auto">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNameSet}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">
                Data Saving Preference
              </DialogTitle>
              <DialogDescription className="text-center">
                Choose whether to save your conversation data for future reference
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <span className="text-2xl">💾</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected Voice: <span className="font-medium text-foreground">{selectedVoice?.display_name}</span> • 
                  Therapist: <span className="font-medium text-foreground">{therapistName}</span>
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="data-saving-preference"
                    checked={dataSavingPreference}
                    onChange={(e) => setDataSavingPreference(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  />
                  <div className="flex-1">
                    <label htmlFor="data-saving-preference" className="text-sm font-medium cursor-pointer">
                      Save Conversation Data
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Allow saving conversation data for future reference and analytics
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">What this means:</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• <strong>Enabled:</strong> Your conversations will be saved for session history and analytics</li>
                  <li>• <strong>Disabled:</strong> No conversation data will be stored (privacy mode)</li>
                  <li>• You can change this preference anytime in your dashboard</li>
                </ul>
              </div>

              <div className="flex gap-3 max-w-xs mx-auto">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(2)}
                  className="px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleDataPreferenceSet}
                  className="px-6"
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">
                Ready to Begin
              </DialogTitle>
              <DialogDescription className="text-center">
                {isTrialMode ? 'Your free trial session is ready to start' : 'Your therapy session is ready to start'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-2">
                  <span className="text-3xl">🚀</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">Voice:</span>
                    <span className="font-medium">{selectedVoice?.display_name}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">Therapist:</span>
                    <span className="font-medium">{therapistName}</span>
                  </div>
                  {!isTrialMode && userSubscriptionStatus !== 'calm' && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-muted-foreground">Data Saving:</span>
                      <span className="font-medium">{dataSavingPreference ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  )}
                </div>
              </div>

              {isTrialMode && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Trial Session Features:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• 5 minutes of AI therapy conversation</li>
                    <li>• Real-time emotion detection</li>
                    <li>• Personalized responses</li>
                    <li>• No account required</li>
                  </ul>
                </div>
              )}

              <div className="flex gap-3 max-w-xs mx-auto">
                <Button
                  variant="outline"
                  onClick={() => setModalStep(userSubscriptionStatus === 'calm' || isTrialMode ? 2 : 3)}
                  className="px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConnect}
                  className="px-6 bg-primary hover:bg-primary/90"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Starting..." : "Begin Session"}
                </Button>
              </div>
            </div>
          </>
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
          className={`
            fixed bottom-20 left-1/2 -translate-x-1/2 z-50
            md:top-1/2 md:bottom-auto md:-translate-y-1/2
            transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-primary/80 hover:text-primary-foreground
          `}
        >
          {isTrialMode ? 'Start Free Trial' : 'Start Session'}
        </Button>
      )}

      {/* Terms Agreement Dialog */}
      <Dialog open={showTermsAgreement} onOpenChange={setShowTermsAgreement}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-center text-xl font-bold text-red-600">
              IMPORTANT MEDICAL DISCLAIMER
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Please read and agree to the following before starting your session
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 font-medium text-sm leading-relaxed">
                TalkAI is NOT a medical device, healthcare provider, or substitute for professional mental health care. 
                This service is for informational and emotional support purposes only.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">By using this service, you understand that:</h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>This AI cannot diagnose mental health conditions or provide medical advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>This service is not suitable for mental health emergencies or crisis situations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>If you are experiencing thoughts of self-harm, please contact emergency services (911) or the 988 Suicide & Crisis Lifeline immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>For serious mental health conditions, please consult with licensed mental health professionals</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                <strong>Emergency Resources:</strong> If you're in crisis, call 911, contact the 988 Suicide & Crisis Lifeline, 
                or visit your nearest emergency room. Do not use this service for emergencies.
              </p>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>
                By clicking "I Agree" below, you acknowledge that you have read and understood this disclaimer, 
                and you agree to our{" "}
                <a href="/terms" target="_blank" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="text-primary hover:underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowTermsAgreement(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTermsAgree}
              disabled={isConnecting}
              className="px-6 bg-primary hover:bg-primary/90"
            >
              {isConnecting ? "Starting..." : "I Agree - Start Session"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Multi-Step Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="mobile-dialog !w-[95vw] !max-w-4xl !h-[90vh] !max-h-[90vh] overflow-hidden flex flex-col !p-0 !gap-0">
          <div className="flex-1 overflow-y-auto">
            {renderModalContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
