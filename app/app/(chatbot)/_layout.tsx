import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';


export default function ChatbotLayout() {
  const colorScheme = useColorScheme();

  return (
	<Stack>
	  <Stack.Screen name="chatbot" options={{ headerShown: false }} />
	</Stack>
  );
}
