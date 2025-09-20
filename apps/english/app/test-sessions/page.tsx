import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import React from "react";
import AutoReload from "@/components/AutoReload";

// Client component for auth-aware test sessions
const TestSessionsContent = dynamic(() => import("@/components/TestSessionsContent"));

export default async function TestSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ trial?: string }>;
}) {
  const { trial } = await searchParams;
  const isTrialMode = trial === 'true';
  
  // Always try to get access token
  let accessToken: string | null = null;
  try {
    accessToken = await getHumeAccessToken();
  } catch (error) {
    console.error('Error getting access token:', error);
  }

  return (
    <>
      <AutoReload />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
        {/* Test Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black p-2 text-center font-medium">
          🧪 TEST SESSIONS PAGE - This is a development/testing version
        </div>
        <TestSessionsContent 
          isTrialMode={isTrialMode} 
          accessToken={accessToken} 
        />
      </div>
    </>
  );
}
