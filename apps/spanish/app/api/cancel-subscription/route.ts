import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabase from '@/supabaseClient';

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil' as const,
  });
}

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();

    // Initialize Stripe with error handling
    const stripe = getStripe();

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update the subscription in the database
    const { error } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        status: subscription.status,
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Error canceling subscription' },
      { status: 500 }
    );
  }
} 