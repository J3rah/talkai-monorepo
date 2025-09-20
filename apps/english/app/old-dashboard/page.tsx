"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import supabase from "@/supabaseClient";
import VoiceSettings from "@/components/VoiceSettings";
import { expressionLabels } from "@/utils/expressionLabels";
import { expressionColors } from "@/utils/expressionColors";
import { getAvailableVoiceConfigurations, getVoiceConfigurationById, getFallbackVoiceConfigurations, VoiceConfigurationGroup, VoiceConfiguration } from "@/utils/voiceConfigUtils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import TherapistSettings from "@/components/TherapistSettings";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Loader2, Trash2 } from "lucide-react";

interface ChatSession {
  id: string;
  created_at: string;
  title: string;
  summary: string;
  hume_chat_group_id?: string;
  hume_chat_id?: string;
}

interface EmotionMetric {
  emotion_type: string;
  intensity: number;
  confidence: number;
}

interface TherapySession {
  id: string;
  created_at: string;
  duration: number;
  status: string;
  chat_sessions?: {
    id: string;
    title: string;
    summary: string;
    created_at: string;
  };
}

interface UserSubscription {
  id: string;
  status: string;
  current_period_end: string;
  subscription_plans: {
    name: string;
    price_amount: number;
    features: string[];
    session_limit?: number;
    duration_limit?: number;
  };
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price_amount: number;
  features: string[];
  session_limit?: number;
  duration_limit?: number;
  stripe_price_id: string;
}

interface UsageStats {
  sessionsThisMonth: number;
  durationThisMonth: number;
  sessionsLimit: number;
  durationLimit: number;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  is_admin: boolean;
  therapist_name: string;
  voice_config_id?: string;
  voice_parameters?: any;
  base_voice?: string;
  data_saving_preference: boolean;
  notification_preferences: {
    email_notifications: boolean;
    session_reminders: boolean;
    progress_updates: boolean;
    marketing_emails: boolean;
  };
  profile_settings: {
    timezone: string;
    language: string;
    theme: string;
    privacy_mode: boolean;
  };
}

interface SessionTrend {
  date: string;
  sessions: number;
  duration: number;
  avgEmotionIntensity: number;
}

interface EmotionTrend {
  emotion: string;
  data: Array<{
    date: string;
    intensity: number;
    confidence: number;
  }>;
}

interface ProgressMetric {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface DetailedEmotionData {
  emotion_type: string;
  intensity: number;
  confidence: number;
  created_at: string;
  session_id: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [emotionMetrics, setEmotionMetrics] = useState<EmotionMetric[]>([]);
  const [therapySessions, setTherapySessions] = useState<TherapySession[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<{ [key: string]: any[] }>({});
  const [therapistName, setTherapistName] = useState("Talk Therapist");
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    sessionsThisMonth: 0,
    durationThisMonth: 0,
    sessionsLimit: 0,
    durationLimit: 0
  });
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [sessionTrends, setSessionTrends] = useState<SessionTrend[]>([]);
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([]);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [detailedEmotionData, setDetailedEmotionData] = useState<DetailedEmotionData[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string>('free');
  const [audioReconstructionStatus, setAudioReconstructionStatus] = useState<{ [sessionId: string]: { status: string; downloadUrl?: string; lastChecked?: number } }>({});
  const [showAudioInfoModal, setShowAudioInfoModal] = useState(false);
  const [audioInfoModalSessionId, setAudioInfoModalSessionId] = useState<string | null>(null);
  const [resumingSessionId, setResumingSessionId] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Reset resuming state when component mounts or user returns to dashboard
  useEffect(() => {
    setResumingSessionId(null);
  }, []);

  // Delete sessions modal state
  const [showDeleteSessionsModal, setShowDeleteSessionsModal] = useState(false);
  const [deleteSessionsConfirmed, setDeleteSessionsConfirmed] = useState(false);
  const [isDeletingSessions, setIsDeletingSessions] = useState(false);

  // Delete account modal state
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountConfirmed, setDeleteAccountConfirmed] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Voice configuration state - now managed from database
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfiguration | null>(null);
  const [voiceGroups, setVoiceGroups] = useState<VoiceConfigurationGroup[]>([]);
  const [totalVoicesCount, setTotalVoicesCount] = useState(0);

  // Function to get all available voices (flattened from groups) based on subscription plan
  const getAvailableVoicesCount = useCallback((subscriptionStatus: string, groups: VoiceConfigurationGroup[]) => {
    const planHierarchy = {
      'calm': ['calm'],
      'centered': ['calm', 'centered'],
      'grounded': ['calm', 'centered', 'grounded']
    };

    const allowedPlans = planHierarchy[subscriptionStatus as keyof typeof planHierarchy] || ['calm'];
    let availableCount = 0;
    
    groups.forEach(group => {
      availableCount += group.voice_configurations.filter(voice => 
        allowedPlans.includes(voice.required_plan)
      ).length;
    });
    
    return availableCount;
  }, []);

  // Load voice configurations from database
  const loadVoiceConfigurations = useCallback(async (subscriptionStatus: string) => {
    try {
      console.log('🎵 Dashboard: Loading voice configurations for plan:', subscriptionStatus);
      
      let groups: VoiceConfigurationGroup[] = [];
      let allGroups: VoiceConfigurationGroup[] = [];
      
      try {
        // Get all groups to count total voices
        allGroups = await getAvailableVoiceConfigurations('grounded'); // Get all voices for total count
        groups = await getAvailableVoiceConfigurations(subscriptionStatus);
        console.log('🎵 Dashboard: Loaded voice groups from database:', groups.length);
      } catch (error) {
        console.warn('🎵 Dashboard: Failed to load from database, using fallback:', error);
        allGroups = getFallbackVoiceConfigurations();
        groups = getFallbackVoiceConfigurations(); // Will be filtered by available voices count function
      }

      setVoiceGroups(groups);
      
      // Calculate total voices count
      let totalCount = 0;
      allGroups.forEach(group => {
        totalCount += group.voice_configurations.length;
      });
      setTotalVoicesCount(totalCount);

      return groups;
    } catch (error) {
      console.error('🎵 Dashboard: Error loading voice configurations:', error);
      const fallbackGroups = getFallbackVoiceConfigurations();
      setVoiceGroups(fallbackGroups);
      setTotalVoicesCount(8); // Fallback count
      return fallbackGroups;
    }
  }, []);

  // Load and set current voice from user profile
  const loadCurrentVoice = useCallback(async (voiceConfigId: string | null, groups: VoiceConfigurationGroup[]) => {
    if (!voiceConfigId) {
      // Default to first available voice
      if (groups.length > 0 && groups[0].voice_configurations.length > 0) {
        const defaultVoice = groups[0].voice_configurations[0];
        console.log('🎵 Dashboard: No saved voice, defaulting to:', defaultVoice.display_name);
        setSelectedVoice(defaultVoice);
      }
      return;
    }

    try {
      console.log('🎵 Dashboard: Looking for saved voice config:', voiceConfigId);
      
      // First try to find it in the loaded groups
      let foundVoice: VoiceConfiguration | null = null;
      for (const group of groups) {
        foundVoice = group.voice_configurations.find(config => 
          config.hume_config_id === voiceConfigId
        ) || null;
        if (foundVoice) break;
      }

      if (foundVoice) {
        console.log('✅ Dashboard: Found saved voice in available groups:', foundVoice.display_name);
        setSelectedVoice(foundVoice);
      } else {
        // Try to fetch from database directly
        console.log('🔍 Dashboard: Voice not in available groups, fetching from database...');
        const voiceFromDb = await getVoiceConfigurationById(voiceConfigId);
        if (voiceFromDb) {
          console.log('✅ Dashboard: Found voice in database:', voiceFromDb.display_name);
          setSelectedVoice(voiceFromDb);
        } else {
          // Fallback to first available voice
          console.warn('⚠️ Dashboard: Saved voice not found, defaulting to first available');
          if (groups.length > 0 && groups[0].voice_configurations.length > 0) {
            setSelectedVoice(groups[0].voice_configurations[0]);
          }
        }
      }
    } catch (error) {
      console.error('🎵 Dashboard: Error loading current voice:', error);
      // Fallback to first available voice
      if (groups.length > 0 && groups[0].voice_configurations.length > 0) {
        setSelectedVoice(groups[0].voice_configurations[0]);
      }
    }
  }, []);

  // Legacy function removed - now using database-driven voice configurations

  // Memoize subscription limits calculation
  const getSubscriptionLimits = useCallback((planName: string) => {
    switch (planName?.toLowerCase()) {
      case 'calm':
        return { sessionsLimit: 999, durationLimit: 30 * 60 }; // 30 minutes
      case 'centered':
        return { sessionsLimit: 999, durationLimit: 120 * 60 }; // 120 minutes  
      case 'grounded':
        return { sessionsLimit: 999, durationLimit: 300 * 60 }; // 300 minutes
      default:
        return { sessionsLimit: 5, durationLimit: 5 * 60 }; // Default fallback
    }
  }, []);

  // Memoize processed top emotions to avoid recalculation
  const processedTopEmotions = useMemo(() => {
    if (!emotionMetrics || emotionMetrics.length === 0) return [];
    
    const emotionCounts: { [key: string]: { total: number; count: number } } = {};
    
    emotionMetrics.forEach((metric: EmotionMetric) => {
      if (!emotionCounts[metric.emotion_type]) {
        emotionCounts[metric.emotion_type] = { total: 0, count: 0 };
      }
      emotionCounts[metric.emotion_type].total += metric.intensity;
      emotionCounts[metric.emotion_type].count += 1;
    });

    return Object.entries(emotionCounts)
      .map(([emotion, data]) => ({
        emotion: expressionLabels[emotion] || emotion,
        intensity: Math.round((data.total / data.count) * 100)
      }))
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 5);
  }, [emotionMetrics]);

  // Debug effect for voice changes
  // useEffect(() => {
  //   console.log('Selected voice updated:', selectedVoice);
  // }, [selectedVoice]);

  // Debug effect for userProfile and user changes
  // useEffect(() => {
  //   console.log('Welcome message debug - userProfile:', userProfile, 'user:', user);
  // }, [userProfile, user]);

  useEffect(() => {
    let isMounted = true; // Prevent race conditions
    let authSubscription: any = null;

    const checkUser = async () => {
      try {
        // Check both session and user
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!isMounted) return; // Component unmounted, abort
        
        if (!user && !session) {
          console.log('Dashboard: No user or session found, redirecting to auth');
          setIsRedirecting(true);
          router.push('/auth');
          return;
        }
        
        const currentUser = user || session?.user;
        if (!currentUser) {
          console.log('Dashboard: No current user found, redirecting to auth');
          setIsRedirecting(true);
          router.push('/auth');
          return;
        }
        
        console.log('Dashboard: User authenticated:', currentUser.email);
        
        // Check admin status, therapist name, and voice settings in profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (!isMounted) return; // Component unmounted, abort
        
        if (error && error.code !== 'PGRST116') {
          console.error('Dashboard: Error fetching profile:', error);
        }
        
        // Set admin status and other profile data
        setIsAdmin(profile?.is_admin || false);
        setTherapistName(profile?.therapist_name || 'Talk Therapist');
        
        // Set subscription status
        const subscriptionStatus = profile?.subscription_status || 'calm';
        setUserSubscriptionStatus(subscriptionStatus);
        
        // Set user profile with defaults
        const newUserProfile = {
          id: currentUser.id || '',
          email: currentUser.email || '',
          full_name: profile?.full_name || '',
          created_at: currentUser.created_at || new Date().toISOString(),
          is_admin: profile?.is_admin || false,
          therapist_name: profile?.therapist_name || 'Talk Therapist',
          voice_config_id: profile?.voice_config_id,
          voice_parameters: profile?.voice_parameters,
          base_voice: profile?.base_voice,
          data_saving_preference: profile?.data_saving_preference || false,
          notification_preferences: profile?.notification_preferences || {
            email_notifications: true,
            session_reminders: true,
            progress_updates: false,
            marketing_emails: false
          },
          profile_settings: profile?.profile_settings || {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: 'en',
            theme: 'system',
            privacy_mode: false
          }
        };
        setUserProfile(newUserProfile);
        
        setUser(currentUser);
        
        // Load voice configurations for this subscription level
        console.log('🎵 Dashboard: Loading voice configurations for subscription:', subscriptionStatus);
        const voiceGroups = await loadVoiceConfigurations(subscriptionStatus);
        
        // Load the user's current voice selection
        await loadCurrentVoice(profile?.voice_config_id, voiceGroups);
        
        await fetchUserData(currentUser.id);
        
      } catch (error) {
        console.error('Dashboard: Error in checkUser:', error);
        if (isMounted) {
          setIsRedirecting(true);
          router.push('/auth');
        }
      } finally {
        if (isMounted && !isRedirecting) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener only once
    const setupAuthListener = () => {
      authSubscription = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        
        console.log('Dashboard: Auth state change:', event, session ? 'has session' : 'no session');
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log('Dashboard: User signed out or no session, redirecting to auth');
          setIsRedirecting(true);
          router.push('/auth');
        } else if (event === 'SIGNED_IN' && session) {
          console.log('Dashboard: User signed in, refreshing user data');
          // Only refresh if we don't already have a user
          if (!user) {
            setIsRedirecting(false); // Reset redirecting state
            checkUser();
          }
        }
      });
    };

    // Initial check and setup
    checkUser();
    setupAuthListener();

    // Cleanup function
    return () => {
      isMounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [router]); // Remove getAvailableVoices dependency to fix infinite loop

  // Voice selection is now handled in loadCurrentVoice function during checkUser

  const calculateAnalytics = useCallback(async (userId: string, detailedEmotions: any[]) => {
    if (!detailedEmotions || detailedEmotions.length === 0) {
      return;
    }

    try {
      // Calculate session trends (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentSessions, error: sessionsError } = await supabase
        .from('therapy_sessions')
        .select('created_at, duration')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (sessionsError) {
        console.error('Dashboard: Error fetching session trends:', sessionsError);
      } else {
        console.log('Dashboard: Recent sessions for trends:', recentSessions?.length || 0);
        
        // Group sessions by date
        const sessionsByDate: { [key: string]: { sessions: number; duration: number; emotions: any[] } } = {};
        
        recentSessions?.forEach(session => {
          const date = new Date(session.created_at).toISOString().split('T')[0];
          if (!sessionsByDate[date]) {
            sessionsByDate[date] = { sessions: 0, duration: 0, emotions: [] };
          }
          sessionsByDate[date].sessions += 1;
          sessionsByDate[date].duration += session.duration || 0;
        });

        // Add emotion data to dates
        detailedEmotions.forEach(emotion => {
          const date = new Date(emotion.created_at).toISOString().split('T')[0];
          if (sessionsByDate[date]) {
            sessionsByDate[date].emotions.push(emotion);
          }
        });

        // Convert to array and calculate averages
        const trends: SessionTrend[] = Object.entries(sessionsByDate).map(([date, data]) => ({
          date,
          sessions: data.sessions,
          duration: data.duration,
          avgEmotionIntensity: data.emotions.length > 0 
            ? data.emotions.reduce((acc, e) => acc + e.intensity, 0) / data.emotions.length 
            : 0
        }));

        console.log('Dashboard: Setting session trends:', trends.length);
        setSessionTrends(trends);
      }

      // Calculate emotion trends by type
      const emotionsByType: { [key: string]: any[] } = {};
      detailedEmotions.forEach(emotion => {
        if (!emotionsByType[emotion.emotion_type]) {
          emotionsByType[emotion.emotion_type] = [];
        }
        emotionsByType[emotion.emotion_type].push(emotion);
      });

      const emotionTrends: EmotionTrend[] = Object.entries(emotionsByType).map(([emotion, data]) => ({
        emotion: expressionLabels[emotion] || emotion,
        data: data.map(e => ({
          date: new Date(e.created_at).toISOString().split('T')[0],
          intensity: e.intensity,
          confidence: e.confidence
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }));

      console.log('Dashboard: Setting emotion trends:', emotionTrends.length);
      setEmotionTrends(emotionTrends);

      // Calculate progress metrics (compare last 7 days vs previous 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const recentEmotions = detailedEmotions.filter(e => new Date(e.created_at) >= sevenDaysAgo);
      const previousEmotions = detailedEmotions.filter(e => 
        new Date(e.created_at) >= fourteenDaysAgo && new Date(e.created_at) < sevenDaysAgo
      );

      const metrics: ProgressMetric[] = [
        {
          metric: 'Average Emotion Intensity',
          current: recentEmotions.length > 0 ? recentEmotions.reduce((acc, e) => acc + e.intensity, 0) / recentEmotions.length : 0,
          previous: previousEmotions.length > 0 ? previousEmotions.reduce((acc, e) => acc + e.intensity, 0) / previousEmotions.length : 0,
          change: 0,
          trend: 'stable'
        },
        {
          metric: 'Session Frequency',
          current: recentSessions?.filter(s => new Date(s.created_at) >= sevenDaysAgo).length || 0,
          previous: recentSessions?.filter(s => new Date(s.created_at) >= fourteenDaysAgo && new Date(s.created_at) < sevenDaysAgo).length || 0,
          change: 0,
          trend: 'stable'
        }
      ];

      // Calculate changes and trends
      metrics.forEach(metric => {
        if (metric.previous > 0) {
          metric.change = ((metric.current - metric.previous) / metric.previous) * 100;
          metric.trend = metric.change > 5 ? 'up' : metric.change < -5 ? 'down' : 'stable';
        }
      });

      console.log('Dashboard: Setting progress metrics:', metrics.length);
      setProgressMetrics(metrics);

    } catch (error) {
      console.error('Dashboard: Error in calculateAnalytics:', error);
    }
  }, [expressionLabels]);

  const fetchUserData = async (userId: string) => {
    try {
      // Also check the subscription status from the profile to make sure we have the latest
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', userId)
        .single();
      
      let actualSubscriptionStatus = profile?.subscription_status || userSubscriptionStatus || 'calm';
      
      // If profile query failed due to RLS, try to get it via API
      if (profileError && profileError.code === 'PGRST116') {
        console.log('Profile query failed due to RLS, trying API fallback...');
        try {
          const response = await fetch('/api/admin/check-direct', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.subscriptionStatus) {
              actualSubscriptionStatus = result.subscriptionStatus;
              setUserSubscriptionStatus(result.subscriptionStatus);
              console.log('Retrieved subscription status via API:', actualSubscriptionStatus);
            }
          }
        } catch (apiError) {
          console.error('API fallback failed:', apiError);
        }
      }
      
      // Only fetch analytics data if user has centered/grounded subscription
      if (actualSubscriptionStatus === 'centered' || actualSubscriptionStatus === 'grounded') {
        await fetchAnalyticsData(userId);
      }
      
      // Fetch basic user data for all users
      await fetchBasicUserData(userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchBasicUserData = async (userId: string) => {
    try {      
      // Fetch basic data in parallel
      const [subscriptionResult, plansResult, monthlySessionsResult, therapyResult, chatResult] = await Promise.all([
        // Fetch current subscription
        supabase
          .from('subscriptions')
          .select(`
            *,
            subscription_plans (
              name,
              price_amount,
              features
            )
          `)
          .eq('user_id', userId)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle(), // Use maybeSingle() instead of single() to handle no subscription gracefully
        
        // Fetch all subscription plans for comparison
        supabase
          .from('subscription_plans')
          .select('*')
          .order('price_amount', { ascending: true }),
        
        // Calculate usage stats for current month
        supabase
          .from('therapy_sessions')
          .select('duration')
          .eq('user_id', userId)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        
        // Fetch recent therapy sessions
        supabase
          .from('therapy_sessions')
          .select(`
            *,
            chat_sessions (
              id,
              title,
              summary,
              created_at
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10), // Limit to 10 most recent
        
        // Fetch recent chat sessions
        supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10) // Limit to 10 most recent
      ]);

      // Process subscription data
      if (subscriptionResult.error && subscriptionResult.error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subscriptionResult.error);
      } else if (subscriptionResult.data) {
        setCurrentSubscription(subscriptionResult.data);
      } else {
        setCurrentSubscription(null);
      }

      // Process plans data
      if (!plansResult.error) {
        setAllPlans(plansResult.data || []);
      }

      // Process usage stats
      if (!monthlySessionsResult.error && monthlySessionsResult.data) {
        const sessionsThisMonth = monthlySessionsResult.data.length;
        const durationThisMonth = monthlySessionsResult.data.reduce((acc, session) => acc + (session.duration || 0), 0);
        
        const currentPlan = subscriptionResult.data?.subscription_plans;
        const limits = getSubscriptionLimits(currentPlan?.name || 'free');
        
        setUsageStats({
          sessionsThisMonth,
          durationThisMonth,
          sessionsLimit: limits.sessionsLimit,
          durationLimit: limits.durationLimit
        });
      }

      // Process therapy sessions
      if (!therapyResult.error) {
        setTherapySessions(therapyResult.data || []);
      } else {
        console.error('Dashboard: Error fetching therapy sessions:', therapyResult.error);
      }

      // Process chat sessions
      if (!chatResult.error) {
        console.log('Dashboard: Chat sessions query result:', {
          userId,
          sessionsFound: chatResult.data?.length || 0,
          sessions: chatResult.data?.map(s => ({
            id: s.id,
            title: s.title,
            created_at: s.created_at,
            user_id: s.user_id
          })) || []
        });
        setChatSessions(chatResult.data || []);
      } else {
        console.error('Dashboard: Error fetching chat sessions:', chatResult.error);
      }

    } catch (error) {
      console.error('Error fetching basic user data:', error);
    }
  };

  const fetchAnalyticsData = async (userId: string) => {
    try {
      console.log('Dashboard: fetchAnalyticsData called for user:', userId);
      
      // Fetch analytics data only for premium/standard users
      const [emotionsResult, detailedEmotionsResult] = await Promise.all([
        // Fetch emotion metrics
        supabase
          .from('emotion_metrics')
          .select(`
            emotion_type,
            intensity,
            confidence,
            created_at,
            chat_sessions!inner (
              user_id
            )
          `)
          .eq('chat_sessions.user_id', userId)
          .limit(100), // Limit for performance

        // Fetch detailed emotion data for analytics
        supabase
          .from('emotion_metrics')
          .select(`
            emotion_type,
            intensity,
            confidence,
            created_at,
            chat_session_id,
            chat_sessions!inner (
              user_id
            )
          `)
          .eq('chat_sessions.user_id', userId)
          .order('created_at', { ascending: false })
          .limit(200) // Reduced from 500 for better performance
      ]);

      console.log('Dashboard: Analytics query results:', {
        emotionsError: emotionsResult.error?.message,
        emotionsCount: emotionsResult.data?.length || 0,
        detailedEmotionsError: detailedEmotionsResult.error?.message,
        detailedEmotionsCount: detailedEmotionsResult.data?.length || 0
      });

      // Process emotions
      if (!emotionsResult.error) {
        console.log('Dashboard: Setting emotion metrics:', emotionsResult.data?.length || 0);
        setEmotionMetrics(emotionsResult.data || []);
      } else {
        console.error('Dashboard: Error fetching emotion metrics:', emotionsResult.error);
      }

      // Process detailed emotions
      if (!detailedEmotionsResult.error && detailedEmotionsResult.data) {
        const formattedEmotionData: DetailedEmotionData[] = detailedEmotionsResult.data.map(emotion => ({
          emotion_type: emotion.emotion_type,
          intensity: emotion.intensity,
          confidence: emotion.confidence,
          created_at: emotion.created_at,
          session_id: emotion.chat_session_id || ''
        }));
        console.log('Dashboard: Setting detailed emotion data:', formattedEmotionData.length);
        setDetailedEmotionData(formattedEmotionData);
        
        // Calculate analytics with the emotion data
        await calculateAnalytics(userId, formattedEmotionData);
      } else {
        console.error('Dashboard: Error fetching detailed emotions:', detailedEmotionsResult.error);
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiration = (dateString: string) => {
    const expirationDate = new Date(dateString);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  // Function to get the correct subscription display name
  const getSubscriptionDisplayName = (subscriptionName: string) => {
    // Map subscription status to display names
    switch (subscriptionName.toLowerCase()) {
      case 'premium':
      case 'grounded':
        return 'Grounded';
      case 'standard':
      case 'centered':
        return 'Centered';
      case 'free':
      case 'calm':
      default:
        return 'Calm';
    }
  };

  const updateNotificationPreferences = async (preferences: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: preferences })
        .eq('id', user?.id);
      
      if (error) {
        console.error('Error updating notification preferences:', error);
      } else {
        setUserProfile(prev => prev ? { ...prev, notification_preferences: preferences } : null);
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  const updateProfileSettings = async (settings: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_settings: settings })
        .eq('id', user?.id);
      
      if (error) {
        console.error('Error updating profile settings:', error);
      } else {
        setUserProfile(prev => prev ? { ...prev, profile_settings: settings } : null);
      }
    } catch (error) {
      console.error('Error updating profile settings:', error);
    }
  };

  const updateDataSavingPreference = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ data_saving_preference: enabled })
        .eq('id', user?.id);
      
      if (error) {
        console.error('Error updating data saving preference:', error);
      } else {
        setUserProfile(prev => prev ? { ...prev, data_saving_preference: enabled } : null);
      }
    } catch (error) {
      console.error('Error updating data saving preference:', error);
    }
  };

  const handleTherapistNameChange = (name: string) => {
    setTherapistName(name);
  };

  const handleVoiceChange = async (voiceConfig: VoiceConfiguration) => {
    console.log('🎵 Dashboard: Voice changed to:', voiceConfig.display_name);
    setSelectedVoice(voiceConfig);
    
    // Refresh user profile to get the updated voice configuration
    if (user?.id) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('voice_config_id')
          .eq('id', user.id)
          .single();
        
        if (!error && profile && userProfile) {
          // Update the user profile with the new voice config
          const updatedProfile = {
            ...userProfile,
            voice_config_id: profile.voice_config_id
          };
          setUserProfile(updatedProfile);
          console.log('✅ Dashboard: User profile updated with new voice config');
        }
      } catch (error) {
        console.error('🎵 Dashboard: Error refreshing user profile after voice change:', error);
      }
    }
  };

  // Add a refresh function to reload user data
  const refreshUserData = async () => {
    if (user?.id) {
      console.log('Refreshing user data...');
      await fetchUserData(user.id);
      // Also refresh the profile data to get updated subscription_status
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error && profile) {
        const subscriptionStatus = profile?.subscription_status || 'free';
        console.log('Updated subscription status from profile:', subscriptionStatus);
        setUserSubscriptionStatus(subscriptionStatus);
        
        // Update user profile
        const newUserProfile = {
          ...userProfile!,
          subscription_status: subscriptionStatus
        };
        setUserProfile(newUserProfile);
      }
    }
  };

  // Download session data function (Premium only)
  const downloadSessionData = async (sessionId: string, format: 'json' | 'csv' = 'json') => {
    if (userSubscriptionStatus !== 'grounded') {
      alert('Session downloads are only available for Grounded users.');
      return;
    }

    try {
      // Fetch complete session data
      const [sessionResult, messagesResult, emotionsResult, therapyResult] = await Promise.all([
        supabase
          .from('chat_sessions')
          .select('*')
          .eq('id', sessionId)
          .single(),
        supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_session_id', sessionId)
          .order('created_at', { ascending: true }),
        supabase
          .from('emotion_metrics')
          .select('*')
          .eq('chat_session_id', sessionId)
          .order('created_at', { ascending: true }),
        supabase
          .from('therapy_sessions')
          .select('*')
          .eq('chat_session_id', sessionId)
          .single()
      ]);

      if (sessionResult.error) throw sessionResult.error;

      const sessionData = {
        session: sessionResult.data,
        messages: messagesResult.data || [],
        emotions: emotionsResult.data || [],
        therapy_session: therapyResult.data || null,
        exported_at: new Date().toISOString(),
        export_format: format
      };

      const session = sessionResult.data;
      const fileName = `session_${session.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'untitled'}_${new Date(session.created_at).toISOString().split('T')[0]}`;

      if (format === 'json') {
        // Download as JSON
        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        // Download as CSV (messages only for simplicity)
        const messages = messagesResult.data || [];
        const csvHeaders = ['Timestamp', 'Role', 'Content', 'Emotions'];
        const csvRows = messages.map(msg => [
          new Date(msg.created_at).toLocaleString(),
          msg.role,
          `"${msg.content.replace(/"/g, '""')}"`, // Escape quotes
          msg.emotion_data ? `"${JSON.stringify(msg.emotion_data).replace(/"/g, '""')}"` : ''
        ]);
        
        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.join(','))
          .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading session data:', error);
      alert('Failed to download session data. Please try again.');
    }
  };

  // Audio reconstruction function (Premium only)
  const reconstructSessionAudio = async (sessionId: string) => {
    console.log('🎵 Audio reconstruction button clicked for session:', sessionId);
    
    if (userSubscriptionStatus !== 'grounded') {
      console.log('❌ User not grounded, blocking audio reconstruction');
      alert('Audio reconstruction is only available for Grounded users.');
      return;
    }

    console.log('✅ Premium user confirmed, proceeding with audio reconstruction');

    // Update status to processing
    setAudioReconstructionStatus(prev => ({
      ...prev,
      [sessionId]: { status: 'PROCESSING', lastChecked: Date.now() }
    }));

    try {
      console.log('📡 Fetching session data from database...');
      // Fetch session data to get Hume chat group ID
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('chat_group_id, hume_chat_id, hume_chat_group_id, title, created_at')
        .eq('id', sessionId)
        .single();

      console.log('📊 Session data result:', {
        sessionData,
        error: sessionError
      });

      if (sessionError) {
        console.error('❌ Database error fetching session:', sessionError);
        setAudioReconstructionStatus(prev => ({
          ...prev,
          [sessionId]: { status: 'ERROR', lastChecked: Date.now() }
        }));
        throw sessionError;
      }

      // Check if we have either chat_group_id or hume_chat_id
      console.log('🔍 Checking for Hume identifiers:', {
        chat_group_id: sessionData?.chat_group_id,
        hume_chat_id: sessionData?.hume_chat_id,
        hume_chat_group_id: sessionData?.hume_chat_group_id,
        created_at: sessionData?.created_at
      });

      if (!sessionData?.chat_group_id && !sessionData?.hume_chat_id && !sessionData?.hume_chat_group_id) {
        console.log('❌ No Hume identifiers found in session data');
        setAudioReconstructionStatus(prev => ({
          ...prev,
          [sessionId]: { status: 'NO_AUDIO', lastChecked: Date.now() }
        }));
        alert('This session was created before Hume integration. Audio reconstruction is only available for new sessions created with voice chat.');
        return;
      }

      let apiUrl: string;
      let requestBody: any;

      if (sessionData.chat_group_id) {
        // Use chat group endpoint (preferred for multiple chats in a group)
        apiUrl = '/api/hume/reconstruct-audio-group';
        requestBody = { chatGroupId: sessionData.chat_group_id };
      } else if (sessionData.hume_chat_id) {
        // Use individual chat endpoint (fallback)
        apiUrl = '/api/hume/reconstruct-audio';
        requestBody = { chatId: sessionData.hume_chat_id };
      } else {
        throw new Error('No valid Hume ID found');
      }

      console.log('Starting audio reconstruction for session:', sessionId, 'with data:', requestBody);

      // Make request to our API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAudioReconstructionStatus(prev => ({
          ...prev,
          [sessionId]: { status: 'ERROR', lastChecked: Date.now() }
        }));
        throw new Error(errorData.error || 'Failed to start audio reconstruction');
      }

      const result = await response.json();
      console.log('Audio reconstruction result:', result);
      
      // Handle different response formats
      if (result.status === 'COMPLETE' && result.signed_audio_url) {
        // Single chat reconstruction complete
        console.log('✅ Audio reconstruction COMPLETE - ready for download');
        setAudioReconstructionStatus(prev => ({
          ...prev,
          [sessionId]: { status: 'COMPLETE', downloadUrl: result.signed_audio_url, lastChecked: Date.now() }
        }));
      } else if (result.audio_reconstructions_page && result.audio_reconstructions_page.length > 0) {
        // Chat group reconstruction - check first reconstruction
        const firstReconstruction = result.audio_reconstructions_page[0];
        console.log('📊 Chat group reconstruction status:', firstReconstruction.status);
        if (firstReconstruction.status === 'COMPLETE' && firstReconstruction.signed_audio_url) {
          console.log('✅ Group audio reconstruction COMPLETE - ready for download');
          setAudioReconstructionStatus(prev => ({
            ...prev,
            [sessionId]: { status: 'COMPLETE', downloadUrl: firstReconstruction.signed_audio_url, lastChecked: Date.now() }
          }));
        } else {
          console.log('⏳ Group reconstruction in progress:', firstReconstruction.status);
          setAudioReconstructionStatus(prev => ({
            ...prev,
            [sessionId]: { status: firstReconstruction.status, lastChecked: Date.now() }
          }));
        }
      } else if (result.status) {
        // Reconstruction in progress
        console.log('⏳ Individual reconstruction status:', result.status);
        setAudioReconstructionStatus(prev => ({
          ...prev,
          [sessionId]: { status: result.status, lastChecked: Date.now() }
        }));
      } else {
        console.log('❓ Unknown reconstruction response format');
        setAudioReconstructionStatus(prev => ({
          ...prev,
          [sessionId]: { status: 'QUEUED', lastChecked: Date.now() }
        }));
      }
    } catch (error) {
      console.error('Error reconstructing session audio:', error);
      setAudioReconstructionStatus(prev => ({
        ...prev,
        [sessionId]: { status: 'ERROR', lastChecked: Date.now() }
      }));
      alert(`Failed to reconstruct audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Check reconstruction status
  const checkReconstructionStatus = async (sessionId: string) => {
    const currentStatus = audioReconstructionStatus[sessionId];
    if (!currentStatus || currentStatus.status === 'COMPLETE' || currentStatus.status === 'ERROR' || currentStatus.status === 'NO_AUDIO') {
      return;
    }

    // Don't check too frequently (wait at least 30 seconds between checks)
    if (currentStatus.lastChecked && Date.now() - currentStatus.lastChecked < 30000) {
      return;
    }

    console.log('🔍 Checking reconstruction status for session:', sessionId);
    await reconstructSessionAudio(sessionId);
  };

  // Download ready audio
  const downloadAudio = (sessionId: string) => {
    const status = audioReconstructionStatus[sessionId];
    if (status?.status === 'COMPLETE' && status.downloadUrl) {
      console.log('🎵 Downloading audio for session:', sessionId);
      const fileName = `audio_session_${sessionId.slice(0, 8)}.mp4`;
      const a = document.createElement('a');
      a.href = status.downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Show audio info modal
  const showAudioInfo = (sessionId: string) => {
    setAudioInfoModalSessionId(sessionId);
    setShowAudioInfoModal(true);
  };

  // Start audio reconstruction from modal
  const startAudioReconstruction = () => {
    if (audioInfoModalSessionId) {
      setShowAudioInfoModal(false);
      reconstructSessionAudio(audioInfoModalSessionId);
      setAudioInfoModalSessionId(null);
    }
  };

  // Audio Info Modal Component
  const AudioInfoModal = () => {
    if (!showAudioInfoModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎵</div>
            <h2 className="text-xl font-semibold text-gray-800">Audio Reconstruction</h2>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>What is this?</strong><br />
              We can recreate the audio from your voice therapy session using Hume's AI technology.
            </p>
            
            <p>
              <strong>How it works:</strong><br />
              • We send your session data to Hume for audio reconstruction<br />
              • Processing typically takes 1-5 minutes<br />
              • You'll get a downloadable MP4 file with the full conversation
            </p>
            
            <p>
              <strong>What to expect:</strong><br />
              • The button will show "Processing..." while Hume works<br />
              • Once ready, you'll see a "Download Audio" button<br />
              • The audio file includes both your voice and the AI's responses
            </p>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800 text-xs">
                <strong>Note:</strong> Only sessions with voice conversations can be reconstructed. 
                This feature is exclusive to Premium users.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAudioInfoModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={startAudioReconstruction}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              Start Reconstruction
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Download all sessions data function (Premium only)
  const downloadAllSessionsData = async (format: 'json' | 'csv' = 'json') => {
    if (userSubscriptionStatus !== 'grounded') {
      alert('Session downloads are only available for Grounded users.');
      return;
    }

    try {
      // Fetch all user's session data
      const [sessionsResult, messagesResult, emotionsResult, therapyResult] = await Promise.all([
        supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('chat_messages')
          .select('*')
          .in('chat_session_id', chatSessions.map(s => s.id))
          .order('created_at', { ascending: true }),
        supabase
          .from('emotion_metrics')
          .select('*')
          .in('chat_session_id', chatSessions.map(s => s.id))
          .order('created_at', { ascending: true }),
        supabase
          .from('therapy_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (sessionsResult.error) throw sessionsResult.error;

      const allSessionsData = {
        user_id: user.id,
        export_summary: {
          total_sessions: sessionsResult.data?.length || 0,
          total_messages: messagesResult.data?.length || 0,
          total_emotions: emotionsResult.data?.length || 0,
          date_range: {
            earliest: sessionsResult.data?.[sessionsResult.data.length - 1]?.created_at,
            latest: sessionsResult.data?.[0]?.created_at
          }
        },
        sessions: sessionsResult.data || [],
        messages: messagesResult.data || [],
        emotions: emotionsResult.data || [],
        therapy_sessions: therapyResult.data || [],
        exported_at: new Date().toISOString(),
        export_format: format
      };

      const fileName = `all_sessions_${new Date().toISOString().split('T')[0]}`;

      if (format === 'json') {
        // Download as JSON
        const blob = new Blob([JSON.stringify(allSessionsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        // Download as CSV (messages with session info)
        const messages = messagesResult.data || [];
        const sessions = sessionsResult.data || [];
        const sessionMap = sessions.reduce((acc, session) => {
          acc[session.id] = session;
          return acc;
        }, {} as Record<string, any>);

        const csvHeaders = ['Session Title', 'Session Date', 'Message Timestamp', 'Role', 'Content', 'Emotions'];
        const csvRows = messages.map(msg => {
          const session = sessionMap[msg.chat_session_id];
          return [
            `"${(session?.title || 'Untitled').replace(/"/g, '""')}"`,
            session ? new Date(session.created_at).toLocaleDateString() : '',
            new Date(msg.created_at).toLocaleString(),
            msg.role,
            `"${msg.content.replace(/"/g, '""')}"`,
            msg.emotion_data ? `"${JSON.stringify(msg.emotion_data).replace(/"/g, '""')}"` : ''
          ];
        });
        
        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.join(','))
          .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading all sessions data:', error);
      alert('Failed to download sessions data. Please try again.');
    }
  };

  const handleResumeSession = async (sessionId: string) => {
    setResumingSessionId(sessionId);
    try {
      // Use the existing localStorage pattern for resumption
      console.log('🔄 Resuming session from dashboard:', sessionId);
      localStorage.setItem('previousSessionIdToResume', sessionId);
      sessionStorage.setItem('resumptionTriggered', 'true');
      // Preserve session ID for Hot Refresh recovery
      sessionStorage.setItem('hotRefreshSessionId', sessionId);
      router.push('/chat');
      
      // Reset the state after navigation setup is complete
      setTimeout(() => {
        setResumingSessionId(null);
      }, 1000);
    } catch (error) {
      console.error('❌ Error resuming session:', error);
      setResumingSessionId(null);
    }
  };

  // Delete all user sessions function
  const deleteAllUserSessions = async () => {
    setIsDeletingSessions(true);
    try {
      console.log('🗑️ Deleting all user sessions...');
      
      // Get the current user's access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      // Call our delete API endpoint
      const response = await fetch('/api/delete-user-sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete sessions');
      }

      const result = await response.json();
      console.log('✅ Sessions deleted successfully:', result);

      // Reset state
      setChatSessions([]);
      setTherapySessions([]);
      setEmotionMetrics([]);
      setSessionMessages({});

      // Close modal and reset confirmation
      setShowDeleteSessionsModal(false);
      setDeleteSessionsConfirmed(false);

      alert('All conversation data has been successfully deleted.');

    } catch (error) {
      console.error('❌ Error deleting sessions:', error);
      alert(`Failed to delete sessions: ${(error as Error).message}`);
    } finally {
      setIsDeletingSessions(false);
    }
  };

  // Delete user account function
  const deleteUserAccount = async () => {
    setIsDeletingAccount(true);
    try {
      console.log('🗑️ Deleting user account...');
      
      // Get the current user's access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      // Call our delete API endpoint
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      const result = await response.json();
      console.log('✅ Account deleted successfully:', result);

      // Close modal and reset confirmation
      setShowDeleteAccountModal(false);
      setDeleteAccountConfirmed(false);

      // Sign out and redirect to home page
      await supabase.auth.signOut();
      alert('Your account has been successfully deleted.');
      router.push('/');

    } catch (error) {
      console.error('❌ Error deleting account:', error);
      alert(`Failed to delete account: ${(error as Error).message}`);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (loading || isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <div className="text-lg text-muted-foreground">
          {isRedirecting ? 'Redirecting...' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (!user) {
    // This should rarely be reached now due to the redirecting logic above
    console.log('Dashboard: Rendering login message as fallback');
    return <div className="flex items-center justify-center min-h-screen">Please log in to access the dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">Dashboard</h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground truncate">
            Welcome back, {userProfile?.full_name || user?.email}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded transition-colors font-medium bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm lg:text-base whitespace-nowrap"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 sm:gap-6">
        {/* User Info Section */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">User Info & Preferences</h2>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <p className="text-sm sm:text-base"><span className="font-medium">Email:</span> {user?.email}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <p className="text-sm sm:text-base"><span className="font-medium">Account Created:</span> {userProfile ? formatDate(userProfile.created_at) : 'Loading...'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <p className="text-sm sm:text-base"><span className="font-medium">Last Sign In:</span> {new Date(user?.last_sign_in_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <p className="text-sm sm:text-base"><span className="font-medium">Therapist Name:</span></p>
                <TherapistSettings 
                  onNameChange={(name) => {
                    setTherapistName(name);
                    window.location.reload();
                  }} 
                  className="h-8 max-w-40"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <p className="text-sm sm:text-base">
                  <span className="font-medium">Subscription:</span>{' '}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    getSubscriptionDisplayName(currentSubscription?.subscription_plans?.name || userSubscriptionStatus) === 'Grounded' 
                      ? 'bg-purple-100 text-purple-800' 
                      : getSubscriptionDisplayName(currentSubscription?.subscription_plans?.name || userSubscriptionStatus) === 'Centered'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getSubscriptionDisplayName(currentSubscription?.subscription_plans?.name || userSubscriptionStatus)}
                  </span>
                </p>
                <div className="flex gap-2">
                  <Link
                    href="/subscription"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Manage Subscription
                  </Link>
                  <button
                    onClick={refreshUserData}
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              {/* Expiry */}
              {currentSubscription && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">Expires:</span>{' '}
                    <span className={`${getDaysUntilExpiration(currentSubscription.current_period_end) <= 7 ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                      {formatDate(currentSubscription.current_period_end)}
                      {getDaysUntilExpiration(currentSubscription.current_period_end) <= 7 && (
                        <span className="ml-1 text-xs">({getDaysUntilExpiration(currentSubscription.current_period_end)} days left)</span>
                      )}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Data Management Section */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3 text-base sm:text-lg">Data Management</h3>
              <div className="space-y-4">
                {/* Data Saving Preference */}
                {userProfile && userSubscriptionStatus !== 'free' && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">Save Conversation Data</p>
                      <p className="text-xs text-muted-foreground">
                        Allow saving conversation data for future reference
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="data-saving-preference"
                        checked={userProfile.data_saving_preference}
                        onChange={(e) => updateDataSavingPreference(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="data-saving-preference" className="text-sm">
                        {userProfile.data_saving_preference ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Conversation Data</p>
                    <p className="text-xs text-muted-foreground">
                      Delete all your conversation sessions and related data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteSessionsModal(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 max-w-40 min-w-0 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Delete All Sessions</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Usage & Limits */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">Usage & Limits</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPlanComparison(!showPlanComparison)}
              className="max-w-32 min-w-0 text-xs sm:text-sm"
            >
              <span className="truncate">
                {showPlanComparison ? 'Hide' : 'Compare'} Plans
              </span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Sessions Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-medium">Sessions This Month</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {usageStats.sessionsThisMonth} / {usageStats.sessionsLimit === 0 ? '∞' : usageStats.sessionsLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getUsagePercentage(usageStats.sessionsThisMonth, usageStats.sessionsLimit) >= 90 
                      ? 'bg-red-500' 
                      : getUsagePercentage(usageStats.sessionsThisMonth, usageStats.sessionsLimit) >= 75 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ 
                    width: usageStats.sessionsLimit === 0 
                      ? '0%' 
                      : `${getUsagePercentage(usageStats.sessionsThisMonth, usageStats.sessionsLimit)}%` 
                  }}
                ></div>
              </div>
              {usageStats.sessionsLimit > 0 && getUsagePercentage(usageStats.sessionsThisMonth, usageStats.sessionsLimit) >= 90 && (
                <p className="text-xs text-red-600">You're approaching your session limit!</p>
              )}
            </div>
            {/* Duration Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-medium">Duration This Month</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {formatDuration(usageStats.durationThisMonth)} / {usageStats.durationLimit === 0 ? '∞' : formatDuration(usageStats.durationLimit)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getUsagePercentage(usageStats.durationThisMonth, usageStats.durationLimit) >= 90 
                      ? 'bg-red-500' 
                      : getUsagePercentage(usageStats.durationThisMonth, usageStats.durationLimit) >= 75 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ 
                    width: usageStats.durationLimit === 0 
                      ? '0%' 
                      : `${getUsagePercentage(usageStats.durationThisMonth, usageStats.durationLimit)}%` 
                  }}
                ></div>
              </div>
              {usageStats.durationLimit > 0 && getUsagePercentage(usageStats.durationThisMonth, usageStats.durationLimit) >= 90 && (
                <p className="text-xs text-red-600">You're approaching your duration limit!</p>
              )}
            </div>
          </div>
          {/* Plan Comparison */}
          {showPlanComparison && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Plan Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allPlans.map((plan) => {
                  // Determine if this is the current plan by checking subscription first, then profile status
                  let currentPlanName;
                  if (currentSubscription?.subscription_plans?.name) {
                    currentPlanName = currentSubscription.subscription_plans.name;
                  } else {
                    currentPlanName = userSubscriptionStatus.charAt(0).toUpperCase() + userSubscriptionStatus.slice(1);
                  }
                  const isCurrentPlan = currentPlanName === plan.name;
                  // Get limits for this plan
                  const planLimits = getSubscriptionLimits(plan.name);
                  return (
                  <div 
                    key={plan.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCurrentPlan
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="font-semibold text-base sm:text-lg">{plan.name}</h4>
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        ${(plan.price_amount / 100).toFixed(2)}
                        <span className="text-sm text-muted-foreground">/mn</span>
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Sessions:</span> {planLimits.sessionsLimit === 999 ? 'Unlimited' : planLimits.sessionsLimit}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Duration:</span> {formatDuration(planLimits.durationLimit)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Features:</span>
                        <ul className="list-disc list-inside mt-1 text-xs text-muted-foreground">
                          {plan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {isCurrentPlan ? (
                      <div className="mt-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current Plan
                        </span>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Link
                          href={
                            plan.price_amount === 0 
                              ? "/subscription" 
                              : plan.stripe_price_id 
                              ? `/subscription?plan=${plan.stripe_price_id}`
                              : "/subscription"
                          }
                          className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                        >
                          {plan.price_amount === 0 ? 'Switch to Free' : 'Upgrade'}
                        </Link>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Session Stats</h2>
            <div className="flex flex-col h-[calc(100%-2rem)]">
              <div className="space-y-2">
                <p className="text-sm sm:text-base">Total Sessions: {therapySessions.length}</p>
                <p className="text-sm sm:text-base">Last Session: {therapySessions[0] ? new Date(therapySessions[0].created_at).toLocaleDateString() : 'Never'}</p>
                <p className="text-sm sm:text-base">Total Duration: {formatDuration(therapySessions.reduce((acc, session) => acc + (session.duration || 0), 0))}</p>
                {therapySessions[0]?.chat_sessions && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Last Session Summary: {therapySessions[0].chat_sessions.summary || 'No summary available'}
                  </p>
                )}
              </div>
              <div className="mt-auto pt-4">
                <div className="space-y-2">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  >
                    Start Therapy Session
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Voice Settings</h2>
            <div className="flex flex-col h-[calc(100%-2rem)]">
              <div className="space-y-2">
                <p className="text-sm sm:text-base">Current Voice: {selectedVoice?.display_name || 'Loading...'}</p>
                <p className="text-sm sm:text-base">Voice Preference: {selectedVoice?.display_name || 'Loading...'}</p>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <p>Subscription: {getSubscriptionDisplayName(userSubscriptionStatus)}</p>
                  <p>Available Voices: {getAvailableVoicesCount(userSubscriptionStatus, voiceGroups)} of {totalVoicesCount}</p>
                  {userSubscriptionStatus === 'calm' && (
                    <p className="text-amber-600 mt-1">Calm plan: Basic voices available</p>
                  )}
                  {userSubscriptionStatus === 'centered' && (
                    <p className="text-blue-600 mt-1">Centered plan: More voices available</p>
                  )}
                  {userSubscriptionStatus === 'grounded' && (
                    <p className="text-green-600 mt-1">Grounded plan: All voices available</p>
                  )}
                </div>
              </div>
              <div className="mt-auto pt-4">
                <VoiceSettings 
                  className="w-full" 
                  onVoiceChange={handleVoiceChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Emotional Insights</h2>
            <div className="space-y-2">
              <p className="text-sm sm:text-base">Total Emotions Tracked: {emotionMetrics.length}</p>
              <p className="text-sm sm:text-base">Average Intensity: {(emotionMetrics.reduce((acc, metric) => acc + metric.intensity, 0) / (emotionMetrics.length || 1)).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Top Emotions Chart */}
        {(userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded') ? (
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Top Emotions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedTopEmotions}>
                    <XAxis 
                      dataKey="emotion" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Intensity']}
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    <Bar 
                      dataKey="intensity" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Pie Chart */}
              <div className="h-64">
                {processedTopEmotions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedTopEmotions}
                        dataKey="intensity"
                        nameKey="emotion"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {processedTopEmotions.map((entry, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={['#f3b885', '#c8e3b9', '#fdeaba', '#97cad2', '#f0aba7'][index % 5]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Intensity']}
                        contentStyle={{
                          backgroundColor: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No emotion data available
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card p-4 sm:p-6 rounded-lg border border-amber-200 bg-amber-50">
            <h2 className="text-xl font-semibold mb-4 text-amber-800">Top Emotions</h2>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-amber-800 mb-2">Premium Feature</h3>
              <p className="text-amber-700 mb-4">
                Unlock detailed emotion tracking and visualization with our Centered or Grounded plans.
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-600 text-white hover:bg-amber-700 h-10 px-4 py-2"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* Recent Sessions */}
        {(userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded') ? (
          <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h2 className="text-lg sm:text-xl font-semibold">Recent Sessions</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('🔄 Manual refresh triggered');
                    if (user?.id) {
                      fetchUserData(user.id);
                    }
                  }}
                  className="text-xs max-w-20"
                >
                  🔄 Refresh
                </Button>
                {userSubscriptionStatus === 'grounded' && chatSessions.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAllSessionsData('json')}
                      className="text-xs max-w-44"
                  >
                    📥 Download All (TEXT/JSON)
                  </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAllSessionsData('csv')}
                      className="text-xs max-w-44"
                    >
                      📊 Download All (EXCEL/CSV)
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {chatSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate">{session.title || 'Untitled Session'}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">{new Date(session.created_at).toLocaleString()}</p>
                        <p className="text-xs text-gray-400 font-mono truncate">ID: {session.id}</p>
                        {session.hume_chat_id && session.hume_chat_group_id ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ Resumable
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            📜 Legacy
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {session.summary && (
                    <p className="mt-2 text-sm">{session.summary}</p>
                  )}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    {/* Resume/Continue Session Button */}
                    {session.hume_chat_id && session.hume_chat_group_id ? (
                      <Button
                        onClick={() => handleResumeSession(session.id)}
                        disabled={resumingSessionId === session.id}
                        className={`${resumingSessionId === session.id ? "cursor-not-allowed" : ""} max-w-32`}
                        size="sm"
                      >
                        {resumingSessionId === session.id ? "Resuming..." : "Resume Session"}
                      </Button>
                    ) : (
                      <>
                        <span className="text-xs text-gray-500 flex items-center">
                          📜 Legacy
                        </span>
                        <Button
                          onClick={() => window.open(`/session/${session.id}`, '_blank')}
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 max-w-28"
                          size="sm"
                        >
                          View Session
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="max-w-32"
                      onClick={async () => {
                        console.log('View Messages button clicked for session:', session.id);
                        console.log('Current expandedSessionId:', expandedSessionId);
                        console.log('Current sessionMessages for this session:', sessionMessages[session.id]);
                        
                        if (expandedSessionId === session.id) {
                          console.log('Collapsing session messages');
                          setExpandedSessionId(null);
                          return;
                        }
                        
                        try {
                          if (!sessionMessages[session.id]) {
                            console.log('Fetching messages from database for session:', session.id);
                            const { data: messages, error } = await supabase
                              .from('chat_messages')
                              .select('*')
                              .eq('chat_session_id', session.id)
                              .order('created_at', { ascending: true });

                            console.log('Database query result:', {
                              error: error?.message,
                              messagesCount: messages?.length || 0,
                              messages: messages?.slice(0, 3) // Log first 3 messages for debugging
                            });

                            if (error) {
                              console.error('Error fetching messages:', error);
                              alert(`Error fetching messages: ${error.message}`);
                              return;
                            }

                            console.log('Setting messages in state for session:', session.id);
                            setSessionMessages(prev => ({
                              ...prev,
                              [session.id]: messages || []
                            }));
                          } else {
                            console.log('Messages already cached for session:', session.id);
                          }
                          
                          console.log('Setting expandedSessionId to:', session.id);
                          setExpandedSessionId(session.id);
                        } catch (error) {
                          console.error('Error in View Messages handler:', error);
                          alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                        }
                      }}
                    >
                      {expandedSessionId === session.id ? 'Hide Messages' : 'View Messages'}
                    </Button>
                    
                    {/* Grounded Download Buttons */}
                    {userSubscriptionStatus === 'grounded' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadSessionData(session.id, 'json')}
                          className="text-xs max-w-24"
                        >
                          📥 TEXT/JSON
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadSessionData(session.id, 'csv')}
                          className="text-xs max-w-24"
                        >
                          📊 EXCEL/CSV
                        </Button>
                        {/* Smart Audio Button */}
                        {(() => {
                          const status = audioReconstructionStatus[session.id];
                          
                          if (!status) {
                            // No reconstruction started - show info button
                            return (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => showAudioInfo(session.id)}
                                className="text-xs max-w-20"
                              >
                                🎵 Audio
                              </Button>
                            );
                          }
                          
                          switch (status.status) {
                            case 'PROCESSING':
                            case 'QUEUED':
                              return (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => checkReconstructionStatus(session.id)}
                                  className="text-xs max-w-24"
                                  disabled={Date.now() - (status.lastChecked || 0) < 30000}
                                >
                                  {status.status === 'PROCESSING' ? '⏳ Processing...' : '🔄 Queued...'}
                                </Button>
                              );
                              
                            case 'COMPLETE':
                              return (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadAudio(session.id)}
                                  className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100 max-w-32"
                                >
                                  ⬇️ Download Audio
                                </Button>
                              );
                              
                            case 'ERROR':
                              return (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => showAudioInfo(session.id)}
                                  className="text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100 max-w-24"
                                >
                                  ❌ Retry Audio
                                </Button>
                              );
                              
                            case 'NO_AUDIO':
                              return (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className="text-xs bg-gray-50 border-gray-200 text-gray-500 max-w-24"
                                >
                                  🚫 No Audio
                                </Button>
                              );
                              
                            default:
                              return (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => checkReconstructionStatus(session.id)}
                                  className="text-xs max-w-28"
                                >
                                  🔍 Check Status
                                </Button>
                              );
                          }
                        })()}
                      </>
                    )}
                  </div>
                  
                  {/* Expanded Messages */}
                  {expandedSessionId === session.id && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">
                        Session Messages: ({sessionMessages[session.id]?.length || 0} messages)
                      </h4>
                      {(() => {
                        console.log('Rendering expanded messages for session:', session.id);
                        console.log('expandedSessionId:', expandedSessionId);
                        console.log('sessionMessages[session.id]:', sessionMessages[session.id]);
                        console.log('sessionMessages object:', sessionMessages);
                        
                        if (!sessionMessages[session.id]) {
                          console.log('No messages in state - showing loading');
                          return <p className="text-sm text-muted-foreground">Loading messages...</p>;
                        } else if (sessionMessages[session.id]?.length === 0) {
                          console.log('Messages array is empty - showing no messages found');
                          return <p className="text-sm text-muted-foreground">No messages found for this session.</p>;
                        } else {
                          console.log('Rendering messages - count:', sessionMessages[session.id]?.length);
                          return (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {sessionMessages[session.id]?.map((message: any, index: number) => {
                                console.log(`Rendering message ${index}:`, message);
                                return (
                                  <div 
                                    key={message.id} 
                                    className={`p-2 rounded text-sm ${
                                      message.role === 'user' 
                                        ? 'bg-primary text-primary-foreground ml-4' 
                                        : 'bg-secondary mr-4'
                                    }`}
                                  >
                                    <div className="font-medium text-xs mb-1">
                                      {message.role === 'user' ? 'You' : 'Assistant'} • {new Date(message.created_at).toLocaleTimeString()}
                                    </div>
                                    <div>{message.content}</div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              ))}
              
              {chatSessions.length === 0 && (
                <p className="text-muted-foreground">No sessions yet. Start your first session to see it here!</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-lg border border-blue-200 bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Recent Sessions</h2>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">Premium Feature</h3>
              <p className="text-blue-700 mb-4">
                Access detailed session history and message transcripts with our Centered or Grounded plans.
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* Analytics & Insights Section */}
        {(userSubscriptionStatus === 'centered' || userSubscriptionStatus === 'grounded') ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Analytics & Insights</h2>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
            </div>

            {showAnalytics && (
              <div className="space-y-8">
                {/* Progress Metrics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Progress Metrics (This Week vs Last Week)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {progressMetrics.map((metric, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-600">{metric.metric}</h4>
                          <div className={`flex items-center text-sm ${
                            metric.trend === 'up' ? 'text-green-600' : 
                            metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {metric.trend === 'up' && '↗'}
                            {metric.trend === 'down' && '↘'}
                            {metric.trend === 'stable' && '→'}
                            <span className="ml-1">
                              {metric.change > 0 ? '+' : ''}{metric.change}
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{metric.current}</div>
                        <div className="text-sm text-gray-500">Previous: {metric.previous}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Trends */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Session Trends (Last 30 Days)</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {sessionTrends.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
                          <div>Date</div>
                          <div>Sessions</div>
                          <div>Duration (min)</div>
                          <div>Avg Emotion</div>
                        </div>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {sessionTrends.slice(-10).reverse().map((trend, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-200">
                              <div className="text-gray-800">
                                {new Date(trend.date).toLocaleDateString()}
                              </div>
                              <div className="text-gray-800">{trend.sessions}</div>
                              <div className="text-gray-800">{Math.round(trend.duration / 60)}</div>
                              <div className="text-gray-800">
                                {trend.avgEmotionIntensity > 0 ? 
                                  `${Math.round(trend.avgEmotionIntensity * 100)}%` : 
                                  'N/A'
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <span className="font-medium">Total Sessions:</span> {sessionTrends.reduce((sum, t) => sum + t.sessions, 0)}
                            </div>
                            <div>
                              <span className="font-medium">Total Duration:</span> {Math.round(sessionTrends.reduce((sum, t) => sum + t.duration, 0) / 60)} min
                            </div>
                            <div>
                              <span className="font-medium">Avg Sessions/Day:</span> {(sessionTrends.reduce((sum, t) => sum + t.sessions, 0) / Math.max(sessionTrends.length, 1)).toFixed(1)}
                            </div>
                            <div>
                              <span className="font-medium">Avg Duration/Day:</span> {Math.round(sessionTrends.reduce((sum, t) => sum + t.duration, 0) / Math.max(sessionTrends.length, 1) / 60)} min
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center py-8">
                        No session data available for the last 30 days
                      </div>
                    )}
                  </div>
                </div>

                {/* Emotion Trends */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Detailed Emotion Tracking (Top 5 Emotions)</h3>
                  <div className="space-y-4">
                    {emotionTrends.length > 0 ? (
                      emotionTrends.map((emotionTrend, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-800">{emotionTrend.emotion}</h4>
                            <div className="text-sm text-gray-600">
                              Avg Intensity: {Math.round(emotionTrend.data.reduce((sum, d) => sum + d.intensity, 0) / emotionTrend.data.length * 100)}%
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-600 border-b pb-1">
                              <div>Date</div>
                              <div>Intensity</div>
                              <div>Confidence</div>
                            </div>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {emotionTrend.data.slice(-5).reverse().map((dataPoint, dataIndex) => (
                                <div key={dataIndex} className="grid grid-cols-3 gap-4 text-xs py-1">
                                  <div className="text-gray-700">
                                    {new Date(dataPoint.date).toLocaleDateString()}
                                  </div>
                                  <div className="text-gray-700">
                                    <div className="flex items-center">
                                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full" 
                                          style={{ width: `${dataPoint.intensity * 100}%` }}
                                        ></div>
                                      </div>
                                      {Math.round(dataPoint.intensity * 100)}%
                                    </div>
                                  </div>
                                  <div className="text-gray-700">
                                    {Math.round(dataPoint.confidence * 100)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                        No emotion data available yet. Start a therapy session to begin tracking your emotional journey.
                      </div>
                    )}
                  </div>
                </div>

                {/* Emotion Distribution */}
                {detailedEmotionData.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Emotion Distribution</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(
                          detailedEmotionData
                            .slice(0, 50) // Last 50 emotions
                            .reduce((acc, emotion) => {
                              const label = expressionLabels[emotion.emotion_type] || emotion.emotion_type;
                              acc[label] = (acc[label] || 0) + 1;
                              return acc as { [key: string]: number };
                            }, {} as { [key: string]: number })
                        )
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 8)
                          .map(([emotion, count]) => (
                            <div key={emotion} className="text-center">
                              <div className="text-2xl font-bold text-gray-800">{count}</div>
                              <div className="text-sm text-gray-600">{emotion}</div>
                              <div className="text-xs text-gray-500">
                                {Math.round((count / Math.min(detailedEmotionData.length, 50)) * 100)}%
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Insights Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Key Insights</h3>
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                    {sessionTrends.length > 0 && (
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Session Consistency:</span> You've had {sessionTrends.filter(t => t.sessions > 0).length} active days in the last 30 days
                          {sessionTrends.filter(t => t.sessions > 0).length >= 20 && (
                            <span className="text-green-600 font-medium"> - Excellent consistency! 🎉</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {emotionTrends.length > 0 && (
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Emotional Range:</span> You've expressed {emotionTrends.length} different primary emotions, showing healthy emotional awareness
                        </div>
                      </div>
                    )}

                    {progressMetrics.length > 0 && (
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Progress Trend:</span> 
                          {progressMetrics.filter(m => m.trend === 'up').length > progressMetrics.filter(m => m.trend === 'down').length ? (
                            <span className="text-green-600 font-medium"> Positive trajectory across most metrics 📈</span>
                          ) : (
                            <span className="text-blue-600 font-medium"> Mixed progress - focus areas identified 📊</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 border border-purple-200 bg-purple-50">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Analytics & Insights</h2>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-lg font-medium text-purple-800 mb-2">Premium Feature</h3>
              <p className="text-purple-700 mb-4">
                Get comprehensive analytics, progress tracking, and personalized insights with our Standard or Premium plans.
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* Grounded Data Export Section */}
        {userSubscriptionStatus === 'grounded' && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">💎</div>
              <h2 className="text-xl font-semibold text-purple-800">Grounded Data Export</h2>
            </div>
            <p className="text-purple-700 mb-4">
              As a Grounded user, you have full access to download and export all your therapy session data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 mb-2">📊 Complete Data Export</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Download all your sessions, messages, and emotion data in one comprehensive file.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAllSessionsData('json')}
                    className="flex-1 text-xs sm:text-sm"
                  >
                    <span className="block sm:hidden">📥 JSON / TEXT</span>
                    <span className="hidden sm:block">Download TEXT/JSON</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAllSessionsData('csv')}
                    className="flex-1 text-xs sm:text-sm"
                  >
                    <span className="block sm:hidden">📊 CSV / EXCEL</span>
                    <span className="hidden sm:block">Download EXCEL/CSV</span>
                  </Button>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 mb-2">🔍 What's Included</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete conversation transcripts</li>
                  <li>• Emotion analysis data</li>
                  <li>• Session metadata & timestamps</li>
                  <li>• Therapy session summaries</li>
                  <li>• Export timestamps for data integrity</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-xs text-purple-700">
                <strong>Privacy Note:</strong> Your data exports are generated locally in your browser and are not stored on our servers. 
                Please keep your downloaded files secure and follow your organization's data handling policies.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Audio Info Modal */}
      <AudioInfoModal />

      {/* Delete Sessions Modal */}
      <Dialog open={showDeleteSessionsModal} onOpenChange={setShowDeleteSessionsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete All Conversation Data
            </DialogTitle>
            <DialogDescription className="text-left space-y-2">
              <p>
                This action will <strong>permanently delete</strong> all of your conversation sessions and related data, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All chat sessions and messages</li>
                <li>Emotion analysis data</li>
                <li>Therapy session records</li>
                <li>Progress tracking information</li>
              </ul>
              <p className="text-red-600 font-medium">
                This action cannot be undone.
              </p>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="confirmDelete"
                checked={deleteSessionsConfirmed}
                onChange={(e) => setDeleteSessionsConfirmed(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="confirmDelete" className="text-sm font-medium">
                I understand this action cannot be undone
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteSessionsModal(false);
                setDeleteSessionsConfirmed(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteAllUserSessions}
              disabled={!deleteSessionsConfirmed || isDeletingSessions}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingSessions ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Sessions
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteAccountModal} onOpenChange={setShowDeleteAccountModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Account Permanently
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-red-800 font-medium text-sm">
                  ⚠️ This action will permanently delete your entire account
                </p>
              </div>
              <p>
                This action will <strong>permanently and irreversibly delete</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Your user account and profile</li>
                <li>All conversation sessions and messages</li>
                <li>All emotion analysis and therapy data</li>
                <li>Your subscription and billing information</li>
                <li>All progress tracking and analytics</li>
                <li>Any stored preferences and settings</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> You will be immediately signed out and will not be able to recover any of this data.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="confirmAccountDelete"
                checked={deleteAccountConfirmed}
                onChange={(e) => setDeleteAccountConfirmed(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="confirmAccountDelete" className="text-sm font-medium">
                I understand my account and all data will be permanently deleted
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteAccountModal(false);
                setDeleteAccountConfirmed(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteUserAccount}
              disabled={!deleteAccountConfirmed || isDeletingAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 