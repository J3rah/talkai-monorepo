import { EmotionMetrics } from '../types';
interface EmotionsStore {
    emotionMetrics: EmotionMetrics[];
    setEmotionMetrics: (metrics: EmotionMetrics[]) => void;
    addEmotionMetric: (metric: EmotionMetrics) => void;
}
export declare const useEmotions: import("zustand").UseBoundStore<import("zustand").StoreApi<EmotionsStore>>;
export {};
//# sourceMappingURL=emotions.d.ts.map