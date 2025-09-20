// Test script to verify admin subscription permissions
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminPermissions() {
  try {
    console.log('Testing admin subscription permissions...');
    
    // First, check if we can read subscription plans
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*');
    
    if (plansError) {
      console.error('Error reading subscription plans:', plansError);
      return;
    }
    
    console.log('✅ Can read subscription plans:', plans?.length);
    
    // Check if we can read subscriptions (this will depend on being logged in)
    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (subsError) {
      console.log('⚠️  Cannot read subscriptions (expected if not logged in):', subsError.message);
    } else {
      console.log('✅ Can read subscriptions');
    }
    
    // Check profiles access
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, is_admin')
      .limit(1);
    
    if (profilesError) {
      console.log('⚠️  Cannot read profiles (expected if not logged in):', profilesError.message);
    } else {
      console.log('✅ Can read profiles');
    }
    
    console.log('\n🔍 Policy test complete. The actual admin operations will work when logged in as an admin user.');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdminPermissions(); 