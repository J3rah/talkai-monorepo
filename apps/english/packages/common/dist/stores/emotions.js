"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEmotions = void 0;
const zustand_1 = require("zustand");
exports.useEmotions = (0, zustand_1.create)((set) => ({
    emotionMetrics: [],
    setEmotionMetrics: (metrics) => set({ emotionMetrics: metrics }),
    addEmotionMetric: (metric) => set((state) => ({
        emotionMetrics: [...state.emotionMetrics, metric]
    }))
}));
//# sourceMappingURL=emotions.js.map