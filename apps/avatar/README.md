# TalkAI Avatar - Real-time Avatar Therapist

Experience empathetic AI therapy with a human-like avatar powered by **Hume EVI** (Emotional Voice Interface) and **HeyGen Realtime Avatar API**.

## 🌟 Features

- **Real-time Avatar Video**: HeyGen's streaming technology for lifelike human video
- **Emotional AI**: Hume EVI analyzes voice tone and emotions for empathetic responses
- **Voice-to-Voice Streaming**: Sub-second latency for natural conversations
- **Emotion Synchronization**: Avatar expressions sync with detected emotions
- **Conversation History**: Optional storage in Supabase
- **Emotion Visualizer**: Real-time emotion ring overlay
- **Shared Authentication**: Uses same user database as main TalkAI app

## 🏗️ Architecture

```
User Voice Input
    ↓
Hume EVI (Speech-to-Text + Emotion Analysis)
    ↓
AI Response + Emotion Data
    ↓
ElevenLabs (Text-to-Speech)
    ↓
HeyGen Avatar (Lip-synced Video + Expression Sync)
    ↓
User sees & hears avatar
```

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Voice AI**: Hume AI EVI
- **Avatar**: HeyGen Streaming API
- **TTS**: ElevenLabs (optional, can use Hume's TTS)
- **Database**: Supabase (shared with main TalkAI app)
- **State Management**: Zustand
- **UI**: Tailwind CSS + Radix UI
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Accounts for:
  - Hume AI (https://hume.ai)
  - HeyGen (https://heygen.com)
  - ElevenLabs (https://elevenlabs.io)
  - Supabase (existing TalkAI database)

### Installation

1. Install dependencies:

```bash
cd apps/avatar
npm install
```

2. Create `.env.local` file:

```env
# Supabase (shared with main talkAI app)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hume AI
HUME_API_KEY=your_hume_api_key
HUME_SECRET_KEY=your_hume_secret_key
NEXT_PUBLIC_HUME_CONFIG_ID=your_evi_config_id

# HeyGen
HEYGEN_API_KEY=your_heygen_api_key
NEXT_PUBLIC_HEYGEN_AVATAR_ID=your_avatar_id
HEYGEN_VOICE_ID=your_voice_id

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=your_voice_id

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

3. Run development server:

```bash
npm run dev
```

4. Open http://localhost:3003

## 📁 Project Structure

```
apps/avatar/
├── app/
│   ├── page.tsx              # Landing page
│   ├── session/page.tsx      # Main avatar session
│   ├── auth/page.tsx         # Authentication
│   ├── api/
│   │   └── hume/
│   │       └── access-token/ # Hume token endpoint
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── AvatarPlayer.tsx      # HeyGen video player + expression sync
│   ├── EmotionVisualizer.tsx # Emotion ring overlay
│   ├── WaveformVisualizer.tsx # Audio waveform
│   ├── TranscriptView.tsx    # Chat transcript
│   ├── SessionControls.tsx   # Session controls (mute, pause, end)
│   └── ui/                   # Radix UI components
├── lib/
│   ├── humeClient.ts         # Hume EVI WebSocket client
│   ├── heygenClient.ts       # HeyGen Streaming API client
│   ├── supabaseClient.ts     # Database client
│   └── utils.ts              # Helper functions
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Configuration

### Hume EVI Setup

1. Go to https://beta.hume.ai
2. Create an EVI configuration
3. Set system prompt (e.g., "You are an empathetic therapist...")
4. Enable emotion analysis and prosody
5. Copy the config ID to `NEXT_PUBLIC_HUME_CONFIG_ID`

### HeyGen Setup

1. Go to https://app.heygen.com
2. Create or select an avatar
3. Copy the avatar ID to `NEXT_PUBLIC_HEYGEN_AVATAR_ID`
4. Get API key from settings

### Database Schema

The app uses existing TalkAI tables but extends them:

```sql
-- Extend chat_sessions table
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS avatar_id TEXT;

-- emotion_metrics table (already exists in talkAI)
-- Used to store real-time emotion data
```

## 🎨 Customization

### Change Avatar

Update `NEXT_PUBLIC_HEYGEN_AVATAR_ID` in `.env.local` with your HeyGen avatar ID.

### Emotion Mapping

Edit `lib/heygenClient.ts` → `mapEmotionToExpression()` to customize emotion-to-expression mapping.

### UI Theming

Modify `app/globals.css` CSS variables for colors and animations.

## 🚢 Deployment

### Vercel Deployment

1. Push code to repository
2. Go to Vercel dashboard
3. Import project
4. Add environment variables
5. Deploy

### Subdomain Setup (avatar.talkai.im)

1. Add DNS record:
   - Type: CNAME
   - Name: avatar
   - Value: cname.vercel-dns.com

2. In Vercel:
   - Project Settings → Domains
   - Add `avatar.talkai.im`

3. Update `vercel.json` in monorepo root:

```json
{
  "projects": [
    {
      "name": "talkai-avatar",
      "directory": "apps/avatar",
      "domain": ["avatar.talkai.im"]
    }
  ]
}
```

## 🔒 Security

- All API keys stored in environment variables
- Hume access tokens generated server-side
- User authentication required for sessions
- WebRTC connections encrypted (DTLS-SRTP)
- Optional conversation storage (user-controlled)

## 🐛 Troubleshooting

### Avatar Video Not Loading

- Check HeyGen API key and avatar ID
- Verify network allows WebRTC connections
- Try fallback mode (voice-only)

### Hume Connection Issues

- Verify API key and secret key
- Check EVI config ID is correct
- Ensure microphone permissions granted

### High Latency

- Use quality: 'medium' instead of 'high' in HeyGen config
- Reduce emotion update throttle interval
- Check network connection speed

## 📊 Performance

- **Latency**: < 1 second end-to-end
- **Video Quality**: 720p @ 30fps
- **Audio Sample Rate**: 16kHz PCM
- **Emotion Update Rate**: 2-3 times per second

## 🤝 Integration with Main TalkAI App

This app shares:
- Supabase database
- User authentication
- Profile settings
- Conversation history (optional)

Users can seamlessly switch between text chat and avatar sessions.

## 📝 License

Part of TalkAI monorepo. All rights reserved.

## 🆘 Support

For issues or questions:
- Email: support@talkai.im
- GitHub Issues: [repository link]

---

Built with ❤️ using Hume AI, HeyGen, and ElevenLabs

