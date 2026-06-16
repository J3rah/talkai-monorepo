const { Room, RoomEvent, LocalAudioTrack, AudioFrame } = require('@livekit/rtc-node');
const { generateLiveKitToken } = require('./livekit');

// Active sessions map: sessionId → { room, audioSource, liveAvatarSessionToken }
const sessions = new Map();

// ─── LiveAvatar session token (LITE mode + LiveKit) ─────────────────────────────
// Creates a LiveAvatar session that joins OUR LiveKit room: the avatar subscribes
// to the audio we publish there (Hume) and publishes its video back into the room.

async function getLiveAvatarSessionToken(roomName, avatarLivekitToken) {
  const apiKey = process.env.LIVEAVATAR_API_KEY;
  if (!apiKey) throw new Error('LIVEAVATAR_API_KEY must be set');
  const avatarId = process.env.LIVEAVATAR_AVATAR_ID;
  if (!avatarId) throw new Error('LIVEAVATAR_AVATAR_ID must be set (avatar UUID from app.liveavatar.com)');

  const response = await fetch('https://api.liveavatar.com/v1/sessions/token', {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'LITE',
      avatar_id: avatarId,
      livekit_config: {
        livekit_url: process.env.LIVEKIT_URL,
        livekit_room: roomName,
        livekit_client_token: avatarLivekitToken,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LiveAvatar token request failed: ${response.status} ${text}`);
  }

  const json = await response.json();
  const data = json.data || json; // some responses nest under `data`
  return { sessionToken: data.session_token, liveAvatarSessionId: data.session_id };
}

// Starts the LiveAvatar session (makes the avatar join the room). Bearer = session token.
async function startLiveAvatarSession(sessionToken) {
  const response = await fetch('https://api.liveavatar.com/v1/sessions/start', {
    method: 'POST',
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LiveAvatar start failed: ${response.status} ${text}`);
  }
  return response.json().catch(() => ({}));
}

// ─── Session lifecycle ────────────────────────────────────────────────────────

async function createBridgeSession(sessionId) {
  if (sessions.has(sessionId)) {
    console.log(`⚠️  Session ${sessionId} already exists, reusing`);
    const existing = sessions.get(sessionId);
    return {
      roomName: existing.roomName,
      liveAvatarSessionId: existing.liveAvatarSessionId,
    };
  }

  const roomName = `talkai-${sessionId}`;
  console.log(`🏗️  Creating bridge session: ${roomName}`);

  // 1. Create a LiveKit room and join as a publisher (the bridge is the audio source)
  const room = new Room();
  const publisherToken = await generateLiveKitToken(roomName, 'bridge-publisher', true);
  await room.connect(process.env.LIVEKIT_URL, publisherToken, { autoSubscribe: false });
  console.log(`✅ Bridge connected to LiveKit room: ${roomName}`);

  // 2. Publish the Hume audio track the avatar will lip-sync to
  //    Hume EVI outputs 16kHz mono PCM; we upsample to 48kHz for LiveKit.
  const { AudioSource } = require('@livekit/rtc-node');
  const audioSource = new AudioSource(48000, 1);
  const track = LocalAudioTrack.createAudioTrack('hume-audio', audioSource);
  await room.localParticipant.publishTrack(track);
  console.log(`✅ Audio track published to LiveKit`);

  // 3. Mint a LiveKit token for the avatar to join the SAME room (publish video + subscribe audio)
  const avatarLivekitToken = await generateLiveKitToken(roomName, 'liveavatar', true);

  // 4. Create the LiveAvatar LITE session pointed at our room, then start it
  const { sessionToken, liveAvatarSessionId } = await getLiveAvatarSessionToken(roomName, avatarLivekitToken);
  console.log(`✅ LiveAvatar session token obtained (${liveAvatarSessionId})`);
  await startLiveAvatarSession(sessionToken);
  console.log(`✅ LiveAvatar session started — avatar joining room`);

  room.on(RoomEvent.Disconnected, () => {
    console.log(`🔌 LiveKit room disconnected for session: ${sessionId}`);
    sessions.delete(sessionId);
  });

  sessions.set(sessionId, {
    roomName,
    room,
    audioSource,
    liveAvatarSessionId,
    sessionToken,
    // Buffer for accumulating incoming PCM chunks before resampling
    pcmBuffer: Buffer.alloc(0),
  });

  return { roomName, liveAvatarSessionId };
}

async function endBridgeSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) {
    console.warn(`⚠️  No session found for: ${sessionId}`);
    return;
  }

  console.log(`🛑 Ending bridge session: ${sessionId}`);
  try {
    await session.room.disconnect();
  } catch (err) {
    console.warn(`⚠️  Error disconnecting room:`, err.message);
  }
  sessions.delete(sessionId);
  console.log(`✅ Bridge session ended: ${sessionId}`);
}

function getActiveSessions() {
  return Array.from(sessions.keys());
}

// ─── Audio publishing ─────────────────────────────────────────────────────────

// Hume sends 16kHz signed 16-bit mono PCM.
// LiveKit expects 48kHz signed 16-bit PCM frames of exactly 10ms (480 samples at 48kHz).
// We do a simple 3x upsample (16kHz → 48kHz) by repeating each sample 3 times.

const LIVEKIT_SAMPLE_RATE = 48000;
const LIVEKIT_CHANNELS = 1;
const FRAME_DURATION_MS = 10;
const SAMPLES_PER_FRAME = (LIVEKIT_SAMPLE_RATE * FRAME_DURATION_MS) / 1000; // 480 samples
const BYTES_PER_FRAME = SAMPLES_PER_FRAME * 2; // 16-bit = 2 bytes per sample
const HUME_SAMPLE_RATE = 16000;
const UPSAMPLE_FACTOR = LIVEKIT_SAMPLE_RATE / HUME_SAMPLE_RATE; // 3

function upsamplePCM(inputBuffer) {
  // inputBuffer: 16kHz signed 16-bit mono PCM
  const inputSamples = inputBuffer.length / 2;
  const outputBuffer = Buffer.alloc(inputSamples * UPSAMPLE_FACTOR * 2);

  for (let i = 0; i < inputSamples; i++) {
    const sample = inputBuffer.readInt16LE(i * 2);
    for (let j = 0; j < UPSAMPLE_FACTOR; j++) {
      outputBuffer.writeInt16LE(sample, (i * UPSAMPLE_FACTOR + j) * 2);
    }
  }
  return outputBuffer;
}

function publishAudio(sessionId, rawData) {
  const session = sessions.get(sessionId);
  if (!session) return; // session may have ended

  // Upsample the incoming 16kHz PCM to 48kHz
  const upsampled = upsamplePCM(Buffer.from(rawData));

  // Append to the session's PCM buffer
  session.pcmBuffer = Buffer.concat([session.pcmBuffer, upsampled]);

  // Drain complete 10ms frames from the buffer and push them to LiveKit
  while (session.pcmBuffer.length >= BYTES_PER_FRAME) {
    const frameData = session.pcmBuffer.subarray(0, BYTES_PER_FRAME);
    session.pcmBuffer = session.pcmBuffer.subarray(BYTES_PER_FRAME);

    // Build an AudioFrame and push to the audio source
    const frame = new AudioFrame(
      new Int16Array(frameData.buffer, frameData.byteOffset, SAMPLES_PER_FRAME),
      LIVEKIT_SAMPLE_RATE,
      LIVEKIT_CHANNELS,
      SAMPLES_PER_FRAME,
    );

    session.audioSource.captureFrame(frame).catch((err) => {
      console.error(`❌ captureFrame error for session ${sessionId}:`, err.message);
    });
  }
}

module.exports = {
  createBridgeSession,
  endBridgeSession,
  getActiveSessions,
  publishAudio,
};
