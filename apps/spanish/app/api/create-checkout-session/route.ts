import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY environment variable is not set');
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil' as const,
  });
}

// Initialize Supabase with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Checkout session request received');
    const { priceId, userId } = await request.json();
    console.log('📋 Request data:', { priceId, userId: userId ? 'provided' : 'missing' });

    if (!priceId || !userId) {
      console.error('❌ Missing required parameters:', { priceId, userId });
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Supabase not configured');
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Skip Stripe for free plan
    if (priceId === 'free') {
      console.log('🆓 Processing free plan subscription');
      // Get the free plan
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('price_id', 'free')
        .single();

      if (planError) {
        console.error('❌ Error fetching free plan:', planError);
        return NextResponse.json(
          { error: 'Database error: ' + planError.message },
          { status: 500 }
        );
      }

      if (!plan) {
        console.error('❌ Free plan not found in database');
        return NextResponse.json(
          { error: 'Free plan not found' },
          { status: 404 }
        );
      }

      // Check if user already has any active subscription
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (existingSubscription) {
        console.log('🔄 User is downgrading from a paid plan. Cancelling current subscription…');
        // 1) Cancel in Stripe (if we have a Stripe subscription ID)
        if (existingSubscription.stripe_subscription_id) {
          try {
            const stripe = getStripe();
            await stripe.subscriptions.update(existingSubscription.stripe_subscription_id, {
              cancel_at_period_end: true, // let them keep benefits until the end of the period
            });
            console.log('✅ Stripe subscription set to cancel_at_period_end');
          } catch (stripeErr) {
            console.error('❌ Failed to cancel Stripe subscription:', stripeErr);
            // we continue – Stripe failure shouldn't block moving user to free tier
          }
        }

        // 2) Mark the existing subscription as cancelled in our DB
        const { error: deactivateError } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled', cancel_at_period_end: true })
          .eq('id', existingSubscription.id);

        if (deactivateError) {
          console.error('❌ Failed to deactivate existing subscription:', deactivateError);
          return NextResponse.json(
            { 
              error: 'Failed to downgrade subscription',
              details: JSON.stringify(deactivateError, null, 2)
            },
            { status: 500 }
          );
        }
      }

      // Create subscription record for free plan
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: plan.id,
          status: 'active'
        });

      if (error) {
        console.error('Error creating free subscription:', error);
        return NextResponse.json(
          { 
            error: 'Failed to create free subscription',
            details: JSON.stringify(error, null, 2)
          },
          { status: 500 }
        );
      }

      // Return for front-end (uses `calm` flag)
      return NextResponse.json({ success: true, calm: true });
    }

    // Verify the plan exists
    console.log('🔍 Looking up plan with priceId:', priceId);
    const { data: plan, error: planLookupError } = await supabase
      .from('subscription_plans')
      .select('id, name, price_amount')
      .eq('price_id', priceId)
      .single();

    if (planLookupError) {
      console.error('❌ Error looking up plan:', planLookupError);
      return NextResponse.json(
        { 
          error: 'Database error: ' + planLookupError.message,
          details: JSON.stringify(planLookupError, null, 2)
        },
        { status: 500 }
      );
    }

    if (!plan) {
      console.error('❌ Plan not found for priceId:', priceId);
      return NextResponse.json(
        { 
          error: 'Invalid plan',
          details: { priceId }
        },
        { status: 400 }
      );
    }

    console.log('✅ Found plan:', { id: plan.id, name: plan.name, priceAmount: plan.price_amount });

    // Initialize Stripe with error handling
    console.log('🔧 Initializing Stripe...');
    const stripe = getStripe();
    console.log('✅ Stripe initialized successfully');

    // Create Stripe checkout session
    console.log('💳 Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription`,
      metadata: {
        userId,
        planId: plan.id,
      },
    });
    console.log('✅ Stripe session created:', session.id);

    // Check if user already has an active subscription
    console.log('🔍 Checking for existing subscription for user:', userId);
    const { data: existingSubscription, error: existingSubError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (existingSubError && existingSubError.code !== 'PGRST116') {
      console.error('❌ Error checking existing subscription:', existingSubError);
    } else if (existingSubscription) {
      console.log('✅ Found existing subscription:', existingSubscription.id);
    } else {
      console.log('✅ No existing subscription found');
    }

    if (existingSubscription) {
      // User is upgrading - deactivate existing subscription
      const { error: deactivateError } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('id', existingSubscription.id);

      if (deactivateError) {
        console.error('Error deactivating existing subscription:', deactivateError);
        return NextResponse.json(
          { 
            error: 'Failed to process subscription upgrade',
            details: deactivateError ? (typeof deactivateError === 'object' ? JSON.stringify(deactivateError, null, 2) : String(deactivateError)) : 'No error details returned from Supabase.'
          },
          { status: 500 }
        );
      }
    }

    // Create pending subscription record
    console.log('💾 Creating subscription record...', {
      userId,
      planId: plan.id,
      sessionId: session.id
    });
    
    const { data: newSubscription, error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: plan.id,
        stripe_session_id: session.id,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating subscription record:', {
        error: insertError,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details
      });
      return NextResponse.json(
        { 
          error: 'Failed to create subscription record',
          details: JSON.stringify(insertError, null, 2)
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Subscription record created:', newSubscription.id);

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('❌ FATAL ERROR in checkout session:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorType: typeof error,
      errorKeys: error && typeof error === 'object' ? Object.keys(error) : undefined,
      fullError: JSON.stringify(error, null, 2)
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : JSON.stringify(error, null, 2)
      },
      { status: 500 }
    );
  }
} 