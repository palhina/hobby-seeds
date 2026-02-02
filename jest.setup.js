/**
 * Jest Setup File
 *
 * テスト実行前の共通セットアップ
 */

// AsyncStorage モック
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// expo-router モック
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: () => '/',
  Link: ({ children }) => children,
}));

// expo-haptics モック
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// react-native-safe-area-context モック
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

// react-native-reanimated モック
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// IconSymbol モック
jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: ({ name, size, color }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, {
      testID: `icon-${name}`,
      children: name,
      style: { fontSize: size, color },
    });
  },
}));

// 警告を抑制（テスト時のノイズ軽減）
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Warning: An update to') ||
      args[0].includes('act(...)'))
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};
