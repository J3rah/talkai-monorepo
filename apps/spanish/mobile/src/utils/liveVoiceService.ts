import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple EventEmitter implementation for React Native
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }

  removeAllListeners(): void {
    this.events = {};
  }
}

export interface LiveVoiceMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isInterim?: boolean;
}

export interface LiveVoiceConfig {
  configId: string;
  name: string;
  parameters?: {
    speaking_rate?: number;
    pitch?: number;
  };
}

class LiveVoiceService extends EventEmitter {
  private apiKey: string | null = null;
  private websocket: WebSocket | null = null;
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private isRecording = false;
  private isPlaying = false;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private lastSeedText: string | null = null;

  // Web audio streaming (web only)
  private audioContext: any = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isStreaming = false;
  private targetSampleRate = 16000;
  private sampleBuffer: Float32Array = new Float32Array(0);
  // Web-only speech recognition fallback
  private speechRecognition: any = null;
  private isSpeechRecognitionActive = false;

  // Turn-taking (simple VAD)
  private assistantPaused = false;
  private lastSpeechMs = 0;
  private speechThreshold = 0.003; // tweak if needed
  private silenceMs = 800;

  constructor() {
    super();
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  // ---------- Helpers ----------
  private extractTextFromContent(content: any): string | undefined {
    if (!content) return undefined;
    if (typeof content === 'string') return content;
    if (typeof content?.text === 'string') return content.text;
    if (Array.isArray(content)) {
      // Find first text-y segment
      for (const segment of content) {
        const t = this.extractTextFromContent(segment);
        if (t && typeof t === 'string' && t.trim()) return t;
      }
      return undefined;
    }
    // Some SDKs may use { type, text } shape
    if (typeof content === 'object' && typeof (content as any).text === 'string') {
      return (content as any).text;
    }
    return undefined;
  }

  async setApiKey(apiKey: string): Promise<void> {
    this.apiKey = apiKey;
    await AsyncStorage.setItem('hume_api_key', apiKey);
  }

  async getApiKey(): Promise<string | null> {
    if (this.apiKey) {
      return this.apiKey;
    }
    
    // Try environment variable first (for Expo)
    const envKey = process.env.EXPO_PUBLIC_HUME_API_KEY;
    if (envKey) {
      this.apiKey = envKey;
      return envKey;
    }
    
    // Fallback to AsyncStorage
    const storedKey = await AsyncStorage.getItem('hume_api_key');
    if (storedKey) {
      this.apiKey = storedKey;
      return storedKey;
    }
    
    return null;
  }

  async connect(configId: string, systemPrompt?: string): Promise<void> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('Hume API key not set');
    }

    return new Promise((resolve, reject) => {
      try {
        // Close existing connection
        this.disconnect();

        // Create WebSocket connection to documented chat endpoint with API key in query
        const wsUrl = `wss://api.hume.ai/v0/evi/chat?api_key=${encodeURIComponent(apiKey)}`;
        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = async () => {
          console.log('🔌 WebSocket connected to Hume Voice');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.assistantPaused = false;
          this.emit('connected');

          // Send initial session settings AFTER connection opens
          try {
            this.sendConfiguration(configId, systemPrompt);
          } catch (err) {
            console.error('Error sending initial configuration:', err);
          }

          // Don't auto-start streaming - let the UI control when to start

          resolve();
        };

        this.websocket.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            await this.handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.websocket.onerror = (error: any) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
        };

        this.websocket.onclose = (event: any) => {
          console.log('WebSocket closed:', event?.code, event?.reason || '');
          this.isConnected = false;
          this.stopMicStream().catch(() => {});
          this.emit('disconnected', event);
          
          if (event?.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect(configId, systemPrompt);
          }
        };
      } catch (error) {
        console.error('Error connecting to Hume Voice:', error);
        reject(error);
      }
    });
  }

  private sendConfiguration(configId: string, systemPrompt?: string) {
    if (!this.websocket || !this.isConnected) return;

    const sessionSettings = {
      type: 'session_settings',
      config_id: configId,
      audio: {
        encoding: 'linear16',
        sample_rate: this.targetSampleRate,
        channels: 1,
      },
    };

    this.websocket.send(JSON.stringify(sessionSettings));

    if (systemPrompt) {
      const seed = { type: 'assistant_input', text: systemPrompt };
      this.lastSeedText = systemPrompt;
      this.websocket.send(JSON.stringify(seed));
    }
  }

  private async handleWebSocketMessage(data: any) {
    try {
      if (__DEV__) {
        // Log type and minimal preview; avoid spamming large payloads
        const preview = typeof data === 'object' ? Object.keys(data) : typeof data;
        console.log('📨 Hume WS message:', data?.type, preview);
        // Special logging for assistant_message to debug text extraction
        if (data?.type === 'assistant_message') {
          console.log('🔍 Assistant message details:', {
            hasContent: !!data.content,
            contentType: typeof data.content,
            contentKeys: data.content ? Object.keys(data.content) : 'none',
            hasMessage: !!data.message,
            messageKeys: data.message ? Object.keys(data.message) : 'none'
          });
        }
        // Special logging for user_message to debug text extraction
        if (data?.type === 'user_message') {
          console.log('🔍 User message details:', {
            hasContent: !!data.content,
            contentType: typeof data.content,
            contentKeys: data.content ? Object.keys(data.content) : 'none',
            hasMessage: !!data.message,
            messageKeys: data.message ? Object.keys(data.message) : 'none',
            fullData: JSON.stringify(data, null, 2)
          });
        }
      }
    } catch {}
    if (data.type === 'chat_metadata') {
      this.emit('chatMetadata', data);
      return;
    }

    // Assistant final text output (multiple shapes)
    try {
      const assistantText: string | undefined =
        // Existing schema
        (data.type === 'output' ? this.extractTextFromContent(data.output?.text) : undefined) ??
        // Alternate shapes used by some SDKs
        (data.type === 'assistant_message' ? this.extractTextFromContent(data.content ?? data.message?.content ?? data.message?.text ?? data.message) : undefined) ??
        (data.message?.role === 'assistant' ? this.extractTextFromContent(data.message?.content ?? data.message?.text) : undefined);

      if (assistantText && typeof assistantText === 'string' && assistantText.trim()) {
        // Avoid echoing the seed/system prompt as spoken assistant output
        if (this.lastSeedText && assistantText.trim() === this.lastSeedText.trim()) {
          this.lastSeedText = null;
          return;
        }
        const message: LiveVoiceMessage = {
          id: Date.now().toString(),
          content: assistantText,
          role: 'assistant',
          timestamp: new Date(),
        };
        this.emit('message', message);
        await this.speakText(assistantText);
        return;
      }
    } catch (e) {
      // Non-fatal
    }

    // User transcript / echoed user input (multiple shapes)
    try {
      const userText: string | undefined =
        // Existing schema
        ((data.type === 'user_input') ? (typeof data.text === 'string' ? data.text : this.extractTextFromContent(data.text)) : undefined) ||
        ((data.type === 'transcript') ? (typeof data.text === 'string' ? data.text : this.extractTextFromContent(data.text ?? data.transcript)) : undefined) ||
        ((data.type === 'user_transcript') ? (typeof data.text === 'string' ? data.text : this.extractTextFromContent(data.text ?? data.transcript)) : undefined) ||
        // Variants
        (this.extractTextFromContent(data?.transcript)) ||
        (this.extractTextFromContent(data?.input_audio_transcription)) ||
        // Enhanced user_message parsing
        ((data.type === 'user_message') ? 
          (typeof data.content === 'string' ? data.content : 
           typeof data.message === 'string' ? data.message :
           this.extractTextFromContent(data.content ?? data.message?.text ?? data.message ?? data)) : undefined) ||
        ((data.message?.role === 'user') ? this.extractTextFromContent(data.message?.content ?? data.message?.text) : undefined) ||
        // Additional fallbacks for user speech
        (data.type === 'user_message' && data.message && typeof data.message === 'object' ? 
          (data.message.text || data.message.content || JSON.stringify(data.message)) : undefined);

      if (userText && typeof userText === 'string' && userText.trim()) {
        console.log('🎤 User transcript extracted:', userText);
        const message: LiveVoiceMessage = {
          id: Date.now().toString(),
          content: userText,
          role: 'user',
          timestamp: new Date(),
        };
        this.emit('message', message);
        return;
      }
    } catch (e) {
      console.log('❌ Error parsing user message:', e);
      // Non-fatal
    }

    // Interim/partial assistant output (multiple shapes)
    try {
      const interimText: string | undefined =
        (data.type === 'interim_output' && this.extractTextFromContent(data.output?.text ?? data.output)) ||
        (data.type === 'interim_transcript' ? (typeof data.text === 'string' ? data.text : this.extractTextFromContent(data.transcript ?? data.text)) : undefined) ||
        ((data.message?.role === 'assistant' && data.message?.isInterim) ? this.extractTextFromContent(data.message?.content) : undefined);

      if (interimText && typeof interimText === 'string' && interimText.trim()) {
        const message: LiveVoiceMessage = {
          id: `interim-${Date.now()}`,
          content: interimText,
          role: 'assistant',
          timestamp: new Date(),
          isInterim: true,
        };
        this.emit('interimMessage', message);
        return;
      }
    } catch (e) {
      // Non-fatal
    }

    if (data.type === 'error') {
      const msg = data.message || data.error || JSON.stringify(data);
      console.error('Hume Voice error:', msg);
      this.emit('error', new Error(String(msg)));
      return;
    }

    // Fallback heuristic: if there is any text-like field, display it once.
    try {
      const textCandidate: any = data?.text ?? data?.content?.text ?? data?.content ?? data?.output?.text;
      if (typeof textCandidate === 'string' && textCandidate.trim()) {
        const role: 'user' | 'assistant' =
          /user|transcript/i.test(String(data?.type)) || data?.message?.role === 'user' ? 'user' : 'assistant';
        if (role === 'assistant' && this.lastSeedText && textCandidate.trim() === this.lastSeedText.trim()) {
          this.lastSeedText = null;
          return;
        }
        const message: LiveVoiceMessage = {
          id: Date.now().toString(),
          content: textCandidate,
          role,
          timestamp: new Date(),
        };
        this.emit('message', message);
        if (role === 'assistant') {
          await this.speakText(textCandidate);
        }
      }
    } catch (e) {
      // swallow
    }
  }

  private sendPauseAssistant() {
    try {
      if (this.websocket && this.websocket.readyState === 1) {
        this.websocket.send(JSON.stringify({ type: 'pause_assistant_message' }));
        if (__DEV__) console.log('⏸️ pause_assistant_message');
      }
    } catch {}
  }

  private sendResumeAssistant() {
    try {
      if (this.websocket && this.websocket.readyState === 1) {
        this.websocket.send(JSON.stringify({ type: 'resume_assistant_message' }));
        if (__DEV__) console.log('▶️ resume_assistant_message');
      }
    } catch {}
  }

  // Public controls for UI
  async pauseStreaming(): Promise<void> {
    if (this.isStreaming) {
      await this.stopMicStream();
    }
    this.sendPauseAssistant();
  }

  async resumeStreaming(): Promise<void> {
    if (!this.isStreaming) {
      await this.startMicStream();
    }
    this.sendResumeAssistant();
  }

  // ---------- Web mic streaming ----------
  private isWeb(): boolean {
    return typeof window !== 'undefined' && typeof navigator !== 'undefined';
  }

  private floatTo16BitPCM(float32Array: Float32Array): Uint8Array {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Uint8Array(buffer);
  }

  private bytesToBase64(bytes: Uint8Array): string {
    // Avoid stack overflow on large arrays by chunking
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const sub = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(sub));
    }
    return btoa(binary);
  }

  private concatFloat32(a: Float32Array, b: Float32Array): Float32Array {
    const out = new Float32Array(a.length + b.length);
    out.set(a, 0);
    out.set(b, a.length);
    return out;
  }

  private downsampleBuffer(buffer: Float32Array, inputSampleRate: number, outSampleRate: number): Float32Array {
    if (outSampleRate === inputSampleRate) return buffer;
    const sampleRateRatio = inputSampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  async startMicStream(): Promise<void> {
    if (!this.isWeb()) return; // only auto-stream on web for now
    if (this.isStreaming) return;
    if (!this.websocket || !this.isConnected) throw new Error('Not connected');

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // @ts-ignore
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.audioContext.resume().catch(() => {});
      // Start web speech recognition fallback if available
      try {
        // @ts-ignore
        const RecognitionCtor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (RecognitionCtor && !this.isSpeechRecognitionActive) {
          this.speechRecognition = new RecognitionCtor();
          this.speechRecognition.continuous = true;
          this.speechRecognition.interimResults = false;
          this.speechRecognition.lang = 'en-US';
          this.speechRecognition.maxAlternatives = 1;
          this.speechRecognition.onresult = (e: any) => {
            if (!e?.results?.length) return;
            const result = e.results[e.results.length - 1];
            const transcript = result[0]?.transcript;
            const confidence = result[0]?.confidence || 0;
            // Only emit high-confidence, substantial transcripts to avoid noise
            if (transcript && transcript.trim().length > 3 && confidence > 0.7) {
              console.log('🎤 Speech recognition:', { transcript, confidence });
              const message: LiveVoiceMessage = {
                id: Date.now().toString(),
                content: transcript,
                role: 'user',
                timestamp: new Date(),
              };
              this.emit('message', message);
            }
          };
          this.speechRecognition.onerror = (e: any) => {
            console.log('🎤 Speech recognition error:', e.error);
          };
          this.speechRecognition.onend = () => {};
          try { this.speechRecognition.start(); this.isSpeechRecognitionActive = true; } catch {}
        }
      } catch {}

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      const bufferSize = 2048; // smaller chunk to reduce latency
      this.processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

      if (!this.processor) {
        throw new Error('Processor not initialized');
      }
      this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
        if (!this.isStreaming || !this.websocket || !this.isConnected) return;
        const inputBuffer = event.inputBuffer.getChannelData(0);
        // accumulate ~100ms of audio before sending
        this.sampleBuffer = this.concatFloat32(this.sampleBuffer, new Float32Array(inputBuffer));
        const inputRate = this.audioContext.sampleRate || 44100;
        const samplesPerChunk = Math.floor(this.targetSampleRate * 0.1); // 100ms
        const requiredBufferLen = Math.floor(samplesPerChunk * (inputRate / this.targetSampleRate));
        if (this.sampleBuffer.length >= requiredBufferLen) {
          const toProcess = this.sampleBuffer.slice(0, requiredBufferLen);
          this.sampleBuffer = this.sampleBuffer.slice(requiredBufferLen);
          const down = this.downsampleBuffer(toProcess, inputRate, this.targetSampleRate);
          // simple RMS for debug / VAD
          let rms = 0;
          for (let i = 0; i < down.length; i++) rms += down[i] * down[i];
          rms = Math.sqrt(rms / down.length);
          // Emit RMS for UI waveform
          try { this.emit('rms', rms); } catch {}

          // Turn taking: pause assistant when speech is detected; resume after silence
          const now = Date.now();
          if (rms > this.speechThreshold) {
            this.lastSpeechMs = now;
            if (!this.assistantPaused) {
              this.sendPauseAssistant();
              this.assistantPaused = true;
            }
          } else if (this.assistantPaused && now - this.lastSpeechMs > this.silenceMs) {
            this.sendResumeAssistant();
            this.assistantPaused = false;
          }

          const pcm16 = this.floatTo16BitPCM(down);
          const base64 = this.bytesToBase64(pcm16);
          const audioMsg = {
            type: 'audio_input',
            data: base64,
            encoding: 'linear16',
            sample_rate: this.targetSampleRate,
            channels: 1,
          };
          try {
            if (this.websocket && this.websocket.readyState === 1 /* OPEN */) {
              this.websocket.send(JSON.stringify(audioMsg));
              if (__DEV__) console.log('🔊 sent chunk', { len: pcm16.length, rms: Number(rms.toFixed(4)) });
            }
          } catch (e) {
            // ignore transient send errors
          }
        }
      };

      if (this.processor) {
        source.connect(this.processor);
      }
      if (this.processor && this.audioContext && this.audioContext.destination) {
        this.processor.connect(this.audioContext.destination);
      }
      this.isStreaming = true;
      this.emit('recordingStarted');
      console.log('🎤 Mic streaming started');
    } catch (e) {
      console.error('Failed to start mic streaming:', e);
      throw e;
    }
  }

  async stopMicStream(): Promise<void> {
    if (!this.isStreaming) return;
    try {
      this.isStreaming = false;
      this.emit('recordingStopped');
      if (this.isSpeechRecognitionActive && this.speechRecognition) {
        try { this.speechRecognition.stop(); } catch {}
        this.isSpeechRecognitionActive = false;
        this.speechRecognition = null;
      }
      if (this.processor) {
        try { this.processor.disconnect(); } catch {}
        this.processor.onaudioprocess = null as any;
        this.processor = null;
      }
      if (this.audioContext) {
        try { this.audioContext.close(); } catch {}
        this.audioContext = null;
      }
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(t => t.stop());
        this.mediaStream = null;
      }
      this.sampleBuffer = new Float32Array(0);
      console.log('🛑 Mic streaming stopped');
    } catch (e) {
      console.error('Failed to stop mic streaming:', e);
    }
  }

  // ---------- Legacy manual recording (native fallback) ----------
  async startLiveRecording(): Promise<void> {
    if (this.isRecording) {
      throw new Error('Already recording');
    }
    if (!this.isConnected) {
      throw new Error('Not connected to Hume Voice');
    }
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;
      this.isRecording = true;
      this.emit('recordingStarted');
      console.log('🎤 Live recording started');
    } catch (error) {
      console.error('Error starting live recording:', error);
      throw error;
    }
  }

  async stopLiveRecording(): Promise<string> {
    if (!this.recording || !this.isRecording) {
      throw new Error('Not recording');
    }
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
      }
      const uri = this.recording ? this.recording.getURI() : null;
      this.recording = null;
      this.isRecording = false;
      this.emit('recordingStopped');
      if (!uri) {
        throw new Error('No recording URI available');
      }
      await this.sendAudioFileToHume(uri);
      return uri;
    } catch (error) {
      console.error('Error stopping live recording:', error);
      throw error;
    }
  }

  private async sendAudioFileToHume(audioUri: string): Promise<void> {
    if (!this.websocket || !this.isConnected) {
      throw new Error('Not connected to Hume Voice');
    }
    try {
      const response = await fetch(audioUri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const audioMessage = {
        type: 'audio_input',
        data: base64Audio,
        encoding: 'linear16',
        sample_rate: this.targetSampleRate,
        channels: 1,
      };
      if (this.websocket && this.websocket.readyState === 1 /* OPEN */) {
        this.websocket.send(JSON.stringify(audioMessage));
      }
      console.log('🎵 Audio file sent to Hume Voice');
    } catch (error) {
      console.error('Error sending audio to Hume:', error);
      throw error;
    }
  }

  async sendTextMessage(text: string): Promise<void> {
    if (!this.websocket || !this.isConnected) {
      throw new Error('Not connected to Hume Voice');
    }
    try {
      const textMessage = { type: 'user_input', text };
      this.websocket.send(JSON.stringify(textMessage));
      console.log('📝 Text message sent to Hume Voice');
    } catch (error) {
      console.error('Error sending text message:', error);
      throw error;
    }
  }

  private async speakText(text: string): Promise<void> {
    if (this.isPlaying) {
      await this.stopAudio();
    }
    try {
      console.log('🔊 Speaking:', text);
      this.emit('speaking', text);
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }

  async stopAudio(): Promise<void> {
    if (this.sound && this.isPlaying) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
        this.isPlaying = false;
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  }

  private attemptReconnect(configId: string, systemPrompt?: string) {
    this.reconnectAttempts++;
    console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect(configId, systemPrompt);
      } catch (error) {
        console.error('Reconnection failed:', error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect(configId, systemPrompt);
        } else {
          this.emit('reconnectionFailed');
        }
      }
    }, 1000 * this.reconnectAttempts);
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.stopMicStream().catch(() => {});
    if (this.websocket) {
      try { this.websocket.close(1000, 'Manual disconnect'); } catch {}
      this.websocket = null;
    }
    if (this.recording) {
      this.recording.stopAndUnloadAsync();
      this.recording = null;
    }
    this.isRecording = false;
    this.emit('disconnected');
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording || this.isStreaming;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  isConnectedToHume(): boolean {
    return this.isConnected;
  }

  cleanup(): void {
    this.disconnect();
    this.removeAllListeners();
  }
}

export const liveVoiceService = new LiveVoiceService();
