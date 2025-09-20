// Quick debug script to check recent sessions
const { createClient } = require('./node_modules/@supabase/supabase-js/dist/main/index.js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugSessions() {
  try {
    console.log('🔍 Checking recent chat sessions...');
    
    // Get recent sessions
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching sessions:', error);
      return;
    }

    console.log(`📊 Found ${sessions.length} recent sessions:`);
    sessions.forEach((session, i) => {
      console.log(`${i+1}. ID: ${session.id}`);
      console.log(`   Title: ${session.title}`);
      console.log(`   Created: ${session.created_at}`);
      console.log(`   User: ${session.user_id}`);
      console.log(`   Hume Chat ID: ${session.hume_chat_id || 'None'}`);
      console.log(`   Status: ${session.status || 'None'}`);
      console.log('');
    });

    // Check profiles with data saving enabled
    console.log('🔍 Checking users with data saving enabled...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, subscription_status, data_saving_preference')
      .eq('data_saving_preference', true);
    
    if (!profileError) {
      console.log(`📊 Found ${profiles.length} users with data saving enabled:`);
      profiles.forEach(profile => {
        console.log(`- ${profile.id}: ${profile.subscription_status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugSessions();
