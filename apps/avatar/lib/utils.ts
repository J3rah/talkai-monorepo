import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getEmotionColor(emotion: string, score: number): string {
  const emotionColors: Record<string, string> = {
    joy: '#FFD700',
    happiness: '#FFA500',
    excitement: '#FF69B4',
    contentment: '#90EE90',
    sadness: '#4169E1',
    anger: '#DC143C',
    fear: '#9370DB',
    surprise: '#FF6347',
    disgust: '#8B4513',
    anxiety: '#DDA0DD',
    calmness: '#87CEEB',
    confidence: '#32CD32',
  };

  const baseColor = emotionColors[emotion.toLowerCase()] || '#808080';
  const opacity = Math.max(0.3, Math.min(1, score));
  
  return baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
}

export function getDominantEmotion(emotions: Record<string, number>): { emotion: string; score: number } {
  let maxEmotion = 'neutral';
  let maxScore = 0;

  for (const [emotion, score] of Object.entries(emotions)) {
    if (score > maxScore) {
      maxScore = score;
      maxEmotion = emotion;
    }
  }

  return { emotion: maxEmotion, score: maxScore };
}

export function interpolateEmotions(
  currentEmotion: Record<string, number>,
  targetEmotion: Record<string, number>,
  alpha: number
): Record<string, number> {
  const result: Record<string, number> = {};
  
  const allKeys = new Set([...Object.keys(currentEmotion), ...Object.keys(targetEmotion)]);
  
  for (const key of allKeys) {
    const current = currentEmotion[key] || 0;
    const target = targetEmotion[key] || 0;
    result[key] = current + (target - current) * alpha;
  }
  
  return result;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

