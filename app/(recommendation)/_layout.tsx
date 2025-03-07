import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';


export default function RecommendationLayout() {
  const colorScheme = useColorScheme();

  return (
	<Stack>
	  <Stack.Screen name="recommendation" options={{ headerShown: false }} />
	</Stack>
  );
}