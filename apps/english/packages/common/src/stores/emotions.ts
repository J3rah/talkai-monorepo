import { create } from 'zustand';
import { EmotionMetrics } from '../types';

interface EmotionsStore {
  emotionMetrics: EmotionMetrics[];
  setEmotionMetrics: (metrics: EmotionMetrics[]) => void;
  addEmotionMetric: (metric: EmotionMetrics) => void;
}

export const useEmotions = create<EmotionsStore>((set) => ({
  emotionMetrics: [],
  setEmotionMetrics: (metrics) => set({ emotionMetrics: metrics }),
  addEmotionMetric: (metric) => set((state) => ({
    emotionMetrics: [...state.emotionMetrics, metric]
  }))
})); 