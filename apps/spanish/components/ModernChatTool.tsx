"use client";

import { useState, useEffect, useRef } from "react";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Slider } from "./ui/slider";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronDown, 
  ChevronUp,
  Settings,
  MoreHorizontal,
  Play,
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";
import supabase from "@/supabaseClient";
import { getVoiceConfigurationById, VoiceConfiguration } from "@/utils/voiceConfigUtils";

interface ModernChatToolProps {
  accessToken: string;
  onSessionEnd?: () => void;
}

interface Personality {
  id: string;
  name: string;
  icon: string;
  description?: string;
  is18Plus?: boolean;
  hasRefresh?: boolean;
}

const personalities: Personality[] = [
  { id: "custom", name: "Custom", icon: "⚙️" },
  { id: "assistant", name: "Assistant", icon: "🔧", hasRefresh: true },
  { id: "therapist", name: "Therapist", icon: "🛋️" },
  { id: "storyteller", name: "Storyteller", icon: "📖" },
  { id: "kids-story", name: "Kids Story Time", icon: "⚖️" },
  { id: "kids-trivia", name: "Kids Trivia Game", icon: "🏆" },
  { id: "meditation", name: "Meditation", icon: "🧘" },
  { id: "grok-doc", name: "Grok \"Doc\"", icon: "🩺", hasRefresh: true },
  { id: "unhinged", name: "Unhinged 18+", icon: "🌀", is18Plus: true, hasRefresh: true },
  { id: "sexy", name: "Sexy 18+", icon: "🔥", is18Plus: true },
  { id: "motivation", name: "Motivation 18+", icon: "🏁", is18Plus: true },
  { id: "conspiracy", name: "Conspiracy", icon: "🔺", hasRefresh: true },
  { id: "romantic", name: "Romantic 18+", icon: "💎", is18Plus: true },
  { id: "argumentative", name: "Argumentative 18+", icon: "⚡", is18Plus: true },
];

const voices = [
  { id: "ara", name: "Ara", description: "Upbeat Female", isSelected: true },
  { id: "eve", name: "Eve", description: "Soothing Female" },
  { id: "leo", name: "Leo", description: "British Male" },
  { id: "rex", name: "Rex", description: "Calm Male" },
  { id: "sal", name: "Sal", description: "Smooth Male" },
  { id: "gork", name: "Gork", description: "Lazy Male" },
];

export default function ModernChatTool({ accessToken, onSessionEnd }: ModernChatToolProps) {
  const { status, unmute, mute, micFft, disconnect, isMuted, pauseAssistant, resumeAssistant } = useVoice();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [selectedPersonality, setSelectedPersonality] = useState(personalities[6]); // Meditation
  const [speakingSpeed, setSpeakingSpeed] = useState([1.0]);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isMuteButtonDisabled, setIsMuteButtonDisabled] = useState(false);
  
  const sessionStartTime = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const pauseStartTime = useRef<number | null>(null);
  const timerInterval = useRef<number | NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (status.value === 'connected') {
      if (!sessionStartTime.current) {
        sessionStartTime.current = Date.now();
        setSessionDuration(0);
      }

      if (!timerInterval.current) {
        timerInterval.current = setInterval(() => {
          if (!isPausedRef.current && sessionStartTime.current) {
            const elapsedSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
            setSessionDuration(elapsedSeconds);
          }
        }, 1000);
      }
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      if (status.value === 'disconnected') {
        sessionStartTime.current = null;
        pauseStartTime.current = null;
        setSessionDuration(0);
      }
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, [status.value]);

  // Update pause ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Auto-resume audio pipeline
  useEffect(() => {
    if (status.value === 'connected') {
      setTimeout(() => {
        try {
          if (typeof unmute === 'function') unmute();
          if (typeof resumeAssistant === 'function') resumeAssistant();
        } catch (err) {
          console.warn('Auto-unmute/resume failed:', err);
        }
      }, 300);
    }
  }, [status.value, unmute, resumeAssistant]);

  const handlePauseToggle = () => {
    if (isPaused) {
      if (pauseStartTime.current && sessionStartTime.current) {
        const pauseDuration = Date.now() - pauseStartTime.current;
        sessionStartTime.current += pauseDuration;
        pauseStartTime.current = null;
      }
      resumeAssistant();
      unmute();
      setIsPaused(false);
      setIsMuteButtonDisabled(false);
    } else {
      pauseStartTime.current = Date.now();
      pauseAssistant();
      mute();
      setIsPaused(true);
      setIsMuteButtonDisabled(true);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (isMuted === false) {
        try {
          await mute();
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Microphone cleanup failed:', error);
        }
      }
      await disconnect();
      onSessionEnd?.();
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    if (isMuteButtonDisabled) return;
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  if (status.value !== "connected") {
    return null;
  }

  return (
    <>
      {/* Main Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Voice activity and controls */}
              <div className="flex items-center gap-3">
                {/* Voice Activity Indicator */}
                <div className="flex items-center gap-1">
                  <div className="w-2 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-2 h-4 bg-blue-500 rounded-sm"></div>
                  <div className="w-2 h-5 bg-blue-500 rounded-sm"></div>
                  <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
                </div>

                {/* Microphone Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 rounded-full p-0 hover:bg-gray-100"
                  onClick={handleMuteToggle}
                  disabled={isMuteButtonDisabled}
                >
                  {isMuted ? (
                    <MicOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Mic className="w-5 h-5 text-gray-600" />
                  )}
                </Button>

                {/* Volume/Mute Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 rounded-full p-0 hover:bg-gray-100"
                >
                  <Volume2 className="w-5 h-5 text-gray-600" />
                </Button>
              </div>

              {/* Center - Session Selector */}
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-gray-200"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-800">{selectedVoice.name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{selectedPersonality.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>

              {/* Right side - End Session */}
              <Button
                size="sm"
                variant="destructive"
                className="w-12 h-10 rounded-xl bg-red-600 hover:bg-red-700"
                onClick={handleDisconnect}
              >
                <X className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Voice & Personality Settings</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Left Panel - Voice Settings */}
            <div className="space-y-6">
              {/* Voice Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Voice</h3>
                <div className="grid grid-cols-2 gap-3">
                  {voices.map((voice) => (
                    <Button
                      key={voice.id}
                      variant={selectedVoice.id === voice.id ? "default" : "outline"}
                      className={cn(
                        "h-auto p-4 flex flex-col items-center gap-2 rounded-lg border-2 transition-all",
                        selectedVoice.id === voice.id 
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg" 
                          : "bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300"
                      )}
                      onClick={() => setSelectedVoice(voice)}
                    >
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-sm opacity-75">{voice.description}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Personality Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personality</h3>
                <div className="space-y-1">
                  {personalities.map((personality) => (
                    <Button
                      key={personality.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-auto p-3 rounded-lg transition-all",
                        selectedPersonality.id === personality.id 
                          ? "bg-blue-50 border border-blue-200 shadow-sm" 
                          : "hover:bg-gray-50"
                      )}
                      onClick={() => setSelectedPersonality(personality)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{personality.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{personality.name}</span>
                            {personality.is18Plus && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">18+</span>
                            )}
                          </div>
                        </div>
                        {personality.hasRefresh && (
                          <Button size="sm" variant="ghost" className="w-6 h-6 p-0 hover:bg-gray-200">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </Button>
                        )}
                        {selectedPersonality.id === personality.id && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Speed Control */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Speed</h3>
                <div className="space-y-3">
                  <Slider
                    value={speakingSpeed}
                    onValueChange={setSpeakingSpeed}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    {speakingSpeed[0]}x
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Session Controls */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Session Controls</h3>
                
                {/* Session Timer */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-mono font-bold text-gray-800">
                    {formatTime(sessionDuration)}
                  </div>
                  <div className="text-sm text-gray-600">Session Duration</div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handlePauseToggle}
                    variant={isPaused ? "default" : "outline"}
                    className="flex-1"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleMuteToggle}
                    variant={isMuted ? "destructive" : "outline"}
                    className="flex-1"
                    disabled={isMuteButtonDisabled}
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Unmute
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Mute
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Current Settings Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Current Settings</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>Voice: {selectedVoice.name} ({selectedVoice.description})</div>
                  <div>Personality: {selectedPersonality.name}</div>
                  <div>Speed: {speakingSpeed[0]}x</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
