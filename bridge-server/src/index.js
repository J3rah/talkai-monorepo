require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { createBridgeSession, endBridgeSession, getActiveSessions } = require('./bridgeSession');
const { generateLiveKitToken } = require('./livekit');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// ─── REST endpoints ───────────────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', activeSessions: getActiveSessions().length });
});

// Generate a LiveKit token for the frontend (so it can receive avatar video)
app.post('/livekit-token', async (req, res) => {
  try {
    const { roomName, participantName } = req.body;
    if (!roomName || !participantName) {
      return res.status(400).json({ error: 'roomName and participantName required' });
    }
    const token = await generateLiveKitToken(roomName, participantName);
    res.json({ token, url: process.env.LIVEKIT_URL });
  } catch (err) {
    console.error('❌ Failed to generate LiveKit token:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Start a bridge session (called when user starts a chat)
app.post('/session/start', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const { roomName, liveAvatarSessionId } = await createBridgeSession(sessionId);
    res.json({ roomName, liveAvatarSessionId });
  } catch (err) {
    console.error('❌ Failed to start bridge session:', err);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// End a bridge session
app.post('/session/end', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    await endBridgeSession(sessionId);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to end bridge session:', err);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// ─── WebSocket server (receives Hume audio from the browser) ─────────────────
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/audio' });

wss.on('connection', (ws, req) => {
  // Expect sessionId as a query param: ws://bridge:3001/audio?sessionId=xxx
  const url = new URL(req.url, `http://localhost`);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    console.warn('⚠️  WebSocket connection rejected: no sessionId');
    ws.close(1008, 'sessionId required');
    return;
  }

  console.log(`🔌 Browser connected for session: ${sessionId}`);

  ws.on('message', (data) => {
    // data is a binary Buffer containing raw PCM audio from Hume
    // Forward it to the LiveKit publisher for this session
    const { publishAudio } = require('./bridgeSession');
    publishAudio(sessionId, data);
  });

  ws.on('close', () => {
    console.log(`🔌 Browser disconnected for session: ${sessionId}`);
  });

  ws.on('error', (err) => {
    console.error(`❌ WebSocket error for session ${sessionId}:`, err.message);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Bridge server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/audio?sessionId=YOUR_SESSION_ID`);
  console.log(`🔑 LiveKit URL: ${process.env.LIVEKIT_URL}`);
});
