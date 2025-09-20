#!/usr/bin/env node

/**
 * Script to apply the TTS config ID migration directly to the database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyTTSMigration() {
  console.log('🎵 Applying TTS Config ID Migration');
  console.log('===================================\n');

  try {
    // Step 1: Add the tts_config_id column
    console.log('📝 Step 1: Adding tts_config_id column...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE voice_configurations ADD COLUMN IF NOT EXISTS tts_config_id TEXT;'
    });

    if (alterError) {
      console.error('❌ Error adding column:', alterError);
      return;
    }
    console.log('✅ Added tts_config_id column');

    // Step 2: Back-fill with current EVI IDs
    console.log('\n🔄 Step 2: Back-filling with current EVI IDs...');
    const { error: updateError } = await supabase
      .from('voice_configurations')
      .update({ tts_config_id: supabase.sql`hume_config_id` })
      .is('tts_config_id', null);

    if (updateError) {
      console.error('❌ Error back-filling:', updateError);
      return;
    }
    console.log('✅ Back-filled tts_config_id with hume_config_id values');

    // Step 3: Verify the results
    console.log('\n📋 Step 3: Verifying results...');
    const { data: voices, error: fetchError } = await supabase
      .from('voice_configurations')
      .select('display_name, internal_name, hume_config_id, tts_config_id')
      .order('display_name');

    if (fetchError) {
      console.error('❌ Error fetching voices:', fetchError);
      return;
    }

    console.log(`\nFound ${voices.length} voice configurations:`);
    voices.forEach(voice => {
      const hasTTS = voice.tts_config_id !== null;
      const status = hasTTS ? '✅' : '❌';
      console.log(`${status} ${voice.display_name} (${voice.internal_name})`);
      console.log(`    EVI ID: ${voice.hume_config_id}`);
      console.log(`    TTS ID: ${voice.tts_config_id || 'NULL'}`);
    });

    console.log('\n🎉 TTS Config ID migration complete!');
    console.log('💡 Next: Update the TTS config IDs with actual TTS-only IDs from Hume dashboard');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

applyTTSMigration();
