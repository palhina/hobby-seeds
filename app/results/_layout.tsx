/**
 * 結果画面のレイアウト
 *
 * 結果一覧と詳細画面のStack Navigator
 */

import { Stack } from 'expo-router';

export default function ResultsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
