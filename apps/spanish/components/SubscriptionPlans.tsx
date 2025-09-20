'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import supabase from '@/supabaseClient';
import { loadStripe } from '@stripe/stripe-js';

// Check if Stripe publishable key is available
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : Promise.resolve(null);

// Debug Stripe loading
if (stripePublishableKey) {
  console.log('✅ Stripe publishable key found:', stripePublishableKey.substring(0, 20) + '...');
} else {
  console.error('❌ Stripe publishable key missing');
}

// Debug Supabase configuration
console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
console.log('🔍 Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_id: string;
  price_amount: number;
  features: string[];
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  subscription_plans: {
    name: string;
    price_amount: number;
    features: string[];
  };
}

export default function SubscriptionPlans() {
  console.log('🔄 SubscriptionPlans component mounted');
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Component mount effect
  useEffect(() => {
    console.log('🔄 SubscriptionPlans component mounted in useEffect');
    return () => {
      console.log('🔄 SubscriptionPlans component unmounting in useEffect');
    };
  }, []);

  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    console.log('🔄 fetchData function called');
    try {
      console.log('🔄 Starting fetchData...');
      console.log('🚨 Setting loading to true');
      setLoading(true);
      setError(null);
      
      // Check if Stripe is properly configured
      if (!stripePublishableKey) {
        console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
        setError('Payment system is not properly configured. Please contact support.');
        setLoading(false);
        return;
      }
      
      // Get current user
      console.log('🔍 Fetching user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('❌ Error fetching user:', userError);
      }
      console.log('👤 User:', user ? user.email : 'No user');
      console.log('🚨 Setting user state');
      setUser(user || null);

      // Fetch all subscription plans
      console.log('🔍 Fetching subscription plans...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          console.log('⏰ Database query timeout after 10 seconds');
          reject(new Error('Database query timeout'));
        }, 10000)
      );
      
      const plansQuery = supabase
        .from('subscription_plans')
        .select('*')
        .order('price_amount', { ascending: true });

      console.log('🔍 Executing plans query...');
      const { data: plansData, error: plansError } = await Promise.race([
        plansQuery,
        timeoutPromise
      ]) as any;

      if (plansError) {
        console.error('❌ Error fetching plans:', plansError);
        console.error('❌ Error details:', {
          message: plansError.message,
          code: plansError.code,
          details: plansError.details,
          hint: plansError.hint
        });
        const errorMessage = `Failed to load therapy plans: ${plansError.message}`;
        console.log('🚨 Setting error:', errorMessage);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      console.log('✅ Plans loaded:', plansData?.length || 0, 'plans');
      if (plansData && plansData.length > 0) {
        console.log('📋 Plan names:', plansData.map((p: any) => p.name));
        console.log('📋 Plan details:', plansData);
        console.log('🚨 Setting plans state');
      } else {
        console.log('⚠️ No plans found in database');
      }
      setPlans(plansData || []);

      // Only fetch subscription data if user is authenticated
      if (user) {
        console.log('🔍 Fetching user subscription...');
        
        const subscriptionQuery = supabase
          .from('subscriptions')
          .select(`
            *,
            subscription_plans (*)
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        try {
          console.log('🔍 Executing subscription query...');
          const { data: subscriptionData, error: subscriptionError } = await Promise.race([
            subscriptionQuery,
            timeoutPromise
          ]) as any;

          if (subscriptionError && subscriptionError.code !== 'PGRST116') {
            console.error('❌ Error fetching subscription:', subscriptionError);
            console.error('❌ Subscription error details:', {
              message: subscriptionError.message,
              code: subscriptionError.code,
              details: subscriptionError.details,
              hint: subscriptionError.hint
            });
          } else if (subscriptionData) {
            console.log('✅ Subscription data loaded:', subscriptionData);
            console.log('📋 Subscription plan name:', subscriptionData.subscription_plans?.name);
            console.log('🚨 Setting currentSubscription state');
            setCurrentSubscription(subscriptionData);
          } else {
            console.log('ℹ️ No active subscription found');
          }
        } catch (subscriptionTimeout) {
          console.error('❌ Subscription query timeout:', subscriptionTimeout);
        }
      }

    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          const errorMessage = 'Database query timed out. Please try refreshing the page.';
          console.log('🚨 Setting timeout error:', errorMessage);
          setError(errorMessage);
        } else if (error.message.includes('fetch')) {
          const errorMessage = 'Network error. Please check your connection and try again.';
          console.log('🚨 Setting network error:', errorMessage);
          setError(errorMessage);
        } else {
          const errorMessage = `Failed to load therapy plan data: ${error.message}`;
          console.log('🚨 Setting generic error:', errorMessage);
          setError(errorMessage);
        }
      } else {
        const errorMessage = `Failed to load therapy plan data: ${String(error)}`;
        console.log('🚨 Setting string error:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      console.log('✅ fetchData completed, setting loading to false');
      console.log('🚨 Setting loading to false');
      setLoading(false);
    }
  }, [stripePublishableKey]);

  useEffect(() => {
    console.log('🔄 useEffect triggered - searchParams:', searchParams.toString());
    if (searchParams.get('justConfirmed')) {
      setShowWelcome(true);
      window.history.replaceState({}, '', '/subscription');
    }

    console.log('🔄 Calling fetchData from useEffect');
    fetchData();
  }, [fetchData]);

  // Monitor state changes
  useEffect(() => {
    console.log('📊 State updated - loading:', loading, 'plans:', plans.length, 'error:', error);
    
    return () => {
      console.log('🔄 SubscriptionPlans component unmounting');
    };
  }, [loading, plans.length, error]);

  // Monitor searchParams changes
  useEffect(() => {
    console.log('🔍 searchParams changed:', searchParams.toString());
  }, [searchParams]);

  // Define correct subscription limits
  const getCorrectFeatures = (planName: string, originalFeatures: string[]) => {
    const correctedFeatures = originalFeatures.map(feature => {
      // Replace outdated duration limits with correct ones
      if (feature.includes('minutes per month')) {
        switch (planName.toLowerCase()) {
          case 'calm':
          case 'free':
            return '30 minutes per month';
          case 'centered':
          case 'standard':
            return '120 minutes per month';
          case 'grounded':
          case 'premium':
            return '300 minutes per month';
          default:
            return feature;
        }
      }
      // Update the download feature to clarify both data and audio
      if (feature === 'Download therapy sessions') {
        return 'Download therapy sessions (data & audio)';
      }
      return feature;
    });
    
    // Add grounded-specific features
    if (planName.toLowerCase() === 'grounded' || planName.toLowerCase() === 'premium') {
      correctedFeatures.push('Resume chat sessions (coming now)');
    }
    
    return correctedFeatures;
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      setError('Please log in to choose a therapy plan');
      return;
    }

    if (currentSubscription?.plan_id === plan.id) {
      setError('You are already enrolled in this therapy plan');
      return;
    }

    setSubscribing(plan.id);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.price_id,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Handle calm plan
      if (data.calm) {
        setError(null);
        await fetchData(); // Refresh data
        return;
      }

      // Redirect to Stripe Checkout
      if (data.sessionId) {
        const stripe = await stripePromise;
        if (!stripe) {
          setError('Stripe payment system is not available. Please check your configuration.');
          return;
        }
        
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (error) {
          setError(error.message || 'Failed to redirect to checkout');
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSubscribing(null);
    }
  };

  console.log('🔄 Rendering SubscriptionPlans component - loading:', loading, 'plans:', plans.length, 'error:', error, 'user:', user ? 'authenticated' : 'not authenticated');
  
  if (loading) {
    console.log('🔄 Rendering loading state');
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading subscription plans...</p>
      </div>
    );
  }

  if (error && plans.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Plans</h2>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchData();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log('🔄 About to render SubscriptionPlans component content');
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {showWelcome && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowWelcome(false)}
        >
          <div 
            className="bg-card rounded-2xl shadow-2xl p-6 pt-8 sm:p-8 max-w-md w-full text-center transform transition-all duration-300 scale-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowWelcome(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Welcome to TalkAI!
            </h2>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Your account is confirmed. Unlock more with our paid plans:
            </p>
            <div className="text-left space-y-4 text-sm sm:text-base">
              <div>
                <h3 className="font-semibold text-foreground">Centered/Standard Plan ($12.99/mn)</h3>
                <ul className="list-disc list-inside text-muted-foreground mt-1 pl-2">
                  <li>120 minutes per month</li>
                  <li>Advanced AI therapy sessions</li>
                  <li>Priority support</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Grounded/Premium Plan ($29.99/mn)</h3>
                <ul className="list-disc list-inside text-muted-foreground mt-1 pl-2">
                  <li>300 minutes per month</li>
                  <li>Premium AI therapy sessions</li>
                  <li>Download therapy sessions (data & audio)</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Upgrade now to get the most out of your therapy journey!
            </p>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Choose Your Therapy Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Select the perfect plan for your mental health journey with our AI Talk Therapist
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => {
              console.log('🔄 Retrying fetchData...');
              setError(null);
              fetchData();
            }}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {currentSubscription && (
        <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-600 dark:text-green-400">
            You are currently enrolled in the{' '}
            <strong>{currentSubscription.subscription_plans?.name || 'Unknown'}</strong> therapy plan
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.plan_id === plan.id;
          // Handle both naming conventions: Centered/Standard and Grounded/Premium
          const isPopular = plan.name === 'Centered' || plan.name === 'Standard'
          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                isPopular
                  ? 'border-blue-500 transform scale-105'
                  : 'border-gray-200 dark:border-gray-600'
              } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    ${(plan.price_amount / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">
                    /mn
                  </span>
                </div>

                <ul className="space-y-3 mb-8 text-sm sm:text-base">
                  {getCorrectFeatures(plan.name, plan.features).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribing === plan.id || isCurrentPlan || !user}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    isCurrentPlan
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-not-allowed'
                      : subscribing === plan.id
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : !user
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {subscribing === plan.id
                    ? 'Processing...'
                    : isCurrentPlan
                    ? 'Current Plan'
                    : !user
                    ? 'Login Required'
                    : `Start ${plan.name} Therapy`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!user && (
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Please{' '}
            <a href="/auth" className="text-blue-500 hover:underline font-semibold">
              log in or sign up
            </a>{' '}
            to choose a therapy plan and begin your journey.
          </p>
        </div>
      )}
    </div>
  );
} 