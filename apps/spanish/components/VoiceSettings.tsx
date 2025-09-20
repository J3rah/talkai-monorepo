"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import supabase from "@/supabaseClient";
import { Volume2 } from "lucide-react";
import { getAvailableVoiceConfigurations, getFallbackVoiceConfigurations, VoiceConfigurationGroup, VoiceConfiguration } from "@/utils/voiceConfigUtils";
import { Tooltip } from './ui/tooltip';

export default function VoiceSettings({ onVoiceChange, className }: { onVoiceChange?: (voice: any) => void, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfiguration | null>(null);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string>('calm');
  const [voiceGroups, setVoiceGroups] = useState<VoiceConfigurationGroup[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get subscription access levels for a voice
  const getSubscriptionAccessLevels = (requiredPlan: string) => {
    switch (requiredPlan) {
      case 'calm':
        return 'Calm, Centered & Grounded';
      case 'centered':
        return 'Centered & Grounded';
      case 'grounded':
        return 'Grounded only';
      default:
        return requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);
    }
  };

  // Fetch current voice settings and subscription status when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      console.log('🎵 VoiceSettings: Fetching user data on mount');
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('🎵 VoiceSettings: User data:', user ? 'Found user' : 'No user');
        
        let subscriptionStatus = 'calm';
        let savedVoiceConfigId = null;

        if (user) {
          console.log('🎵 VoiceSettings: Fetching profile for user:', user.id);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('voice_config_id, subscription_status')
            .eq('id', user.id)
            .single();

          console.log('🎵 VoiceSettings: Profile query result:', { profile, error });

          if (profile) {
            subscriptionStatus = profile.subscription_status || 'calm';
            savedVoiceConfigId = profile.voice_config_id;
            console.log('🎵 VoiceSettings: Retrieved profile data:', {
              voice_config_id: savedVoiceConfigId,
              subscription_status: subscriptionStatus
            });
          }
        }

        // Set subscription status
        setUserSubscriptionStatus(subscriptionStatus);

        // Fetch voice configurations from database
        console.log('🎵 VoiceSettings: Fetching voice configurations for plan:', subscriptionStatus);
        let groups: VoiceConfigurationGroup[] = [];
        
        try {
          groups = await getAvailableVoiceConfigurations(subscriptionStatus);
          console.log('🎵 VoiceSettings: Fetched voice groups from database:', groups.length);
        } catch (error) {
          console.warn('🎵 VoiceSettings: Failed to fetch from database, using fallback:', error);
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
          console.log('✅ VoiceSettings: Setting selected voice:', foundVoice.display_name);
          setSelectedVoice(foundVoice);
        }

      } catch (error) {
        console.error('🎵 VoiceSettings: Error fetching user data:', error);
        // Fallback to default configurations
        const fallbackGroups = getFallbackVoiceConfigurations();
        setVoiceGroups(fallbackGroups);
        if (fallbackGroups.length > 0 && fallbackGroups[0].voice_configurations.length > 0) {
          setSelectedVoice(fallbackGroups[0].voice_configurations[0]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveVoice = async () => {
    if (!selectedVoice) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsSaving(false); return; }

      console.log('💾 VoiceSettings: Saving voice settings:', {
        voice_config_id: selectedVoice.hume_config_id,
        voice_parameters: selectedVoice.parameters,
        base_voice: selectedVoice.base_voice,
        user_id: user.id,
        voice_name: selectedVoice.display_name
      });

      const { data, error } = await supabase
        .from('profiles')
        .update({
          voice_config_id: selectedVoice.hume_config_id,
          voice_parameters: selectedVoice.parameters,
          base_voice: selectedVoice.base_voice,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ VoiceSettings: Error saving voice settings:', error);
        throw error;
      }

      console.log('✅ VoiceSettings: Voice settings saved successfully:', data);
      
      // Verify the update was successful
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('voice_config_id, voice_parameters')
        .eq('id', user.id)
        .single();

      if (verifyError) {
        console.error('❌ VoiceSettings: Error verifying voice settings:', verifyError);
        throw verifyError;
      }

      console.log('✅ VoiceSettings: Verified voice settings:', verifyData);
      
      // Only call onVoiceChange if the verification was successful
      if (verifyData.voice_config_id === selectedVoice.hume_config_id && 
          verifyData.voice_parameters?.speaking_rate === selectedVoice.parameters.speaking_rate &&
          verifyData.voice_parameters?.pitch === selectedVoice.parameters.pitch) {
        console.log('✅ VoiceSettings: Calling onVoiceChange with:', selectedVoice.display_name);
        onVoiceChange?.(selectedVoice);
        setSaveSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSaveSuccess(false);
          window.location.reload(); // Reload the page after closing the modal
        }, 1000);
      } else {
        throw new Error('Voice settings verification failed');
      }
    } catch (error) {
      console.error('❌ VoiceSettings: Error saving voice preference:', error);
      alert('Failed to save voice settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add debug logging for voice selection
  useEffect(() => {
    console.log('Selected voice in VoiceSettings:', selectedVoice);
  }, [selectedVoice]);

  return (
    <>
      <Button
        onClick={() => {
          console.log('Opening voice settings modal');
          setIsOpen(true);
        }}
        className={className}
      >
        <Volume2 className="size-4 mr-2" />
        Change Voice
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        console.log('Dialog open state changed:', open);
        setIsOpen(open);
      }}>
        <DialogContent className="mobile-dialog !w-[95vw] !max-w-4xl !h-[90vh] !max-h-[90vh] overflow-hidden flex flex-col !p-0 !gap-0">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl">Voice Settings</DialogTitle>
            <DialogDescription className="text-sm">
              Choose your preferred voice for the AI therapist
              {userSubscriptionStatus === 'calm' && (
                <div className="mt-2 text-sm text-amber-600">
                  You're on the Calm plan. Upgrade to access more voices.
                </div>
              )}
              {userSubscriptionStatus === 'centered' && (
                <div className="mt-2 text-sm text-blue-600">
                  You're on the Centered plan. Upgrade to Grounded for all voices.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:gap-6 pb-4">
                {voiceGroups.map((group) => (
                  <div key={group.id} className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold">{group.display_name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{group.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {group.voice_configurations.map((config) => (
                        <div
                          key={config.id}
                          className={`relative p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 touch-manipulation min-h-[100px] sm:min-h-[120px] ${
                            selectedVoice?.id === config.id
                              ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                          }`}
                          style={{
                            backgroundColor: selectedVoice?.id === config.id ? undefined : 'transparent',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedVoice?.id !== config.id) {
                              e.currentTarget.style.backgroundColor = '#5a8f91';
                              e.currentTarget.style.opacity = '0.6';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedVoice?.id !== config.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.opacity = '1';
                            }
                          }}
                          onClick={() => {
                            console.log('Voice selected:', config.display_name);
                            setSelectedVoice(config);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedVoice(config);
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
                          
                          <h4 className="font-medium text-sm sm:text-base mb-1 sm:mb-2 pr-6 sm:pr-8">{config.display_name}</h4>
                          <Tooltip content={config.description} side="top">
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2 cursor-help">{config.description}</p>
                          </Tooltip>
                          <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">
                            {getSubscriptionAccessLevels(config.required_plan)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {userSubscriptionStatus !== 'grounded' && (
                  <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
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
            )}
          </div>

          <div className="flex-shrink-0 p-4 sm:p-6 pt-2 border-t">
            <Button
              onClick={handleSaveVoice}
              className="w-full"
              disabled={isSaving || !selectedVoice}
            >
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Voice Preference'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 