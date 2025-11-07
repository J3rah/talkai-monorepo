/**
 * Hume EVI (Emotional Voice Interface) Client
 * Handles WebSocket streaming with Hume for real-time emotional voice analysis
 */

import { fetchAccessToken } from 'hume';

export interface HumeEmotion {
  name: string;
  score: number;
}

export interface HumeMessage {
  type: 'user_message' | 'assistant_message' | 'audio_input' | 'audio_output';
  role: 'user' | 'assistant';
  content?: string;
  timestamp: number;
  emotions?: HumeEmotion[];
  prosody?: {
    scores: Record<string, number>;
  };
  audioData?: ArrayBuffer;
}

export interface HumeConnectionConfig {
  configId: string;
  accessToken: string;
  onMessage?: (message: HumeMessage) => void;
  onEmotion?: (emotions: HumeEmotion[]) => void;
  onAudio?: (audioData: ArrayBuffer) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export class HumeClient {
  private ws: WebSocket | null = null;
  private config: HumeConnectionConfig;
  private messageQueue: any[] = [];
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;

  constructor(config: HumeConnectionConfig) {
    this.config = config;
  }

  /**
   * Connect to Hume EVI WebSocket
   */
  async connect(): Promise<void> {
    try {
      const wsUrl = `wss://api.hume.ai/v0/evi/chat?config_id=${this.config.configId}&access_token=${this.config.accessToken}`;
      
      console.log('🔌 Connecting to Hume EVI...');
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ Connected to Hume EVI');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.config.onConnect?.();
        
        // Send queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          this.send(message);
        }
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('❌ Hume WebSocket error:', error);
        this.config.onError?.(new Error('WebSocket connection error'));
      };

      this.ws.onclose = () => {
        console.log('🔌 Disconnected from Hume EVI');
        this.isConnected = false;
        this.config.onDisconnect?.();
        
        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
        }
      };
    } catch (error) {
      console.error('❌ Failed to connect to Hume:', error);
      throw error;
    }
  }

  /**
   * Start capturing audio from user microphone
   */
  async startAudioCapture(): Promise<void> {
    try {
      // Get user media stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      // Create audio context
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create script processor for audio processing
      const bufferSize = 4096;
      this.audioProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
      
      this.audioProcessor.onaudioprocess = (event) => {
        if (!this.isConnected) return;
        
        const inputData = event.inputBuffer.getChannelData(0);
        const pcmData = this.floatTo16BitPCM(inputData);
        
        // Send audio data to Hume
        this.sendAudio(pcmData);
      };

      source.connect(this.audioProcessor);
      this.audioProcessor.connect(this.audioContext.destination);
      
      console.log('🎤 Audio capture started');
    } catch (error) {
      console.error('❌ Failed to start audio capture:', error);
      throw error;
    }
  }

  /**
   * Stop audio capture
   */
  stopAudioCapture(): void {
    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    console.log('🎤 Audio capture stopped');
  }

  /**
   * Send audio data to Hume
   */
  private sendAudio(audioData: Int16Array): void {
    if (!this.isConnected || !this.ws) return;

    const message = {
      type: 'audio_input',
      data: Array.from(audioData),
      timestamp: Date.now(),
    };

    this.send(message);
  }

  /**
   * Send text message to Hume
   */
  sendTextMessage(text: string): void {
    const message = {
      type: 'user_message',
      content: text,
      timestamp: Date.now(),
    };

    if (this.isConnected) {
      this.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  /**
   * Handle incoming messages from Hume
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      
      // Parse message based on type
      switch (message.type) {
        case 'user_message':
        case 'assistant_message':
          const chatMessage: HumeMessage = {
            type: message.type,
            role: message.role,
            content: message.message?.content || message.content,
            timestamp: message.timestamp || Date.now(),
            emotions: message.models?.prosody?.scores ? this.parseEmotions(message.models.prosody.scores) : [],
            prosody: message.models?.prosody,
          };
          this.config.onMessage?.(chatMessage);
          
          if (chatMessage.emotions && chatMessage.emotions.length > 0) {
            this.config.onEmotion?.(chatMessage.emotions);
          }
          break;

        case 'audio_output':
          if (message.data) {
            const audioData = this.base64ToArrayBuffer(message.data);
            this.config.onAudio?.(audioData);
          }
          break;

        default:
          console.log('📨 Received message:', message.type);
      }
    } catch (error) {
      console.error('❌ Error parsing Hume message:', error);
    }
  }

  /**
   * Parse emotions from Hume prosody scores
   */
  private parseEmotions(scores: Record<string, number>): HumeEmotion[] {
    return Object.entries(scores)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 emotions
  }

  /**
   * Send message via WebSocket
   */
  private send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Convert Float32Array to 16-bit PCM
   */
  private floatTo16BitPCM(float32Array: Float32Array): Int16Array {
    const pcm = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm;
  }

  /**
   * Convert base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Disconnect from Hume
   */
  disconnect(): void {
    this.stopAudioCapture();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
  }

  /**
   * Get connection status
   */
  getStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      default:
        return 'disconnected';
    }
  }
}

/**
 * Fetch Hume access token
 */
export async function getHumeAccessToken(): Promise<string> {
  try {
    const response = await fetch('/api/hume/access-token');
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error('Failed to fetch Hume access token:', error);
    throw error;
  }
}

