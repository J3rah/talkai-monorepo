"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { VoiceProvider } from "@/components/VoiceProvider";
import Rechat from "@/components/Rechat";
import { getClientAccessToken } from "@/utils/getClientAccessToken";

export default function RechatPage() {
  const params = useParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getClientAccessToken();
        setAccessToken(token);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    fetchAccessToken();
  }, []);

  if (!accessToken) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
      <Rechat
        onVoiceSelect={(configId) => {
          console.log('Selected voice config:', configId);
        }}
        previousSessionId={params.id as string}
      />
    </VoiceProvider>
  );
} 