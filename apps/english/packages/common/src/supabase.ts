import { createClient } from '@supabase/supabase-js';

// Environment variables will be handled differently in web vs mobile
// Web: NEXT_PUBLIC_* variables
// Mobile: Expo Constants or environment-specific config
const getSupabaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Web environment
    return process.env.NEXT_PUBLIC_SUPABASE_URL!;
  } else {
    // Mobile environment - will be configured via Expo Constants
    return process.env.EXPO_PUBLIC_SUPABASE_URL!;
  }
};

const getSupabaseAnonKey = () => {
  if (typeof window !== 'undefined') {
    // Web environment
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  } else {
    // Mobile environment - will be configured via Expo Constants
    return process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
  }
};

export const supabase = createClient(
  getSupabaseUrl(),
  getSupabaseAnonKey()
);

export default supabase; 