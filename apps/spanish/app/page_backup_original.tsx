import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import React from "react";
import AutoReload from "@/components/AutoReload";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

const TrialChat = dynamic(() => import("@/components/TrialChat"), {
  ssr: false,
});

const LandingPage = dynamic(() => import("@/components/LandingPage"), {
  ssr: false,
});

export default async function Page({
  searchParams,
}: {
  searchParams: { trial?: string };
}) {
  const isTrialMode = searchParams.trial === 'true';
  
  // Check authentication
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;
  
  // Always try to get access token, but don't redirect if it fails in trial mode
  let accessToken: string | null = null;
  try {
    accessToken = await getHumeAccessToken();
  } catch (error) {
    console.error('Error getting access token:', error);
  }

  // If trial mode, show trial chat with conditional header
  if (isTrialMode) {
    return (
      <>
        <AutoReload />
        <div className={"grow flex flex-col"}>
          <TrialChat accessToken={accessToken} />
        </div>
      </>
    );
  }

  // If no access token and not in trial mode, show landing page
  if (!accessToken) {
    return <>
      <AutoReload />
      <LandingPage isAuthenticated={isAuthenticated} />
    </>;
  }

  // Regular authenticated session
  return (
    <>
      <AutoReload />
      <div className={"grow flex flex-col"}>
        <Chat accessToken={accessToken} />
      </div>
    </>
  );
} 