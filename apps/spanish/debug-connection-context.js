const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔍 DEBUGGING CONNECTION CONTEXT DIFFERENCES...\n');

// Check environment variables
console.log('📊 ENVIRONMENT VARIABLES:');
console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 'undefined');
console.log('  SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 'undefined');
console.log('');

// Create clients with different auth contexts
const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const serviceClient = process.env.SUPABASE_SERVICE_ROLE_KEY ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
) : null;

async function testConnections() {
  try {
    console.log('🔐 TESTING ANONYMOUS CLIENT (same as web app):');
    
    // Test anonymous connection without auth
    const { data: anonSessions, error: anonError } = await anonClient
      .from('chat_sessions')
      .select('count()')
      .single();
    
    console.log('  Sessions count (no auth):', anonSessions?.count || 'Error');
    console.log('  Error:', anonError?.message || 'None');
    console.log('');

    // Test with simulated user auth (this won't work in Node.js but shows the difference)
    console.log('🔐 TESTING WITH USER CONTEXT:');
    console.log('  Note: Node.js scripts run without user authentication context');
    console.log('  Web apps have auth.uid() from authenticated sessions');
    console.log('  This is likely why counts differ!');
    console.log('');

    if (serviceClient) {
      console.log('🔧 TESTING SERVICE ROLE CLIENT (bypass RLS):');
      
      const { data: serviceSessions, error: serviceError } = await serviceClient
        .from('chat_sessions')
        .select('count()')
        .single();
      
      console.log('  Sessions count (service role):', serviceSessions?.count || 'Error');
      console.log('  Error:', serviceError?.message || 'None');

      // Check for sessions for specific user
      const { data: userSessions, error: userError } = await serviceClient
        .from('chat_sessions')
        .select('count()')
        .eq('user_id', '124361c2-db51-465e-a4e6-98894ceacd1e')
        .single();
      
      console.log('  Sessions for specific user:', userSessions?.count || 'Error');
      console.log('  Error:', userError?.message || 'None');
    }

    console.log('');
    console.log('🔍 RLS POLICY CHECK:');
    
    // Check if RLS policies are blocking anonymous access
    const { data: policies, error: policyError } = await anonClient
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'chat_sessions');
    
    console.log('  RLS policies found:', policies?.length || 'Error checking');
    console.log('  Policy error:', policyError?.message || 'None');
    
    if (policies && policies.length > 0) {
      policies.forEach(policy => {
        console.log(`    Policy: ${policy.policyname} (${policy.cmd}) - ${policy.qual}`);
      });
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

console.log('💡 EXPLANATION:');
console.log('  If Node.js shows 0 sessions but web app shows 62:');
console.log('  1. RLS policies require authenticated user context (auth.uid())');
console.log('  2. Node.js scripts run without user auth → see 0 sessions');
console.log('  3. Web app runs with user auth → sees user\'s sessions');
console.log('  4. This is NORMAL and SECURE behavior!');
console.log('');

testConnections(); 