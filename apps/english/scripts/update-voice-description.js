// Update the description for a specific voice config ID in the voice_configurations table
const path = require('path');
let supabase;
try {
  supabase = require(path.join(__dirname, '../supabaseClient'));
} catch (e) {
  try {
    supabase = require(path.join(__dirname, '../supabaseClient.ts'));
  } catch (err) {
    console.error('Could not import supabaseClient. Make sure it is exported as CommonJS or use a .js wrapper.');
    process.exit(1);
  }
}

const VOICE_CONFIG_ID = "7538b2c8-4527-4e56-919f-19523d640a8e";
const NEW_DESCRIPTION = "A middle-aged African American man, reminiscing with a slightly gravelly voice and a tone of hard-earned wisdom.";

async function updateVoiceDescription() {
  const { data, error } = await supabase
    .from('voice_configurations')
    .update({ description: NEW_DESCRIPTION })
    .eq('id', VOICE_CONFIG_ID)
    .select();

  if (error) {
    console.error('Error updating voice description:', error);
    process.exit(1);
  }

  console.log('Voice configuration updated:', data);
}

updateVoiceDescription(); 