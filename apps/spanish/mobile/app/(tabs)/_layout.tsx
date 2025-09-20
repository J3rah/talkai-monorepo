import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#4ECDC4', // Cyan color
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>🏠</Text>
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>💬</Text>
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>👤</Text>
            </View>
          )
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000', // Black background
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)', // Cyan with transparency
    borderRadius: 12,
  },
  tabIconText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabIconTextActive: {
    color: '#4ECDC4', // Cyan color
  },
});