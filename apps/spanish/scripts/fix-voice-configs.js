#!/usr/bin/env node

/**
 * Script to fix voice configuration IDs and remove duplicates
 * Based on the correct IDs from Hume dashboard
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Correct voice configuration mapping from Hume dashboard
const correctVoiceConfigs = {
  // Classic Voices
  'male': '793d1f15-4bf9-4beb-a4ab-a62caff84e70', // Zander
  'female': '3a451da2-a50a-42c2-83fa-13c79f027643', // Luna
  'energetic': '8a80af40-ec14-4da0-afeb-d11008491410', // Energetic Voice
  
  // Character Voices
  'brit': 'ea959dd5-8316-4373-b30e-7d10f1a75631', // Brit
  'sass': '8346ae7f-32c4-40f6-aa81-20ce7081df13', // Sass
  'nia': '22161928-44b4-4514-b464-e9d8b0636afa', // Nia
  'julian': '7538b2c8-4527-4e56-919f-19523d640a8e', // Julian
  'maleprotagonist': 'b4fe69c2-720c-44bb-ae45-eccfcc7ebcd6', // Aven
  'jacksparrow': 'a608626e-23e0-4070-8e24-dc880d34000b', // The Pirate
  'zora': '959e5574-4f1a-4f33-a295-84265c438ab3', // Zora
  'kai': '0aae3b3b-b14f-444d-b728-66fb6f0e700f', // Kai
};

async function fixVoiceConfigs() {
  console.log('🎵 Fixing Voice Configuration IDs');
  console.log('==================================\n');

  try {
    // Step 1: Delete duplicate voices (Professional and Friendly)
    console.log('🗑️  Step 1: Removing duplicate voices...');
    
    const { error: deleteError } = await supabase
      .from('voice_configurations')
      .delete()
      .in('internal_name', ['professional', 'friendly']);

    if (deleteError) {
      console.error('Error deleting duplicate voices:', deleteError);
    } else {
      console.log('✅ Deleted Professional and Friendly voices');
    }

    // Step 2: Update voice configuration IDs
    console.log('\n🔄 Step 2: Updating voice configuration IDs...');
    
    for (const [internalName, correctId] of Object.entries(correctVoiceConfigs)) {
      const { error: updateError } = await supabase
        .from('voice_configurations')
        .update({ hume_config_id: correctId })
        .eq('internal_name', internalName);

      if (updateError) {
        console.error(`❌ Error updating ${internalName}:`, updateError);
      } else {
        console.log(`✅ Updated ${internalName} → ${correctId}`);
      }
    }

    // Step 3: Verify the results
    console.log('\n📋 Step 3: Verifying results...');
    
    const { data: voices, error: fetchError } = await supabase
      .from('voice_configurations')
      .select('display_name, internal_name, hume_config_id')
      .order('display_name');

    if (fetchError) {
      console.error('Error fetching voices:', fetchError);
    } else {
      console.log(`\nFound ${voices.length} voice configurations:`);
      voices.forEach(voice => {
        const isCorrect = correctVoiceConfigs[voice.internal_name] === voice.hume_config_id;
        const status = isCorrect ? '✅' : '❌';
        console.log(`${status} ${voice.display_name} (${voice.internal_name}): ${voice.hume_config_id}`);
      });
    }

    console.log('\n🎉 Voice configuration fix complete!');
    console.log('💡 You can now test the voice samples again.');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixVoiceConfigs();
