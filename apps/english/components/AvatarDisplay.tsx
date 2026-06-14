/**
 * AvatarDisplay.tsx
 * 
 * Drop this into your talkAI frontend at: components/AvatarDisplay.tsx
 */

'use client';

import { useEffect, useRef } from 'react';

interface AvatarDisplayProps {
  liveAvatarSessionToken: string;
  livekitToken: string;
  className?: string;
}

export default function AvatarDisplay({
  liveAvatarSessionToken,
  livekitToken,
  className = '',
}: AvatarDisplayProps) {
  const sdkRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!liveAvatarSessionToken || !livekitToken || initializedRef.current) return;
    if (!containerRef.current) return;

    initializedRef.current = true;

    const initAvatar = async () => {
      try {
        console.log('🎭 Initializing LiveAvatar...');

        // Dynamically import the LiveAvatar Web SDK
        const { LiveAvatarSession } = await import('@heygen/liveavatar-web-sdk');

        // LiveAvatarSession takes (sessionToken, userConfig) as per SDK docs
        const userConfig = {
          voiceChat: false, // Hume handles all voice — avatar is display layer only
          container: containerRef.current!,
        };

        const session = new LiveAvatarSession(liveAvatarSessionToken, userConfig);

        await session.start();
        sdkRef.current = session;
        console.log('✅ LiveAvatar connected and rendering');
      } catch (err) {
        console.error('❌ LiveAvatar initialization failed:', err);
      }
    };

    initAvatar();

    return () => {
      if (sdkRef.current) {
        console.log('🧹 Stopping LiveAvatar');
        sdkRef.current.stop?.();
        sdkRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [liveAvatarSessionToken, livekitToken]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-black ${className}`}
      style={{ aspectRatio: '1 / 1' }}
    >
      {/* Fallback shown while avatar stream loads */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-50 pointer-events-none">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-2">👤</div>
          <p>Connecting avatar...</p>
        </div>
      </div>
    </div>
  );
}
