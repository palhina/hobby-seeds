/**
 * ステップアップセクションのレイアウト
 */

import { Stack } from 'expo-router';
import React from 'react';

export default function StepUpLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'ステップアップ',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: '詳細',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
