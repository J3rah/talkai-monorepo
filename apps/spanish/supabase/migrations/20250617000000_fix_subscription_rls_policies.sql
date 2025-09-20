-- Fix RLS policies for subscriptions to resolve 406 errors
-- This migration fixes the Row Level Security policies that are causing subscription query failures

-- Drop existing problematic policies
DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_update" ON subscriptions;
DROP POLICY IF EXISTS "subscription_plans_select" ON subscription_plans;

-- Recreate subscription policies with proper service role access
CREATE POLICY "subscriptions_user_select" ON subscriptions
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.role() = 'service_role'
    );

CREATE POLICY "subscriptions_user_insert" ON subscriptions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.role() = 'service_role'
    );

CREATE POLICY "subscriptions_user_update" ON subscriptions
    FOR UPDATE USING (
        auth.uid() = user_id OR
        auth.role() = 'service_role'
    );

-- Fix subscription_plans policy for joins
CREATE POLICY "subscription_plans_public_select" ON subscription_plans
    FOR SELECT USING (true);

-- Ensure service role policies exist
DROP POLICY IF EXISTS "service_subscriptions" ON subscriptions;
CREATE POLICY "service_subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_subscription_plans" ON subscription_plans;
CREATE POLICY "service_subscription_plans" ON subscription_plans
    FOR ALL USING (auth.role() = 'service_role');
