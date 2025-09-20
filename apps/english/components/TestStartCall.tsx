"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { useState, useEffect, useMemo } from "react";
import supabase from "@/supabaseClient";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { getAvailableVoiceConfigurations, getFallbackVoiceConfigurations, VoiceConfigurationGroup, VoiceConfiguration } from "@/utils/voiceConfigUtils";
import { Card } from "./ui/card";
import { CheckCircle, Mic, User, Database, Rocket, ArrowLeft, ChevronRight } from "lucide-react";


interface TestStartCallProps {
  onVoiceSelect: (configId: string) => void;
  onTherapistNameChange?: (name: string) => void;
  onSessionStart?: () => void;
  hideAfterSessionStart?: boolean;
  sessionStarted?: boolean;
  accessToken?: string;
}

export default function TestStartCall({ onVoiceSelect, onTherapistNameChange, onSessionStart, hideAfterSessionStart, sessionStarted, accessToken }: TestStartCallProps) {
  const { connect, status } = useVoice();
  const [sessionConnected, setSessionConnected] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfiguration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [therapistName, setTherapistName] = useState("Talk Therapist");
  const [voiceAccessToken, setVoiceAccessToken] = useState<string | null>(null);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string>('calm');
  const [voiceGroups, setVoiceGroups] = useState<VoiceConfigurationGroup[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [dataSavingPreference, setDataSavingPreference] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [hasDefaultPreferences, setHasDefaultPreferences] = useState(false);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);
  const searchParams = useSearchParams();
  
  // Check if we're in trial mode
  const isTrialMode = useMemo(() => {
    const trialMode = searchParams.get('trial') === 'true';
    console.log('TestStartCall: isTrialMode =', trialMode);
    return trialMode;
  }, [searchParams]);

  // Check authentication status (skip in trial mode)
  useEffect(() => {
    const checkAuth = async () => {
      if (isTrialMode) {
        console.log('TestStartCall: Trial mode, skipping auth check');
        setIsAuthenticated(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [isTrialMode]);

  // Use the access token passed from parent instead of fetching our own
  useEffect(() => {
    if (accessToken) {
      setVoiceAccessToken(accessToken);
    }
  }, [accessToken]);

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchUserPreferences = async () => {
      setIsLoadingVoices(true);
      try {
        let subscriptionStatus = 'calm';
        let savedVoiceConfigId = null;
        let savedTherapistName = null;

        let profile = null;
        if (!isTrialMode) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('voice_config_id, therapist_name, subscription_status, data_saving_preference')
              .eq('id', user.id)
              .single();

            if (profileData) {
              profile = profileData;
              subscriptionStatus = profileData.subscription_status || 'calm';
              savedVoiceConfigId = profileData.voice_config_id;
              savedTherapistName = profileData.therapist_name;
              setDataSavingPreference(profileData.data_saving_preference || false);
            }
          }
        }

        setUserSubscriptionStatus(subscriptionStatus);
        if (savedTherapistName) {
          setTherapistName(savedTherapistName);
        }

        // Fetch voice configurations
        let groups: VoiceConfigurationGroup[] = [];
        try {
          groups = await getAvailableVoiceConfigurations(subscriptionStatus);
        } catch (error) {
          groups = getFallbackVoiceConfigurations();
        }

        setVoiceGroups(groups);

        // Set default voice
        if (groups.length > 0 && groups[0].voice_configurations.length > 0) {
          let defaultVoice = groups[0].voice_configurations[0];
          if (savedVoiceConfigId) {
            for (const group of groups) {
              const found = group.voice_configurations.find(config => 
                config.hume_config_id === savedVoiceConfigId
              );
              
              if (found) {
                defaultVoice = found;
                setSelectedVoice(found);
              }
            }
          }
          
          // Check if user has complete default preferences
          if (savedVoiceConfigId && savedTherapistName && profile && profile.data_saving_preference !== null) {
            setHasDefaultPreferences(true);
          }
          
          setSelectedVoice(defaultVoice);
        }

      } catch {
        console.error('Error fetching preferences');
        const fallbackGroups = getFallbackVoiceConfigurations();
        setVoiceGroups(fallbackGroups);
        if (fallbackGroups.length > 0) {
          setSelectedVoice(fallbackGroups[0].voice_configurations[0]);
        }
      } finally {
        setIsLoadingVoices(false);
      }
    };

    fetchUserPreferences();
  }, [isTrialMode]);

  const handleVoiceSelect = (config: VoiceConfiguration) => {
    setSelectedVoice(config);
    if (config.hume_config_id) {
      onVoiceSelect(config.hume_config_id);
    }
    // Auto advance to next question with smooth scroll
    setTimeout(() => {
      setCurrentQuestion(2);
      scrollToQuestion(2);
    }, 600);
  };

  const handleNameSubmit = () => {
    if (!therapistName.trim()) return;
    onTherapistNameChange?.(therapistName);
    setTimeout(() => {
      if (userSubscriptionStatus === 'calm' || isTrialMode) {
        setCurrentQuestion(4); // Skip data saving for calm users
        scrollToQuestion(4);
      } else {
        setCurrentQuestion(3);
        scrollToQuestion(3);
      }
    }, 400);
  };

  const handleDataPreferenceSelect = (preference: boolean) => {
    setDataSavingPreference(preference);
    setTimeout(() => {
      setCurrentQuestion(4); // Move to terms
      scrollToQuestion(4);
    }, 600);
  };

  const handleTermsAccept = (accepted: boolean) => {
    setTermsAccepted(accepted);
    if (accepted) {
      setTimeout(() => {
        setCurrentQuestion(5); // Move to final screen
        scrollToQuestion(5);
      }, 600);
    }
  };

  const handleConnect = async () => {
    if (isConnecting) return;
    
    if (!selectedVoice?.hume_config_id) {
      console.error('handleConnect: No voice selected');
      return;
    }
    
    setIsConnecting(true);
    
    // Add a timeout to prevent hanging
    const connectionTimeout = setTimeout(() => {
      console.error('handleConnect: Connection timeout reached');
      setIsConnecting(false);
    }, 10000); // 10 second timeout
    
    try {
      const connectConfig = {
        configId: selectedVoice?.hume_config_id,
        audioConstraints: {
          echoCancellation: true,
          noiseSuppression: true
        }
      };
      
      if (voiceAccessToken) {
        (connectConfig as any).auth = { type: 'accessToken', value: voiceAccessToken };
      }
      
      console.log('handleConnect: Attempting to connect with config:', connectConfig);
      await connect(connectConfig as any);
      
      clearTimeout(connectionTimeout);
      console.log('handleConnect: Connection successful');
      
      console.log('handleConnect: Setting sessionConnected to true');
      setSessionConnected(true);
      console.log('handleConnect: Calling onSessionStart callback');
      onSessionStart?.(); // Notify parent that session has started
    } catch (error) {
      clearTimeout(connectionTimeout);
      console.error('handleConnect: Failed to connect:', error);
    } finally {
      clearTimeout(connectionTimeout);
      setIsConnecting(false);
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestion === 2) {
      setCurrentQuestion(1);
    } else if (currentQuestion === 3) {
      setCurrentQuestion(2);
    } else if (currentQuestion === 4) {
      if (userSubscriptionStatus === 'calm' || isTrialMode) {
        setCurrentQuestion(2);
      } else {
        setCurrentQuestion(3);
      }
    } else if (currentQuestion === 5) {
      setCurrentQuestion(4);
    }
  };

  const handleLoadDefaults = async () => {
    if (!isAuthenticated || !hasDefaultPreferences) {
      console.log('handleLoadDefaults: Early return - not authenticated or no defaults');
      return;
    }
    
    if (isLoadingVoices || voiceGroups.length === 0) {
      console.log('handleLoadDefaults: Voice groups not ready yet, waiting...');
      return;
    }
    
    console.log('handleLoadDefaults: Starting to load defaults...');
    setIsLoadingDefaults(true);
    
    // Add a fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      console.error('handleLoadDefaults: Fallback timeout reached, resetting loading state');
      setIsLoadingDefaults(false);
    }, 15000); // 15 second fallback
    
    try {
      // Load default preferences from profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('handleLoadDefaults: No user found');
        return;
      }
      
      console.log('handleLoadDefaults: User found, fetching profile...');
      const { data: profile } = await supabase
        .from('profiles')
        .select('voice_config_id, therapist_name, data_saving_preference')
        .eq('id', user.id)
        .single();

      if (!profile) {
        console.log('handleLoadDefaults: No profile found');
        return;
      }

      console.log('handleLoadDefaults: Profile loaded:', profile);
      
      // Set all preferences
      setTherapistName(profile.therapist_name || 'Talk Therapist');
      setDataSavingPreference(profile.data_saving_preference || false);
      setTermsAccepted(true);
      
      // Find and set the voice
      if (profile.voice_config_id && voiceGroups.length > 0) {
        console.log('handleLoadDefaults: Looking for voice config:', profile.voice_config_id);
        console.log('handleLoadDefaults: Available voice groups:', voiceGroups);
        
        let voiceFound = false;
        for (const group of voiceGroups) {
          const found = group.voice_configurations.find(config => 
            config.hume_config_id === profile.voice_config_id
          );
          if (found) {
            console.log('handleLoadDefaults: Voice found:', found);
            setSelectedVoice(found);
            onVoiceSelect(found.hume_config_id);
            voiceFound = true;
            break;
          }
        }
        
        if (!voiceFound) {
          console.error('handleLoadDefaults: Voice config not found in available voices');
          return;
        }
      } else {
        console.log('handleLoadDefaults: No voice config ID or voice groups not loaded yet');
        return;
      }
      
      // Start session immediately
      console.log('handleLoadDefaults: Starting session in 1000ms...');
      setTimeout(() => {
        console.log('handleLoadDefaults: Calling handleConnect...');
        handleConnect();
      }, 1000);
      
    } catch (error) {
      console.error('handleLoadDefaults: Error occurred:', error);
    } finally {
      console.log('handleLoadDefaults: Finally block - setting loading to false');
      setIsLoadingDefaults(false);
      clearTimeout(fallbackTimeout); // Clear the fallback timeout
    }
  };

  const handleSaveDefaults = async () => {
    if (!isAuthenticated || !selectedVoice || !therapistName.trim()) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            voice_config_id: selectedVoice.hume_config_id,
            therapist_name: therapistName.trim(),
            data_saving_preference: dataSavingPreference
          })
          .eq('id', user.id);
        
        setHasDefaultPreferences(true);
        console.log('Default preferences saved successfully');
      }
    } catch (error) {
      console.error('Error saving defaults:', error);
    }
  };

  // Auto-scroll to next question
  const scrollToQuestion = (questionNum: number) => {
    const element = document.getElementById(`question-${questionNum}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const renderQuestion = (questionNum: number, isVisible: boolean) => {
    const baseClasses = `py-20 px-6 transition-all duration-700 ${
      isVisible ? 'opacity-100' : 'opacity-30 pointer-events-none'
    }`;

    switch (questionNum) {
      case 1:
        return (
          <div id="question-1" className={baseClasses}>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="text-4xl">🎙️</div>
                <h1 className="text-4xl font-bold text-white mb-2">Choose your voice</h1>
                <p className="text-lg text-white/80">Select the voice that feels right for your session</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {!isLoadingVoices && voiceGroups.flatMap(group => 
                  group.voice_configurations.map((config) => (
                    <Card
                      key={config.id}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 p-6 ${
                        selectedVoice?.id === config.id
                          ? 'ring-2 ring-white bg-white/20 shadow-lg'
                          : 'bg-white/10 hover:bg-white/15'
                      }`}
                      onClick={() => handleVoiceSelect(config)}
                    >
                      <div className="text-center space-y-3">
                        <div className="text-3xl">
                          {config.internal_name?.toLowerCase().includes('male') && !config.internal_name?.toLowerCase().includes('female') ? '🧑' : 
                           config.internal_name?.toLowerCase().includes('female') ? '👩' : 
                           config.internal_name?.toLowerCase().includes('calm') ? '🧘' :
                           config.internal_name?.toLowerCase().includes('energetic') ? '⚡' :
                           config.internal_name?.toLowerCase().includes('professional') ? '👔' :
                           config.internal_name?.toLowerCase().includes('friendly') ? '😊' :
                           config.internal_name?.toLowerCase().includes('sass') ? '💁' :
                           config.internal_name?.toLowerCase().includes('pirate') ? '🏴‍☠️' : '🎭'}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{config.display_name}</h3>
                        <p className="text-sm text-white/70">{config.description}</p>
                        {selectedVoice?.id === config.id && (
                          <CheckCircle className="w-5 h-5 text-white mx-auto" />
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div id="question-2" className={baseClasses}>
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="text-4xl">🤖</div>
                <h1 className="text-4xl font-bold text-white mb-2">What should we call your therapist?</h1>
                <p className="text-lg text-white/80">Choose a name that feels welcoming</p>
              </div>
              
              <div className="space-y-6">
                <Input
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  placeholder="Enter therapist name"
                  className="h-14 text-xl text-center bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && therapistName.trim()) {
                      handleNameSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleNameSubmit}
                  disabled={!therapistName.trim()}
                  className="h-12 px-8 bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        if (userSubscriptionStatus === 'calm' || isTrialMode) return null;
        return (
          <div id="question-3" className={baseClasses}>
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="text-4xl">💾</div>
                <h1 className="text-4xl font-bold text-white mb-2">Save your conversation data?</h1>
                <p className="text-lg text-white/80">You can change this anytime in settings</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 p-6 ${
                    dataSavingPreference === true
                      ? 'ring-2 ring-white bg-white/20 shadow-lg'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                  onClick={() => handleDataPreferenceSelect(true)}
                >
                  <div className="text-center space-y-4">
                    <div className="text-3xl">✅</div>
                    <h3 className="text-xl font-semibold text-white">Yes, save my data</h3>
                    <p className="text-sm text-white/70">Enable session history and insights</p>
                    {dataSavingPreference === true && (
                      <CheckCircle className="w-5 h-5 text-white mx-auto" />
                    )}
                  </div>
                </Card>
                
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 p-6 ${
                    dataSavingPreference === false
                      ? 'ring-2 ring-white bg-white/20 shadow-lg'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                  onClick={() => handleDataPreferenceSelect(false)}
                >
                  <div className="text-center space-y-4">
                    <div className="text-3xl">🔒</div>
                    <h3 className="text-xl font-semibold text-white">No, keep private</h3>
                    <p className="text-sm text-white/70">Maximum privacy, no data stored</p>
                    {dataSavingPreference === false && (
                      <CheckCircle className="w-5 h-5 text-white mx-auto" />
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div id="question-4" className={baseClasses}>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="text-4xl">⚠️</div>
                <h1 className="text-4xl font-bold text-white mb-2">Medical Disclaimer</h1>
                <p className="text-lg text-white/80">Please read and understand before continuing</p>
              </div>
              
              <Card className="bg-red-500/20 border-red-400/30 p-6 text-center">
                <p className="text-white font-medium">
                  talkAI is NOT a medical device or substitute for professional mental health care.
                </p>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Important Points:</h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li>• Cannot diagnose mental health conditions</li>
                    <li>• Not suitable for emergencies</li>
                    <li>• Consult licensed professionals for serious conditions</li>
                  </ul>
                </div>
                
                <Card className="bg-yellow-500/20 border-yellow-400/30 p-4">
                  <h4 className="font-semibold text-white mb-2">🚨 Emergency Resources</h4>
                  <div className="text-white/80 text-sm space-y-1">
                    <p><strong>Crisis:</strong> Call 911</p>
                    <p><strong>Suicide Prevention:</strong> 988</p>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleTermsAccept(false)}
                  className="h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  I Don&apos;t Agree
                </Button>
                <Button
                  onClick={() => handleTermsAccept(true)}
                  className="h-12 bg-white/20 hover:bg-white/30 text-white"
                >
                  I Understand & Agree <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div id="question-5" className={baseClasses}>
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="text-4xl">🚀</div>
                <h1 className="text-4xl font-bold text-white mb-2">Ready to Begin!</h1>
                <p className="text-lg text-white/80">
                  {isTrialMode ? 'Your free trial session is ready' : 'Your therapy session is ready'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/10 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Mic className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium">Voice</h4>
                      <p className="text-sm text-white/70">{selectedVoice?.display_name}</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/10 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <User className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium">Therapist</h4>
                      <p className="text-sm text-white/70">{therapistName}</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/10 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Database className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium">Data Saving</h4>
                      <p className="text-sm text-white/70">{dataSavingPreference ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="h-14 px-8 text-lg bg-white/20 hover:bg-white/30 text-white"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting Session...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Begin Session
                  </>
                )}
              </Button>
              
              {/* Save as Default Button */}
              {isAuthenticated && !hasDefaultPreferences && (
                <Button
                  onClick={handleSaveDefaults}
                  variant="outline"
                  className="h-12 px-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  💾 Save as Default Preferences
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Don't show anything if connected
  console.log('TestStartCall render check:', { 
    sessionConnected, 
    statusValue: status.value, 
    hideAfterSessionStart,
    sessionStarted,
    shouldHide: sessionStarted || sessionConnected || status.value === "connected"
  });
  
  if (sessionStarted || sessionConnected || status.value === "connected") {
    if (hideAfterSessionStart) {
      console.log('TestStartCall: Hiding component due to session started/connected');
      return null;
    }
  }

  const totalQuestions = (userSubscriptionStatus === 'calm' || isTrialMode) ? 4 : 5;

  return (
    <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentQuestion > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackQuestion}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div className="text-white">
              <span className="font-medium">{currentQuestion} of {totalQuestions}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Default Preferences Button */}
            {isAuthenticated && hasDefaultPreferences && currentQuestion === 1 && (
              <Button
                onClick={handleLoadDefaults}
                disabled={isLoadingDefaults || isLoadingVoices}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                size="sm"
              >
                {isLoadingDefaults ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : isLoadingVoices ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Loading Voices...
                  </>
                ) : (
                  'Use Default Preferences'
                )}
              </Button>
            )}
            
            <div className="text-white/80 text-sm">
              talkAI Test Session
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-white/10">
          <div 
            className="h-full bg-white/40 transition-all duration-500"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div>
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((questionNum) => {
          // Skip question 3 for calm users and trial mode
          if (questionNum === 3 && (userSubscriptionStatus === 'calm' || isTrialMode)) {
            return null;
          }
          
          return renderQuestion(questionNum, currentQuestion >= questionNum);
        })}
      </div>
    </div>
  );
}