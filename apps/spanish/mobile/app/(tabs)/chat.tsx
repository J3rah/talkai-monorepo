import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useApp } from "../../src/contexts/AppContext";
import { humeService } from "../../src/utils/humeService";
import { liveVoiceService } from "../../src/utils/liveVoiceService";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  emotions?: any;
  voiceUrl?: string;
};

export default function ChatScreen() {
  const { user, sessionStats } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotions, setCurrentEmotions] = useState<any>(null);
  const [voiceConfig, setVoiceConfig] = useState('0ea8bb7d-ef50-4174-ae64-be7a621db425'); // Default voice
  
  const humeServiceRef = useRef(humeService);
  const liveVoiceServiceRef = useRef(liveVoiceService);

  useEffect(() => {
    // Set up live voice event listeners
    const liveVoice = liveVoiceServiceRef.current;
    
    const handleConnected = () => {
      setIsConnected(true);
      console.log('Connected to Hume Voice');
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      console.log('Disconnected from Hume Voice');
    };

    const handleMessage = (message: any) => {
      console.log('Received message:', message);
      if (message.role === 'assistant') {
        addMessage(message.content, false, message.emotions);
      }
    };

    const handleEmotions = (emotions: any) => {
      setCurrentEmotions(emotions);
      console.log('Current emotions:', emotions);
    };

    const handleError = (error: any) => {
      console.error('Voice service error:', error);
      Alert.alert('Voice Error', error.message || 'An error occurred with voice services');
    };

    // Add event listeners
    liveVoice.on('connected', handleConnected);
    liveVoice.on('disconnected', handleDisconnected);
    liveVoice.on('message', handleMessage);
    liveVoice.on('emotions', handleEmotions);
    liveVoice.on('error', handleError);

    return () => {
      // Clean up event listeners and disconnect
      liveVoice.off('connected', handleConnected);
      liveVoice.off('disconnected', handleDisconnected);
      liveVoice.off('message', handleMessage);
      liveVoice.off('emotions', handleEmotions);
      liveVoice.off('error', handleError);
      liveVoice.disconnect();
    };
  }, []);

  const addMessage = (text: string, isUser: boolean, emotions?: any, voiceUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      emotions,
      voiceUrl,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startVoiceSession = async () => {
    try {
      setIsProcessing(true);
      await liveVoiceServiceRef.current.connect(voiceConfig,
        `You are a compassionate AI therapist. Help the user with their mental health journey. Be empathetic, supportive, and professional.`
      );
      
      // Start the microphone stream after connecting
      await liveVoiceServiceRef.current.startMicStream();
      
      addMessage("Voice session started. You can now speak naturally.", false);
    } catch (error) {
      console.error('Failed to start voice session:', error);
      Alert.alert('Error', 'Failed to start voice session. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const stopVoiceSession = async () => {
    try {
      liveVoiceServiceRef.current.disconnect();
      addMessage("Voice session ended.", false);
    } catch (error) {
      console.error('Failed to stop voice session:', error);
    }
  };

  const sendTextMessage = async () => {
    // Fallback text input for when voice isn't available
    const text = "I'd like to send a text message instead of using voice.";
    addMessage(text, true);
    
    try {
      const response = await humeServiceRef.current.sendMessage(text);
      addMessage(response.content, false);
    } catch (error) {
      console.error('Failed to send text message:', error);
      addMessage("I'm sorry, I couldn't process that message. Please try again.", false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getEmotionDisplay = (emotions: any) => {
    if (!emotions) return null;
    
    const topEmotions = Object.entries(emotions)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([emotion, value]) => `${emotion}: ${(value as number * 100).toFixed(1)}%`)
      .join(', ');
    
    return topEmotions;
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userMessageBubble : styles.aiMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {item.text}
        </Text>
        {item.emotions && (
          <View style={styles.emotionContainer}>
            <Text style={styles.emotionText}>
              Emotions: {getEmotionDisplay(item.emotions)}
            </Text>
          </View>
        )}
        <Text style={[
          styles.messageTime,
          item.isUser ? styles.userMessageTime : styles.aiMessageTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>AI</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Therapist</Text>
            <Text style={styles.headerSubtitle}>
              {isConnected ? 'Voice Connected' : 'Voice Disconnected'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, isConnected && styles.headerButtonActive]}
            onPress={isConnected ? stopVoiceSession : startVoiceSession}
            disabled={isProcessing}
          >
            <Text style={styles.headerButtonText}>
              {isProcessing ? '⏳' : isConnected ? '🔴' : '🎤'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Emotions Display */}
      {currentEmotions && (
        <View style={styles.emotionsBar}>
          <Text style={styles.emotionsTitle}>Current Emotions:</Text>
          <Text style={styles.emotionsText}>{getEmotionDisplay(currentEmotions)}</Text>
        </View>
      )}

      {/* Messages */}
      <View style={styles.messagesList}>
        {messages.map((message) => (
          <View key={message.id} style={[
            styles.messageContainer,
            message.isUser ? styles.userMessageContainer : styles.aiMessageContainer
          ]}>
            <View style={[
              styles.messageBubble,
              message.isUser ? styles.userMessageBubble : styles.aiMessageBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
              {message.emotions && (
                <View style={styles.emotionContainer}>
                  <Text style={styles.emotionText}>
                    Emotions: {getEmotionDisplay(message.emotions)}
                  </Text>
                </View>
              )}
              <Text style={[
                styles.messageTime,
                message.isUser ? styles.userMessageTime : styles.aiMessageTime
              ]}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Voice Controls */}
      <View style={styles.voiceControls}>
        <View style={styles.voiceStatus}>
          <Text style={styles.voiceStatusText}>
            {isConnected ? '🎤 Voice Active - Speak naturally' : '🎤 Voice Inactive - Tap to start'}
          </Text>
        </View>
        
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={[styles.voiceButton, isConnected && styles.voiceButtonActive]}
            onPress={isConnected ? stopVoiceSession : startVoiceSession}
            disabled={isProcessing}
          >
            <Text style={styles.voiceButtonText}>
              {isProcessing ? 'Connecting...' : isConnected ? 'End Session' : 'Start Voice Chat'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.textButton}
            onPress={sendTextMessage}
          >
            <Text style={styles.textButtonText}>Text Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: '#000000',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#4ECDC4', // Cyan color
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4ECDC4', // Cyan color
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  headerButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  emotionsBar: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(78, 205, 196, 0.2)',
  },
  emotionsTitle: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  emotionsText: {
    color: '#ffffff',
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
    padding: 20,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userMessageBubble: {
    backgroundColor: '#4ECDC4', // Cyan color
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // White with transparency
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#ffffff',
  },
  emotionContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 8,
  },
  emotionText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontStyle: 'italic',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiMessageTime: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#4ECDC4', // Cyan color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  voiceControls: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  voiceStatus: {
    alignItems: 'center',
    marginBottom: 16,
  },
  voiceStatusText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '500',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  voiceButton: {
    flex: 1,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  voiceButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  voiceButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});