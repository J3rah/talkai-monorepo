'use client';

import React, { useEffect, useRef } from 'react';
import { HumeMessage } from '@/lib/humeClient';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TranscriptViewProps {
  messages: HumeMessage[];
  className?: string;
}

export default function TranscriptView({ messages, className = '' }: TranscriptViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className={`h-full ${className}`}>
      <div ref={scrollRef} className="p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {/* Message content */}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Timestamp and emotion indicator */}
                <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                  <span>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {/* Top emotions */}
                  {message.emotions && message.emotions.length > 0 && (
                    <div className="flex gap-1">
                      {message.emotions.slice(0, 3).map((emotion, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10"
                          title={`${emotion.name}: ${Math.round(emotion.score * 100)}%`}
                        >
                          {emotion.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start speaking to begin the conversation...</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

