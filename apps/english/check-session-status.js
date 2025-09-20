const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSessionStatus() {
  const sessionId = '8c04aeaa-0243-4706-b193-3913abdff479';
  
  try {
    console.log('🔍 CHECKING SESSION STATUS...\n');
    console.log(`Session ID: ${sessionId}`);
    
    // Get full session details
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      return;
    }

    if (!session) {
      console.log('❌ Session not found in database');
      return;
    }

    console.log('\n📊 SESSION DETAILS:');
    console.log(`   Title: ${session.title || 'Untitled'}`);
    console.log(`   Status: ${session.status || 'unknown'}`);
    console.log(`   Created: ${new Date(session.created_at).toLocaleString()}`);
    console.log(`   Updated: ${session.updated_at ? new Date(session.updated_at).toLocaleString() : 'Never'}`);
    console.log(`   Duration: ${session.duration || 0} seconds`);
    console.log(`   User ID: ${session.user_id}`);
    
    console.log('\n🔧 HUME INTEGRATION:');
    console.log(`   Hume Chat ID: ${session.hume_chat_id || 'NOT SET'}`);
    console.log(`   Hume Group ID: ${session.hume_chat_group_id || 'NOT SET'}`);
    console.log(`   Is Resumable: ${session.hume_chat_group_id ? 'YES ✅' : 'NO ❌'}`);
    
    console.log('\n🚦 STATUS ANALYSIS:');
    const status = session.status || 'unknown';
    
    switch (status) {
      case 'in_progress':
        console.log('   ⚠️  SESSION IS STUCK IN "in_progress" STATUS');
        console.log('   This will prevent resumption from working properly');
        console.log('   The session should be updated to "completed"');
        break;
        
      case 'completed':
        console.log('   ✅ Session status is correct for resumption');
        break;
        
      case 'disconnected':
        console.log('   🔌 Session marked as disconnected');
        break;
        
      default:
        console.log(`   ❓ Unknown status: ${status}`);
    }
    
    // Check if this could be causing resumption issues
    console.log('\n🔄 RESUMPTION READINESS:');
    const hasHumeIds = !!(session.hume_chat_id && session.hume_chat_group_id);
    const isCompleted = session.status === 'completed';
    const isReady = hasHumeIds && isCompleted;
    
    console.log(`   Has Hume IDs: ${hasHumeIds ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   Status Completed: ${isCompleted ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   Ready for Resumption: ${isReady ? 'YES ✅' : 'NO ❌'}`);
    
    if (!isReady) {
      console.log('\n🔧 FIXING ISSUES:');
      
      if (!isCompleted && session.status === 'in_progress') {
        console.log('   Updating session status to "completed"...');
        const { error: updateError } = await supabase
          .from('chat_sessions')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', sessionId);
        
        if (updateError) {
          console.error('   ❌ Failed to update status:', updateError);
        } else {
          console.log('   ✅ Status updated to "completed"');
        }
      }
      
      if (!hasHumeIds) {
        console.log('   ❌ Missing Hume IDs - this session cannot be resumed');
        console.log('   This typically means the session ended before Hume metadata was received');
      }
    }
    
    // Check for recent activity
    const now = new Date();
    const created = new Date(session.created_at);
    const ageMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    console.log(`\n⏰ AGE: ${ageMinutes} minutes old`);
    
    if (ageMinutes < 30) {
      console.log('   🔥 This is a very recent session');
    } else if (ageMinutes < 60) {
      console.log('   🕐 This is a recent session (within last hour)');
    } else {
      console.log('   📅 This is an older session');
    }

  } catch (error) {
    console.error('❌ Error checking session:', error);
  }
}

checkSessionStatus(); 