import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

const REFERRAL_MINUTES = parseInt(process.env.NEXT_PUBLIC_REFERRAL_MINUTES || '30', 10);

export async function POST(req: NextRequest) {
  const { referralCode } = await req.json();
  if (!referralCode) {
    return NextResponse.json({ error: 'Missing referralCode' }, { status: 400 });
  }

  // Get auth cookie / header
  const { data: { user }, error: userErr } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''));

  if (userErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Do not allow self-referral if somehow codes match
  const { data: referrerProfile, error: profileErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('referral_code', referralCode)
    .single();

  if (profileErr || !referrerProfile) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
  }

  if (referrerProfile.id === user.id) {
    return NextResponse.json({ error: 'Cannot redeem your own code' }, { status: 400 });
  }

  // Call the Postgres function to award minutes and record referral
  const { error: rpcErr } = await supabase.rpc('award_referral_minutes', {
    p_referrer: referrerProfile.id,
    p_referred: user.id,
    p_minutes: REFERRAL_MINUTES,
  });

  if (rpcErr) {
    return NextResponse.json({ error: rpcErr.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, minutes: REFERRAL_MINUTES });
} 