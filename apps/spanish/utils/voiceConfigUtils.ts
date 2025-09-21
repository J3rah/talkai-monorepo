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
      console.error('Error fetching voice configuration groups:', error);
      return [];
    }

    return data?.map(group => ({
      ...group,
      voice_configurations: group.voice_configurations
        ?.filter((config: any) => config.is_active)
        ?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
    })) || [];
  } catch (error) {
    console.error('Error in getVoiceConfigurationGroups:', error);
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

  const allowedPlans = [
    ...(planHierarchy[subscriptionStatus as keyof typeof planHierarchy] ?? ['calm'])
  ] as ('calm' | 'centered' | 'grounded')[];
  
  try {
    const groups = await getVoiceConfigurationGroups();
    
    return groups.map(group => ({
      ...group,
      voice_configurations: group.voice_configurations.filter(config => 
        allowedPlans.includes(config.required_plan)
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
      display_name: 'Voces Clásicas',
      description: 'Voces tradicionales y profesionales de terapia para sesiones cotidianas',
      sort_order: 1,
      is_active: true,
      voice_configurations: [
        {
          id: 'male',
          internal_name: 'male',
          display_name: 'Voz Masculina',
          character_name: 'Zander',
          description: 'Una voz terapéutica masculina',
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
          display_name: 'Voz Femenina',
          character_name: 'Mia',
          description: 'Una voz terapéutica femenina',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_FEMALE_CONFIG_ID || '3a451da2-a50a-42c2-83fa-13c79f027643',
          base_voice: 'ITO',
          parameters: { speaking_rate: 1.0, pitch: 0.0 },
          required_plan: 'calm',
          group_id: 'classic',
          sort_order: 2,
          is_active: true
        }
      ]
    },
    {
      id: 'creative',
      name: 'creative',
      display_name: 'Voces de Personajes',
      description: 'Voces únicas y atractivas con personalidad para una experiencia más dinámica',
      sort_order: 2,
      is_active: true,
      voice_configurations: [
        {
          id: 'sass',
          internal_name: 'sass',
          display_name: 'Sass',
          character_name: 'Sass',
          description: 'Una voz amigable y sencilla con encanto occidental',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_SASS_CONFIG_ID || '8346ae7f-32c4-40f6-aa81-20ce7081df13',
          base_voice: 'ITO',
          parameters: { speaking_rate: 0.95, pitch: -0.1 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 1,
          is_active: true
        },
        {
          id: 'jacksparrow',
          internal_name: 'jacksparrow',
          display_name: 'El Pirata',
          character_name: 'Captain Jack',
          description: 'Una voz carismática e ingeniosa inspirada en piratas legendarios',
          hume_config_id: process.env.NEXT_PUBLIC_HUME_JACKSPARROW_CONFIG_ID || 'a608626e-23e0-4070-8e24-dc880d34000b',
          base_voice: 'ITO',
          parameters: { speaking_rate: 0.95, pitch: 0.1 },
          required_plan: 'grounded',
          group_id: 'creative',
          sort_order: 2,
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
    'Voz Masculina': 'Zander',
    'Voz Femenina': 'Mia',
    'Voz Tranquila': 'Zen',
    'Voz Energética': 'Spark',
    'Voz Profesional': 'Dr. Williams',
    'Voz Amigable': 'Alex',
    
    // Character voices
    'Sass': 'Sass',
    'El Pirata': 'Captain Jack',
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
    'jacksparrow': 'Captain Jack',
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