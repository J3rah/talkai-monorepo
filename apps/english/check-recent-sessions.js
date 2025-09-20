const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔧 Environment check:');
console.log('   SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
console.log('   SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkRecentSessions() {
  try {
    console.log('🔍 Checking recent chat sessions...\n');
    
    // First, let's check if we can connect to the database at all
    console.log('🔌 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('chat_sessions')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    console.log('✅ Database connection successful\n');
    
    // Check total count of sessions
    const { count: totalCount, error: countError } = await supabase
      .from('chat_sessions')
      .select('id', { count: 'exact' });
    
    if (countError) {
      console.error('❌ Error getting total count:', countError);
    } else {
      console.log(`📊 Total sessions in database: ${totalCount}\n`);
    }
    
    // Get the most recent 10 sessions regardless of date
    console.log('🕒 Fetching 10 most recent sessions (any date):');
    const { data: mostRecent, error: recentError } = await supabase
      .from('chat_sessions')
      .select('id, created_at, title, user_id')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (recentError) {
      console.error('❌ Error fetching recent sessions:', recentError);
    } else if (mostRecent && mostRecent.length > 0) {
      mostRecent.forEach((session, index) => {
        console.log(`${index + 1}. ${session.id.slice(-8)} - ${new Date(session.created_at).toLocaleString()} - ${session.title || 'Untitled'}`);
      });
      console.log('');
    } else {
      console.log('No sessions found at all!\n');
    }
    
    // Now check with date filtering
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    console.log(`🗓️  Date filtering debug:`);
    console.log(`   Current time: ${new Date().toISOString()}`);
    console.log(`   24 hours ago: ${oneDayAgo.toISOString()}`);
    console.log(`   Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n`);
    
    const { data: recentSessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .gte('created_at', oneDayAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (sessionsError) {
      console.error('❌ Error fetching filtered sessions:', sessionsError);
      return;
    }
    
    console.log(`📊 Found ${recentSessions?.length || 0} sessions in the last 24 hours:\n`);
    
    if (recentSessions && recentSessions.length > 0) {
      recentSessions.forEach((session, index) => {
        const timeDiff = Date.now() - new Date(session.created_at).getTime();
        const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesAgo = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        console.log(`${index + 1}. Session ${session.id}`);
        console.log(`   Title: ${session.title || 'Untitled'}`);
        console.log(`   User ID: ${session.user_id}`);
        console.log(`   Created: ${new Date(session.created_at).toLocaleString()}`);
        console.log(`   Time ago: ${hoursAgo}h ${minutesAgo}m`);
        console.log(`   Status: ${session.status || 'No status'}`);
        console.log(`   Duration: ${session.duration || 0} seconds`);
        console.log(`   Has Hume Chat ID: ${!!session.hume_chat_id}`);
        console.log(`   Has Hume Chat Group ID: ${!!session.hume_chat_group_id}`);
        console.log(`   Summary: ${session.summary || 'No summary'}`);
        console.log('');
      });
      
      // Check for any sessions that might be stuck or incomplete
      const stuckSessions = recentSessions.filter(s => s.status === 'in_progress');
      if (stuckSessions.length > 0) {
        console.log(`⚠️  Found ${stuckSessions.length} sessions stuck in 'in_progress' status:`);
        stuckSessions.forEach(session => {
          console.log(`   - ${session.id} (created ${new Date(session.created_at).toLocaleString()})`);
        });
        console.log('');
      }
      
      // Check for sessions without Hume identifiers
      const sessionsWithoutHume = recentSessions.filter(s => !s.hume_chat_group_id);
      if (sessionsWithoutHume.length > 0) {
        console.log(`⚠️  Found ${sessionsWithoutHume.length} sessions without Hume chat group ID:`);
        sessionsWithoutHume.forEach(session => {
          console.log(`   - ${session.id} (created ${new Date(session.created_at).toLocaleString()})`);
        });
        console.log('');
      }
      
      // Check for messages in recent sessions
      const sessionIds = recentSessions.map(s => s.id);
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('chat_session_id, role, created_at')
        .in('chat_session_id', sessionIds)
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        console.error('❌ Error fetching messages:', messagesError);
      } else {
        console.log(`💬 Message distribution across recent sessions:`);
        const messagesBySession = {};
        messages?.forEach(msg => {
          if (!messagesBySession[msg.chat_session_id]) {
            messagesBySession[msg.chat_session_id] = { user: 0, assistant: 0 };
          }
          messagesBySession[msg.chat_session_id][msg.role]++;
        });
        
        recentSessions.forEach(session => {
          const msgCount = messagesBySession[session.id];
          if (msgCount) {
            console.log(`   Session ${session.id.slice(-8)}: ${msgCount.user || 0} user, ${msgCount.assistant || 0} assistant messages`);
          } else {
            console.log(`   Session ${session.id.slice(-8)}: No messages found`);
          }
        });
      }
      
    } else {
      console.log('❓ This is unexpected - sessions should exist!');
      console.log('   Possible issues:');
      console.log('   - Timezone mismatch');
      console.log('   - Database RLS (Row Level Security) filtering');
      console.log('   - Different environment/database');
      console.log('   - Sessions are older than 24 hours');
    }
    
    // Check localStorage data (if this was run in browser)
    console.log('\n📱 Current localStorage state:');
    console.log('   previousSessionIdToResume:', typeof window !== 'undefined' ? localStorage.getItem('previousSessionIdToResume') : 'N/A (server)');
    console.log('   currentChatSessionId:', typeof window !== 'undefined' ? localStorage.getItem('currentChatSessionId') : 'N/A (server)');
    console.log('   currentTherapySessionId:', typeof window !== 'undefined' ? localStorage.getItem('currentTherapySessionId') : 'N/A (server)');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkRecentSessions(); 