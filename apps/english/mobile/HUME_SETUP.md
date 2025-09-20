# Hume AI Integration Setup Guide

## Step 1: Environment Configuration

Create a `.env` file in the `mobile/` directory with the following variables:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Hume AI Configuration
EXPO_PUBLIC_HUME_API_KEY=your_hume_api_key_here
EXPO_PUBLIC_HUME_SECRET_KEY=your_hume_secret_key_here

# OpenAI Configuration (if needed)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Backend Configuration (optional)
EXPO_PUBLIC_BACKEND_BASE_URL=http://localhost:3000
```

## Step 2: Get Your Hume AI API Keys

1. Go to [Hume AI Console](https://console.hume.ai/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key and secret key to your `.env` file

## Step 3: Voice Configuration IDs

The app uses the following voice configuration IDs from Hume AI:

- **Default Voice**: `0ea8bb7d-ef50-4174-ae64-be7a621db425`
- **Alternative Voice**: `8a80af40-ec14-4da0-afeb-d11008491410`

These are pre-configured in the app. If you need to use different voice configurations:

1. Go to Hume AI Console → Voice Configurations
2. Create or select your desired voice configuration
3. Copy the configuration ID
4. Update the `voiceConfigUtils.ts` file with your configuration IDs

## Step 4: Testing the Integration

1. Start the mobile app: `npm start`
2. Navigate to the Home screen
3. In development mode, you'll see two test components:
   - **Hume AI Integration Test**: Tests basic API integration
   - **Live Voice Integration Test**: Tests WebSocket connection and real-time voice
4. Tap "Run Tests" on both components to verify everything is working
5. Check the test results for any issues

## Step 5: Live Voice Chat Testing

1. Go to "Start Call" tab
2. Select a voice configuration
3. Enter a therapist name
4. Accept the medical disclaimer
5. Start a live voice session
6. Test real-time voice conversation:
   - Tap the microphone to start recording
   - Speak naturally - the AI will respond in real-time
   - No need to wait for processing - it's a live conversation

## Troubleshooting

### Common Issues:

1. **"Missing environment variables" error**
   - Ensure all required variables are set in your `.env` file
   - Restart the development server after adding environment variables

2. **"Hume API key not configured" error**
   - Verify your Hume API key is correct
   - Check that the API key has the necessary permissions

3. **"Failed to create chat group" error**
   - Verify your Hume account has available credits
   - Check that the voice configuration ID is valid

4. **Voice recording not working**
   - Ensure microphone permissions are granted
   - Check that the device supports audio recording

### Debug Information:

- Check the console logs for detailed error messages
- Use the test component to isolate issues
- Verify network connectivity for API calls

## API Endpoints Used

The app integrates with the following Hume AI endpoints:

### Basic API Integration:
- `POST /v0/chat/groups` - Create chat groups
- `POST /v0/chat/groups/{id}/messages` - Send messages
- `GET /v0/chat/groups/{id}/messages` - Retrieve messages
- `DELETE /v0/chat/groups/{id}` - Delete chat groups
- `POST /v0/evi/chat/completions` - Voice processing

### Live Voice Integration (WebSocket):
- `wss://api.hume.ai/v1/evi` - Real-time voice conversation
- Supports continuous audio streaming
- Real-time message exchange
- Live voice synthesis and playback

## Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secure and rotate them regularly
- Monitor your Hume AI usage to avoid unexpected charges
- Consider implementing rate limiting for production use

## Next Steps

Once the basic integration is working:

1. Test voice recording and playback
2. Implement error handling and retry logic
3. Add voice configuration management
4. Implement session persistence
5. Add analytics and monitoring
