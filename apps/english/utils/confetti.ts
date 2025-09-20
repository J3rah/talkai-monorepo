import confetti from 'canvas-confetti';

// Define positive emotions that should trigger confetti
const POSITIVE_EMOTIONS = ['happiness', 'joy', 'excitement'];

// Threshold for emotion intensity to trigger confetti (0-1 scale)
const EMOTION_THRESHOLD = 0.3;

/**
 * Check if the emotion data contains positive emotions above the threshold
 */
export function shouldTriggerConfetti(emotionScores: Record<string, number>): boolean {
  if (!emotionScores) return false;
  
  return POSITIVE_EMOTIONS.some(emotion => {
    const score = emotionScores[emotion.toLowerCase()];
    return score && score >= EMOTION_THRESHOLD;
  });
}

/**
 * Trigger confetti animation with positive emotion settings
 */
export function triggerConfetti(): void {
  // A rainbow of fruit flavors!
  const fruitSaladColors = ['#FF6B6B', '#FFA500', '#FFD700', '#32CD32', '#4169E1', '#8A2BE2'];

  // Create a more celebratory confetti effect for positive emotions
  confetti({
    particleCount: 200,
    spread: 90,
    origin: { y: 0.6 },
    colors: fruitSaladColors,
    shapes: ['circle', 'square'],
    scalar: 1.8,
    startVelocity: 45,
    gravity: 0.8,
    ticks: 300,
    disableForReducedMotion: true // Respect user's motion preferences
  });
}

/**
 * Trigger a spectacular confetti explosion for session completion
 */
export function triggerSessionCompleteConfetti(): void {
  if (typeof window === 'undefined') {
    console.log('Confetti not available in server environment');
    return;
  }

  try {
    const sessionColors = ['#FF6B6B', '#FFA500', '#FFD700', '#32CD32', '#4169E1', '#8A2BE2', '#FF69B4', '#00CED1'];

    // Create multiple bursts for maximum celebration!
    // First burst - center explosion
    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.6 },
      colors: sessionColors,
      shapes: ['circle', 'square'],
      scalar: 2.0,
      startVelocity: 50,
      gravity: 0.7,
      ticks: 350,
      disableForReducedMotion: true
    });

    // Second burst - slightly delayed for cascade effect
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5, x: 0.3 },
        colors: sessionColors,
        shapes: ['star', 'circle'],
        scalar: 1.5,
        startVelocity: 40,
        gravity: 0.8,
        ticks: 250,
        disableForReducedMotion: true
      });
    }, 200);

    // Third burst - from the other side
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5, x: 0.7 },
        colors: sessionColors,
        shapes: ['star', 'circle'],
        scalar: 1.5,
        startVelocity: 40,
        gravity: 0.8,
        ticks: 250,
        disableForReducedMotion: true
      });
    }, 400);

  } catch (error) {
    console.error('Error in triggerSessionCompleteConfetti:', error);
  }
}

/**
 * Trigger confetti for specific positive emotions with custom settings
 */
export function triggerEmotionConfetti(emotion: string): void {
  if (typeof window === 'undefined') {
    console.log('Confetti not available in server environment');
    return;
  }

  try {
    const emotionConfigs: Record<string, any> = {
      happiness: { // Lemon, Orange, Sunshine
        particleCount: 100,
        colors: ['#FFD700', '#FFA500', '#FFC300'],
        shapes: ['circle'],
        scalar: 1.1
      },
      joy: { // Strawberry, Watermelon, Raspberry
        particleCount: 120,
        colors: ['#FF6B6B', '#FF4757', '#FF80ED'],
        shapes: ['star', 'circle'],
        scalar: 1.3
      },
      excitement: { // A burst of fruity flavors
        particleCount: 150,
        colors: ['#FFD700', '#32CD32', '#FF6B6B', '#4169E1'],
        shapes: ['square', 'circle'],
        scalar: 1.2
      }
    };

    const config = emotionConfigs[emotion.toLowerCase()] || {
      particleCount: 100,
      colors: ['#FF6B6B', '#FFA500', '#FFD700', '#32CD32', '#4169E1', '#8A2BE2'], // Full fruit salad rainbow
      shapes: ['circle', 'square'],
      scalar: 1.0
    };

    confetti({
      ...config,
      spread: 70,
      origin: { y: 0.6 },
      startVelocity: 30,
      gravity: 0.8,
      ticks: 200,
      disableForReducedMotion: true
    });
  } catch (error) {
    console.error('Error in triggerEmotionConfetti:', error);
  }
} 