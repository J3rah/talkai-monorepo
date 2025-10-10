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
    
    // Normaliza posibles sinónimos en la base de datos
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
      display_name: 'Voces Clásicas',
      description: 'Voces tradicionales y profesionales de terapia para sesiones cotidianas',
      sort_order: 1,
      is_active: true,
      voice_configurations: [
        {
          id: 'male',
          internal_name: 'male',
          display_name: 'Zander',
          character_name: 'Zander',
          description: 'Una voz terapéutica masculina • Disponible en planes Calm, Centered y Grounded',
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
          description: 'Una voz terapéutica femenina • Disponible en planes Calm, Centered y Grounded',
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
          display_name: 'Energético',
          character_name: 'Spark',
          description: 'Una voz más dinámica y atractiva • Disponible en planes Centered y Grounded',
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
          description: 'Una voz amigable y sencilla con encanto occidental • Disponible solo en plan Grounded',
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
          description: 'Una mujer negra con una voz segura y resonante con un sutil acento de Luisiana, que refleja una mezcla de orgullo cultural y ambición profesional.',
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
          description: 'Un distinguido terapeuta británico, cuya voz transmite un profundo sentido de sabiduría y curiosidad. Su cadencia mesurada y articulación clara hacen que cada palabra sea deliberada y atractiva',
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
          description: 'Un terapeuta masculino protagonista tranquilizador que es un poco bullicioso pero le encanta ayudar a la gente',
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
          description: 'Una voz amigable con acento británico y encanto cálido y accesible • Disponible en planes Centered y Grounded',
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
          display_name: 'Capitán Jules Vane',
          character_name: 'Captain Jules Vane',
          description: 'Una voz carismática e ingeniosa inspirada en piratas legendarios • Disponible solo en plan Grounded',
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
          description: 'La terapeuta tiene una voz reflexiva afroamericana, reminiscente de un narrador de Harlem compartiendo recuerdos nostálgicos con un tono de resistencia y fortaleza tranquila.',
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
          description: 'Este terapeuta tiene un tono confiado y carismático, como un gurú de la tecnología explicando una nueva tecnología con entusiasmo contagioso.',
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
    'Voz Masculina': 'Zander',
    'Voz Femenina': 'Mia',
    'Voz Tranquila': 'Zen',
    'Voz Energética': 'Spark',
    'Voz Profesional': 'Dr. Williams',
    'Voz Amigable': 'Alex',
    
    // Character voices
    'Sass': 'Sass',
    'El Pirata': 'Captain Jules Vane',
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