import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HumeMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
}

export interface HumeChatGroup {
  id: string;
  name: string;
  config_id: string;
  created_at: string;
}

export interface HumeVoiceConfig {
  id: string;
  name: string;
  description: string;
  config_id: string;
  parameters?: {
    speaking_rate?: number;
    pitch?: number;
  };
}

class HumeService {
  private apiKey: string | null = null;
  private chatGroupId: string | null = null;
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private isRecording = false;
  private isPlaying = false;

  constructor() {
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

  async createChatGroup(configId: string, name: string): Promise<HumeChatGroup> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('Hume API key not set');
    }

    try {
      const response = await fetch('https://api.hume.ai/v0/chat/groups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config_id: configId,
          name: name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create chat group: ${errorData.message || response.statusText}`);
      }

      const chatGroup = await response.json();
      this.chatGroupId = chatGroup.id;
      await AsyncStorage.setItem('hume_chat_group_id', chatGroup.id);
      
      return chatGroup;
    } catch (error) {
      console.error('Error creating chat group:', error);
      throw error;
    }
  }

  async sendMessage(content: string, role: 'user' | 'assistant' = 'user'): Promise<HumeMessage> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('Hume API key not set');
    }

    if (!this.chatGroupId) {
      throw new Error('No active chat group');
    }

    try {
      const response = await fetch(`https://api.hume.ai/v0/chat/groups/${this.chatGroupId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          role: role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send message: ${errorData.message || response.statusText}`);
      }

      const messageData = await response.json();
      
      const message: HumeMessage = {
        id: messageData.id || Date.now().toString(),
        content: messageData.content || content,
        role: role,
        timestamp: new Date(),
      };

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendVoiceMessage(audioUri: string): Promise<HumeMessage> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('Hume API key not set');
    }

    try {
      // Convert audio file to base64
      const response = await fetch(audioUri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Send to Hume Voice API
      const humeResponse = await fetch('https://api.hume.ai/v0/evi/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hume-Api-Key': apiKey,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'audio',
                  audio: {
                    data: base64Audio,
                    mime_type: 'audio/m4a'
                  }
                }
              ]
            }
          ],
          stream: false
        }),
      });

      if (!humeResponse.ok) {
        const errorData = await humeResponse.json();
        throw new Error(`Failed to process voice message: ${errorData.message || humeResponse.statusText}`);
      }

      const data = await humeResponse.json();
      const assistantMessage = data.choices[0]?.message?.content;

      if (!assistantMessage) {
        throw new Error('No response from Hume Voice API');
      }

      // Send the transcribed text to the chat group
      const message = await this.sendMessage(assistantMessage, 'user');

      return message;
    } catch (error) {
      console.error('Error sending voice message:', error);
      throw error;
    }
  }

  async startRecording(): Promise<void> {
    if (this.isRecording) {
      throw new Error('Already recording');
    }

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      this.recording = recording;
      this.isRecording = true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string> {
    if (!this.recording || !this.isRecording) {
      throw new Error('Not recording');
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      
      this.recording = null;
      this.isRecording = false;

      if (!uri) {
        throw new Error('No recording URI available');
      }

      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  async playAudio(audioUrl: string): Promise<void> {
    if (this.isPlaying) {
      await this.stopAudio();
    }

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      this.sound = sound;
      this.isPlaying = true;

      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.isPlaying = false;
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
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

  async getChatGroupMessages(): Promise<HumeMessage[]> {
    const apiKey = await this.getApiKey();
    if (!apiKey || !this.chatGroupId) {
      return [];
    }

    try {
      const response = await fetch(`https://api.hume.ai/v0/chat/groups/${this.chatGroupId}/messages`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const messages = await response.json();
      return messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: new Date(msg.created_at),
        audioUrl: msg.audio_url,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async deleteChatGroup(): Promise<void> {
    const apiKey = await this.getApiKey();
    if (!apiKey || !this.chatGroupId) {
      return;
    }

    try {
      const response = await fetch(`https://api.hume.ai/v0/chat/groups/${this.chatGroupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        console.warn('Failed to delete chat group');
      }

      this.chatGroupId = null;
      await AsyncStorage.removeItem('hume_chat_group_id');
    } catch (error) {
      console.error('Error deleting chat group:', error);
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentChatGroupId(): string | null {
    return this.chatGroupId;
  }

  async setChatGroupId(groupId: string): Promise<void> {
    this.chatGroupId = groupId;
    await AsyncStorage.setItem('hume_chat_group_id', groupId);
  }

  async loadStoredChatGroupId(): Promise<string | null> {
    const storedId = await AsyncStorage.getItem('hume_chat_group_id');
    if (storedId) {
      this.chatGroupId = storedId;
      return storedId;
    }
    return null;
  }

  cleanup(): void {
    if (this.recording) {
      this.recording.stopAndUnloadAsync();
    }
    if (this.sound) {
      this.sound.unloadAsync();
    }
    this.isRecording = false;
    this.isPlaying = false;
  }
}

export const humeService = new HumeService();
