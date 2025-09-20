import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { liveVoiceService } from '../utils/liveVoiceService';
import { ENV, validateEnvironment } from '../config/environment';

export default function LiveVoiceTestComponent() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    try {
      // Test 1: Environment validation
      addResult('Testing environment variables...');
      const envValidation = validateEnvironment();
      if (!envValidation.isValid) {
        throw new Error(`Missing environment variables: ${envValidation.missing.join(', ')}`);
      }
      addResult('✅ Environment variables are valid');

      // Test 2: API key setup
      addResult('Testing Hume API key setup...');
      await liveVoiceService.setApiKey(ENV.HUME_API_KEY);
      const apiKey = await liveVoiceService.getApiKey();
      if (!apiKey) {
        throw new Error('Failed to set/get API key');
      }
      addResult('✅ API key setup successful');

      // Test 3: WebSocket connection
      addResult('Testing WebSocket connection...');
      
      // Setup event listeners
      const handleConnected = () => {
        setIsConnected(true);
        addResult('✅ WebSocket connection established');
      };

      const handleDisconnected = () => {
        setIsConnected(false);
        addResult('⚠️ WebSocket disconnected');
      };

      const handleError = (error: Error) => {
        addResult(`❌ WebSocket error: ${error.message}`);
      };

      liveVoiceService.on('connected', handleConnected);
      liveVoiceService.on('disconnected', handleDisconnected);
      liveVoiceService.on('error', handleError);

      // Connect to Hume Voice
      const testConfigId = '0ea8bb7d-ef50-4174-ae64-be7a621db425'; // Default voice config
      await liveVoiceService.connect(testConfigId, 'You are a test AI assistant.');

      // Wait a bit for connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!isConnected) {
        throw new Error('WebSocket connection failed to establish');
      }

      // Test 4: Send test message
      addResult('Testing message sending...');
      await liveVoiceService.sendTextMessage('Hello, this is a test message');
      addResult('✅ Text message sent successfully');

      // Test 5: Cleanup
      addResult('Cleaning up test resources...');
      liveVoiceService.disconnect();
      addResult('✅ Cleanup successful');

      // Remove event listeners
      liveVoiceService.off('connected', handleConnected);
      liveVoiceService.off('disconnected', handleDisconnected);
      liveVoiceService.off('error', handleError);

      addResult('🎉 All live voice tests passed! WebSocket integration is working correctly.');

    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`);
      console.error('Live voice test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Voice Integration Test</Text>
      <Text style={styles.subtitle}>Tests WebSocket connection and real-time voice</Text>
      
      <TouchableOpacity
        style={[styles.testButton, isTesting && styles.testButtonDisabled]}
        onPress={runTests}
        disabled={isTesting}
      >
        {isTesting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.testButtonText}>Run Live Voice Tests</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});
