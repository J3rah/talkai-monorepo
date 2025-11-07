'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HeyGenClient, AvatarExpression, mapEmotionToExpression } from '@/lib/heygenClient';
import { HumeEmotion } from '@/lib/humeClient';
import { cn } from '@/lib/utils';

export interface AvatarPlayerProps {
  heygenClient: HeyGenClient | null;
  currentEmotion?: HumeEmotion[];
  className?: string;
  showFallback?: boolean;
}

export default function AvatarPlayer({
  heygenClient,
  currentEmotion,
  className,
  showFallback = false,
}: AvatarPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastEmotionRef = useRef<AvatarExpression | null>(null);

  // Handle video stream from HeyGen
  useEffect(() => {
    if (!heygenClient || !videoRef.current) return;

    const handleVideoReady = (stream: MediaStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => {
          setIsVideoReady(true);
          setError(null);
        }).catch((err) => {
          console.error('Failed to play video:', err);
          setError('Failed to play video stream');
        });
      }
    };

    const handleError = (err: Error) => {
      console.error('HeyGen error:', err);
      setError(err.message);
      setIsVideoReady(false);
    };

    // Set up HeyGen callbacks
    const config = {
      ...heygenClient,
      onVideoReady: handleVideoReady,
      onError: handleError,
    };

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [heygenClient]);

  // Update avatar expression based on Hume emotions
  useEffect(() => {
    if (!heygenClient || !currentEmotion || currentEmotion.length === 0) return;

    const updateExpression = async () => {
      // Get dominant emotion
      const dominantEmotion = currentEmotion[0];
      const newExpression = mapEmotionToExpression(dominantEmotion.name, dominantEmotion.score);

      // Smooth transition if emotion changed significantly
      if (lastEmotionRef.current) {
        const emotionChanged = lastEmotionRef.current.emotion !== newExpression.emotion;
        const intensityDelta = Math.abs(lastEmotionRef.current.intensity - newExpression.intensity);

        if (emotionChanged || intensityDelta > 0.2) {
          await heygenClient.transitionExpression(
            lastEmotionRef.current,
            newExpression,
            1000 // 1 second transition
          );
        }
      } else {
        await heygenClient.setExpression(newExpression);
      }

      lastEmotionRef.current = newExpression;
    };

    updateExpression().catch(console.error);
  }, [currentEmotion, heygenClient]);

  return (
    <div className={cn('relative w-full aspect-video rounded-lg overflow-hidden bg-black', className)}>
      {/* Main video element */}
      <video
        ref={videoRef}
        className={cn(
          'w-full h-full object-cover avatar-video transition-opacity duration-500',
          isVideoReady ? 'opacity-100' : 'opacity-0'
        )}
        playsInline
        autoPlay
        muted={false}
      />

      {/* Loading state */}
      {!isVideoReady && !error && !showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white text-lg font-medium">Initializing Avatar...</p>
            <p className="text-white/70 text-sm">Connecting to HeyGen streaming service</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900 to-orange-900">
          <div className="text-center space-y-4 p-6">
            <div className="text-6xl">⚠️</div>
            <p className="text-white text-lg font-medium">Avatar Connection Failed</p>
            <p className="text-white/70 text-sm">{error}</p>
            <p className="text-white/60 text-xs">Switching to fallback mode...</p>
          </div>
        </div>
      )}

      {/* Fallback static image/video */}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl">
              🧑‍⚕️
            </div>
            <p className="text-white text-lg font-medium">Voice-Only Mode</p>
            <p className="text-white/70 text-sm">Avatar video unavailable</p>
          </div>
        </div>
      )}

      {/* Video overlay with subtle border effect */}
      {isVideoReady && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-white/10 rounded-lg"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}

      {/* Emotion indicator */}
      {currentEmotion && currentEmotion.length > 0 && isVideoReady && (
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
          {currentEmotion[0].name} {Math.round(currentEmotion[0].score * 100)}%
        </div>
      )}
    </div>
  );
}

