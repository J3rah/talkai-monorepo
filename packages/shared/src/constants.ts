// Shared constants for talkAI

export const SUBSCRIPTION_PLANS = {
  en: {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'month' as const,
      minutes_per_month: 30,
      features: [
        '30 minutes per month',
        'Basic AI therapy sessions',
        'Email support'
      ]
    },
    standard: {
      id: 'standard',
      name: 'Standard',
      price: 12.99,
      currency: 'USD',
      interval: 'month' as const,
      minutes_per_month: 120,
      features: [
        '120 minutes per month',
        'Advanced AI therapy',
        'Priority support',
        'Session history'
      ]
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      currency: 'USD',
      interval: 'month' as const,
      minutes_per_month: 300,
      features: [
        '300 minutes per month',
        'Premium AI therapy',
        '24/7 support',
        'Advanced analytics',
        'Custom therapist voices'
      ]
    }
  },
  es: {
    free: {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      currency: 'EUR',
      interval: 'month' as const,
      minutes_per_month: 30,
      features: [
        '30 minutos por mes',
        'Sesiones básicas de terapia IA',
        'Soporte por email'
      ]
    },
    standard: {
      id: 'standard',
      name: 'Estándar',
      price: 12.99,
      currency: 'EUR',
      interval: 'month' as const,
      minutes_per_month: 120,
      features: [
        '120 minutos por mes',
        'Terapia IA avanzada',
        'Soporte prioritario',
        'Historial de sesiones'
      ]
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      currency: 'EUR',
      interval: 'month' as const,
      minutes_per_month: 300,
      features: [
        '300 minutos por mes',
        'Terapia IA premium',
        'Soporte 24/7',
        'Análisis avanzados',
        'Voces de terapeuta personalizadas'
      ]
    }
  }
};

export const HUME_VOICE_CONFIGS = {
  en: {
    male: process.env.NEXT_PUBLIC_HUME_MALE_CONFIG_ID,
    female: process.env.NEXT_PUBLIC_HUME_FEMALE_CONFIG_ID,
    male_calm: process.env.NEXT_PUBLIC_HUME_MALE_CALM_CONFIG_ID,
    female_calm: process.env.NEXT_PUBLIC_HUME_FEMALE_CALM_CONFIG_ID,
    male_professional: process.env.NEXT_PUBLIC_HUME_MALE_PROFESSIONAL_CONFIG_ID,
    female_professional: process.env.NEXT_PUBLIC_HUME_FEMALE_PROFESSIONAL_CONFIG_ID,
  },
  es: {
    male: process.env.NEXT_PUBLIC_HUME_SPANISH_MALE_CONFIG_ID,
    female: process.env.NEXT_PUBLIC_HUME_SPANISH_FEMALE_CONFIG_ID,
    male_calm: process.env.NEXT_PUBLIC_HUME_SPANISH_MALE_CALM_CONFIG_ID,
    female_calm: process.env.NEXT_PUBLIC_HUME_SPANISH_FEMALE_CALM_CONFIG_ID,
    male_professional: process.env.NEXT_PUBLIC_HUME_SPANISH_MALE_PROFESSIONAL_CONFIG_ID,
    female_professional: process.env.NEXT_PUBLIC_HUME_SPANISH_FEMALE_PROFESSIONAL_CONFIG_ID,
  }
};

export const API_ENDPOINTS = {
  auth: '/api/auth',
  chat: '/api/agent/chat',
  subscription: '/api/verify-subscription',
  checkout: '/api/create-checkout-session',
  cancel: '/api/cancel-subscription',
  webhooks: {
    stripe: '/api/webhooks/stripe'
  }
};
