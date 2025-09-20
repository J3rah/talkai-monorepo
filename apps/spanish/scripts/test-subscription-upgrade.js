// Test script to debug subscription upgrade issues
// Run with: node scripts/test-subscription-upgrade.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSubscriptionUpgrade() {
  console.log('🔍 Testing Subscription Upgrade Flow...\n');

  try {
    // 1. Check subscription plans
    console.log('1. Checking subscription plans...');
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_amount');

    if (plansError) {
      console.error('❌ Error fetching plans:', plansError);
      return;
    }

    console.log('✅ Available plans:');
    plans.forEach(plan => {
      console.log(`   - ${plan.name}: ${plan.price_id} ($${plan.price_amount / 100})`);
    });

    // 2. Check for users with multiple active subscriptions
    console.log('\n2. Checking for users with multiple active subscriptions...');
    
    // First get all active subscriptions
    const { data: activeSubscriptions, error: activeError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active');

    if (activeError) {
      console.error('❌ Error fetching active subscriptions:', activeError);
    } else {
      // Count subscriptions per user
      const userCounts = {};
      activeSubscriptions.forEach(sub => {
        userCounts[sub.user_id] = (userCounts[sub.user_id] || 0) + 1;
      });

      // Find users with multiple subscriptions
      const multipleSubUsers = Object.entries(userCounts)
        .filter(([userId, count]) => count > 1)
        .map(([userId, count]) => ({ user_id: userId, subscription_count: count }));

      if (multipleSubUsers && multipleSubUsers.length > 0) {
        console.log('⚠️  Users with multiple active subscriptions:');
        multipleSubUsers.forEach(user => {
          console.log(`   - User ${user.user_id}: ${user.subscription_count} subscriptions`);
        });
      } else {
        console.log('✅ No users with multiple active subscriptions found');
      }
    }

    // 3. Check for pending subscriptions without Stripe IDs
    console.log('\n3. Checking for orphaned pending subscriptions...');
    const { data: orphanedSubs, error: orphanError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'pending')
      .is('stripe_subscription_id', null);

    if (orphanError) {
      console.error('❌ Error checking orphaned subscriptions:', orphanError);
    } else if (orphanedSubs && orphanedSubs.length > 0) {
      console.log(`⚠️  Found ${orphanedSubs.length} orphaned pending subscriptions`);
      orphanedSubs.forEach(sub => {
        console.log(`   - ID: ${sub.id}, User: ${sub.user_id}, Created: ${sub.created_at}`);
      });
    } else {
      console.log('✅ No orphaned pending subscriptions found');
    }

    // 4. Check recent subscription activity
    console.log('\n4. Recent subscription activity (last 24 hours)...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentSubs, error: recentError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans(name)
      `)
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false });

    if (recentError) {
      console.error('❌ Error fetching recent subscriptions:', recentError);
    } else if (recentSubs && recentSubs.length > 0) {
      console.log(`📊 Found ${recentSubs.length} recent subscription changes:`);
      recentSubs.forEach(sub => {
        console.log(`   - ${sub.subscription_plans?.name || 'Unknown'}: ${sub.status} (${new Date(sub.created_at).toLocaleString()})`);
      });
    } else {
      console.log('ℹ️  No recent subscription activity');
    }

    console.log('\n✅ Subscription system analysis complete!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSubscriptionUpgrade();
