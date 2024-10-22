import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';


export default function PostLayout() {
  const colorScheme = useColorScheme();

  return (
	<Stack>
		<Stack.Screen name="postlist" options={{ headerShown: false }} />
		<Stack.Screen name="postdetail" options={{ headerShown: false }} />
		<Stack.Screen name="postform" options={{ headerShown: false }} />
	</Stack>
  );
}
