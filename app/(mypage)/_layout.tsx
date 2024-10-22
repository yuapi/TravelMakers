import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';


export default function MyPageLayout() {
  const colorScheme = useColorScheme();

  return (
	<Stack>
		<Stack.Screen name="notice" options={{ headerShown: false }} />
		<Stack.Screen name="profile" options={{ headerShown: false }} />
		<Stack.Screen name="terms" options={{ headerShown: false }} />
	</Stack>
  );
}
