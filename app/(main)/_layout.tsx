import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function MainLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
		tabBarStyle: {
			height: 70,
			paddingVertical: 5,
			paddingBottom: 15,
		}
      }}>
      <Tabs.Screen
        name="main"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (<Text style={{ fontSize: size, color: color }}>🏠</Text>),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: '챗봇',
          tabBarIcon: ({ color, size }) => (<Text style={{ fontSize: size, color: color }}>💬</Text>),
        }}
      />
      <Tabs.Screen
        name="postlist"
        options={{
          title: '커뮤니티',
		  tabBarIcon: ({ color, size }) => (<Text style={{ fontSize: size, color: color }}>📢</Text>),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이 페이지',
		  tabBarIcon: ({ color, size }) => (<Text style={{ fontSize: size, color: color }}>👤</Text>),
        }}
      />
    </Tabs>
  );
}
