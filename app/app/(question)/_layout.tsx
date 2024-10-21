import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';


export default function QuestionLayout() {
  const colorScheme = useColorScheme();

  return (
	<Stack>
		<Stack.Screen name="question1" options={{ headerShown: false }} />
		<Stack.Screen name="question2" options={{ headerShown: false }} />
		<Stack.Screen name="question3" options={{ headerShown: false }} />
		<Stack.Screen name="question4" options={{ headerShown: false }} />
		<Stack.Screen name="question5" options={{ headerShown: false }} />
	</Stack>
  );
}
