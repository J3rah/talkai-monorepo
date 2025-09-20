"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Loader2 } from 'lucide-react';

export default function VoiceSamplePlayer({
  voiceConfigId,
  voiceName,
  voiceParameters,
  className = "",
}: { 
  voiceConfigId: string; 
  voiceName: string; 
  voiceParameters?: { speaking_rate: number; pitch: number };
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlaySample = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('VoiceSamplePlayer: Sending request with voiceConfigId:', voiceConfigId, 'voiceName:', voiceName, 'voiceParameters:', voiceParameters);
      const res = await fetch('/api/hume/tts-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceConfigId,
          voiceParameters,
          text: `Hello, I'm ${voiceName}, your AI therapist. How are you feeling today?`,
        }),
      });

      const ct = res.headers.get('content-type') || '';

      if (!res.ok) {
        if (ct.includes('application/json')) {
          const j = await res.json().catch(() => null);
          console.error('TTS error response:', j || (await res.text()));
        } else {
          console.error('TTS error text:', await res.text());
        }
        throw new Error('Failed to generate voice sample');
      }

      if (ct.includes('application/json')) {
        const j = await res.json();
        console.error('Unexpected JSON from TTS route:', j);
        throw new Error('Unexpected response from TTS route');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const nextAudio = new Audio(url);

      audio?.pause();
      if (audio?.src) URL.revokeObjectURL(audio.src);
      setAudio(nextAudio);

      nextAudio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      nextAudio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(url);
      };

      await nextAudio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Error playing voice sample:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePlaySample}
      disabled={isLoading}
      className={`w-8 h-8 rounded-full p-0 flex items-center justify-center ${className}`}
      aria-label={`Play sample for ${voiceName}`}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
    </Button>
  );
}