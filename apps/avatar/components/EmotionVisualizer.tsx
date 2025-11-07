'use client';

import React, { useEffect, useState } from 'react';
import { HumeEmotion } from '@/lib/humeClient';
import { getEmotionColor, getDominantEmotion } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface EmotionVisualizerProps {
  emotions: HumeEmotion[];
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function EmotionVisualizer({
  emotions,
  size = 'medium',
  className = '',
}: EmotionVisualizerProps) {
  const [dominantEmotion, setDominantEmotion] = useState<{ emotion: string; score: number } | null>(null);

  useEffect(() => {
    if (emotions.length === 0) return;

    const emotionMap = emotions.reduce((acc, e) => {
      acc[e.name] = e.score;
      return acc;
    }, {} as Record<string, number>);

    const dominant = getDominantEmotion(emotionMap);
    setDominantEmotion(dominant);
  }, [emotions]);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  if (!dominantEmotion) return null;

  const emotionColor = getEmotionColor(dominantEmotion.emotion, dominantEmotion.score);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 60%, ${emotionColor} 100%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 50%, ${emotionColor} 100%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />

      {/* Inner core */}
      <motion.div
        className="absolute inset-4 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: emotionColor,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
      >
        {/* Emotion label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dominantEmotion.emotion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="text-white font-bold text-center"
          >
            <div className="text-xs uppercase tracking-wider">
              {dominantEmotion.emotion}
            </div>
            <div className="text-lg font-bold">
              {Math.round(dominantEmotion.score * 100)}%
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Emotion spectrum bars */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-1">
        {emotions.slice(0, 5).map((emotion, index) => (
          <motion.div
            key={emotion.name}
            className="w-1 bg-white/30 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: `${emotion.score * 24}px` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              backgroundColor: getEmotionColor(emotion.name, emotion.score),
            }}
          />
        ))}
      </div>
    </div>
  );
}

