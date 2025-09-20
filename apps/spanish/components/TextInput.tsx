"use client";

import { useState, useRef, useEffect } from 'react';
import { useVoice } from '@humeai/voice-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextInputProps {
  isConnected: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  className?: string;
}

export default function TextInput({ isConnected, isMuted, onToggleMute, className }: TextInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendUserInput, sendSessionSettings, messages, connect, status } = useVoice();

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isSending || !isConnected) return;

    setIsSending(true);
    try {
      console.log('Sending text message as USER message:', trimmedValue);
      await sendUserInput(trimmedValue);
      setInputValue('');
    } catch (error) {
      console.error('Error sending text message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className={cn(
      "fixed left-0 w-full bottom-4 p-2 sm:p-4 flex items-center justify-center z-40",
      "bg-gradient-to-t from-card via-card/90 to-card/0 backdrop-blur-sm",
      className
    )} data-has-toggle={!!onToggleMute}>
      <div className="flex items-center gap-2 w-full max-w-lg mx-auto bg-card border border-border rounded-lg shadow-lg p-2 backdrop-blur-sm">
        {/* Remove icon div entirely */}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isSending}
        />

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isSending}
          size="sm"
          className="shrink-0"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
} 