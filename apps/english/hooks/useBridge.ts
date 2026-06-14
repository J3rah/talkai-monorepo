/**
 * useBridge.ts
 * 
 * Drop this into your talkAI frontend at: src/hooks/useBridge.ts
 * 
 * This hook:
 *  1. Starts a bridge session when the user connects to Hume
 *  2. Captures Hume's audio output via the Web Audio API
 *  3. Streams raw PCM to the bridge server over WebSocket
 *  4. Returns the LiveKit token + room name so LiveAvatar can render
 */

import { useEffect, useRef, useState, useCallback } from 'react';

const BRIDGE_URL = process.env.NEXT_PUBLIC_BRIDGE_URL || 'http://localhost:3001';
const BRIDGE_WS_URL = BRIDGE_URL.replace(/^http/, 'ws');

// Hume plays audio through an <audio> element — we tap into that stream
// via a MediaElementSourceNode → ScriptProcessorNode pipeline.
// The ScriptProcessor fires every ~256 samples and gives us raw PCM float32,
// which we convert to int16 before sending to the bridge.

interface BridgeState {
  roomName: string | null;
  liveAvatarSessionToken: string | null;
  livekitToken: string | null;
  isReady: boolean;
  error: string | null;
}

export function useBridge(sessionId: string | null, isConnected: boolean) {
  const [state, setState] = useState<BridgeState>({
    roomName: null,
    liveAvatarSessionToken: null,
    livekitToken: null,
    isReady: false,
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionStartedRef = useRef(false);

  // ── Start bridge session when Hume connects ──────────────────────────────
  useEffect(() => {
    if (!sessionId || !isConnected || sessionStartedRef.current) return;

    sessionStartedRef.current = true;
    console.log('🌉 Starting bridge session for:', sessionId);

    const startSession = async () => {
      try {
        // 1. Tell the bridge to create a LiveKit room + LiveAvatar session
        const res = await fetch(`${BRIDGE_URL}/session/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) throw new Error(`Bridge session start failed: ${res.status}`);
        const { roomName, liveAvatarSessionToken } = await res.json();
        console.log('✅ Bridge session started, room:', roomName);

        // 2. Get a LiveKit token for the frontend (subscriber only — to receive avatar video)
        const tokenRes = await fetch(`${BRIDGE_URL}/livekit-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName,
            participantName: `user-${sessionId}`,
          }),
        });

        if (!tokenRes.ok) throw new Error(`LiveKit token fetch failed: ${tokenRes.status}`);
        const { token: livekitToken, url: livekitUrl } = await tokenRes.json();
        console.log('✅ LiveKit subscriber token obtained');

        // 3. Open WebSocket to bridge for audio streaming
        const ws = new WebSocket(`${BRIDGE_WS_URL}/audio?sessionId=${sessionId}`);
        ws.binaryType = 'arraybuffer';
        wsRef.current = ws;

        ws.onopen = () => console.log('🔌 Audio WebSocket connected to bridge');
        ws.onerror = (e) => console.error('❌ Audio WebSocket error:', e);
        ws.onclose = () => console.log('🔌 Audio WebSocket closed');

        setState({
          roomName,
          liveAvatarSessionToken,
          livekitToken,
          isReady: true,
          error: null,
        });

        // Store livekitUrl for use in the avatar component
        if (typeof window !== 'undefined') {
          (window as any).__livekitUrl = livekitUrl;
        }
      } catch (err: any) {
        console.error('❌ Bridge setup failed:', err);
        setState((s) => ({ ...s, error: err.message, isReady: false }));
        sessionStartedRef.current = false;
      }
    };

    startSession();
  }, [sessionId, isConnected]);

  // ── Tap into Hume's audio output via Web Audio API ───────────────────────
  // Call this once you have a reference to Hume's <audio> element.
  const attachToAudioElement = useCallback((audioEl: HTMLAudioElement) => {
    if (!wsRef.current || audioContextRef.current) return;

    console.log('🎵 Attaching Web Audio tap to Hume audio element');

    try {
      const ctx = new AudioContext({ sampleRate: 16000 }); // Match Hume's output rate
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(audioEl);
      sourceNodeRef.current = source;

      // ScriptProcessor: buffer size 2048 gives ~128ms chunks at 16kHz
      // Deprecated but universally supported; fine for this use case
      const processor = ctx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;

        const float32 = e.inputBuffer.getChannelData(0);

        // Convert Float32 [-1, 1] → Int16 for the bridge
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        wsRef.current.send(int16.buffer);
      };

      // Route: source → processor → destination (so audio still plays normally)
      source.connect(processor);
      processor.connect(ctx.destination);
      console.log('✅ Web Audio tap active — streaming Hume audio to bridge');
    } catch (err) {
      console.error('❌ Failed to attach Web Audio tap:', err);
    }
  }, []);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (!isConnected && sessionStartedRef.current) {
        console.log('🧹 Cleaning up bridge session:', sessionId);

        // Close WebSocket
        wsRef.current?.close();
        wsRef.current = null;

        // Disconnect Web Audio nodes
        processorRef.current?.disconnect();
        sourceNodeRef.current?.disconnect();
        audioContextRef.current?.close();
        processorRef.current = null;
        sourceNodeRef.current = null;
        audioContextRef.current = null;

        // Tell the bridge to clean up the LiveKit room
        if (sessionId) {
          fetch(`${BRIDGE_URL}/session/end`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          }).catch(console.error);
        }

        sessionStartedRef.current = false;
        setState({
          roomName: null,
          liveAvatarSessionToken: null,
          livekitToken: null,
          isReady: false,
          error: null,
        });
      }
    };
  }, [isConnected, sessionId]);

  return { ...state, attachToAudioElement };
}
