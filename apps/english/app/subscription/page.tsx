'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { Button } from '@/components/ui/button';
import supabase from '@/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string>('free');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  useEffect(() => {
    // Show upsell modal if justConfirmed=1 in query params and not already shown
    if (searchParams.get('justConfirmed') === '1') {
      if (!localStorage.getItem('justConfirmedUpsellShown')) {
        setShowUpsell(true);
        localStorage.setItem('justConfirmedUpsellShown', '1');
      }
    } else {
      // Clear the flag if not justConfirmed, so future confirmations work
      localStorage.removeItem('justConfirmedUpsellShown');
    }
  }, [searchParams]);

  const checkAuthAndFetchData = async () => {
    console.log('🔄 checkAuthAndFetchData called');
    try {
      console.log('Starting subscription page auth check...');
      
      // Check if Stripe is properly configured
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
        setError('Payment system is not properly configured. Please contact support.');
        setLoading(false);
        return;
      }
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        if (authError.message === 'Auth session missing!') {
          console.log('No auth session - showing public pricing');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        console.error('Auth error:', authError);
        setError(`Authentication error: ${authError.message}`);
        return;
      }
      
      if (user) {
        console.log('User authenticated:', user.email);
        setIsAuthenticated(true);
        await fetchCurrentSubscription(user);
      } else {
        console.log('No user authenticated - showing public pricing');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setError(`Error checking authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async (user: any) => {
    console.log('🔄 fetchCurrentSubscription called for user:', user.id);
    const TIMEOUT_MS = 10000; // 10 second timeout
    
    try {
      console.log('Fetching subscription for user:', user.id);
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      );
      
      // Fetch user profile for subscription status with timeout
      try {
        console.log('🔍 Fetching user profile...');
        const profileQuery = supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();
          
        const { data: profile, error: profileError } = await Promise.race([
          profileQuery,
          timeoutPromise
        ]) as any;

        if (profileError) {
          console.error('❌ Profile error:', profileError);
          setUserSubscriptionStatus('free');
        } else {
          console.log('✅ Profile data:', profile);
          setUserSubscriptionStatus(profile?.subscription_status || 'free');
        }
      } catch (profileTimeout) {
        console.error('❌ Profile query timeout:', profileTimeout);
        setUserSubscriptionStatus('free');
      }

      // Fetch active subscription record with timeout
      try {
        console.log('🔍 Fetching subscription data...');
        const subscriptionQuery = supabase
          .from('subscriptions')
          .select(`
            *,
            subscription_plans (
              name,
              price_amount,
              features
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        const { data: subscription, error: subscriptionError } = await Promise.race([
          subscriptionQuery,
          timeoutPromise
        ]) as any;

        if (subscriptionError && subscriptionError.code !== 'PGRST116') {
          console.error('❌ Subscription error:', subscriptionError);
        } else {
          console.log('✅ Subscription data:', subscription);
          setCurrentSubscription(subscription);
        }
      } catch (subscriptionTimeout) {
        console.error('❌ Subscription query timeout:', subscriptionTimeout);
      }
      
    } catch (error) {
      console.error('❌ Error fetching subscription data:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: currentSubscription.stripe_subscription_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Refresh subscription data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchCurrentSubscription(user);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  if (loading) {
    console.log('🔄 Rendering loading state in subscription page');
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-white">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('🔄 Rendering error state in subscription page:', error);
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Subscription Page</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              setLoading(true);
              checkAuthAndFetchData();
            }}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  console.log('🔄 Rendering main subscription page content');
  
  return (
    <div className="container mx-auto py-8">
      <Dialog open={showUpsell} onOpenChange={setShowUpsell}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Your Experience</DialogTitle>
            <DialogDescription>
              <div className="mb-4">
                <strong>Welcome to TalkAI!</strong> You've confirmed your account. Unlock more with our paid plans:
              </div>
              <div className="mb-4">
                <div className="mb-2 font-semibold">Centered/Standard Plan ($12.99/mn)</div>
                <ul className="list-disc pl-5 mb-2 text-sm">
                  <li>120 minutes per month</li>
                  <li>Advanced AI therapy sessions</li>
                  <li>Priority support</li>
                  <li>Session history & analytics</li>
                  <li>Multiple therapist voices</li>
                </ul>
                <div className="mb-2 font-semibold">Grounded/Premium Plan ($29.99/mn)</div>
                <ul className="list-disc pl-5 text-sm">
                  <li>300 minutes per month</li>
                  <li>Premium AI therapy sessions</li>
                  <li>Download therapy sessions (data & audio)</li>
                  <li>Unlimited session history</li>
                  <li>Advanced analytics & insights</li>
                  <li>All therapist voices & personalities</li>
                </ul>
              </div>
              <div className="mb-2 text-sm text-blue-700">Upgrade now to get the most out of your therapy journey!</div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button onClick={() => setShowUpsell(false)} variant="outline">Maybe Later</Button>
            <Button onClick={() => { setShowUpsell(false); router.push('#plans'); }}>View Plans</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {!isAuthenticated && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">Ready to Get Started?</h2>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Sign up for an account to subscribe to any of our plans and start your therapy journey.
          </p>
          <Button 
            onClick={() => router.push('/auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign Up / Log In
          </Button>
        </div>
      )}
      
      {isAuthenticated && (currentSubscription || userSubscriptionStatus !== 'free') && (
        <div className="mb-8 p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Plan:</span>{' '}
              {currentSubscription?.subscription_plans?.name || userSubscriptionStatus.charAt(0).toUpperCase() + userSubscriptionStatus.slice(1)}
            </p>
            {currentSubscription && (
              <>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  {currentSubscription.status}
                </p>
                <p>
                  <span className="font-medium">Next billing date:</span>{' '}
                  {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                </p>
                {currentSubscription.status === 'active' && (
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    className="mt-4"
                  >
                    Cancel Subscription
                  </Button>
                )}
              </>
            )}
            {!currentSubscription && userSubscriptionStatus !== 'free' && (
              <p className="text-sm text-muted-foreground">
                You have {userSubscriptionStatus} access. Manage your subscription through your account settings.
              </p>
            )}
          </div>
        </div>
      )}

      {console.log('🔄 About to render SubscriptionPlans component in subscription page')}
      <SubscriptionPlans />
      {console.log('🔄 SubscriptionPlans component rendered in subscription page')}
    </div>
  );
}

export default function SubscriptionPageWrapper() {
  return (
    <Suspense>
      <SubscriptionPage />
    </Suspense>
  );
} 