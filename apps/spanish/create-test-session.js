const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('⚠️ Supabase credentials not found in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate a proper UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function createTestSession() {
  console.log('🔨 Creating a test session for resumption testing...');
  
  // First, get the current user ID
  const testUserId = '124361c2-db51-465e-a4e6-98894ceacd1e'; // From the logs
  
  const sessionId = generateUUID();
  const chatGroupId = generateUUID();
  const chatId = generateUUID();
  
  console.log('📝 Test session details:', {
    sessionId,
    chatGroupId,
    chatId,
    userId: testUserId
  });
  
  // Create the session
  const { data: sessionData, error: sessionError } = await supabase
    .from('chat_sessions')
    .insert([
      {
        id: sessionId,
        user_id: testUserId,
        title: 'Test Resumption Session',
        status: 'active',
        hume_chat_id: chatId,
        hume_chat_group_id: chatGroupId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
    
  if (sessionError) {
    console.log('❌ Error creating session:', sessionError.message);
    return;
  }
  
  console.log('✅ Test session created:', sessionData);
  
  // Create some test messages to make it look realistic
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert([
      {
        chat_session_id: sessionId,
        role: 'user',
        content: 'Hello, this is a test message for resumption testing.',
        created_at: new Date(Date.now() - 60000).toISOString() // 1 minute ago
      },
      {
        chat_session_id: sessionId,
        role: 'assistant',
        content: 'Hello! I understand this is a test session for resumption functionality.',
        created_at: new Date(Date.now() - 30000).toISOString() // 30 seconds ago
      }
    ]);
    
  if (messageError) {
    console.log('⚠️ Error creating test messages:', messageError.message);
  } else {
    console.log('✅ Test messages created');
  }
  
  console.log('\n🎯 To test resumption with this session:');
  console.log(`1. Open browser console and run: localStorage.setItem('previousSessionIdToResume', '${sessionId}')`);
  console.log(`2. Navigate to /chat`);
  console.log(`3. The system should find and resume this session with chat group ID: ${chatGroupId}`);
  console.log('\n📋 Session details for debugging:');
  console.log(`   Session ID: ${sessionId}`);
  console.log(`   Chat Group ID: ${chatGroupId}`);
  console.log(`   User ID: ${testUserId}`);
  
  // Also create a console command for easy copying
  console.log('\n📋 Copy this command to browser console:');
  console.log(`localStorage.setItem('previousSessionIdToResume', '${sessionId}'); window.location.href = '/chat';`);
}

createTestSession().catch(console.error); 