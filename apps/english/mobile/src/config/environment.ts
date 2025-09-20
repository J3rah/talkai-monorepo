// Environment configuration for the mobile app
export const ENV = {
  // Supabase configuration
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // Hume AI configuration
  HUME_API_KEY: process.env.EXPO_PUBLIC_HUME_API_KEY || '',
  HUME_SECRET_KEY: process.env.EXPO_PUBLIC_HUME_SECRET_KEY || '',
  
  // OpenAI configuration (if needed)
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  
  // Backend configuration
  BACKEND_BASE_URL: process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000',
  
  // App configuration
  APP_NAME: 'talkAI Mobile',
  APP_VERSION: '1.0.0',
};

// Validation function to check if required environment variables are set
export const validateEnvironment = (): { isValid: boolean; missing: string[] } => {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'HUME_API_KEY',
  ];
  
  const missing: string[] = [];
  
  required.forEach(key => {
    if (!ENV[key as keyof typeof ENV]) {
      missing.push(key);
    }
  });
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};

// Helper function to get environment variable with fallback
export const getEnvVar = (key: keyof typeof ENV, fallback?: string): string => {
  const value = ENV[key];
  if (!value && fallback === undefined) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || fallback || '';
};

// Development mode check
export const isDevelopment = __DEV__;

// Production mode check
export const isProduction = !__DEV__;
