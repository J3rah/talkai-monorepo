const supabase = require('../supabaseClient.cjs');

const VOICE_CONFIG_ID = "7538b2c8-4527-4e56-919f-19523d640a8e";

async function checkVoiceDescription() {
  const { data, error } = await supabase
    .from('voice_configurations')
    .select('id, description')
    .eq('id', VOICE_CONFIG_ID)
    .single();

  if (error) {
    console.error('Error fetching voice description:', error);
    process.exit(1);
  }

  console.log('Voice configuration:', data);
}

checkVoiceDescription(); 