import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ENV, validateEnvironment } from '../config/environment';

export default function EnvironmentDebug() {
  if (!__DEV__) return null;

  const envValidation = validateEnvironment();
  
  // Check raw process.env values
  const rawEnvVars = {
    'EXPO_PUBLIC_SUPABASE_URL': process.env.EXPO_PUBLIC_SUPABASE_URL,
    'EXPO_PUBLIC_SUPABASE_ANON_KEY': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    'EXPO_PUBLIC_HUME_API_KEY': process.env.EXPO_PUBLIC_HUME_API_KEY,
    'EXPO_PUBLIC_HUME_SECRET_KEY': process.env.EXPO_PUBLIC_HUME_SECRET_KEY,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Environment Variables Debug</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Raw Process.env Values:</Text>
        {Object.entries(rawEnvVars).map(([key, value]) => (
          <View key={key} style={styles.envRow}>
            <Text style={styles.envKey}>{key}:</Text>
            <Text style={styles.envValue}>
              {value ? `${value.substring(0, 10)}...` : 'NOT SET'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ENV Object Values:</Text>
        <View style={styles.envRow}>
          <Text style={styles.envKey}>SUPABASE_URL:</Text>
          <Text style={styles.envValue}>
            {ENV.SUPABASE_URL ? `${ENV.SUPABASE_URL.substring(0, 20)}...` : 'NOT SET'}
          </Text>
        </View>
        <View style={styles.envRow}>
          <Text style={styles.envKey}>SUPABASE_ANON_KEY:</Text>
          <Text style={styles.envValue}>
            {ENV.SUPABASE_ANON_KEY ? `${ENV.SUPABASE_ANON_KEY.substring(0, 10)}...` : 'NOT SET'}
          </Text>
        </View>
        <View style={styles.envRow}>
          <Text style={styles.envKey}>HUME_API_KEY:</Text>
          <Text style={styles.envValue}>
            {ENV.HUME_API_KEY ? `${ENV.HUME_API_KEY.substring(0, 10)}...` : 'NOT SET'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Validation Result:</Text>
        <Text style={[styles.status, { color: envValidation.isValid ? 'green' : 'red' }]}>
          {envValidation.isValid ? '✅ Valid' : '❌ Invalid'}
        </Text>
        {!envValidation.isValid && (
          <View>
            <Text style={styles.errorTitle}>Missing Variables:</Text>
            {envValidation.missing.map((missing) => (
              <Text key={missing} style={styles.errorText}>• {missing}</Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Troubleshooting:</Text>
        <Text style={styles.tipText}>
          • Make sure .env file is in the mobile/ directory{'\n'}
          • Restart the development server after adding .env{'\n'}
          • Check that variables start with EXPO_PUBLIC_{'\n'}
          • Ensure no spaces around = in .env file
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  envRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 2,
  },
  envKey: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  envValue: {
    fontSize: 12,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'red',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
