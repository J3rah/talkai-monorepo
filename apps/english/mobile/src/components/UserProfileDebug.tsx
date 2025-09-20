import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';

export default function UserProfileDebug() {
  const { user, userProfile } = useAuthStore();

  if (!__DEV__) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile Debug</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user?.id || 'Not logged in'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'N/A'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Profile ID:</Text>
        <Text style={styles.value}>{userProfile?.id || 'No profile'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Subscription Tier:</Text>
        <Text style={styles.value}>
          {userProfile?.subscription_tier || 'Not set'} 
          {userProfile?.subscription_tier ? ` (${userProfile.subscription_tier})` : ''}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Profile Created:</Text>
        <Text style={styles.value}>
          {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Profile Updated:</Text>
        <Text style={styles.value}>
          {userProfile?.updated_at ? new Date(userProfile.updated_at).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
    </View>
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
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
});
