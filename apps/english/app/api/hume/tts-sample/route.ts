import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log('🎵 TTS Sample API: Request received');
    const { voiceConfigId, voiceParameters, text } = await req.json();
    console.log('🎵 TTS Sample API: Request data:', { voiceConfigId, voiceParameters, text });
    
    if (!voiceConfigId) {
      console.log('🎵 TTS Sample API: Missing voiceConfigId');
      return NextResponse.json({ error: "Voice configuration ID is required" }, { status: 400 });
    }

    const apiKey = process.env.HUME_API_KEY || "";
    
    // Fetch voice configuration to get TTS config ID
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: voiceConfig, error: configError } = await supabase
      .from('voice_configurations')
      .select('hume_config_id, tts_config_id')
      .eq('hume_config_id', voiceConfigId)
      .single();
    
    if (configError || !voiceConfig) {
      console.log('🎵 TTS Sample API: Voice config not found, using provided ID directly');
    }
    
    // Use TTS config ID if available, otherwise fall back to EVI config ID
    const ttsConfigId = voiceConfig?.tts_config_id || voiceConfigId;
    console.log('🎵 TTS Sample API: Using TTS config ID:', ttsConfigId);
    
    // Build voice object with correct structure for Hume API
    const voice: any = {
      id: ttsConfigId, // Use the TTS config ID
      provider: "CUSTOM_VOICE",
    };
    
    const payload = {
      utterances: [
        {
          text: text || "Hello, I'm your AI therapist. How are you feeling today?",
          voice,
        },
      ],
      format: { type: "mp3" },
      num_generations: 1,
    } as const;

    console.log('🎵 TTS Sample API: Sending request to Hume with payload:', JSON.stringify(payload, null, 2));
    
    const resp = await fetch("https://api.hume.ai/v0/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hume-Api-Key": apiKey,
        Accept: "audio/mpeg,application/json",
      },
      body: JSON.stringify(payload),
    });
    
    console.log('🎵 TTS Sample API: Hume response status:', resp.status, resp.statusText);

    const ct = resp.headers.get("content-type") || "";

    if (resp.ok && ct.includes("audio")) {
      const audio = await resp.arrayBuffer();
      return new NextResponse(audio, {
        headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=3600" },
      });
    }

    // If Hume returns JSON (which might contain audio data), parse it
    if (resp.ok && ct.includes("application/json")) {
      const jsonResponse = await resp.json();
      console.log("Hume API JSON Response:", jsonResponse);
      
      // Check if the response contains audio data
      if (jsonResponse.generations && jsonResponse.generations[0] && jsonResponse.generations[0].audio) {
        const audioBase64 = jsonResponse.generations[0].audio;
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        
        return new NextResponse(audioBuffer, {
          headers: { 
            "Content-Type": "audio/mpeg", 
            "Cache-Control": "public, max-age=3600",
            "Content-Length": audioBuffer.length.toString()
          },
        });
      }
    }

    // If Hume returns JSON with error details, forward them for visibility
    const raw = await resp.text();
    console.log("Hume API Error Response:", {
      status: resp.status,
      statusText: resp.statusText,
      contentType: ct,
      body: raw
    });
    const details = ct.includes("application/json") ? raw : raw;
    return NextResponse.json({ error: "Failed to generate voice sample", details }, { status: resp.status });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal server error", details: String(e?.message || e) }, { status: 500 });
  }
}