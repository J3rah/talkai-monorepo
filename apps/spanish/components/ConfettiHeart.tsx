"use client";

import { triggerSessionCompleteConfetti } from "@/utils/confetti";
import React from "react";
import confetti from "canvas-confetti";


interface ConfettiHeartProps {
  className?: string;
}

export function triggerStarConfetti(): void {
  if (typeof window === 'undefined') return;
  try {
    confetti({
      particleCount: 180,
      spread: 140,
      origin: { y: 0.6 },
      colors: ['#fffbe6', '#ffe066', '#ffd700', '#fff', '#b5e2fa', '#a7c7e7'],
      shapes: ['star'],
      scalar: 2.2,
      startVelocity: 65,
      gravity: 0.65,
      ticks: 420,
      disableForReducedMotion: true
    });
  } catch (e) {
    console.error('Star confetti error', e);
  }
}

export function ConfettiStars({ className = "" }: { className?: string }) {
  const [cooldown, setCooldown] = React.useState(false);
  const handleClick = () => {
    if (cooldown) return;
    setCooldown(true);
    try {
      triggerStarConfetti();
    } catch (e) {
      console.error("Confetti error", e);
    }
    setTimeout(() => setCooldown(false), 2000);
  };
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center text-2xl transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded ${className}`}
      aria-label="Celebrate with stars!"
      type="button"
      disabled={cooldown}
      style={cooldown ? { opacity: 0.5, pointerEvents: 'none' } : {}}
    >
      <span role="img" aria-label="glowing star">🌟</span>
    </button>
  );
}

export default function ConfettiHeart({ className = "" }: ConfettiHeartProps) {
  const [cooldown, setCooldown] = React.useState(false);
  const handleClick = () => {
    if (cooldown) return;
    setCooldown(true);
    try {
      triggerSessionCompleteConfetti();
    } catch (e) {
      console.error("Confetti error", e);
    }
    setTimeout(() => setCooldown(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center heartbeat-pulse hover:scale-110 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded ${className}`}
      aria-label="Celebrate!"
      type="button"
      disabled={cooldown}
      style={cooldown ? { opacity: 0.5, pointerEvents: 'none' } : {}}
    >
      ❤️
    </button>
  );
} 