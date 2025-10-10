import supabase from '@/supabaseClient';

export interface VoiceConfiguration {
  id: string;
  internal_name: string;
  display_name: string;
  character_name: string;
  description: string;
  hume_config_id: string;
  tts_config_id?: string;
  base_voice: string;
  parameters: {
    speaking_rate: number;
    pitch: number;
  };
  required_plan: 'calm' | 'centered' | 'grounded';
  group_id: string;
  sort_order: number;
  is_active: boolean;
}

export interface VoiceConfigurationGroup {
  id: string;
  name: string;
  display_name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  voice_configurations: VoiceConfiguration[];
}

export async function getVoiceConfigurationGroups(): Promise<VoiceConfigurationGroup[]> {
  try {
    console.log('getVoiceConfigurationGroups: Starting database query...');
    const { data, error } = await supabase
      .from('voice_configuration_groups')
      .select(`
        *,
        voice_configurations!voice_configurations_group_id_fkey (
          *
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('getVoiceConfigurationGroups: Database error:', error);
      return [];
    }

    console.log('getVoiceConfigurationGroups: Database query successful, found', data?.length || 0, 'groups');
    
    const result = data?.map(group => ({
      ...group,
      voice_configurations: group.voice_configurations
        ?.filter((config: any) => config.is_active)
        ?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
    })) || [];
    
    console.log('getVoiceConfigurationGroups: Processed groups:', result.length);
    return result;
  } catch (error) {
    console.error('getVoiceConfigurationGroups: Exception caught:', error);
    return [];
  }
}

export async function getAvailableVoiceConfigurations(subscriptionStatus: string): Promise<VoiceConfigurationGroup[]> {
  // Normalize synonyms so that legacy or alternate plan names map correctly
  const planHierarchy = {
    // Free / entry-level plans
    'calm': ['calm'],
    'free': ['calm'],

    // Mid-tier plans
    'centered': ['calm', 'centered'],
    'standard': ['calm', 'centered'],

    // Top-tier plans
    'grounded': ['calm', 'centered', 'grounded'],
    'premium': ['calm', 'centered', 'grounded']
  } as const;

  // Normalize incoming status (handles 'Grounded', 'Premium', etc.)
  const normalizedStatus = (subscriptionStatus || '').toLowerCase() as keyof typeof planHierarchy;
  const allowedPlans = [
    ...(planHierarchy[normalizedStatus] ?? ['calm'])
  ] as ('calm' | 'centered' | 'grounded')[];
  
  try {
    const groups = await getVoiceConfigurationGroups();
    
    // Some rows may have required_plan stored with mixed casing or synonyms
    const normalizePlan = (plan: string): 'calm' | 'centered' | 'grounded' | any => {
      const p = (plan || '').toLowerCase();
      if (p === 'premium') return 'grounded';
      if (p === 'standard') return 'centered';
      return p;
    };

    return groups.map(group => ({
      ...group,
      voice_configurations: group.voice_configurations.filter((config: any) =>
        allowedPlans.includes(normalizePlan(config.required_plan))
      )
    })).filter(group => group.voice_configurations.length > 0);
  } catch (error) {
    console.error('Error in getAvailableVoiceConfigurations:', error);
    return [];
  }
}

export async function getVoiceConfigurationById(configId: string): Promise<VoiceConfiguration | null> {
  try {
    const { data, error } = await supabase
      .from('voice_configurations')
      .select('*')
      .eq('hume_config_id', configId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.warn('Voice configuration not found for ID:', configId);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getVoiceConfigurationById:', error);
    return null;
  }
}

// Fallback function that returns hardcoded configs if database fails
export function getFallbackVoiceConfigurations(): VoiceConfigurationGroup[] {
  return [
    {
      id: 'classic',
      name: 'classic',
      display_name: 'Classic Voices',
      description: 'Traditional, professional therapy voices for everyday sessions',
      sort_order: 1,
      is_active: true,
      voice_configurations: [
        {
          id: 'male',
          internal_name: 'male',
          display_name: 'Zander',
          character_name: 'Zander',
          description: 'A male therapeutic voice • Available on Calm, Centered, and Grounded plans',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_MALE_CONFIG_ID || '793d1f15-4bf9-4beb-a4ab-a62caff84e70',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'calm',
          group_id: 'classic',
          sort_order: 1,
          is_active: true
        },
        {
          id: 'female',
          internal_name: 'female',
          display_name: 'Luna',
          character_name: 'Luna',
          description: 'A female therapeutic voice • Available on Calm, Centered, and Grounded plans',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_FEMALE_CONFIG_ID || '3a451da2-a50a-42c2-83fa-13c79f027643',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'calm',
          group_id: 'classic',
          sort_order: 2,
          is_active: true
        },
        {
          id: 'energetic',
          internal_name: 'energetic',
          display_name: 'Energetic',
          character_name: 'Spark',
          description: 'A more dynamic and engaging voice • Available on Centered and Grounded plans',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_ENERGETIC_CONFIG_ID || '37c0520f-79dc-4902-85de-71ae4116c3c0',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.1, pitch: 0.2 },
          required_plan: 'centered',
          group_id: 'classic',
          sort_order: 4,
          is_active: true
        }
      ]
    },
    {
      id: 'creative',
      name: 'creative',
      display_name: 'Character Voices',
      description: 'Unique, engaging voices with personality for a more dynamic experience',
      sort_order: 2,
      is_active: true,
      voice_configurations: [
        {
          id: 'sass',
          internal_name: 'sass',
          display_name: 'Sass',
          character_name: 'Sass',
          description: 'A friendly, down-to-earth voice with western charm • Available on Grounded plan only',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_SASS_CONFIG_ID || '8346ae7f-32c4-40f6-aa81-20ce7081df13',
          base_voice: 'ITO',
          parameters: { speaking_rate: 0.95, pitch: -0.1 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 1,
          is_active: true
        },
        {
          id: 'nia',
          internal_name: 'nia',
          display_name: 'Nia',
          character_name: 'Nia',
          description: 'A black woman with a confident, resonant voice with a subtle Louisiana accent, reflecting a blend of cultural pride and professional ambition.',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_NIA_CONFIG_ID || '22161928-44b4-4514-b464-e9d8b0636afa',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 1,
          is_active: true
        },
        {
          id: 'julian',
          internal_name: 'julian',
          display_name: 'Julian',
          character_name: 'Julian',
          description: 'A distinguished British therapist, whose voice carries a deep sense of wisdom and curiosity. His measured, rhythmic cadence and crisp articulation make every word feel deliberate and engaging, drawing listeners into helping them live their best selves',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_JULIAN_CONFIG_ID || '7538b2c8-4527-4e56-919f-19523d640a8e',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 1,
          is_active: true
        },
        {
          id: 'maleprotagonist',
          internal_name: 'maleprotagonist',
          display_name: 'Aven',
          character_name: 'Aven',
          description: 'A calming Male protagonist therapist who\'s a bit boisterous but loves to help people',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_AVEN_CONFIG_ID || 'b4fe69c2-720c-44bb-ae45-eccfcc7ebcd6',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 1,
          is_active: true
        },
        {
          id: 'brit',
          internal_name: 'brit',
          display_name: 'Brit',
          character_name: 'Brit',
          description: 'A friendly British accent voice with warm, approachable charm • Available on Centered and Grounded plans',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_BRIT_CONFIG_ID || 'ea959dd5-8316-4373-b30e-7d10f1a75631',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'centered',
          group_id: 'creative',
          sort_order: 1,
          is_active: true
        },
        {
          id: 'captain-jules-vane',
          internal_name: 'captain-jules-vane',
          display_name: 'Captain Jules Vane',
          character_name: 'Captain Jules Vane',
          description: 'A charismatic and witty voice inspired by legendary pirates • Available on Grounded plan only',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_JACKSPARROW_CONFIG_ID || 'ba6400a5-b389-48d7-b79e-9657aec03265',
          base_voice: 'ITO',
          parameters: { speaking_rate: 0.95, pitch: 0.1 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 2,
          is_active: true
        },
        {
          id: 'zora',
          internal_name: 'zora',
          display_name: 'Zora',
          character_name: 'Zora',
          description: 'The therapist has a reflective, Black American voice, reminiscent of a Harlem storyteller sharing nostalgic memories with a tone of resilience and quiet strength.',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_ZORA_CONFIG_ID || '959e5574-4f1a-4f33-a295-84265c438ab3',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 4,
          is_active: true
        },
        {
          id: 'kai',
          internal_name: 'kai',
          display_name: 'Kai',
          character_name: 'Kai',
          description: 'This therapist has a confident, charismatic tone, like a tech guru explaining a new technology with infectious enthusiasm, and the excitement of a viral storyteller.',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_KAI_CONFIG_ID || '0aae3b3b-b14f-444d-b728-66fb6f0e700f',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 5,
          is_active: true
        }
      ]
    }
  ];
}

/**
 * Maps voice configuration display names to character names
 * This provides consistent character naming across the application
 */
export function getCharacterNameFromVoiceConfig(displayName: string, internalName?: string): string {
  const characterMap: Record<string, string> = {
    // Classic voices
    'Male Voice': 'Zander',
    'Female Voice': 'Mia',
    'Calm Voice': 'Zen',
    'Energetic Voice': 'Spark',
    'Professional Voice': 'Dr. Williams',
    'Friendly Voice': 'Alex',
    
    // Character voices
    'Sass': 'Sass',
    'The Pirate': 'Captain Jules Vane',
    'Brit': 'Brit',
    'Julian': 'Julian',
    'Aven': 'Aven',
    'Nia': 'Nia',
    'Zora': 'Zora',
    'Kai': 'Kai',
    
    // Internal name mappings (fallback)
    'male': 'Zander',
    'female': 'Mia',
    'energetic': 'Spark',
    'sass': 'Sass',
    'jacksparrow': 'Captain Jules Vane',
    'brit': 'Brit',
    'julian': 'Julian',
    'maleprotagonist': 'Aven',
    'nia': 'Nia',
    'zora': 'Zora',
    'kai': 'Kai',
  };

  // Try display name first, then internal name
  return characterMap[displayName] || characterMap[internalName || ''] || displayName;
}

/**
 * Gets agent information from voice configuration
 * Returns both the display name and character name from the database
 */
export function getAgentInfoFromVoiceConfig(voiceConfig: VoiceConfiguration): {
  displayName: string;
  characterName: string;
  configId: string;
} {
  // Use character_name from database as the single source of truth
  const characterName = voiceConfig.character_name || voiceConfig.display_name;
  
  return {
    displayName: voiceConfig.display_name,
    characterName,
    configId: voiceConfig.hume_config_id
  };
} 