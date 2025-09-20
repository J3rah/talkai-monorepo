import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { humeService } from '../utils/humeService';
import { ENV, validateEnvironment } from '../config/environment';

export default function HumeTestComponent() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

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
      await humeService.setApiKey(ENV.HUME_API_KEY);
      const apiKey = await humeService.getApiKey();
      if (!apiKey) {
        throw new Error('Failed to set/get API key');
      }
      addResult('✅ API key setup successful');

      // Test 3: Create chat group
      addResult('Testing chat group creation...');
      const testConfigId = '0ea8bb7d-ef50-4174-ae64-be7a621db425'; // Default voice config
      const chatGroup = await humeService.createChatGroup(testConfigId, 'Test Chat Group');
      if (!chatGroup.id) {
        throw new Error('Failed to create chat group');
      }
      addResult('✅ Chat group creation successful');

      // Test 4: Send test message
      addResult('Testing message sending...');
      const message = await humeService.sendMessage('Hello, this is a test message', 'user');
      if (!message.content) {
        throw new Error('Failed to send message');
      }
      addResult('✅ Message sending successful');

      // Test 5: Get messages
      addResult('Testing message retrieval...');
      const messages = await humeService.getChatGroupMessages();
      if (messages.length === 0) {
        addResult('⚠️ No messages found (this might be normal)');
      } else {
        addResult(`✅ Retrieved ${messages.length} messages`);
      }

      // Test 6: Cleanup
      addResult('Cleaning up test resources...');
      await humeService.deleteChatGroup();
      addResult('✅ Cleanup successful');

      addResult('🎉 All tests passed! Hume integration is working correctly.');

    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`);
      console.error('Hume test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hume AI Integration Test</Text>
      
      <TouchableOpacity
        style={[styles.testButton, isTesting && styles.testButtonDisabled]}
        onPress={runTests}
        disabled={isTesting}
      >
        {isTesting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.testButtonText}>Run Tests</Text>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#007AFF',
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
