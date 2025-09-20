import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil' as const,
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      console.error('No session ID provided');
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log('Verifying session:', sessionId);

    // Initialize Stripe with error handling
    const stripe = getStripe();

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    console.log('Retrieved session:', {
      id: session.id,
      subscription: session.subscription ? 'exists' : 'missing',
      metadata: session.metadata,
      customer: session.customer ? 'exists' : 'missing'
    });

    if (!session.subscription) {
      console.error('No subscription found in session');
      return NextResponse.json(
        { error: 'No subscription found in session' },
        { status: 400 }
      );
    }

    const subscription = session.subscription as unknown as Stripe.Subscription;
    const { userId, planId } = session.metadata || {};

    console.log('Session metadata:', session.metadata);

    if (!userId || !planId) {
      console.error('Missing metadata:', { userId, planId });
      return NextResponse.json(
        { error: 'Missing user or plan information' },
        { status: 400 }
      );
    }

    console.log('Processing subscription:', {
      userId,
      planId,
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: (subscription as any).current_period_start,
      currentPeriodEnd: (subscription as any).current_period_end
    });

    // Get the plan name from the plan ID
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('name')
      .eq('id', planId)
      .single();

    if (planError) {
      console.error('Error fetching plan:', planError);
      return NextResponse.json(
        { error: 'Error fetching plan details' },
        { status: 500 }
      );
    }

    if (!plan) {
      console.error('Invalid plan ID:', planId);
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    // Find the pending subscription created during checkout
    const { data: pendingSubscription, error: findError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .eq('status', 'pending')
      .single();

    if (findError || !pendingSubscription) {
      console.error('Error finding pending subscription:', findError);
      return NextResponse.json(
        { error: 'Pending subscription not found' },
        { status: 404 }
      );
    }

    // Update the pending subscription with Stripe details
    const subscriptionData = {
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      cancel_at_period_end: (subscription as any).cancel_at_period_end,
      updated_at: new Date().toISOString()
    };

    console.log('Updating subscription with data:', subscriptionData);

    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', pendingSubscription.id);

    if (subscriptionError) {
      console.error('Error updating subscription:', subscriptionError);
      return NextResponse.json(
        { error: 'Error updating subscription record' },
        { status: 500 }
      );
    }

    // Update user's subscription status in profiles
    const profileUpdateData = {
      subscription_status: subscription.status === 'active' ? plan.name.toLowerCase() : 'free',
    };

    console.log('Updating profile with data:', profileUpdateData);

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return NextResponse.json(
        { error: 'Error updating user profile' },
        { status: 500 }
      );
    }

    console.log('Subscription verified successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    if (error instanceof (Stripe as any).errors.StripeError) {
      console.error('Stripe error details:', {
        type: (error as any).type,
        code: (error as any).code,
        message: (error as any).message,
        statusCode: (error as any).statusCode
      });
      return NextResponse.json(
        { error: (error as any).message },
        { status: (error as any).statusCode || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Error verifying subscription' },
      { status: 500 }
    );
  }
} 