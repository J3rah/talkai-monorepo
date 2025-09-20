#!/usr/bin/env node

/**
 * Script to test Hume TTS API directly
 */

require('dotenv').config({ path: './.env.local' });

async function testHumeTTS() {
  const apiKey = process.env.HUME_API_KEY;
  
  if (!apiKey) {
    console.error('HUME_API_KEY not found in environment');
    process.exit(1);
  }

  console.log('🎵 Testing Hume TTS API...');
  console.log('API Key length:', apiKey.length);
  
  // Test with Luna's voice config ID
  const voiceConfigId = '3a451da2-a50a-42c2-83fa-13c79f027643';
  
  const payload = {
    utterances: [
      {
        text: "Hello, this is a test of the voice sample.",
        voice: {
          id: voiceConfigId,
          provider: "HUME_AI",
        },
      },
    ],
    format: { type: "mp3" },
    num_generations: 1,
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch("https://api.hume.ai/v0/voice/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hume-Api-Key": apiKey,
        Accept: "audio/mpeg,application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get("content-type") || "";
    
    if (response.ok && contentType.includes("audio")) {
      console.log('✅ Success! Received audio response');
      const audioBuffer = await response.arrayBuffer();
      console.log('Audio size:', audioBuffer.byteLength, 'bytes');
    } else {
      const responseText = await response.text();
      console.log('❌ Error response:');
      console.log('Content-Type:', contentType);
      console.log('Body:', responseText);
      
      if (contentType.includes("application/json")) {
        try {
          const jsonResponse = JSON.parse(responseText);
          console.log('Parsed JSON:', JSON.stringify(jsonResponse, null, 2));
        } catch (e) {
          console.log('Could not parse as JSON');
        }
      }
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testHumeTTS();
