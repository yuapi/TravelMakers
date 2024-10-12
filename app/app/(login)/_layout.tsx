import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';


export default function LoginLayout() {
  const colorScheme = useColorScheme();

  return (
	<Stack>
	  <Stack.Screen name="login" options={{ headerShown: false }} />
	</Stack>
  );
}
