import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // Ensure cookies are properly handled in production
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Add debug logging in development
      debug: process.env.NODE_ENV === 'development'
    }
  }
);

// Add debug logging for production issues
if (process.env.NODE_ENV === 'production') {
  console.log('Supabase client initialized with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export default supabase; 