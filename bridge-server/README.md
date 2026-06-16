# talkAI Bridge Server

Connects Hume EVI's audio output (client-side) to LiveAvatar via LiveKit,
giving talkAI a live talking avatar while keeping all of Hume's emotional
voice intelligence intact.

## Architecture

```
User mic → Hume EVI (browser WebSocket)
               ↓ audio plays in browser
           Web Audio API tap (useBridge hook)
               ↓ raw PCM over WebSocket
           Bridge Server (this)
               ↓ 16kHz → 48kHz upsample + LiveKit publish
           LiveKit room
               ↓ audio stream
           LiveAvatar LITE mode
               ↓ avatar video (WebRTC)
           AvatarDisplay component (browser)
```

## Setup

### 1. Install dependencies

```bash
cd bridge-server
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your `.env`:

| Variable | Where to get it |
|---|---|
| `LIVEKIT_API_KEY` | https://cloud.livekit.io → your project → Settings |
| `LIVEKIT_API_SECRET` | Same place |
| `LIVEKIT_URL` | Same place (starts with `wss://`) |
| `LIVEAVATAR_API_KEY` | https://app.liveavatar.com/developers |

### 3. Run the bridge server

```bash
# Development (auto-restarts on changes)
npm run dev

# Production
npm start
```

The server starts on port 3001 by default.

### 4. Add frontend files to talkAI

Copy these files into your talkAI Next.js project:

| File | Destination |
|---|---|
| `src/useBridge.ts` | `src/hooks/useBridge.ts` |
| `src/AvatarDisplay.tsx` | `src/components/AvatarDisplay.tsx` |

### 5. Install frontend dependency

```bash
# In your talkAI project root
npm install @heygen/liveavatar-web-sdk
```

### 6. Add environment variable to talkAI

In your talkAI `.env.local`:
```
NEXT_PUBLIC_BRIDGE_URL=http://localhost:3001
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### 7. Wire up in your chat page

In your existing `chat/page.tsx`, after the `VoiceProvider` is connected:

```tsx
import { useBridge } from '@/hooks/useBridge';
import AvatarDisplay from '@/components/AvatarDisplay';
import { useVoice } from '@humeai/voice-react';

// Inside your component:
const { status } = useVoice();
const sessionId = localStorage.getItem('currentChatSessionId');
const isConnected = status.value === 'connected';

const { roomName, liveAvatarSessionToken, livekitToken, isReady, attachToAudioElement } =
  useBridge(sessionId, isConnected);

// When Hume's audio element is available, tap into it:
// (Hume's audio element is created internally — see Note below)
useEffect(() => {
  const audioEl = document.querySelector('audio'); // Hume renders one <audio> element
  if (audioEl && isReady) {
    attachToAudioElement(audioEl);
  }
}, [isReady, attachToAudioElement]);

// Render the avatar:
{isReady && liveAvatarSessionToken && livekitToken && (
  <AvatarDisplay
    liveAvatarSessionToken={liveAvatarSessionToken}
    livekitToken={livekitToken}
    className="w-64 h-64"
  />
)}
```

## Notes

- **Audio tap**: Hume's `@humeai/voice-react` renders a hidden `<audio>` element for
  TTS playback. We tap into it using the Web Audio API's `MediaElementSourceNode`.
  The audio still plays normally to the user — we're just also forwarding it to the bridge.

- **Resampling**: Hume outputs 16kHz mono PCM. LiveKit expects 48kHz. The bridge does
  a simple 3× upsample (each sample repeated 3 times). This is sufficient for speech.

- **Credits**: LiveAvatar LITE mode costs 1 credit/minute. LiveKit Cloud has a generous
  free tier (50GB/month egress, up to 100 concurrent participants).

- **Privacy**: The bridge server sees the raw audio of every session. For a therapy app,
  make sure your privacy policy covers this and consider disabling LiveKit's Agent
  Observability in production (Settings → your project → Agent Observability).

## Health check

```bash
curl http://localhost:3001/health
# → { "status": "ok", "activeSessions": 0 }
```
