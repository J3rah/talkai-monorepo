'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Pause, Play, Phone, Settings, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export interface SessionControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  isPaused: boolean;
  sessionDuration: number;
  onMuteToggle: () => void;
  onPauseToggle: () => void;
  onEndSession: () => void;
  onSettingsOpen?: () => void;
  className?: string;
}

export default function SessionControls({
  isConnected,
  isMuted,
  isPaused,
  sessionDuration,
  onMuteToggle,
  onPauseToggle,
  onEndSession,
  onSettingsOpen,
  className = '',
}: SessionControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <div className={`flex items-center justify-between p-4 bg-card border-t ${className}`}>
      {/* Left: Session info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="text-lg font-mono font-bold">
          {formatTime(sessionDuration)}
        </div>
      </div>

      {/* Center: Main controls */}
      <div className="flex items-center gap-2">
        {/* Mute/Unmute */}
        <Button
          variant={isMuted ? 'destructive' : 'outline'}
          size="icon"
          onClick={onMuteToggle}
          disabled={!isConnected}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        {/* Pause/Resume */}
        <Button
          variant="outline"
          size="icon"
          onClick={onPauseToggle}
          disabled={!isConnected}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        </Button>

        {/* End Session */}
        <Button
          variant="destructive"
          size="lg"
          onClick={onEndSession}
          disabled={!isConnected}
          className="px-6"
        >
          <Phone className="h-5 w-5 mr-2" />
          End Session
        </Button>

        {/* Settings */}
        {onSettingsOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={onSettingsOpen}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Right: Volume control */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          title="Volume"
        >
          <Volume2 className="h-5 w-5" />
        </Button>

        {showVolumeSlider && (
          <div className="absolute bottom-full right-0 mb-2 p-4 bg-popover border rounded-lg shadow-lg">
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="w-32"
            />
          </div>
        )}
      </div>
    </div>
  );
}

