#!/usr/bin/env node

/**
 * Script to add tts_config_id column to voice_configurations table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addTTSColumn() {
  console.log('🎵 Adding TTS Config ID Column');
  console.log('==============================\n');

  try {
    // First, let's check the current table structure
    console.log('📋 Checking current table structure...');
    const { data: voices, error: fetchError } = await supabase
      .from('voice_configurations')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.error('❌ Error fetching voices:', fetchError);
      return;
    }

    if (voices && voices.length > 0) {
      console.log('Current columns:', Object.keys(voices[0]));
      
      // Check if tts_config_id already exists
      if ('tts_config_id' in voices[0]) {
        console.log('✅ tts_config_id column already exists!');
        
        // Show current values
        const { data: allVoices, error: allError } = await supabase
          .from('voice_configurations')
          .select('display_name, internal_name, hume_config_id, tts_config_id')
          .order('display_name');

        if (!allError && allVoices) {
          console.log('\nCurrent voice configurations:');
          allVoices.forEach(voice => {
            console.log(`${voice.display_name} (${voice.internal_name})`);
            console.log(`  EVI ID: ${voice.hume_config_id}`);
            console.log(`  TTS ID: ${voice.tts_config_id || 'NULL'}`);
          });
        }
        return;
      }
    }

    console.log('❌ tts_config_id column does not exist yet.');
    console.log('💡 You may need to apply the migration manually through the Supabase dashboard or CLI.');
    console.log('   Migration file: supabase/migrations/20250915000100_add_tts_config_id.sql');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addTTSColumn();
