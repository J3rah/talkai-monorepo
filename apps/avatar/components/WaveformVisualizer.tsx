'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface WaveformVisualizerProps {
  audioData?: Float32Array;
  isActive?: boolean;
  color?: string;
  barCount?: number;
  className?: string;
}

export default function WaveformVisualizer({
  audioData,
  isActive = false,
  color = '#3b82f6',
  barCount = 32,
  className = '',
}: WaveformVisualizerProps) {
  const [bars, setBars] = useState<number[]>(new Array(barCount).fill(0));
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setBars(new Array(barCount).fill(0));
      return;
    }

    const animate = () => {
      if (audioData && audioData.length > 0) {
        // Calculate bar heights from audio data
        const chunkSize = Math.floor(audioData.length / barCount);
        const newBars = new Array(barCount).fill(0);

        for (let i = 0; i < barCount; i++) {
          const start = i * chunkSize;
          const end = start + chunkSize;
          let sum = 0;

          for (let j = start; j < end && j < audioData.length; j++) {
            sum += Math.abs(audioData[j]);
          }

          newBars[i] = (sum / chunkSize) * 100;
        }

        setBars(newBars);
      } else {
        // Generate random bars for demo/placeholder
        const newBars = bars.map(() => Math.random() * 60 + 20);
        setBars(newBars);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, isActive, barCount]);

  return (
    <div className={`flex items-center justify-center gap-1 h-16 ${className}`}>
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="w-1 rounded-full"
          style={{
            backgroundColor: color,
            opacity: isActive ? 0.8 : 0.3,
          }}
          animate={{
            height: isActive ? `${Math.max(4, height)}%` : '10%',
          }}
          transition={{
            duration: 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

