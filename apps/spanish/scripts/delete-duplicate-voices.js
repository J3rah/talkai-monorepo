const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteDuplicateVoices() {
  console.log('🗑️ Deleting Professional and Friendly voices (keeping Luna)...');
  
  try {
    // Delete Professional Voice
    const { error: profError } = await supabase
      .from('voice_configurations')
      .delete()
      .eq('internal_name', 'professional');
    
    if (profError) {
      console.error('Error deleting Professional voice:', profError);
    } else {
      console.log('✅ Deleted Professional Voice');
    }
    
    // Delete Friendly Voice
    const { error: friendlyError } = await supabase
      .from('voice_configurations')
      .delete()
      .eq('internal_name', 'friendly');
    
    if (friendlyError) {
      console.error('Error deleting Friendly voice:', friendlyError);
    } else {
      console.log('✅ Deleted Friendly Voice');
    }
    
    console.log('🎵 Voice deletion completed');
    
    // List remaining voices to confirm
    console.log('\n📋 Remaining voices:');
    const { data: voices, error: listError } = await supabase
      .from('voice_configurations')
      .select('internal_name, display_name, hume_config_id, required_plan')
      .eq('is_active', true)
      .order('display_name');
    
    if (listError) {
      console.error('Error listing voices:', listError);
    } else {
      voices.forEach(voice => {
        console.log(`- ${voice.display_name} (${voice.internal_name}): ${voice.hume_config_id} [${voice.required_plan}]`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

deleteDuplicateVoices();
