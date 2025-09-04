import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#bbb',
        headerStyle: {
          backgroundColor: '#111',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: '#FF4500',
        },
        headerRight: () => (
          <View style={{ marginRight: 15 }}>
            <Ionicons name="notifications" size={24} color="#FF4500" />
          </View>
        ),
        // ✅ Keep your setup
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#1c1c1c',
          },
          default: {
            backgroundColor: '#1c1c1c',
            borderTopWidth: 0,
            elevation: 6,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: '🎮 RAPS Powerplay',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="offer"
        options={{
          title: 'Offers',
          headerTitle: '🔥 Hot Offers',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          headerTitle: '🛒 RAPS Store',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          headerTitle: '📅 Game Booking',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
    <Tabs.Screen
  name="games"
  options={{
    title: 'Games',
    headerTitle: '🎮 Mini Games',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="game-controller" size={size} color={color} />
    ),
  }}
/>
    </Tabs>
  );
}
