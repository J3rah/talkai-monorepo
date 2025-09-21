"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import supabase from "@/supabaseClient";
import VoiceSettings from "@/components/VoiceSettings";
import { expressionLabels } from "@/utils/expressionLabels";
// Removed unused import expressionColors
import { getAvailableVoiceConfigurations, getVoiceConfigurationById, getFallbackVoiceConfigurations, VoiceConfigurationGroup, VoiceConfiguration } from "@/utils/voiceConfigUtils";
import { calculateMostUsedAgent, getDefaultAgent, getAvailableTherapistCount, UserAgentAnalytics } from "@/utils/agentAnalytics";
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
import { 
  Loader2, 
  Trash2, 
  Home,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  Volume2,
  Calendar,
  Download,
  Play,
  ChevronDown,
  ChevronRight,
  Activity,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Shield,
  FileText,
  Headphones,
  Archive
} from "lucide-react";
import Toast from "@/components/Toast";
import ConfettiHeart from '@/components/ConfettiHeart';
import ReferralInvite from "@/components/ReferralInvite";

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
  minutes_balance?: number;
  referral_code?: string;
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

export default function TestDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [emotionMetrics, setEmotionMetrics] = useState<EmotionMetric[]>([]);
  const [therapySessions, setTherapySessions] = useState<TherapySession[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Record<string, unknown[]>>({});
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
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => setToast({ message, type });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

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

  // Referral tracking state
  const [referralsCount, setReferralsCount] = useState<number>(0);

  // Voice configuration state - now managed from database
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfiguration | null>(null);
  const [voiceGroups, setVoiceGroups] = useState<VoiceConfigurationGroup[]>([]);
  const [totalVoicesCount, setTotalVoicesCount] = useState(0);

  // Agent analytics state
  const [agentAnalytics, setAgentAnalytics] = useState<UserAgentAnalytics | null>(null);
  const [defaultAgentName, setDefaultAgentName] = useState<string>('Talk Therapist');
  const [availableTherapistCount, setAvailableTherapistCount] = useState<number>(1);

  // Add password change state after other useState declarations
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
          minutes_balance: profile?.minutes_balance || 0,
          referral_code: profile?.referral_code || '',
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

  const calculateAnalytics = useCallback(async (userId: string, detailedEmotions: DetailedEmotionData[]) => {
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
        const sessionsByDate: { [key: string]: { sessions: number; duration: number; emotions: DetailedEmotionData[] } } = {};
        
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
      const emotionsByType: { [key: string]: DetailedEmotionData[] } = {};
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
      
      // Fetch agent analytics for all users
      await fetchAgentAnalytics(userId);
      
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

  const fetchAgentAnalytics = async (userId: string) => {
    try {
      console.log('Dashboard: Fetching agent analytics for user:', userId);
      
      // Fetch agent analytics data in parallel
      const [analyticsResult, defaultAgentResult, therapistCountResult] = await Promise.all([
        calculateMostUsedAgent(userId),
        getDefaultAgent(userId),
        getAvailableTherapistCount(userId)
      ]);

      console.log('Dashboard: Agent analytics results:', {
        mostUsedAgent: analyticsResult.mostUsedAgent?.characterName || 'None',
        totalSessions: analyticsResult.totalSessions,
        defaultAgent: defaultAgentResult,
        availableCount: therapistCountResult
      });

      setAgentAnalytics(analyticsResult);
      setDefaultAgentName(defaultAgentResult);
      setAvailableTherapistCount(therapistCountResult);
    } catch (error) {
      console.error('Dashboard: Error fetching agent analytics:', error);
      // Set fallback values
      setAgentAnalytics({
        mostUsedAgent: null,
        totalSessions: 0,
        agentBreakdown: []
      });
      setDefaultAgentName('Talk Therapist');
      setAvailableTherapistCount(1);
    }
  };

  const fetchBasicUserData = async (userId: string) => {
    try {      
      // Fetch basic data in parallel
      const [subscriptionResult, plansResult, monthlySessionsResult, therapyResult, chatResult, referralsResult] = await Promise.all([
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
          .limit(10), // Limit to 10 most recent
        
        // Fetch referrals count
        supabase
          .from('referrals')
          .select('id', { count: 'exact', head: true })
          .eq('referrer_id', userId)
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

      // After processing other datasets
      if (!referralsResult.error && typeof referralsResult.count === 'number') {
        setReferralsCount(referralsResult.count);
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

  const handleResumeSession = async (sessionId: string) => {
    setResumingSessionId(sessionId);
    try {
      // Use the existing localStorage pattern for resumption
      console.log('🔄 Resuming session from test dashboard:', sessionId);
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

  // === Helper Functions borrowed from main dashboard ===
  // Download all sessions data (Premium only)
  const downloadAllSessionsData = async (format: 'json' | 'csv' = 'json') => {
    if (userSubscriptionStatus !== 'grounded') {
      showToastMessage('Session downloads are only available for Grounded users.', 'error');
      return;
    }
    try {
      const [sessionsResult, messagesResult, emotionsResult, therapyResult] = await Promise.all([
        supabase.from('chat_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('chat_messages').select('*').in('chat_session_id', chatSessions.map(s => s.id)).order('created_at', { ascending: true }),
        supabase.from('emotion_metrics').select('*').in('chat_session_id', chatSessions.map(s => s.id)).order('created_at', { ascending: true }),
        supabase.from('therapy_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      if (sessionsResult.error) throw sessionsResult.error;

      const allSessionsData = {
        user_id: user.id,
        export_summary: {
          total_sessions: sessionsResult.data?.length || 0,
          total_messages: messagesResult.data?.length || 0,
          total_emotions: emotionsResult.data?.length || 0,
        },
        sessions: sessionsResult.data || [],
        messages: messagesResult.data || [],
        emotions: emotionsResult.data || [],
        therapy_sessions: therapyResult.data || [],
        exported_at: new Date().toISOString(),
        export_format: format,
      };

      const fileName = `all_sessions_${new Date().toISOString().split('T')[0]}`;
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(allSessionsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      showToastMessage('All sessions downloaded successfully.');
    } catch (error) {
      console.error('Error downloading all sessions data:', error);
      showToastMessage('Failed to download sessions data.', 'error');
    }
  };

  // Delete all user sessions
  const deleteAllUserSessions = async () => {
    setIsDeletingSessions(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No valid session found');
      const response = await fetch('/api/delete-user-sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete sessions');
      // Reset local state
      setChatSessions([]);
      setTherapySessions([]);
      setEmotionMetrics([]);
      setSessionMessages({});
      setShowDeleteSessionsModal(false);
      setDeleteSessionsConfirmed(false);
      showToastMessage('All conversation data has been deleted.');
    } catch (error: any) {
      console.error('Error deleting sessions:', error);
      showToastMessage(`Failed to delete sessions: ${error.message}`, 'error');
    } finally {
      setIsDeletingSessions(false);
    }
  };

  // Delete user account
  const deleteUserAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No valid session found');
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete account');
      setShowDeleteAccountModal(false);
      setDeleteAccountConfirmed(false);
      await supabase.auth.signOut();
      showToastMessage('Your account has been deleted.');
      router.push('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      showToastMessage(`Failed to delete account: ${error.message}`, 'error');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Audio reconstruction helpers
  const reconstructSessionAudio = async (sessionId: string) => {
    if (userSubscriptionStatus !== 'grounded') {
      showToastMessage('Audio reconstruction is only available for Grounded users.', 'error');
      return;
    }
    setAudioReconstructionStatus(prev => ({ ...prev, [sessionId]: { status: 'PROCESSING', lastChecked: Date.now() } }));
    try {
      const { data: sessionData, error: sessionError } = await supabase.from('chat_sessions').select('chat_group_id, hume_chat_id').eq('id', sessionId).single();
      if (sessionError) throw sessionError;
      const apiUrl = sessionData.chat_group_id ? '/api/hume/reconstruct-audio-group' : '/api/hume/reconstruct-audio';
      const requestBody = sessionData.chat_group_id ? { chatGroupId: sessionData.chat_group_id } : { chatId: sessionData.hume_chat_id };
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to start audio reconstruction');
      showToastMessage('Audio reconstruction started.');
    } catch (error) {
      console.error('Error reconstructing session audio:', error);
      setAudioReconstructionStatus(prev => ({ ...prev, [sessionId]: { status: 'ERROR', lastChecked: Date.now() } }));
      showToastMessage('Failed to reconstruct audio.', 'error');
    }
  };

  const checkReconstructionStatus = async (sessionId: string) => {
    const currentStatus = audioReconstructionStatus[sessionId];
    if (!currentStatus || ['COMPLETE', 'ERROR', 'NO_AUDIO'].includes(currentStatus.status)) return;
    if (currentStatus.lastChecked && Date.now() - currentStatus.lastChecked < 30000) return;
    await reconstructSessionAudio(sessionId);
  };

  const downloadAudio = (sessionId: string) => {
    const status = audioReconstructionStatus[sessionId];
    if (status?.status === 'COMPLETE' && status.downloadUrl) {
      const a = document.createElement('a');
      a.href = status.downloadUrl;
      a.download = `audio_session_${sessionId.slice(0,8)}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const showAudioInfo = (sessionId: string) => {
    setAudioInfoModalSessionId(sessionId);
    setShowAudioInfoModal(true);
  };

  const startAudioReconstruction = () => {
    if (audioInfoModalSessionId) {
      setShowAudioInfoModal(false);
      reconstructSessionAudio(audioInfoModalSessionId);
      setAudioInfoModalSessionId(null);
    }
  };

  const AudioInfoModal = () => {
    if (!showAudioInfoModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-md w-full p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Audio Reconstruction</h2>
          <p className="text-sm text-muted-foreground">We can recreate the audio from your voice therapy session using Hume's AI technology.</p>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAudioInfoModal(false)}>Cancel</Button>
            <Button onClick={startAudioReconstruction}>Start Reconstruction</Button>
          </div>
        </div>
      </div>
    );
  };
  // === End helper functions ===

  useEffect(() => {
    // Poll audio reconstruction status every 30 seconds
    const interval = setInterval(() => {
      Object.entries(audioReconstructionStatus).forEach(([id, info]) => {
        if (info.status && !['COMPLETE', 'ERROR', 'NO_AUDIO'].includes(info.status)) {
          checkReconstructionStatus(id);
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [audioReconstructionStatus]);

  // Add change password function after other helper functions
  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToastMessage('New passwords do not match.', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToastMessage('Password must be at least 6 characters long.', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      showToastMessage('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      showToastMessage(`Failed to change password: ${error.message}`, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Sidebar navigation items
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      active: activeSection === 'overview'
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: MessageSquare,
      active: activeSection === 'sessions',
      badge: chatSessions.length.toString()
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      active: activeSection === 'analytics',
      premium: userSubscriptionStatus === 'calm'
    },
    {
      id: 'voice',
      label: 'Voice Settings',
      icon: Volume2,
      active: activeSection === 'voice'
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      active: activeSection === 'account'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`bg-card border-r border-border transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-full flex flex-col">
          {/* Logo & Brand */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-semibold text-foreground">TalkAI</h1>
                  <p className="text-xs text-muted-foreground">
                    {userProfile?.full_name ? `${userProfile.full_name} - Dashboard` : 'Dashboard'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              {!sidebarCollapsed && 'Platform'}
            </div>
            
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  disabled={item.premium}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : item.premium
                      ? 'text-muted-foreground cursor-not-allowed'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.premium && (
                        <span className="text-xs text-amber-600 font-medium">PRO</span>
                      )}
                    </>
                  )}
                </button>
              );
            })}

            {/* Referral Section - positioned right after navigation items */}
            {!sidebarCollapsed && (
              <div className="mt-4">
                              <ReferralInvite 
                referralCode={userProfile?.referral_code || null} 
                minutesPerReward={15} 
                minutesBalance={userProfile?.minutes_balance || 0} 
                referralsCount={referralsCount}
                variant="sidebar"
              />
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userProfile?.full_name?.[0] || userProfile?.email?.[0] || 'U'}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {userProfile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {getSubscriptionDisplayName(userSubscriptionStatus)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {userProfile?.full_name || 'there'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/sessions">
                <Button className="bg-primary hover:bg-primary/90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="hidden md:inline-flex">Admin Panel</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto bg-background">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button 
                  onClick={() => setActiveSection('sessions')}
                  className="bg-card p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors w-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold text-foreground">{chatSessions.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </button>

                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold text-foreground">{usageStats.sessionsThisMonth}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                      <p className="text-2xl font-bold text-foreground">{formatDuration(usageStats.durationThisMonth)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                      <p className="text-2xl font-bold text-foreground">{getSubscriptionDisplayName(userSubscriptionStatus)}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Session Stats */}
                <div className="bg-card p-4 sm:p-6 rounded-xl border border-border flex flex-col">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">Session Stats</h2>
                  <div className="space-y-2 flex-1">
                    <p className="text-sm sm:text-base text-foreground">Total Sessions: {therapySessions.length}</p>
                    <p className="text-sm sm:text-base text-foreground">Last Session: {therapySessions[0] ? new Date(therapySessions[0].created_at).toLocaleDateString() : 'Never'}</p>
                    <p className="text-sm sm:text-base text-foreground">Total Duration: {formatDuration(therapySessions.reduce((acc, s) => acc + (s.duration || 0), 0))}</p>
                    {therapySessions[0]?.chat_sessions && (
                      <p className="text-xs sm:text-sm text-muted-foreground">Last Summary: {therapySessions[0].chat_sessions.summary || 'N/A'}</p>
                    )}
                  </div>
                  <div className="pt-4 mt-auto">
                    <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">Start Therapy Session</Link>
                  </div>
                </div>

                {/* Therapist Information */}
                <div className="bg-card p-4 sm:p-6 rounded-xl border border-border flex flex-col">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">Therapist</h2>
                  <div className="space-y-2 flex-1">
                    <p className="text-sm sm:text-base text-foreground">
                      Default Therapist: {defaultAgentName}
                    </p>
                    <p className="text-sm sm:text-base text-foreground">
                      Most Used: {agentAnalytics?.mostUsedAgent?.characterName || 'Not Available'}
                      {agentAnalytics?.mostUsedAgent && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({agentAnalytics.mostUsedAgent.sessionCount} sessions)
                        </span>
                      )}
                    </p>
                    <p className="text-sm sm:text-base text-foreground">
                      Available Therapists: {availableTherapistCount}
                    </p>
                  </div>
                </div>

                {/* Emotional Insights */}
                <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">Emotional Insights</h2>
                  <p className="text-sm sm:text-base mb-2 text-foreground">Total Emotions Tracked: {emotionMetrics.length}</p>
                  <p className="text-sm sm:text-base text-foreground">Average Intensity: {(emotionMetrics.reduce((acc, m) => acc + m.intensity, 0) / Math.max(emotionMetrics.length, 1)).toFixed(2)}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/chat">
                    <div className="p-4 border border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Start New Session</h4>
                          <p className="text-sm text-muted-foreground">Begin a new therapy conversation</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <button 
                    onClick={() => setActiveSection('voice')}
                    className="p-4 border border-border rounded-lg hover:border-purple-500/30 hover:bg-purple-500/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Voice Settings</h4>
                        <p className="text-sm text-muted-foreground">Customize your therapy voice</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveSection('analytics')}
                    className="p-4 border border-border rounded-lg hover:border-green-500/30 hover:bg-green-500/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">View Analytics</h4>
                        <p className="text-sm text-muted-foreground">Track your progress</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Sessions */}
              {chatSessions.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Recent Sessions</h3>
                    <button 
                      onClick={() => setActiveSection('sessions')}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {chatSessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{session.title}</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(session.created_at)}</p>
                        </div>
                        <button
                          onClick={() => handleResumeSession(session.id)}
                          disabled={resumingSessionId === session.id}
                          className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 disabled:opacity-50"
                        >
                          {resumingSessionId === session.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Resume'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'sessions' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Your Sessions</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{chatSessions.length} total</span>
                    {userSubscriptionStatus === 'grounded' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => downloadAllSessionsData('json')}>Download JSON</Button>
                        <Button size="sm" variant="outline" onClick={() => downloadAllSessionsData('csv')}>Download CSV</Button>
                      </>
                    )}
                  </div>
                </div>
                
                {chatSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-foreground mb-2">No sessions yet</h4>
                    <p className="text-muted-foreground mb-4">Start your first therapy session to begin your journey</p>
                    <Link href="/chat">
                      <Button>Start First Session</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatSessions.map((session) => (
                      <div key={session.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-1">{session.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{session.summary}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(session.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleResumeSession(session.id)}
                              disabled={resumingSessionId === session.id}
                              className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 disabled:opacity-50"
                            >
                              {resumingSessionId === session.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Resume'
                              )}
                            </button>
                            {userSubscriptionStatus === 'grounded' && (
                              <>
                              <button
                                onClick={() => downloadSessionData(session.id)}
                                  className="px-2 py-1 text-sm bg-green-500/10 text-green-500 rounded-md hover:bg-green-500/20"
                              >
                                  Download
                              </button>
                                <button
                                  onClick={() => showAudioInfo(session.id)}
                                  className="px-2 py-1 text-sm bg-purple-500/10 text-purple-500 rounded-md hover:bg-purple-500/20"
                                >
                                  Audio
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="space-y-6">
              {/* Session Trends Chart */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Session Trends</h3>
                  {sessionTrends.length > 0 && (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sessionTrends}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sessions" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

              {/* Progress Metrics - moved here from bottom */}
              {sessionTrends.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Progress Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-foreground"><span className="font-medium">Total Sessions:</span> {sessionTrends.reduce((s, t) => s + t.sessions, 0)}</div>
                    <div className="text-foreground"><span className="font-medium">Total Duration:</span> {Math.round(sessionTrends.reduce((s, t) => s + t.duration, 0) / 60)} min</div>
                    <div className="text-foreground"><span className="font-medium">Avg Sessions/Day:</span> {(sessionTrends.reduce((s, t) => s + t.sessions, 0) / Math.max(sessionTrends.length, 1)).toFixed(1)}</div>
                    <div className="text-foreground"><span className="font-medium">Avg Duration/Day:</span> {Math.round(sessionTrends.reduce((s, t) => s + t.duration, 0) / Math.max(sessionTrends.length, 1) / 60)} min</div>
                  </div>
                  {sessionTrends.filter(t => t.sessions > 0).length >= 20 && (
                    <div className="mt-4 flex justify-center"><ConfettiHeart /></div>
              )}
            </div>
          )}

              {/* Top Emotions Chart */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Top Emotions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={processedTopEmotions}>
                        <XAxis dataKey="emotion" tick={{ fontSize: 12 }} interval={0} />
                        <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Intensity']} />
                        <Bar dataKey="intensity" fill="#8884d8" radius={[4, 4, 0, 0]} />
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
                              <Cell key={`cell-${index}`} fill={['#f3b885', '#c8e3b9', '#fdeaba', '#97cad2', '#f0aba7'][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Intensity']} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No emotion data available
                  </div>
                    )}
                </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'voice' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Voice Configuration</h3>
                <div className="space-y-6">
                  {/* Current Voice Display */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Current Voice</h4>
                    {selectedVoice ? (
                      <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Volume2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h5 className="font-medium text-foreground">{selectedVoice.display_name}</h5>
                            <p className="text-sm text-muted-foreground">{selectedVoice.description}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-muted-foreground">No voice selected</p>
                      </div>
                    )}
                  </div>

                  {/* Voice Settings Button */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Change Voice</h4>
                    <VoiceSettings 
                      onVoiceChange={handleVoiceChange}
                      className="w-full bg-primary hover:bg-primary/90"
                    />
                  </div>
                </div>

                {/* Subscription Info */}
                {userSubscriptionStatus !== 'grounded' && (
                  <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" />
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        <span className="font-medium">Upgrade for more voices:</span> Access {totalVoicesCount - getAvailableVoicesCount(userSubscriptionStatus, voiceGroups)} additional character voices with higher plans.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <div className="p-3 bg-muted rounded-lg text-foreground">
                      {userProfile?.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <div className="p-3 bg-muted rounded-lg text-foreground">
                      {userProfile?.full_name || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
                <div className="space-y-4">
                  {!showChangePassword ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Password</p>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline" onClick={() => setShowChangePassword(true)}>
                        Change Password
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter new password"
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Confirm new password"
                          minLength={6}
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowChangePassword(false);
                            setPasswordForm({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                          disabled={isChangingPassword}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={changePassword}
                          disabled={isChangingPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                        >
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription Information */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Subscription</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{getSubscriptionDisplayName(userSubscriptionStatus)} Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {usageStats.sessionsThisMonth} sessions this month
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/subscription">
                      <Button variant="outline">Manage Subscription</Button>
                    </Link>
                    <Button variant="outline" onClick={() => setShowPlanComparison(!showPlanComparison)}>
                      {showPlanComparison ? 'Hide Plans' : 'Compare Plans'}
                    </Button>
                  </div>
                </div>
                {/* Plan comparison moved here */}
                {showPlanComparison && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {allPlans.map((plan) => {
                      const currentPlanName = userSubscriptionStatus.charAt(0).toUpperCase() + userSubscriptionStatus.slice(1);
                      const isCurrent = currentPlanName === plan.name;
                      const limits = getSubscriptionLimits(plan.name);
                      return (
                        <div key={plan.id} className={`p-4 rounded-lg border-2 transition-all ${isCurrent ? 'border-primary bg-primary/5' : 'border-border hover:border-border/60'}`}>
                          <div className="text-center">
                            <h4 className="font-semibold text-lg text-foreground">{plan.name}</h4>
                            <p className="text-2xl font-bold text-primary">${(plan.price_amount / 100).toFixed(2)}<span className="text-sm text-muted-foreground">/mn</span></p>
                          </div>
                          <div className="mt-4 space-y-2 text-sm">
                            <p className="text-foreground"><span className="font-medium">Sessions:</span> {limits.sessionsLimit === 999 ? 'Unlimited' : limits.sessionsLimit}</p>
                            <p className="text-foreground"><span className="font-medium">Duration:</span> {formatDuration(limits.durationLimit)}</p>
                            <div>
                              <span className="font-medium text-foreground">Features:</span>
                              <ul className="list-disc list-inside mt-1 text-xs text-muted-foreground">
                                {plan.features.map((f, idx) => <li key={idx}>{f}</li>)}
                              </ul>
                            </div>
                          </div>
                          {isCurrent ? (
                            <div className="mt-4 text-center"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">Current Plan</span></div>
                          ) : (
                            <div className="mt-4"><Link href={plan.stripe_price_id ? `/subscription?plan=${plan.stripe_price_id}` : '/subscription'} className="inline-flex w-full items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm font-medium">{plan.price_amount === 0 ? 'Switch' : 'Upgrade'}</Link></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Therapist Settings */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Therapist Settings</h3>
                <TherapistSettings 
                  onNameChange={handleTherapistNameChange}
                />
              </div>

              {/* Data & Privacy */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Data & Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Data Saving</p>
                      <p className="text-sm text-muted-foreground">Save session data for progress tracking</p>
                    </div>
                    <button
                      onClick={() => updateDataSavingPreference(!userProfile?.data_saving_preference)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        userProfile?.data_saving_preference ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-background transition ${
                          userProfile?.data_saving_preference ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-card rounded-xl border border-red-200 dark:border-red-800 p-6">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => deleteAllUserSessions()}
                    className="w-full text-left p-3 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-300">Delete All Sessions</p>
                        <p className="text-sm text-red-600 dark:text-red-400">Permanently remove all therapy session data</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => deleteUserAccount()}
                    className="w-full text-left p-3 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-300">Delete Account</p>
                        <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Sessions Modal */}
      <Dialog open={showDeleteSessionsModal} onOpenChange={setShowDeleteSessionsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Sessions</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all your therapy sessions? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleteConfirm"
                checked={deleteSessionsConfirmed}
                onChange={(e) => setDeleteSessionsConfirmed(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="deleteConfirm" className="text-sm">
                I understand this will permanently delete all my session data
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteSessionsModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteAllUserSessions()}
              disabled={!deleteSessionsConfirmed || isDeletingSessions}
            >
              {isDeletingSessions ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete All Sessions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteAccountModal} onOpenChange={setShowDeleteAccountModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This will permanently remove all your data including sessions, preferences, and subscription information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="accountDeleteConfirm"
                checked={deleteAccountConfirmed}
                onChange={(e) => setDeleteAccountConfirmed(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="accountDeleteConfirm" className="text-sm">
                I understand this will permanently delete my account and all associated data
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteAccountModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteUserAccount()}
              disabled={!deleteAccountConfirmed || isDeletingAccount}
            >
              {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast and Audio Modal */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <AudioInfoModal />
    </div>
  );
} 