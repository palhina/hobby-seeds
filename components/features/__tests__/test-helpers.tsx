/**
 * テストユーティリティ
 *
 * styled-componentsで使用するThemeProviderラッパー
 */

import React from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';

import { theme } from '@/constants/theme';

/**
 * ThemeProviderでラップしてレンダリング
 */
export function renderWithTheme(
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>,
    options
  );
}
