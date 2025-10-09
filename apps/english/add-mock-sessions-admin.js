// Script to add mock session data using service role key (bypasses RLS)
// Run this with: node add-mock-sessions-admin.js <user-id>

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables from .env file
try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (error) {
  // dotenv not available, continue without it
  console.log('Note: dotenv not available, using system environment variables');
}

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gtxihsziwrypenfpqwat.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('Usage: SUPABASE_SERVICE_ROLE_KEY=your_service_key node add-mock-sessions-admin.js <user-id>');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock data - different voice characters with different usage counts
const mockSessions = [
  // Zander - 10 sessions
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  { character_name: 'Zander', agent_name: 'Male Voice', voice_config_id: 'zander-config-1' },
  
  // Mia - 6 sessions
  { character_name: 'Mia', agent_name: 'Female Voice', voice_config_id: 'mia-config-1' },
  { character_name: 'Mia', agent_name: 'Female Voice', voice_config_id: 'mia-config-1' },
  { character_name: 'Mia', agent_name: 'Female Voice', voice_config_id: 'mia-config-1' },
  { character_name: 'Mia', agent_name: 'Female Voice', voice_config_id: 'mia-config-1' },
  { character_name: 'Mia', agent_name: 'Female Voice', voice_config_id: 'mia-config-1' },
  { character_name: 'Mia', agent_name: 'Female Voice', voice_config_id: 'mia-config-1' },
  
  // Luna - 4 sessions
  { character_name: 'Luna', agent_name: 'Luna Voice', voice_config_id: 'luna-config-1' },
  { character_name: 'Luna', agent_name: 'Luna Voice', voice_config_id: 'luna-config-1' },
  { character_name: 'Luna', agent_name: 'Luna Voice', voice_config_id: 'luna-config-1' },
  { character_name: 'Luna', agent_name: 'Luna Voice', voice_config_id: 'luna-config-1' },
  
  // Sage - 2 sessions
  { character_name: 'Sage', agent_name: 'Sage Voice', voice_config_id: 'sage-config-1' },
  { character_name: 'Sage', agent_name: 'Sage Voice', voice_config_id: 'sage-config-1' },
];

async function addMockSessionsAdmin(userId) {
  try {
    console.log(`Adding mock sessions for user: ${userId}`);
    
    // Verify user exists
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error('Error finding user:', userError);
      return;
    }
    
    if (!user) {
      console.error('User not found');
      return;
    }
    
    console.log(`Found user: ${user.user.email} (${user.user.id})`);
    
    // Create mock sessions with timestamps spread over the last 30 days
    const sessions = mockSessions.map((session, index) => {
      const daysAgo = Math.floor(index / 2); // Spread sessions over time
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      
      return {
        user_id: userId,
        title: `Test Session ${index + 1}`,
        summary: `Mock session with ${session.character_name}`,
        character_name: session.character_name,
        agent_name: session.agent_name,
        voice_config_id: session.voice_config_id,
        status: 'completed',
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString()
      };
    });
    
    // Insert sessions in batches
    const batchSize = 10;
    let totalInserted = 0;
    
    for (let i = 0; i < sessions.length; i += batchSize) {
      const batch = sessions.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
      } else {
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${batch.length} sessions`);
        totalInserted += batch.length;
      }
    }
    
    console.log(`\n🎉 Mock sessions added successfully! Total inserted: ${totalInserted}`);
    console.log('Expected "Most Used" results:');
    console.log('- Zander: 10 sessions (45.5%)');
    console.log('- Mia: 6 sessions (27.3%)');
    console.log('- Luna: 4 sessions (18.2%)');
    console.log('- Sage: 2 sessions (9.1%)');
    
  } catch (error) {
    console.error('Error adding mock sessions:', error);
  }
}

// Usage: SUPABASE_SERVICE_ROLE_KEY=your_key node add-mock-sessions-admin.js <user-id>
const userId = process.argv[2];
if (!userId) {
  console.log('Usage: SUPABASE_SERVICE_ROLE_KEY=your_service_key node add-mock-sessions-admin.js <user-id>');
  console.log('Example: SUPABASE_SERVICE_ROLE_KEY=your_key node add-mock-sessions-admin.js 674424df-ee0f-4d69-a875-6fe0f8c71f4b');
  process.exit(1);
}

addMockSessionsAdmin(userId);
