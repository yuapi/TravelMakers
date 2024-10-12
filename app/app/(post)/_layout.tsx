import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';


export default function PostLayout() {
  const colorScheme = useColorScheme();

  return (
	<Stack>
	  <Stack.Screen name="PostDetail" options={{ headerShown: false }} />
	  <Stack.Screen name="PostForm" options={{ headerShown: false }} />
    <Stack.Screen name="PostList" options={{ headerShown: false }} />
	</Stack>
  );
}
