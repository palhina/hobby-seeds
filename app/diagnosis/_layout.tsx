/**
 * 診断フローのレイアウト
 */

import { Stack } from 'expo-router';

export default function DiagnosisLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="question" />
    </Stack>
  );
}
