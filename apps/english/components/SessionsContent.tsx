"use client";

import { useEffect, useState, useRef } from "react";
import supabase from "@/supabaseClient";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

const TrialChat = dynamic(() => import("@/components/TrialChat"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-lg">Loading trial session...</p>
    </div>
  )
});

interface SessionsContentProps {
  isTrialMode: boolean;
  accessToken: string | null;
}

export default function SessionsContent({ isTrialMode, accessToken }: SessionsContentProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Simple, fast auth check without retries - since user reached this page via authenticated route
    const quickAuthCheck = async () => {
      try {
        // Use a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth check timeout')), 3000)
        );
        
        const authPromise = supabase.auth.getSession();
        const { data: { session }, error } = await Promise.race([authPromise, timeoutPromise]) as any;
        
        if (!isMounted) return;
        
        // If we have a session OR if this times out, assume authenticated 
        // (since user got here via authenticated button click)
        setIsAuthenticated(!!session?.user);
        
      } catch (err) {
        if (!isMounted) return;
        // If auth check fails/times out, assume authenticated since user reached this protected page
        setIsAuthenticated(true);
      }
    };

    quickAuthCheck();

    // Listen for explicit sign-out only
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Checking authentication...</p>
        <p className="text-sm text-muted-foreground mt-2">Starting session...</p>
      </div>
    );
  }

  // If trial mode, show trial chat
  if (isTrialMode) {
    return (
      <div className={"grow flex flex-col"}>
        <ErrorBoundary fallback={
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Trial Session Error</h1>
            <p className="text-lg mb-6">There was an issue loading the trial session. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        }>
          <TrialChat accessToken={accessToken ?? ""} />
        </ErrorBoundary>
      </div>
    );
  }

  // If not authenticated and not in trial mode, show auth required
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-lg mb-6">Please sign in to start a session.</p>
        <div className="space-y-4">
          <a href="/auth" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign In
          </a>
          <br />
          <a href="/sessions?trial=true" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Try 5-Minute Trial Instead
          </a>
        </div>
      </div>
    );
  }

  // If no access token, show error
  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Unable to Start Session</h1>
        <p className="text-lg mb-6">There was an issue connecting to the voice service. Please try again.</p>
        <a href="/sessions" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retry
        </a>
      </div>
    );
  }

  // Authenticated user with access token - show Chat component
  const Chat = dynamic(() => import("@/components/Chat"), {
    ssr: false,
  });

  return (
    <div className={"grow flex flex-col"}>
      <Chat accessToken={accessToken} />
    </div>
  );
} 