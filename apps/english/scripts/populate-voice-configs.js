require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function populateVoiceConfigs() {
  console.log('Populating voice configurations with correct character names...');
  
  // First, let's check if the table exists and has data
  const { data: existing, error: checkError } = await supabase
    .from('voice_configurations')
    .select('*')
    .limit(1);
  
  if (checkError) {
    console.error('Error checking voice_configurations table:', checkError);
    return;
  }
  
  console.log('Existing records:', existing?.length || 0);
  
  // Update character names for known voices
  const updates = [
    { internal_name: 'jacksparrow', character_name: 'Captain Jules Vane' },
    { internal_name: 'male', character_name: 'Zander' },
    { internal_name: 'female', character_name: 'Mia' },
    { internal_name: 'sass', character_name: 'Sass' },
    { internal_name: 'brit', character_name: 'Brit' },
    { internal_name: 'julian', character_name: 'Julian' },
    { internal_name: 'aven', character_name: 'Aven' },
    { internal_name: 'nia', character_name: 'Nia' },
    { internal_name: 'zora', character_name: 'Zora' },
    { internal_name: 'kai', character_name: 'Kai' },
  ];
  
  for (const update of updates) {
    const { error } = await supabase
      .from('voice_configurations')
      .update({ character_name: update.character_name })
      .eq('internal_name', update.internal_name);
    
    if (error) {
      console.error(`Error updating ${update.internal_name}:`, error);
    } else {
      console.log(`✅ Updated ${update.internal_name} -> ${update.character_name}`);
    }
  }
  
  // Verify the updates
  const { data: updated, error: verifyError } = await supabase
    .from('voice_configurations')
    .select('internal_name, display_name, character_name')
    .eq('is_active', true)
    .order('internal_name');
  
  if (verifyError) {
    console.error('Error verifying updates:', verifyError);
    return;
  }
  
  console.log('\nUpdated voice configurations:');
  updated.forEach(config => {
    console.log(`${config.internal_name}: ${config.display_name} -> ${config.character_name}`);
  });
}

populateVoiceConfigs().catch(console.error);
