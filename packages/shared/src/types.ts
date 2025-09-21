// Shared types for talkAI applications

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  subscription_status?: string;
  subscription_plan?: string;
  subscription_end_date?: string;
  trial_end_date?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  preferred_language?: 'en' | 'es';
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  status: 'active' | 'completed' | 'cancelled';
  started_at: string;
  ended_at?: string;
  last_activity: string;
  hume_chat_group_id?: string;
  session_type?: 'trial' | 'premium';
  voice_config_id?: string;
  agent_name?: string;
  character_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  minutes_per_month: number;
  features: string[];
  stripe_price_id: string;
}

export interface LocaleConfig {
  code: 'en' | 'es';
  name: string;
  flag: string;
  currency: string;
  emergency_number: string;
  compliance: 'GDPR' | 'CCPA';
}

export const LOCALES: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    currency: 'USD',
    emergency_number: '988',
    compliance: 'CCPA'
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    currency: 'EUR',
    emergency_number: '112',
    compliance: 'GDPR'
  }
};
