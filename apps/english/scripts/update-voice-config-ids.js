#!/usr/bin/env node

/**
 * Script to update voice configuration IDs in the database
 * Usage: node scripts/update-voice-config-ids.js
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updateVoiceConfigIds() {
  console.log('🎵 Voice Configuration ID Updater');
  console.log('=====================================\n');

  try {
    // Get all voice configurations
    const { data: voices, error } = await supabase
      .from('voice_configurations')
      .select('*')
      .order('display_name');

    if (error) {
      console.error('Error fetching voice configurations:', error);
      rl.close();
      process.exit(1);
    }

    console.log(`Found ${voices.length} voice configurations:\n`);

    for (let i = 0; i < voices.length; i++) {
      const voice = voices[i];
      console.log(`${i + 1}. ${voice.display_name}`);
      console.log(`   Current ID: ${voice.hume_config_id}`);
      console.log(`   Internal Name: ${voice.internal_name}`);
      console.log(`   Required Plan: ${voice.required_plan}\n`);
    }

    console.log('\n📋 Instructions:');
    console.log('1. Go to your Hume dashboard');
    console.log('2. Find each voice configuration');
    console.log('3. Copy the correct configuration ID');
    console.log('4. Enter the new ID for each voice (or press Enter to skip)\n');

    const updates = [];

    for (const voice of voices) {
      const newId = await askQuestion(
        `Enter new Hume Config ID for "${voice.display_name}" (current: ${voice.hume_config_id}): `
      );

      if (newId && newId !== voice.hume_config_id) {
        updates.push({
          id: voice.id,
          display_name: voice.display_name,
          old_id: voice.hume_config_id,
          new_id: newId
        });
      }
    }

    if (updates.length === 0) {
      console.log('\n✅ No updates needed.');
      rl.close();
      return;
    }

    console.log('\n📝 Summary of updates:');
    updates.forEach(update => {
      console.log(`- ${update.display_name}: ${update.old_id} → ${update.new_id}`);
    });

    const confirm = await askQuestion('\n❓ Proceed with these updates? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Updates cancelled.');
      rl.close();
      return;
    }

    // Perform updates
    console.log('\n🔄 Updating voice configurations...');
    
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('voice_configurations')
        .update({ hume_config_id: update.new_id })
        .eq('id', update.id);

      if (updateError) {
        console.error(`❌ Error updating ${update.display_name}:`, updateError);
      } else {
        console.log(`✅ Updated ${update.display_name}`);
      }
    }

    console.log('\n🎉 Voice configuration updates complete!');
    console.log('💡 You can now test the voice samples again.');

  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    rl.close();
  }
}

updateVoiceConfigIds();
