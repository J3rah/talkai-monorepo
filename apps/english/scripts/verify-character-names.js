#!/usr/bin/env node

/**
 * Script to verify that character names are properly set in the database
 * Usage: node scripts/verify-character-names.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyCharacterNames() {
  try {
    console.log('🔍 Verifying character names in voice_configurations table...\n');

    const { data: voices, error } = await supabase
      .from('voice_configurations')
      .select('internal_name, display_name, character_name, hume_config_id')
      .eq('is_active', true)
      .order('internal_name');

    if (error) {
      console.error('Error fetching voice configurations:', error);
      process.exit(1);
    }

    if (!voices || voices.length === 0) {
      console.log('No voice configurations found.');
      process.exit(0);
    }

    console.log('📋 Voice Configurations with Character Names:\n');
    console.log('Internal Name | Display Name | Character Name | Hume Config ID');
    console.log('--------------|--------------|----------------|----------------');

    voices.forEach(voice => {
      const internalName = voice.internal_name.padEnd(13);
      const displayName = voice.display_name.padEnd(13);
      const characterName = (voice.character_name || 'NULL').padEnd(15);
      const configId = voice.hume_config_id.substring(0, 8) + '...';
      
      console.log(`${internalName} | ${displayName} | ${characterName} | ${configId}`);
    });

    console.log('\n✅ Verification complete!');
    
    // Check for any missing character names
    const missingCharacterNames = voices.filter(v => !v.character_name);
    if (missingCharacterNames.length > 0) {
      console.log('\n⚠️  Warning: Some voices are missing character names:');
      missingCharacterNames.forEach(voice => {
        console.log(`   - ${voice.internal_name} (${voice.display_name})`);
      });
    } else {
      console.log('\n🎉 All voices have character names set!');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

verifyCharacterNames();
