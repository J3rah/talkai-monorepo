import supabase from '@/supabaseClient';

interface TrialSessionData {
  sessionId: string;
  trialLength: number;
  voiceSelected?: string;
  therapistName?: string;
  trialVariant?: string;
  landingPageVariant?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  userAgent?: string;
}

interface TrialEventData {
  trialSessionId: string;
  eventType: string;
  eventData?: any;
  timestampInTrial: number;
}

// Generate a browser fingerprint for trial tracking
const generateBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

export class TrialTracker {
  private static instance: TrialTracker;
  private sessionId: string;
  private startTime: number;
  private trialLength: number;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private browserFingerprint: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.trialLength = 300; // Default 5 minutes
    this.browserFingerprint = generateBrowserFingerprint();
  }

  static getInstance(): TrialTracker {
    if (!TrialTracker.instance) {
      TrialTracker.instance = new TrialTracker();
    }
    return TrialTracker.instance;
  }

  private generateSessionId(): string {
    return `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check if user has already used their trial
  async hasUsedTrial(): Promise<boolean> {
    try {
      console.log('TrialTracker: Checking if trial has been used...');
      
      // Check localStorage first
      const localTrialUsed = localStorage.getItem('trial_used');
      if (localTrialUsed) {
        console.log('TrialTracker: Trial already used (localStorage)');
        return true;
      }

      console.log('TrialTracker: Checking database with fingerprint:', this.browserFingerprint);

      // Check database by browser fingerprint with timeout
      // Soft timeout - if DB is slow, fail open (allow trial) without throwing
      const timeoutPromise = new Promise<{ data?: any; error?: any }>((resolve) => {
        setTimeout(() => resolve({ data: null, error: null }), 5000);
      });

      const queryPromise = supabase
        .from('trial_sessions')
        .select('id, trial_started')
        .eq('browser_fingerprint', this.browserFingerprint)
        .eq('trial_started', true)
        .limit(1);

      const { data, error } = await Promise.race([queryPromise as any, timeoutPromise as any]);

      if (error) {
        console.error('TrialTracker: Error checking trial usage:', error);
        // On error, allow trial to proceed (fail open)
        return false;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        console.log('TrialTracker: Trial already used (database fingerprint match)');
        // Set localStorage to prevent future checks
        localStorage.setItem('trial_used', 'true');
        return true;
      }

      console.log('TrialTracker: No previous trial found, allowing trial');
      return false;
    } catch (error) {
      console.error('TrialTracker: Error checking trial usage:', error);
      // On error, allow trial to proceed (fail open)
      return false;
    }
  }

  // Mark trial as used
  async markTrialAsUsed(): Promise<void> {
    try {
      localStorage.setItem('trial_used', 'true');
      
      // Update the current session to mark trial as started
      await this.updateTrialSession({ 
        trial_started: true,
        browser_fingerprint: this.browserFingerprint
      });
    } catch (error) {
      console.error('Error marking trial as used:', error);
    }
  }

  async initializeTrialSession(data: Partial<TrialSessionData> = {}) {
    // Prevent multiple initialization calls (React strict mode protection)
    if (this.initialized || this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initializeTrialSession(data);
    return this.initializationPromise;
  }

  private async _initializeTrialSession(data: Partial<TrialSessionData> = {}) {
    try {
      // Check if session already exists
      const existingSession = await this.checkSessionExists();
      if (existingSession) {
        console.log('Trial session already exists:', this.sessionId);
        this.initialized = true;
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const trialVariant = await this.getTrialVariant();
      
      const sessionData = {
        session_id: this.sessionId,
        trial_length: data.trialLength || this.trialLength,
        trial_variant: trialVariant,
        landing_page_variant: data.landingPageVariant || 'default',
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        browser_fingerprint: this.browserFingerprint,
        trial_started: false,
        ...data
      };

      const { error } = await supabase
        .from('trial_sessions')
        .insert(sessionData);

      if (error) {
        // If it's a duplicate key error, that's okay - session already exists
        if (error.code === '23505') {
          console.log('Trial session already exists (duplicate key):', this.sessionId);
          this.initialized = true;
          return;
        }
        console.error('Error creating trial session:', error);
        return;
      } else {
        console.log('Trial session initialized:', this.sessionId);
      }

      this.initialized = true;

      // Track initial event only after successful session creation
      await this.trackEvent('trial_initialized', sessionData);
    } catch (error) {
      console.error('Error initializing trial session:', error);
    }
  }

  private async checkSessionExists(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('trial_sessions')
        .select('id')
        .eq('session_id', this.sessionId)
        .maybeSingle();

      if (error) {
        console.error('Error checking session existence:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking session existence:', error);
      return false;
    }
  }

  async trackEvent(eventType: string, eventData?: any) {
    try {
      // Ensure session is initialized before tracking events
      if (!this.initialized) {
        console.warn('Trial session not initialized, skipping event tracking');
        return;
      }

      const trialSessionId = await this.getTrialSessionId();
      if (!trialSessionId) {
        console.warn('No trial session ID found, skipping event tracking');
        return;
      }

      const timestampInTrial = Math.floor((Date.now() - this.startTime) / 1000);
      
      const event = {
        trial_session_id: trialSessionId,
        event_type: eventType,
        event_data: eventData,
        timestamp_in_trial: timestampInTrial
      };

      const { error } = await supabase
        .from('trial_events')
        .insert(event);

      if (error) {
        console.error('Error tracking trial event:', error);
      }
    } catch (error) {
      console.error('Error tracking trial event:', error);
    }
  }

  async trackVoiceSelection(voice: string) {
    await this.trackEvent('voice_selected', { voice });
    await this.updateTrialSession({ voice_selected: voice });
  }

  async trackTherapistNameChange(name: string) {
    await this.trackEvent('therapist_name_changed', { name });
    await this.updateTrialSession({ therapist_name: name });
  }

  async trackTrialStart() {
    await this.trackEvent('trial_started');
    await this.markTrialAsUsed();
  }

  async trackTrialComplete() {
    await this.trackEvent('trial_completed');
    await this.updateTrialSession({ 
      completed_at: new Date().toISOString(),
      duration: Math.floor((Date.now() - this.startTime) / 1000)
    });
  }

  async trackSignupClick() {
    await this.trackEvent('signup_clicked');
  }

  async trackConversion(userId: string) {
    await this.trackEvent('conversion_completed', { userId });
    await this.updateTrialSession({ 
      converted_to_signup: true,
      converted_at: new Date().toISOString(),
      user_id: userId
    });
  }

  async trackTrialExpiry() {
    await this.trackEvent('trial_expired');
    await this.updateTrialSession({ 
      completed_at: new Date().toISOString(),
      duration: this.trialLength
    });
  }

  private async getTrialSessionId(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('trial_sessions')
        .select('id')
        .eq('session_id', this.sessionId)
        .maybeSingle();

      if (error) {
        console.error('Error getting trial session ID:', error);
        return '';
      }

      if (!data) {
        console.warn('No trial session found for session ID:', this.sessionId);
        return '';
      }

      return data.id;
    } catch (error) {
      console.error('Error getting trial session ID:', error);
      return '';
    }
  }

  private async updateTrialSession(updates: any) {
    try {
      const { error } = await supabase
        .from('trial_sessions')
        .update(updates)
        .eq('session_id', this.sessionId);

      if (error) {
        console.error('Error updating trial session:', error);
      }
    } catch (error) {
      console.error('Error updating trial session:', error);
    }
  }

  private async getTrialVariant(): Promise<string> {
    try {
      // Temporarily disable A/B testing for trial length to ensure consistent 5-minute trials
      // Always return default variant with 300 seconds (5 minutes)
      this.trialLength = 300; // Force 5 minutes
      return 'default';
      
      /* A/B testing code - disabled for now
      // Get active trial length A/B test
      const { data: abTest, error } = await supabase
        .from('ab_test_configs')
        .select('variants, traffic_allocation')
        .eq('test_name', 'trial_length')
        .eq('is_active', true)
        .single();

      if (error || !abTest) {
        return 'default';
      }

      // Simple random assignment based on traffic allocation
      const random = Math.random() * 100;
      let cumulative = 0;
      
      for (const [variant, percentage] of Object.entries(abTest.traffic_allocation)) {
        cumulative += percentage as number;
        if (random <= cumulative) {
          // Update trial length based on variant
          const variantConfig = abTest.variants.find((v: any) => v.name === variant);
          if (variantConfig) {
            this.trialLength = variantConfig.duration;
          }
          return variant;
        }
      }

      return 'default';
      */
    } catch (error) {
      console.error('Error getting trial variant:', error);
      // Fallback to 5 minutes on error
      this.trialLength = 300;
      return 'default';
    }
  }

  getTrialLength(): number {
    return this.trialLength;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// Conversion funnel tracking
export const trackConversionStep = async (stepName: string, stepData?: any) => {
  try {
    const tracker = TrialTracker.getInstance();
    
    // Ensure tracker is initialized
    if (!tracker['initialized']) {
      console.warn('Trial tracker not initialized, skipping conversion step tracking');
      return;
    }

    const trialSessionId = await tracker['getTrialSessionId']();
    
    if (!trialSessionId) {
      console.warn('No trial session ID found, skipping conversion step tracking');
      return;
    }

    const timeFromStart = Math.floor((Date.now() - tracker['startTime']) / 1000);

    const { error } = await supabase
      .from('conversion_funnels')
      .insert({
        trial_session_id: trialSessionId,
        step_name: stepName,
        step_data: stepData,
        time_from_start: timeFromStart
      });

    if (error) {
      console.error('Error tracking conversion step:', error);
    }
  } catch (error) {
    console.error('Error tracking conversion step:', error);
  }
}; 