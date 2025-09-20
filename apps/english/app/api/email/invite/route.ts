import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ensure required environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration for email invite route');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const runtime = 'nodejs';

interface InvitePayload {
  email?: string;
  inviteUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, inviteUrl } = (await req.json()) as InvitePayload;

    if (!email || !inviteUrl) {
      return NextResponse.json(
        { error: 'Missing email or inviteUrl' },
        { status: 400 }
      );
    }

    // Build redirect link for after the user confirms their email.
    // Supabase will append its own "token" query parameter.
    // Keeping the original inviteUrl (which already contains ?ref=CODE) preserves referral tracking.
    const redirectTo = inviteUrl;

    // Send the invite email via Supabase Auth admin API.
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });

    if (error) {
      // Supabase returns 422 when user already registered, 400 when invite already sent.
      if ((error as any).status === 422 || (error as any).code === 'email_exists') {
        return NextResponse.json({ success: true, alreadyRegistered: true });
      }

      if ((error as any).status === 400 && String((error as any).message).toLowerCase().includes('already invited')) {
        return NextResponse.json({ success: true, alreadyInvited: true });
      }

      console.error('Error sending invite email:', error);
      return NextResponse.json(
        { error: 'Failed to send invite email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in /api/email/invite:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 