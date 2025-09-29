import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import React from "react";
import AutoReload from "@/components/AutoReload";

// Client component for auth-aware sessions
const SessionsContent = dynamic(() => import("@/components/SessionsContent"), {
  ssr: false,
});

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: { trial?: string; trial_bypass?: string };
}) {
  const isTrialMode = searchParams.trial === 'true' || searchParams.trial_bypass === 'true';
  
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
      <SessionsContent 
        isTrialMode={isTrialMode} 
        accessToken={accessToken} 
      />
    </>
  );
} 