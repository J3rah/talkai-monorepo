"use client";

import { VoiceProvider } from "./VoiceProvider";
import Messages from "./Messages";
import ModernChatTool from "./ModernChatTool";
import { ComponentRef, useRef, useState, useEffect } from "react";
import supabase from "@/supabaseClient";
import { getVoiceConfigurationById } from "@/utils/voiceConfigUtils";

export default function TestChat({
  accessToken,
}: {
  accessToken: string;
}) {
  const [therapistName, setTherapistName] = useState("Talk Therapist");
  const [agentName, setAgentName] = useState("Talk Therapist");
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const defaultConfigId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || '0ea8bb7d-ef50-4174-ae64-be7a621db425';

  // Fetch initial therapist name and voice configuration
  useEffect(() => {
    const fetchTherapistName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('therapist_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.therapist_name) {
            setTherapistName(profile.therapist_name);
          }
        }
      } catch (error) {
        console.error('Error fetching therapist name:', error);
      }
    };

    const getCharacterName = (displayName: string, internalName: string): string => {
      // Map voice configurations to character names
      const characterMap: Record<string, string> = {
        'Male Voice': 'Zander',
        'Female Voice': 'Sofia',
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

    const fetchAgentName = async () => {
      try {
        console.log('🎵 TestChat: Fetching voice configuration for configId:', defaultConfigId);
        const voiceConfig = await getVoiceConfigurationById(defaultConfigId);
        if (voiceConfig?.display_name) {
          const characterName = getCharacterName(voiceConfig.display_name, voiceConfig.internal_name);
          console.log('✅ TestChat: Using character name:', characterName, 'from voice config:', voiceConfig.display_name);
          setAgentName(characterName);
        } else {
          console.log('⚠️ TestChat: Voice config not found, using fallback name');
          setAgentName("Talk Therapist");
        }
      } catch (error) {
        console.error('❌ TestChat: Error fetching voice configuration:', error);
        setAgentName("Talk Therapist");
      }
    };

    fetchTherapistName();
    fetchAgentName();
  }, [defaultConfigId]);

  if (!accessToken) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
        <p className="text-red-800 dark:text-red-200">❌ TestChat: No access token provided</p>
      </div>
    );
  }

  console.log('TestChat: Rendering with accessToken:', accessToken ? 'Present' : 'Missing');

  return (
    <div className="h-screen flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <Messages sessionId={null} therapistName={therapistName} />
      </div>
      
      {/* Modern Chat Tool */}
      <ModernChatTool 
        accessToken={accessToken}
        onSessionEnd={() => {
          console.log('Session ended');
        }}
      />
    </div>
  );
}
