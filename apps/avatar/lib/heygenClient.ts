/**
 * HeyGen Realtime Avatar API Client
 * Handles WebRTC streaming with HeyGen for human-like video avatar rendering
 */

export interface HeyGenConfig {
  apiKey: string;
  avatarId: string;
  voiceId?: string;
  quality?: 'low' | 'medium' | 'high';
  onVideoReady?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface AvatarExpression {
  emotion: string;
  intensity: number; // 0-1
  duration?: number; // milliseconds
}

export class HeyGenClient {
  private config: HeyGenConfig;
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private sessionId: string | null = null;
  private isConnected: boolean = false;
  private videoStream: MediaStream | null = null;
  private audioQueue: ArrayBuffer[] = [];
  private isProcessingAudio: boolean = false;
  private currentExpression: AvatarExpression | null = null;

  constructor(config: HeyGenConfig) {
    this.config = config;
  }

  /**
   * Initialize WebRTC connection with HeyGen
   */
  async connect(): Promise<void> {
    try {
      console.log('🎭 Connecting to HeyGen Streaming Avatar API...');

      // Step 1: Create session with HeyGen API
      const session = await this.createSession();
      this.sessionId = session.session_id;

      // Step 2: Set up WebRTC peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      // Handle incoming media streams
      this.peerConnection.ontrack = (event) => {
        console.log('📹 Received video track from HeyGen');
        this.videoStream = event.streams[0];
        this.config.onVideoReady?.(this.videoStream);
      };

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        console.log('🔌 Connection state:', this.peerConnection?.connectionState);
        
        if (this.peerConnection?.connectionState === 'connected') {
          this.isConnected = true;
          this.config.onConnect?.();
        } else if (this.peerConnection?.connectionState === 'disconnected' || 
                   this.peerConnection?.connectionState === 'failed') {
          this.isConnected = false;
          this.config.onDisconnect?.();
        }
      };

      // Create data channel for control messages
      this.dataChannel = this.peerConnection.createDataChannel('control');
      this.setupDataChannel();

      // Step 3: Create and set local offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Step 4: Send offer to HeyGen and get answer
      const answer = await this.sendOffer(offer);
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

      console.log('✅ Connected to HeyGen avatar');
    } catch (error) {
      console.error('❌ Failed to connect to HeyGen:', error);
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Create HeyGen streaming session
   */
  private async createSession(): Promise<any> {
    const response = await fetch('https://api.heygen.com/v1/streaming.new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.config.apiKey,
      },
      body: JSON.stringify({
        avatar_id: this.config.avatarId,
        voice_id: this.config.voiceId,
        quality: this.config.quality || 'medium',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create HeyGen session: ${error.message}`);
    }

    return response.json();
  }

  /**
   * Send WebRTC offer to HeyGen
   */
  private async sendOffer(offer: RTCSessionDescriptionInit): Promise<any> {
    const response = await fetch('https://api.heygen.com/v1/streaming.start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.config.apiKey,
      },
      body: JSON.stringify({
        session_id: this.sessionId,
        sdp: offer,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to start HeyGen stream: ${error.message}`);
    }

    const data = await response.json();
    return data.sdp;
  }

  /**
   * Set up data channel for control messages
   */
  private setupDataChannel(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('📡 Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      console.log('📨 Received message from avatar:', event.data);
    };

    this.dataChannel.onerror = (error) => {
      console.error('❌ Data channel error:', error);
    };
  }

  /**
   * Send audio to HeyGen for lip-sync
   */
  async sendAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ Not connected, queuing audio');
      this.audioQueue.push(audioData);
      return;
    }

    try {
      // Convert audio to base64
      const base64Audio = this.arrayBufferToBase64(audioData);

      // Send via data channel
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        this.dataChannel.send(JSON.stringify({
          type: 'audio',
          data: base64Audio,
          timestamp: Date.now(),
        }));
      } else {
        // Fallback: Send via HTTP API
        await this.sendAudioViaAPI(base64Audio);
      }

      // Process queued audio
      if (!this.isProcessingAudio && this.audioQueue.length > 0) {
        this.processAudioQueue();
      }
    } catch (error) {
      console.error('❌ Failed to send audio:', error);
    }
  }

  /**
   * Send audio via HTTP API (fallback)
   */
  private async sendAudioViaAPI(base64Audio: string): Promise<void> {
    await fetch(`https://api.heygen.com/v1/streaming.task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.config.apiKey,
      },
      body: JSON.stringify({
        session_id: this.sessionId,
        audio: base64Audio,
      }),
    });
  }

  /**
   * Process queued audio
   */
  private async processAudioQueue(): Promise<void> {
    this.isProcessingAudio = true;

    while (this.audioQueue.length > 0) {
      const audio = this.audioQueue.shift();
      if (audio) {
        await this.sendAudio(audio);
        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    this.isProcessingAudio = false;
  }

  /**
   * Update avatar expression based on emotion
   */
  async setExpression(expression: AvatarExpression): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ Not connected, cannot set expression');
      return;
    }

    try {
      this.currentExpression = expression;

      const message = {
        type: 'expression',
        emotion: expression.emotion,
        intensity: expression.intensity,
        duration: expression.duration || 2000,
        timestamp: Date.now(),
      };

      // Send via data channel
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        this.dataChannel.send(JSON.stringify(message));
      } else {
        // Send via HTTP API
        await fetch(`https://api.heygen.com/v1/streaming.control`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.config.apiKey,
          },
          body: JSON.stringify({
            session_id: this.sessionId,
            ...message,
          }),
        });
      }

      console.log(`😊 Set avatar expression: ${expression.emotion} (${expression.intensity})`);
    } catch (error) {
      console.error('❌ Failed to set expression:', error);
    }
  }

  /**
   * Update avatar expression smoothly with interpolation
   */
  async transitionExpression(
    fromExpression: AvatarExpression,
    toExpression: AvatarExpression,
    duration: number = 1000
  ): Promise<void> {
    const steps = 20;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      const alpha = i / steps;
      const intensity = fromExpression.intensity + (toExpression.intensity - fromExpression.intensity) * alpha;

      await this.setExpression({
        emotion: toExpression.emotion,
        intensity,
        duration: stepDuration,
      });

      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  /**
   * Pause avatar animation
   */
  async pause(): Promise<void> {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({
        type: 'control',
        action: 'pause',
      }));
    }
  }

  /**
   * Resume avatar animation
   */
  async resume(): Promise<void> {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({
        type: 'control',
        action: 'resume',
      }));
    }
  }

  /**
   * Disconnect from HeyGen
   */
  async disconnect(): Promise<void> {
    console.log('🔌 Disconnecting from HeyGen...');

    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Stop session via API
    if (this.sessionId) {
      try {
        await fetch('https://api.heygen.com/v1/streaming.stop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.config.apiKey,
          },
          body: JSON.stringify({
            session_id: this.sessionId,
          }),
        });
      } catch (error) {
        console.error('Failed to stop HeyGen session:', error);
      }
    }

    this.isConnected = false;
    this.sessionId = null;
    this.videoStream = null;
    this.config.onDisconnect?.();

    console.log('✅ Disconnected from HeyGen');
  }

  /**
   * Get current video stream
   */
  getVideoStream(): MediaStream | null {
    return this.videoStream;
  }

  /**
   * Get connection status
   */
  getStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Convert ArrayBuffer to base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

/**
 * Map Hume emotions to HeyGen expressions
 */
export function mapEmotionToExpression(emotion: string, score: number): AvatarExpression {
  const emotionMap: Record<string, string> = {
    joy: 'happy',
    happiness: 'happy',
    excitement: 'excited',
    contentment: 'content',
    sadness: 'sad',
    anger: 'angry',
    fear: 'worried',
    surprise: 'surprised',
    anxiety: 'worried',
    calmness: 'calm',
    confidence: 'confident',
  };

  const mappedEmotion = emotionMap[emotion.toLowerCase()] || 'neutral';
  
  return {
    emotion: mappedEmotion,
    intensity: Math.min(1, score * 1.5), // Amplify intensity slightly
    duration: 2000,
  };
}

