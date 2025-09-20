"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import supabase from "@/supabaseClient";

export default function AuthAwareButtons() {
  const [authState, setAuthState] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (sessionError) {
          setAuthState(false);
          setIsLoading(false);
          clearTimeout(fallbackTimeout);
          return;
        }
        
        const isAuth = !!session?.user;
        setAuthState(isAuth);
        setIsLoading(false);
        clearTimeout(fallbackTimeout);
        
      } catch (err) {
        if (!isMounted) return;
        setAuthState(false);
        setIsLoading(false);
        clearTimeout(fallbackTimeout);
      }
    };

    // Subscribe first so INITIAL_SESSION captured, then check
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        setAuthState(!!session?.user);
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setAuthState(false);
        setIsLoading(false);
      }
    });

    // Start the auth check immediately
    checkAuth();

    // Only timeout if we're still loading after 3 seconds
    const fallbackTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        setAuthState(false);
        setIsLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking auth
  if (isLoading || authState === null) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Button disabled className="px-8 py-4 text-lg font-semibold bg-white/70 text-blue-600">
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
      <Button asChild className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
        <Link href={authState ? "/sessions" : "/sessions?trial=true"}>
          {authState ? "🚀 Start Session" : "🎯 Start 5-Minute Trial"}
        </Link>
      </Button>
      {!authState && (
        <Button asChild className="px-8 py-4 text-lg font-semibold bg-black text-white hover:text-cyan-300 hover:bg-black/80 shadow-lg hover:shadow-[0_0_12px_0_rgba(34,211,238,0.7)] hover:ring-2 hover:ring-cyan-400 transition-all duration-200
           dark:bg-black dark:text-cyan-300 dark:hover:bg-white dark:hover:text-black dark:hover:border dark:hover:border-white dark:shadow-[0_0_16px_0_rgba(34,211,238,0.7)]">
          <Link href="/subscription">Sign Up for Full Access</Link>
        </Button>
      )}
    </div>
  );
} 