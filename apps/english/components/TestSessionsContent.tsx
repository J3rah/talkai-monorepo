"use client";

import { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import { VoiceProvider } from "./VoiceProvider";
import dynamic from "next/dynamic";

const TestChat = dynamic(() => import("@/components/TestChat"), {
  ssr: false,
});

const TrialChat = dynamic(() => import("@/components/TrialChat"), {
  ssr: false,
});

const TestStartCall = dynamic(() => import("@/components/TestStartCall"), {
  ssr: false,
});

interface TestSessionsContentProps {
  isTrialMode: boolean;
  accessToken: string | null;
}

export default function TestSessionsContent({ isTrialMode, accessToken }: TestSessionsContentProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);

  // A single, reliable listener: Supabase always fires INITIAL_SESSION on mount.
  useEffect(() => {
    const fallback = setTimeout(() => {
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 8000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('TestSessionsContent: onAuthStateChange fired – user present?', !!session?.user);
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);

      // If we received a definitive auth state, clear the fallback timer so it doesn't overwrite.
      clearTimeout(fallback);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium">🧪 TEST: Checking authentication...</p>
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            This is the test sessions page. You can modify this without affecting the main /sessions page.
          </p>
        </div>
      </div>
    );
  }

  // If trial mode, show trial chat with TestStartCall
  if (isTrialMode) {
    return (
      <div className={"grow flex flex-col"}>
        <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-b border-blue-300 dark:border-blue-700">
          <p className="text-blue-800 dark:text-blue-200 text-center font-medium">
            🧪 <strong>TEST TRIAL MODE:</strong> New 2-Screen Flow | Free 5-Minute Trial
          </p>
        </div>
        <VoiceProvider auth={{ type: 'accessToken', value: accessToken ?? "" }}>
          <TestStartCall 
            onVoiceSelect={(configId: string) => {
              console.log('TestSessionsContent (Trial): Voice selected:', configId);
            }}
            onTherapistNameChange={(name: string) => {
              console.log('TestSessionsContent (Trial): Therapist name changed:', name);
            }}
            onSessionStart={() => {
              console.log('TestSessionsContent (Trial): Session started');
              setSessionStarted(true);
            }}
            hideAfterSessionStart={true}
            sessionStarted={sessionStarted}
          />
          <TrialChat accessToken={accessToken ?? ""} />
        </VoiceProvider>
      </div>
    );
  }

  // If not authenticated and not in trial mode, show auth required
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            🧪 TEST SESSIONS - Authentication Required
          </p>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-lg mb-6">Please sign in to start a test session.</p>
        <div className="space-y-4">
          <a href="/auth?returnTo=/test-sessions" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Sign In
          </a>
          <br />
          <a href="/test-sessions?trial=true" className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Try Test Trial Mode Instead
          </a>
          <br />
          <button 
            onClick={() => window.location.reload()} 
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            🔄 Refresh Page
          </button>
          <br />
          <button 
            onClick={async () => {
              console.log('TestSessionsContent: Manual auth check triggered');
              const { data: { session } } = await supabase.auth.getSession();
              const { data: { user } } = await supabase.auth.getUser();
              console.log('TestSessionsContent: Manual check results:', { 
                hasSession: !!session?.user, 
                hasUser: !!user,
                session: session,
                user: user
              });
              if (session?.user || user) {
                window.location.reload();
              }
            }} 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔍 Check Auth Status
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border">
          <h3 className="font-medium mb-2">🛠️ Development Notes:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• This page mirrors the main /sessions page</li>
            <li>• Safe to modify without affecting production</li>
            <li>• Test new features and UI changes here first</li>
            <li>• Links point to test-sessions instead of sessions</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300">
          <h3 className="font-medium mb-2 text-blue-800 dark:text-blue-200">🐛 Debug Info:</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>• Auth State: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
            <p>• Loading State: {isLoading ? '🔄 Loading...' : '✅ Loaded'}</p>
            <p>• Trial Mode: {isTrialMode ? '✅ Yes' : '❌ No'}</p>
            <p>• Access Token: {accessToken ? '✅ Present' : '❌ Missing'}</p>
          </div>
        </div>
      </div>
    );
  }

  // If no access token, show error
  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            🧪 TEST SESSIONS - Connection Issue
          </p>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Unable to Start Test Session</h1>
        <p className="text-lg mb-6">There was an issue connecting to the voice service. Please try again.</p>
        <a href="/test-sessions" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Retry Test Session
        </a>
      </div>
    );
  }

  // Authenticated user with access token - show TestStartCall + Chat component
  return (
    <div className={"grow flex flex-col"}>
      <div className="p-3 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900 dark:to-orange-900 border-b border-purple-300 dark:border-purple-700">
        <p className="text-purple-800 dark:text-purple-200 text-center font-medium">
          🧪 <strong>TEST SESSION:</strong> New 2-Screen Typeform-Style Flow | Purple Theme
        </p>
      </div>
      <VoiceProvider auth={{ type: 'accessToken', value: accessToken }}>
        <TestStartCall 
          onVoiceSelect={(configId: string) => {
            console.log('TestSessionsContent: Voice selected:', configId);
          }}
          onTherapistNameChange={(name: string) => {
            console.log('TestSessionsContent: Therapist name changed:', name);
          }}
          onSessionStart={() => {
            console.log('TestSessionsContent: Session started, showing Chat component');
            setSessionStarted(true);
          }}
          hideAfterSessionStart={true}
          sessionStarted={sessionStarted}
          accessToken={accessToken ?? ""}
        />
        
        {/* Show TestChat component after session starts */}
        {sessionStarted && (
          <TestChat accessToken={accessToken ?? ""} />
        )}
      </VoiceProvider>
    </div>
  );
}
