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
  livekitToken: string | null;
  livekitUrl: string | null;
  isReady: boolean;
  error: string | null;
}

export function useBridge(sessionId: string | null, isConnected: boolean) {
  const [state, setState] = useState<BridgeState>({
    roomName: null,
    livekitToken: null,
    livekitUrl: null,
    isReady: false,
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const decodeQueueRef = useRef<Promise<void>>(Promise.resolve());
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
        const { roomName } = await res.json();
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
          livekitToken,
          livekitUrl,
          isReady: true,
          error: null,
        });
      } catch (err: any) {
        console.error('❌ Bridge setup failed:', err);
        setState((s) => ({ ...s, error: err.message, isReady: false }));
        sessionStartedRef.current = false;
      }
    };

    startSession();
  }, [sessionId, isConnected]);

  // ── Stream Hume's audio output to the bridge (for avatar lip-sync) ─────────
  // Hume plays audio via the Web Audio API (no <audio> element), so we capture
  // each audio_output chunk from the SDK's onAudioReceived callback. Each chunk's
  // `data` is base64-encoded WAV; we decode to 16kHz mono PCM and stream int16 to
  // the bridge (which upsamples to 48kHz for LiveKit). Decodes are queued to preserve
  // chunk order. This does NOT touch playback — the user still hears Hume normally.
  const sendAudioMessage = useCallback((audioOutputMessage: { data?: string }) => {
    const data = audioOutputMessage?.data;
    if (!data) return;

    decodeQueueRef.current = decodeQueueRef.current
      .then(async () => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        if (!audioContextRef.current) {
          // 16kHz so decodeAudioData resamples to the rate the bridge expects
          audioContextRef.current = new AudioContext({ sampleRate: 16000 });
        }
        const ctx = audioContextRef.current;

        // base64 → ArrayBuffer
        const binary = atob(data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
        const float32 = audioBuffer.getChannelData(0);

        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(int16.buffer);
        }
      })
      .catch((err) => console.warn('🌉 audio decode/send failed:', err));
  }, []);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (!isConnected && sessionStartedRef.current) {
        console.log('🧹 Cleaning up bridge session:', sessionId);

        // Close WebSocket
        wsRef.current?.close();
        wsRef.current = null;

        // Close the decode AudioContext
        audioContextRef.current?.close();
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
          livekitToken: null,
          livekitUrl: null,
          isReady: false,
          error: null,
        });
      }
    };
  }, [isConnected, sessionId]);

  return { ...state, sendAudioMessage };
}
