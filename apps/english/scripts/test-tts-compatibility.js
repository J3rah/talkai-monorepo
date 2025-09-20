#!/usr/bin/env node

/**
 * Script to test which EVI voice config IDs also work with TTS
 */

require('dotenv').config({ path: './.env.local' });

const voiceConfigs = [
  { name: 'Zander (Male)', id: '793d1f15-4bf9-4beb-a4ab-a62caff84e70' },
  { name: 'Luna (Female)', id: '3a451da2-a50a-42c2-83fa-13c79f027643' },
  { name: 'Energetic Voice', id: '8a80af40-ec14-4da0-afeb-d11008491410' },
  { name: 'Brit (British)', id: 'ea959dd5-8316-4373-b30e-7d10f1a75631' },
  { name: 'Sass (Western)', id: '8346ae7f-32c4-40f6-aa81-20ce7081df13' },
  { name: 'Nia (Louisiana)', id: '22161928-44b4-4514-b464-e9d8b0636afa' },
  { name: 'Julian (British Therapist)', id: '7538b2c8-4527-4e56-919f-19523d640a8e' },
  { name: 'Aven (Male Protagonist)', id: 'b4fe69c2-720c-44bb-ae45-eccfcc7ebcd6' },
  { name: 'The Pirate (Jack Sparrow)', id: 'a608626e-23e0-4070-8e24-dc880d34000b' },
  { name: 'Zora (Harlem Storyteller)', id: '959e5574-4f1a-4f33-a295-84265c438ab3' },
  { name: 'Kai (Tech Guru)', id: '0aae3b3b-b14f-444d-b728-66fb6f0e700f' },
];

async function testTTSCompatibility() {
  const apiKey = process.env.HUME_API_KEY;
  
  if (!apiKey) {
    console.error('❌ HUME_API_KEY not found in environment');
    process.exit(1);
  }

  console.log('🎵 Testing TTS Compatibility for EVI Voice Config IDs');
  console.log('====================================================\n');

  const results = {
    compatible: [],
    incompatible: []
  };

  for (const voice of voiceConfigs) {
    console.log(`Testing ${voice.name}...`);
    
    const payload = {
      utterances: [
        {
          text: "Hello, this is a test of the voice sample.",
          voice: {
            id: voice.id,
            provider: "CUSTOM_VOICE",
          },
        },
      ],
      format: { type: "mp3" },
      num_generations: 1,
    };

    try {
      const response = await fetch("https://api.hume.ai/v0/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Hume-Api-Key": apiKey,
          Accept: "audio/mpeg,application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      
      if (response.ok && (contentType.includes("audio") || contentType.includes("application/json"))) {
        console.log(`✅ ${voice.name} - TTS Compatible`);
        results.compatible.push(voice);
      } else {
        const responseText = await response.text();
        console.log(`❌ ${voice.name} - TTS Incompatible (${response.status})`);
        results.incompatible.push({ ...voice, error: responseText.substring(0, 100) });
      }
    } catch (error) {
      console.log(`❌ ${voice.name} - Error: ${error.message}`);
      results.incompatible.push({ ...voice, error: error.message });
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 RESULTS SUMMARY');
  console.log('==================');
  console.log(`✅ TTS Compatible (${results.compatible.length}):`);
  results.compatible.forEach(voice => {
    console.log(`   - ${voice.name}: ${voice.id}`);
  });
  
  console.log(`\n❌ TTS Incompatible (${results.incompatible.length}):`);
  results.incompatible.forEach(voice => {
    console.log(`   - ${voice.name}: ${voice.id}`);
  });

  console.log('\n💡 Next Steps:');
  if (results.incompatible.length > 0) {
    console.log('   - Incompatible voices need separate TTS config IDs');
    console.log('   - Compatible voices can use their EVI IDs for both');
  } else {
    console.log('   - All voices are TTS compatible! No separate TTS IDs needed.');
  }
}

testTTSCompatibility().catch(console.error);
