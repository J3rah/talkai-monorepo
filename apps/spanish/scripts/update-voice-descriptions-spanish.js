#!/usr/bin/env node

/**
 * Script to update voice configuration descriptions to Spanish
 * Run with: node scripts/update-voice-descriptions-spanish.js
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables from process.env (already loaded by Next.js)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Spanish translations for voice configurations
const spanishTranslations = {
  // Voice Groups
  groups: {
    classic: {
      display_name: 'Voces Clásicas',
      description: 'Voces tradicionales y profesionales de terapia para sesiones cotidianas'
    },
    creative: {
      display_name: 'Voces de Personajes', 
      description: 'Voces únicas y atractivas con personalidad para una experiencia más dinámica'
    }
  },
  
  // Voice Configurations
  voices: {
    male: {
      display_name: 'Voz Masculina',
      description: 'Una voz terapéutica masculina'
    },
    female: {
      display_name: 'Voz Femenina',
      description: 'Una voz terapéutica femenina'
    },
    calm: {
      display_name: 'Voz Tranquila',
      description: 'Una voz más suave y relajante'
    },
    energetic: {
      display_name: 'Voz Energética',
      description: 'Una voz más dinámica y atractiva'
    },
    professional: {
      display_name: 'Voz Profesional',
      description: 'Una voz clara y autoritaria'
    },
    friendly: {
      display_name: 'Voz Amigable',
      description: 'Una voz cálida y accesible'
    },
    sass: {
      display_name: 'Sass',
      description: 'Una voz amigable y sencilla con encanto occidental'
    },
    jacksparrow: {
      display_name: 'El Pirata',
      description: 'Una voz carismática e ingeniosa inspirada en piratas legendarios'
    },
    brit: {
      display_name: 'Brit',
      description: 'Una voz con acento británico amigable, cálida y accesible'
    },
    aven: {
      display_name: 'Aven',
      description: 'Un terapeuta masculino protagonista que es un poco bullicioso'
    },
    julian: {
      display_name: 'Julian',
      description: 'Un terapeuta británico distinguido, cuya voz lleva una profunda'
    },
    zander: {
      display_name: 'Zander',
      description: 'Una voz terapéutica masculina'
    },
    luna: {
      display_name: 'Luna',
      description: 'Una voz terapéutica femenina'
    },
    nia: {
      display_name: 'Nia',
      description: 'Una voz femenina cálida y empática'
    },
    zora: {
      display_name: 'Zora',
      description: 'Una voz femenina profesional y confiable'
    },
    kai: {
      display_name: 'Kai',
      description: 'Una voz masculina moderna y dinámica'
    }
  }
};

async function updateVoiceDescriptions() {
  try {
    console.log('🇪🇸 Updating voice configurations to Spanish...\n');

    // Update voice groups
    console.log('📝 Updating voice groups...');
    for (const [groupName, translation] of Object.entries(spanishTranslations.groups)) {
      const { data, error } = await supabase
        .from('voice_configuration_groups')
        .update({
          display_name: translation.display_name,
          description: translation.description
        })
        .eq('name', groupName)
        .select();

      if (error) {
        console.error(`❌ Error updating group ${groupName}:`, error);
      } else {
        console.log(`✅ Updated group: ${groupName} -> ${translation.display_name}`);
      }
    }

    // Update voice configurations
    console.log('\n📝 Updating voice configurations...');
    for (const [voiceName, translation] of Object.entries(spanishTranslations.voices)) {
      const { data, error } = await supabase
        .from('voice_configurations')
        .update({
          display_name: translation.display_name,
          description: translation.description
        })
        .eq('internal_name', voiceName)
        .select();

      if (error) {
        console.error(`❌ Error updating voice ${voiceName}:`, error);
      } else {
        console.log(`✅ Updated voice: ${voiceName} -> ${translation.display_name}`);
      }
    }

    console.log('\n🎉 All voice configurations updated to Spanish successfully!');
    
    // Show summary
    console.log('\n📊 Summary:');
    console.log(`   • Updated ${Object.keys(spanishTranslations.groups).length} voice groups`);
    console.log(`   • Updated ${Object.keys(spanishTranslations.voices).length} voice configurations`);
    
  } catch (error) {
    console.error('❌ Error updating voice descriptions:', error);
    process.exit(1);
  }
}

// Run the update
updateVoiceDescriptions();
