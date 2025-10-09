// Script to add mock session data for testing "Most Used" functionality
// Run this with: node add-mock-sessions.js

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://gtxihsziwrypenfpqwat.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGloc3ppd3J5cGVuZnBxd2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NDE0MDQsImV4cCI6MjA2MTAxNzQwNH0.Sz9uPlGxu0HqxiUGiDP_TDHqzZZIHCEKf8plYQ_8jqw';
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function addMockSessions(userIdentifier) {
  try {
    console.log(`Adding mock sessions for user: ${userIdentifier}`);
    
    let userId;
    
    // Check if userIdentifier looks like a UUID (user ID) or email
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userIdentifier);
    
    if (isUuid) {
      // It's a UUID, use it directly as user ID
      userId = userIdentifier;
      console.log(`Using provided user ID: ${userId}`);
    } else {
      // It's an email, but we can't look it up due to RLS
      console.log('Email lookup not available due to Row Level Security (RLS) policies.');
      console.log('Please provide the user ID directly instead of email.');
      console.log('');
      console.log('To find the user ID:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to Authentication > Users');
      console.log('3. Find the user and copy their User UID');
      console.log('4. Run: node add-mock-sessions.js <user-id>');
      console.log('');
      console.log('Example: node add-mock-sessions.js 123e4567-e89b-12d3-a456-426614174000');
      return;
    }
    
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
    for (let i = 0; i < sessions.length; i += batchSize) {
      const batch = sessions.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
      } else {
        console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}: ${batch.length} sessions`);
      }
    }
    
    console.log('✅ Mock sessions added successfully!');
    console.log('Expected "Most Used" results:');
    console.log('- Zander: 10 sessions (45.5%)');
    console.log('- Mia: 6 sessions (27.3%)');
    console.log('- Luna: 4 sessions (18.2%)');
    console.log('- Sage: 2 sessions (9.1%)');
    
  } catch (error) {
    console.error('Error adding mock sessions:', error);
  }
}

// Usage: node add-mock-sessions.js <user-id-or-email>
const userIdentifier = process.argv[2];
if (!userIdentifier) {
  console.log('Usage: node add-mock-sessions.js <user-id-or-email>');
  console.log('Example: node add-mock-sessions.js 123e4567-e89b-12d3-a456-426614174000');
  console.log('');
  console.log('Note: Due to RLS policies, you need to provide the user ID directly.');
  console.log('Find the user ID in your Supabase dashboard under Authentication > Users');
  process.exit(1);
}

addMockSessions(userIdentifier);
