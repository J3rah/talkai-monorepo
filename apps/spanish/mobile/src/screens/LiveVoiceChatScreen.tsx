import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';
import { liveVoiceService, LiveVoiceMessage } from '../utils/liveVoiceService';
import { getVoiceConfigurationById } from '../utils/voiceConfigUtils';
import { useAuthStore } from '../stores/authStore';
import { ENV, validateEnvironment } from '../config/environment';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  voiceConfigId: string;
  topic?: string;
}

export default function LiveVoiceChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { voiceConfigId, topic } = route.params as RouteParams;
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState<LiveVoiceMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [rms, setRms] = useState(0);
  const [rmsHistory, setRmsHistory] = useState<number[]>(new Array(48).fill(0));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const messagesEndRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeSession();
    
    return () => {
      // Cleanup when component unmounts
      liveVoiceService.cleanup();
    };
  }, []);

  useEffect(() => {
    // Setup event listeners for live voice service
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      setIsConnecting(false);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setConnectionStatus('Disconnected');
      setIsRecording(false);
    };

    const handleMessage = (message: LiveVoiceMessage) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    };

    const handleInterimMessage = (message: LiveVoiceMessage) => {
      // Replace the last interim message or add new one
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isInterim);
        return [...filtered, message];
      });
      scrollToBottom();
    };

    const handleRecordingStarted = () => {
      setIsRecording(true);
      startPulseAnimation();
    };

    const handleRecordingStopped = () => {
      setIsRecording(false);
      stopPulseAnimation();
    };

    const handleSpeaking = (text: string) => {
      setIsSpeaking(true);
      // You could add visual feedback here
    };

    const handleError = (error: Error) => {
      console.error('Live voice service error:', error);
      setError(error.message);
      setIsConnecting(false);
    };

    // Add event listeners
    liveVoiceService.on('connected', handleConnected);
    liveVoiceService.on('disconnected', handleDisconnected);
    liveVoiceService.on('message', handleMessage);
    liveVoiceService.on('interimMessage', handleInterimMessage);
    liveVoiceService.on('recordingStarted', handleRecordingStarted);
    liveVoiceService.on('recordingStopped', handleRecordingStopped);
    liveVoiceService.on('speaking', handleSpeaking);
    liveVoiceService.on('error', handleError);

    return () => {
      // Remove event listeners
      liveVoiceService.off('connected', handleConnected);
      liveVoiceService.off('disconnected', handleDisconnected);
      liveVoiceService.off('message', handleMessage);
      liveVoiceService.off('interimMessage', handleInterimMessage);
      liveVoiceService.off('recordingStarted', handleRecordingStarted);
      liveVoiceService.off('recordingStopped', handleRecordingStopped);
      liveVoiceService.off('speaking', handleSpeaking);
      liveVoiceService.off('error', handleError);
    };
  }, []);

  useEffect(() => {
    const onRms = (value: number) => {
      setRms(value);
      setRmsHistory(prev => {
        const next = prev.slice(1);
        next.push(value);
        return next;
      });
    };
    liveVoiceService.on('rms', onRms);
    return () => { liveVoiceService.off('rms', onRms); };
  }, []);

  useEffect(() => {
    if (isConnected) startTimer(); else stopTimer();
  }, [isConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollToEnd({ animated: true });
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const startTimer = () => {
    if (timerRef.current) return;
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(prev => prev + 1000);
    }, 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const initializeSession = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Validate environment variables
      const envValidation = validateEnvironment();
      if (!envValidation.isValid) {
        throw new Error(`Missing environment variables: ${envValidation.missing.join(', ')}`);
      }

      // Get Hume API key from environment
      const humeApiKey = ENV.HUME_API_KEY;
      if (!humeApiKey) {
        throw new Error('Hume API key not configured');
      }

      // Set API key in live voice service
      await liveVoiceService.setApiKey(humeApiKey);

      // Get voice configuration
      const voiceConfig = getVoiceConfigurationById(voiceConfigId);
      if (!voiceConfig) {
        throw new Error('Invalid voice configuration');
      }

      // Create a new chat session in Supabase
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user?.id,
          title: `Mobile Session${topic ? ` - ${topic}` : ''}`,
          status: 'in_progress',
          voice_config_id: voiceConfig.configId,
          agent_name: voiceConfig.displayName,
          character_name: topic || voiceConfig.displayName,
        })
        .select()
        .single();

      if (sessionError || !sessionData) {
        console.error('Create chat session error:', sessionError);
        throw new Error('Failed to create chat session');
      }

      setSessionId(sessionData.id);

      // Connect to Hume Voice with WebSocket
      const systemPrompt = `You are an empathetic AI therapist named ${topic || 'Therapist'}. 
      Respond naturally and supportively to the user's concerns. 
      Keep responses conversational, helpful, and therapeutic. 
      Focus on active listening and providing emotional support.`;

      await liveVoiceService.connect(voiceConfig.configId, systemPrompt);
      
      // Add welcome message
      const welcomeMessage: LiveVoiceMessage = {
        id: Date.now().toString(),
        content: `Hello! I'm here to listen and support you${topic ? ` about ${topic}` : ''}. How are you feeling today?`,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    } catch (error: any) {
      console.error('Session initialization error:', error);
      setError(error.message || 'Failed to initialize session');
      setIsConnecting(false);
    }
  };

  const handleMicrophonePress = async () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please wait for the connection to be established.');
      return;
    }

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await liveVoiceService.startLiveRecording();
    } catch (error: any) {
      console.error('Error starting recording:', error);
      Alert.alert('Recording Error', error.message || 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      await liveVoiceService.stopLiveRecording();
    } catch (error: any) {
      console.error('Error stopping recording:', error);
      Alert.alert('Recording Error', error.message || 'Failed to stop recording');
    }
  };

  const handleEndSession = async () => {
    try {
      // Update session status in Supabase
      if (sessionId) {
        await supabase
          .from('chat_sessions')
          .update({ status: 'completed' })
          .eq('id', sessionId);
      }

      // Disconnect from Hume Voice
      liveVoiceService.disconnect();

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error ending session:', error);
      navigation.goBack();
    }
  };

  const togglePause = async () => {
    try {
      if (isPaused) {
        await liveVoiceService.resumeStreaming();
        setIsPaused(false);
      } else {
        await liveVoiceService.pauseStreaming();
        setIsPaused(true);
      }
    } catch (e) {
      console.error('Pause/Resume error:', e);
    }
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeSession}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isInitialized && isConnecting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Connecting to voice session...</Text>
        <Text style={styles.connectionStatus}>{connectionStatus}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleEndSession}
          >
            <Text style={styles.backButtonText}>← End Session</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {topic || 'Live Voice Chat'}
            </Text>
            <View style={styles.connectionIndicator}>
              <View style={[
                styles.connectionDot,
                { backgroundColor: isConnected ? '#4CAF50' : '#FF5722' }
              ]} />
              <Text style={styles.connectionText}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.timerText}>{formatTime(elapsedMs)}</Text>
            <TouchableOpacity onPress={togglePause} style={styles.pauseButton}>
              <Text style={styles.pauseButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={messagesEndRef}
          style={styles.messagesContainer} 
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessage : styles.aiMessage,
                message.isInterim && styles.interimMessage,
              ]}
            >
              <Text style={[
                styles.messageText,
                message.role === 'user' ? styles.userMessageText : styles.aiMessageText,
                message.isInterim && styles.interimMessageText,
              ]}>
                {message.content}
                {message.isInterim && '...'}
              </Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          ))}
          {isSpeaking && (
            <View style={styles.speakingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.speakingText}>AI is speaking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Toolbar */}
        <View style={styles.toolbarContainer}>
          <TouchableOpacity onPress={handleEndSession} style={styles.endButton}>
            <Text style={styles.endButtonText}>End</Text>
          </TouchableOpacity>

          <View style={styles.toolbarCenter}>
            <Text style={styles.toolbarTimer}>{formatTime(elapsedMs)}</Text>
            <View style={styles.waveformContainer}>
              {rmsHistory.map((v, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.waveformBar,
                    { height: Math.max(2, Math.min(28, v * 1200)), opacity: idx > rmsHistory.length - 12 ? 1 : 0.6 }
                  ]}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={togglePause} style={styles.pauseButton}>
            <Text style={styles.pauseButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: 'rgba(255,255,255,0.9)',
    marginRight: 12,
  },
  pauseButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pauseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  interimMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#333',
  },
  aiMessageText: {
    color: 'white',
  },
  interimMessageText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    textAlign: 'right',
  },
  speakingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  speakingText: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  microphoneContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
  },
  microphoneButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  microphoneButtonRecording: {
    // Animation handled by Animated.View
  },
  microphoneTouchable: {
    flex: 1,
  },
  microphoneGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  microphoneIcon: {
    fontSize: 32,
  },
  microphoneStatus: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  connectionStatus: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  waveContainer: {
    height: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  waveBar: {
    height: '100%',
  },
  waveformContainer: {
    height: 30,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#34D399',
    borderRadius: 2,
    marginRight: 1,
  },
  toolbarContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  endButton: {
    backgroundColor: 'rgba(239,68,68,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  endButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  toolbarCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  toolbarTimer: {
    color: 'rgba(255,255,255,0.9)',
    marginRight: 12,
    fontWeight: '600',
  },
  pauseButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pauseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
