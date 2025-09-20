const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('⚠️ Supabase credentials not found in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSession() {
  console.log('🔍 Checking for session dbe37855-1550-4ee3-b0b0-476daaebd393...');
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, hume_chat_group_id, title, status, created_at')
    .eq('id', 'dbe37855-1550-4ee3-b0b0-476daaebd393')
    .maybeSingle();
    
  if (error) {
    console.log('❌ Database error:', error.message);
    return;
  }
  
  if (!data) {
    console.log('❌ Session not found by session ID');
    
    // Check if the ID we were querying for is actually a chat group ID
    console.log('🔍 Checking if this is actually a chat group ID...');
    const { data: byGroupId, error: groupError } = await supabase
      .from('chat_sessions')
      .select('id, hume_chat_group_id, title, status, created_at')
      .eq('hume_chat_group_id', 'dbe37855-1550-4ee3-b0b0-476daaebd393')
      .maybeSingle();
      
    if (byGroupId) {
      console.log('✅ Found session by chat group ID:', byGroupId);
    } else {
      console.log('❌ Not found as chat group ID either');
    }
    
    // Also check what localStorage was actually containing
    console.log('🔍 Checking for fdf4c194-bb87-4e28-aed0-2b5c6bae486f (from logs)...');
    const { data: loggedId, error: loggedError } = await supabase
      .from('chat_sessions')
      .select('id, hume_chat_group_id, title, status, created_at')
      .eq('id', 'fdf4c194-bb87-4e28-aed0-2b5c6bae486f')
      .maybeSingle();
      
    if (loggedId) {
      console.log('✅ Found session by logged ID:', loggedId);
    } else {
      console.log('❌ Logged ID not found as session ID either');
      
      // Check if it's a chat group ID
      const { data: loggedAsGroupId } = await supabase
        .from('chat_sessions')
        .select('id, hume_chat_group_id, title, status, created_at')
        .eq('hume_chat_group_id', 'fdf4c194-bb87-4e28-aed0-2b5c6bae486f')
        .maybeSingle();
        
      if (loggedAsGroupId) {
        console.log('✅ Found session by logged ID as chat group ID:', loggedAsGroupId);
      }
    }
    return;
  }
  
  console.log('✅ Session found by session ID:', data);
}

checkSession().catch(console.error); 