'use client';

import { useState, useEffect } from 'react';
import supabase from '@/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
import Link from 'next/link';
import AdminFAQForm from '@/components/admin/AdminFAQForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  subscription_status: string;
  is_admin: boolean;
}

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
  user_id: string;
  plan_id: string;
  status: string;
  current_period_end: string;
  subscription_plans: {
    name: string;
    price_amount: number;
  };
}

interface TrialSession {
  id: string;
  session_id: string;
  created_at: string;
  completed_at: string | null;
  duration: number;
  trial_length: number;
  voice_selected: string | null;
  converted_to_signup: boolean;
  converted_at: string | null;
  trial_variant: string | null;
  landing_page_variant: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

interface TrialAnalytics {
  totalTrials: number;
  conversions: number;
  conversionRate: number;
  averageDuration: number;
  completionRate: number;
  topVoices: { voice: string; count: number }[];
  dailyTrials: { date: string; trials: number; conversions: number }[];
  variantPerformance: { variant: string; trials: number; conversions: number; conversionRate: number }[];
}

interface ABTestConfig {
  id: string;
  test_name: string;
  description: string;
  is_active: boolean;
  variants: any[];
  traffic_allocation: any;
  start_date: string | null;
  end_date: string | null;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<{ [key: string]: UserSubscription }>({});
  const [trialSessions, setTrialSessions] = useState<TrialSession[]>([]);
  const [trialAnalytics, setTrialAnalytics] = useState<TrialAnalytics | null>(null);
  const [abTests, setAbTests] = useState<ABTestConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'trials' | 'abtests' | 'analytics' | 'faq'>('users');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSessionAndUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        setError('Please log in to access the admin panel');
        router.push('/auth');
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setError('Please log in to access the admin panel');
        router.push('/auth');
        return;
      }
      setUser(user);
      setLoading(false);
      checkAdminAccess(user, session);
    };
    getSessionAndUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const checkAdminAccess = async (user: any, session: any) => {
    try {
      console.log('Checking admin access for user:', user?.email);
      
      if (!user) {
        console.log('No user found, redirecting to auth');
        router.push('/auth');
        return;
      }

      // First try the API route
      try {
        console.log('Session found, checking admin status via API...');
        const response = await fetch('/api/admin/check', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        console.log('API response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('API check result:', result);
          
          if (result.isAdmin) {
            console.log('Admin access granted via API');
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.error('API check failed:', apiError);
      }

      // Fallback: Check admin status directly using service role
      console.log('API failed, checking admin status directly...');
      try {
        const response = await fetch('/api/admin/check-direct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Direct check result:', result);
          
          if (result.isAdmin) {
            console.log('Admin access granted via direct check');
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }
      } catch (directError) {
        console.error('Direct check failed:', directError);
      }

      // Final fallback: Check database directly (this should work since we're using service role)
      console.log('All checks failed, checking database directly...');
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Database check error:', error);
        setError('Failed to verify admin status');
        setLoading(false);
        return;
      }

      if (profile?.is_admin) {
        console.log('Admin access granted via database check');
        setIsAdmin(true);
        setLoading(false);
      } else {
        console.log('User is not an admin');
        setError('Admin access required');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setError('Failed to verify admin status');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      if (activeTab === 'faq') {
        fetchFaqs();
      }
    }
  }, [isAdmin]);

  const fetchTrialData = async () => {
    try {
      const daysBack = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Fetch trial sessions
      const { data: trials, error: trialsError } = await supabase
        .from('trial_sessions')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (trialsError) throw trialsError;
      setTrialSessions(trials || []);

      // Calculate analytics
      if (trials) {
        const analytics = calculateTrialAnalytics(trials);
        setTrialAnalytics(analytics);
      }

    } catch (err) {
      setError('Failed to fetch trial data');
      console.error('Error fetching trial data:', err);
    }
  };

  useEffect(() => {
    if ((activeTab === 'trials' || activeTab === 'analytics') && isAdmin) {
      fetchTrialData();
    }
    if (activeTab === 'faq' && isAdmin) {
      fetchFaqs();
    }
  }, [activeTab, dateRange, isAdmin]);

  const fetchData = async () => {
    try {
      // Fetch users using the admin API endpoint
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const { users } = await response.json();
      setUsers(users || []);

      // Fetch subscription plans
      const { data: plans, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_amount', { ascending: true });

      if (plansError) throw plansError;
      setSubscriptionPlans(plans || []);

      // Fetch user subscriptions
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            price_amount
          )
        `)
        .eq('status', 'active');

      if (subscriptionsError) throw subscriptionsError;
      
      // Create a map of user_id to subscription
      const subscriptionMap: { [key: string]: UserSubscription } = {};
      subscriptions?.forEach((sub) => {
        subscriptionMap[sub.user_id] = sub;
      });
      setUserSubscriptions(subscriptionMap);

      // Fetch A/B test configurations
      const { data: abTestData, error: abTestError } = await supabase
        .from('ab_test_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (abTestError) throw abTestError;
      setAbTests(abTestData || []);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrialAnalytics = (trials: TrialSession[]): TrialAnalytics => {
    const totalTrials = trials.length;
    const conversions = trials.filter(t => t.converted_to_signup).length;
    const conversionRate = totalTrials > 0 ? (conversions / totalTrials) * 100 : 0;
    const completedTrials = trials.filter(t => t.completed_at);
    const completionRate = totalTrials > 0 ? (completedTrials.length / totalTrials) * 100 : 0;
    const averageDuration = trials.reduce((sum, t) => sum + t.duration, 0) / totalTrials || 0;

    // Top voices
    const voiceCounts: { [key: string]: number } = {};
    trials.forEach(t => {
      if (t.voice_selected) {
        voiceCounts[t.voice_selected] = (voiceCounts[t.voice_selected] || 0) + 1;
      }
    });
    const topVoices = Object.entries(voiceCounts)
      .map(([voice, count]) => ({ voice, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Daily trials
    const dailyData: { [key: string]: { trials: number; conversions: number } } = {};
    trials.forEach(t => {
      const date = new Date(t.created_at).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { trials: 0, conversions: 0 };
      }
      dailyData[date].trials++;
      if (t.converted_to_signup) {
        dailyData[date].conversions++;
      }
    });
    const dailyTrials = Object.entries(dailyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Variant performance
    const variantData: { [key: string]: { trials: number; conversions: number } } = {};
    trials.forEach(t => {
      const variant = t.trial_variant || 'default';
      if (!variantData[variant]) {
        variantData[variant] = { trials: 0, conversions: 0 };
      }
      variantData[variant].trials++;
      if (t.converted_to_signup) {
        variantData[variant].conversions++;
      }
    });
    const variantPerformance = Object.entries(variantData)
      .map(([variant, data]) => ({
        variant,
        trials: data.trials,
        conversions: data.conversions,
        conversionRate: data.trials > 0 ? (data.conversions / data.trials) * 100 : 0
      }));

    return {
      totalTrials,
      conversions,
      conversionRate,
      averageDuration,
      completionRate,
      topVoices,
      dailyTrials,
      variantPerformance
    };
  };

  const toggleABTest = async (testId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('ab_test_configs')
        .update({ is_active: !isActive })
        .eq('id', testId);

      if (error) throw error;
      setSuccess(`A/B test ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch (err) {
      setError('Failed to update A/B test');
      console.error('Error updating A/B test:', err);
    }
  };

  const updateTrialLength = async (variant: string, newLength: number) => {
    try {
      const trialTest = abTests.find(test => test.test_name === 'trial_length');
      if (!trialTest) return;

      const updatedVariants = trialTest.variants.map((v: any) => 
        v.name === variant ? { ...v, duration: newLength } : v
      );

      const { error } = await supabase
        .from('ab_test_configs')
        .update({ variants: updatedVariants })
        .eq('id', trialTest.id);

      if (error) throw error;
      setSuccess(`Trial length updated for ${variant} variant`);
      fetchData();
    } catch (err) {
      setError('Failed to update trial length');
      console.error('Error updating trial length:', err);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      console.log(`Attempting to toggle admin status for user ${userId} from ${currentStatus} to ${!currentStatus}`);
      
      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('No active session');
        return;
      }

      // Use the API route to update admin status
      const response = await fetch('/api/admin/update-admin-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId,
          isAdmin: !currentStatus
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API error:', result);
        throw new Error(result.error || 'Failed to update admin status');
      }

      console.log('Update result:', result);
      setSuccess(result.message || `User ${!currentStatus ? 'promoted to' : 'demoted from'} admin successfully`);
      
      // Refresh the data to show the updated status
      await fetchData();
    } catch (err) {
      console.error('Error updating admin status:', err);
      setError(`Failed to update admin status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Attempting to delete user:', userId);
      
      // Use the database function to delete the user
      const { data, error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId
      });

      if (error) {
        console.error('Delete user error:', error);
        throw new Error(error.message || 'Failed to delete user');
      }

      console.log('Delete user result:', data);
      setSuccess('User deleted successfully');
      fetchData();
    } catch (err: any) {
      console.error('Delete user error:', err);
      setError(err.message || 'Failed to delete user');
    }
  };

  const syncAdminSubscriptions = async () => {
    if (!confirm('This will give all Admin users Premium subscriptions. Continue?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const premiumPlan = subscriptionPlans.find(plan => plan.name === 'Premium');
      if (!premiumPlan) {
        setError('Premium plan not found');
        return;
      }

      // Get all admin users
      const adminUsers = users.filter(user => user.is_admin);
      
      console.log('Syncing admin subscriptions for', adminUsers.length, 'admin users');

      for (const adminUser of adminUsers) {
        const currentPlan = getCurrentPlan(adminUser.id);
        
        // Only update if they're not already on Premium
        if (currentPlan !== 'Premium') {
          console.log(`Updating ${adminUser.email} from ${currentPlan} to Premium`);
          
          const subscriptionData = {
            user_id: adminUser.id,
            plan_id: premiumPlan.id,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          };

          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .upsert(subscriptionData);

          if (subscriptionError) {
            console.error(`Error updating subscription for ${adminUser.email}:`, subscriptionError);
            continue;
          }

          const { error: profileError } = await supabase
            .from('profiles')
            .update({ subscription_status: 'premium' })
            .eq('id', adminUser.id);

          if (profileError) {
            console.error(`Error updating profile for ${adminUser.email}:`, profileError);
          }
        }
      }

      setSuccess(`Admin subscriptions synced successfully`);
      fetchData();
    } catch (err) {
      console.error('Error syncing admin subscriptions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to sync admin subscriptions: ${errorMessage}`);
    }
  };

  const changeUserSubscription = async (userId: string, planId: string) => {
    try {
      setError(null);
      setSuccess(null);

      console.log('Changing subscription for user:', userId, 'to plan:', planId);

      const selectedPlan = subscriptionPlans.find(plan => plan.id === planId);
      if (!selectedPlan) {
        setError('Invalid plan selected');
        return;
      }

      console.log('Selected plan:', selectedPlan);

      if (selectedPlan.price_id === 'free') {
        console.log('Setting to free plan - deleting existing subscription');
        
        const { error: deleteError } = await supabase
          .from('subscriptions')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          console.error('Error deleting existing subscription:', deleteError);
          // Don't throw here, continue to update profile
        }

        console.log('Updating profile to free status');
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ subscription_status: 'free' })
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating profile to free:', profileError);
          throw profileError;
        }
      } else {
        // Deactivate any existing active subscription for this user
        await supabase
          .from('subscriptions')
          .update({ status: 'inactive', updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('status', 'active');

        console.log('Setting to paid plan - upserting subscription');
        const subscriptionData = {
          user_id: userId,
          plan_id: planId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        console.log('Subscription data:', subscriptionData);

        const { error: subscriptionError, data: subscriptionResult } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData);

        if (subscriptionError) {
          console.error('Error upserting subscription:', subscriptionError);
          console.error('Full error details:', JSON.stringify(subscriptionError, null, 2));
          setError(`Failed to upsert subscription: ${JSON.stringify(subscriptionError, null, 2)}`);
          throw subscriptionError;
        }

        console.log('Subscription upsert result:', subscriptionResult);
        console.log('Profile will be updated automatically by database trigger');
      }

      setSuccess(`User subscription changed to ${selectedPlan.name} successfully`);
      setShowSubscriptionModal(false);
      setSelectedUser(null);
      console.log('Subscription change completed successfully, refreshing data...');
      fetchData();
    } catch (err) {
      console.error('Error changing subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to change user subscription: ${errorMessage}`);
    }
  };

  const openSubscriptionModal = (userId: string) => {
    setSelectedUser(userId);
    setShowSubscriptionModal(true);
    setError(null);
    setSuccess(null);
    // Default to current plan, or first plan if none
    const currentPlanId = userSubscriptions[userId]?.plan_id;
    setSelectedPlanId(currentPlanId || (subscriptionPlans[0]?.id ?? null));
  };

  const getCurrentPlan = (userId: string) => {
    const subscription = userSubscriptions[userId];
    if (subscription) {
      return subscription.subscription_plans.name;
    }
    
    // If no active subscription, check the user's profile status
    const userProfile = users.find(u => u.id === userId);
    if (userProfile) {
      switch (userProfile.subscription_status) {
        case 'premium':
          return 'Grounded';
        case 'standard':
          return 'Centered';
        case 'free':
        default:
          return 'Calm';
      }
    }
    
    return 'Calm';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/admin/faq');
      const data = await res.json();
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await fetch('/api/admin/faq', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setFaqs((prev) => prev.filter((faq) => faq.id !== id));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center h-screen">Checking admin access...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Logged in as: {user?.email}
          </div>
          {process.env.NEXT_PUBLIC_ENABLE_TRIAL_BYPASS === 'true' && (
            <Link href="?trial_bypass=true">
              <Button variant="outline" size="sm">Reset trial (dev)</Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="text-green-600 dark:text-green-400">{success}</div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {[
          { key: 'users', label: 'Users' },
          { key: 'trials', label: 'Trial Analytics' },
          { key: 'abtests', label: 'A/B Tests' },
          { key: 'analytics', label: 'Analytics' },
          { key: 'faq', label: 'FAQ Management' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">User Management</h2>
            <button
              onClick={syncAdminSubscriptions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sync Subscriptions
            </button>
          </div>

          <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subscription</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((userProfile) => (
                    <tr key={userProfile.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{userProfile.full_name || 'No name'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{userProfile.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userProfile.subscription_status === 'premium' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                            : userProfile.subscription_status === 'standard'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {getCurrentPlan(userProfile.id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userProfile.is_admin 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {userProfile.is_admin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(userProfile.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openSubscriptionModal(userProfile.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Change Plan
                          </button>
                          <button
                            onClick={() => toggleAdminStatus(userProfile.id, userProfile.is_admin)}
                            className={`px-3 py-1 rounded transition-colors ${
                              userProfile.is_admin
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {userProfile.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => deleteUser(userProfile.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Plan Pricing Legend */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Plan Pricing Reference</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  Calm
                </span>
                <span className="text-muted-foreground">= Free</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  Centered
                </span>
                <span className="text-muted-foreground">= $12.99/month</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  Grounded
                </span>
                <span className="text-muted-foreground">= $29.99/month</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional tab content for trials, abtests, analytics would go here */}
      {activeTab === 'abtests' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">A/B Tests</h2>
          <div className="text-muted-foreground">A/B test management content would be displayed here...</div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">FAQ Management</h2>
          
          <AdminFAQForm onSave={fetchFaqs} editing={editing} />

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(faq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(faq)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {faqs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No FAQs found. Add your first FAQ above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscription Change Modal */}
      {showSubscriptionModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Change Subscription Plan</h2>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => { setShowSubscriptionModal(false); setSelectedUser(null); }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="space-y-4">
              {subscriptionPlans.map((plan) => (
                <label
                  key={plan.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    userSubscriptions[selectedUser]?.plan_id === plan.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selectedPlanId === plan.id}
                    onChange={() => setSelectedPlanId(plan.id)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">{plan.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">${plan.price_amount / 100} / month</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => { setShowSubscriptionModal(false); setSelectedUser(null); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!selectedPlanId || userSubscriptions[selectedUser]?.plan_id === selectedPlanId}
                onClick={() => {
                  if (selectedPlanId) changeUserSubscription(selectedUser, selectedPlanId);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 