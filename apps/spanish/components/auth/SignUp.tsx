import { useState, useEffect, useRef } from 'react';
import supabase from '../../supabaseClient';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import TurnstileComponent from '../Turnstile';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

interface AuthConfig {
  phoneEnabled: boolean;
  emailEnabled: boolean;
}

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // const [verificationCode, setVerificationCode] = useState('');
  // const [showVerification, setShowVerification] = useState(false);
  const [authConfig, setAuthConfig] = useState<AuthConfig>({ phoneEnabled: false, emailEnabled: true });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    checkAuthConfig();
    // Capture ?ref= code from URL and save for later
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('pendingReferralCode', ref);
    }
  }, []);

  // Cleanup effect for Turnstile
  useEffect(() => {
    return () => {
      // Clear Turnstile token when component unmounts
      setTurnstileToken(null);
      setTurnstileError(null);
    };
  }, []);

  const checkAuthConfig = async () => {
    try {
      // Try to get auth settings from Supabase
      const { data: settings, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking auth config:', error);
        // Default to email only if we can't check
        setAuthConfig({ phoneEnabled: false, emailEnabled: true });
        return;
      }

      // Phone auth check temporarily disabled
      setAuthConfig({ phoneEnabled: false, emailEnabled: true });
    } catch (err) {
      console.error('Error in auth config check:', err);
      setAuthConfig({ phoneEnabled: false, emailEnabled: true });
    }
  };

  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    return {
      score,
      feedback,
      isValid: score >= 4 && password.length >= 8
    };
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-green-400';
    return 'bg-green-600';
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  // Helper to verify Turnstile token server-side
  const verifyTurnstile = async (token: string) => {
    try {
      const res = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      return data.success;
    } catch (error) {
      console.error('❌ Turnstile verification failed:', error);
      return false;
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTurnstileError(null);
    
    console.log('🚀 Starting signup process...');
    
    if (!turnstileToken) {
      console.log('❌ No Turnstile token found');
      setTurnstileError('Please complete the security verification.');
      setLoading(false);
      return;
    }

    const turnstileValid = await verifyTurnstile(turnstileToken);
    if (!turnstileValid) {
      setTurnstileError('Security verification failed. Please try again.');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    const strength = checkPasswordStrength(password);
    if (!strength.isValid) {
      setMessage(`Password is too weak: ${strength.feedback.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      console.log('📡 Calling Supabase signup...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      console.log('📊 Signup response:', { data, error });

      if (error) {
        console.error('❌ Signup error:', error);
        if (error.message.includes('Email')) {
          setMessage('There was an issue with the email service. Please try again later or contact support.');
        } else {
          setMessage(error.message);
        }
      } else if (data) {
        console.log('✅ Signup successful:', data);
        if (data.user && !data.user.email_confirmed_at) {
          setMessage('Please check your email for the confirmation link.');
        } else {
          setMessage('Account created successfully!');
        }

        // Attempt to redeem referral if we have a code and a session token
        const code = referralCode || localStorage.getItem('pendingReferralCode');
        if (code && data.session?.access_token) {
          try {
            const resp = await fetch('/api/referrals/redeem', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.session.access_token}`
              },
              body: JSON.stringify({ referralCode: code })
            });
            const resJson = await resp.json();
            console.log('🎁 Referral redemption response:', resJson);
            if (resp.ok) {
              localStorage.removeItem('pendingReferralCode');
            }
          } catch (redeemErr) {
            console.error('Referral redeem error:', redeemErr);
          }
        }
      } else {
        console.log('⚠️ No data or error returned');
        setMessage('Signup completed, but no response received. Please try logging in.');
      }
    } catch (err) {
      console.error('❌ Signup exception:', err);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {!authConfig.emailEnabled && (
        <div className="p-4 text-center text-red-500">
          Authentication services are currently unavailable. Please try again later.
        </div>
      )}

      <form onSubmit={handleEmailSignUp} className="space-y-4 p-6 bg-card rounded-lg shadow">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
          required
          className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
        />
        <div className="space-y-2">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => handlePasswordChange(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-2 pr-10 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password Strength:</span>
                <span className={`text-sm font-medium ${
                  passwordStrength.score <= 1 ? 'text-red-500' :
                  passwordStrength.score <= 2 ? 'text-orange-500' :
                  passwordStrength.score <= 3 ? 'text-yellow-500' :
                  passwordStrength.score <= 4 ? 'text-green-400' :
                  'text-green-600'
                }`}>
                  {getStrengthText(passwordStrength.score)}
                </span>
              </div>
              
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded ${
                      level <= passwordStrength.score
                        ? getStrengthColor(passwordStrength.score)
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              
              {passwordStrength.feedback.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Requirements needed:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {passwordStrength.isValid && (
                <div className="flex items-center space-x-2 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Password meets all requirements</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="w-full px-3 py-2 pr-10 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <TurnstileComponent
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
          onVerify={(token: string | null) => {
            console.log('🔐 SignUp Turnstile onVerify:', token);
            setTurnstileToken(token);
          }}
          onError={(error: string) => setTurnstileError(error)}
        />
        {turnstileError && <div className="text-red-500 text-sm">{turnstileError}</div>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up with Email'}
        </Button>

        {message && (
          <p className={`text-sm text-center ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
} 