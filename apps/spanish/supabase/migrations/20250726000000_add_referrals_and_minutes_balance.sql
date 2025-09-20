-- Migration: Add minutes_balance & referral_code to profiles, create referrals table
-- Run with Supabase CLI or via dashboard

-- Ensure pgcrypto extension is available for digest()/gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Add new columns to profiles -----------------------------------------
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS minutes_balance integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- Generate a referral code for existing users (hash of uuid, simple example)
UPDATE profiles
SET referral_code = encode(digest(id::text, 'sha256'), 'hex')
WHERE referral_code IS NULL;

-- 2. Create referrals table ----------------------------------------------
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  minutes_awarded integer NOT NULL,
  redeemed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referrer_id, referred_id)
);

-- 3. Row-level security ---------------------------------------------------
-- Enable RLS so users can only see their own referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Referrer can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- 4. Helper function to award minutes ------------------------------------
CREATE OR REPLACE FUNCTION award_referral_minutes(p_referrer uuid, p_referred uuid, p_minutes integer)
RETURNS void AS $$
BEGIN
  -- Update balances
  UPDATE profiles SET minutes_balance = minutes_balance + p_minutes WHERE id IN (p_referrer, p_referred);

  -- Insert referral record (idempotent thanks to UNIQUE constraint)
  INSERT INTO referrals (referrer_id, referred_id, minutes_awarded, redeemed)
  VALUES (p_referrer, p_referred, p_minutes, true)
  ON CONFLICT (referrer_id, referred_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users so our API/Edge functions can call it
GRANT EXECUTE ON FUNCTION award_referral_minutes TO authenticated; 