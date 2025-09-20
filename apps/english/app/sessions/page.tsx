import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import React from "react";
import AutoReload from "@/components/AutoReload";

// Client component for auth-aware sessions
const SessionsContent = dynamic(() => import("@/components/SessionsContent"));

export default async function SessionsPage({
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
      <SessionsContent 
        isTrialMode={isTrialMode} 
        accessToken={accessToken} 
      />
    </>
  );
} 