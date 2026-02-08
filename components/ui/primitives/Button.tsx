/**
 * Button プリミティブ
 *
 * アプリ全体で使用する共通ボタンスタイル
 */

import styled from 'styled-components/native';

// ===================
// Primary Button
// ===================

/**
 * プライマリボタン（メインアクション用）
 */
export const SPrimaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.md}px ${theme.spacing.xl}px`};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
`;

/**
 * プライマリボタンのテキスト
 */
export const SPrimaryButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: #FFFFFF;
`;

/**
 * 大きいプライマリボタン（CTAなど）
 */
export const SPrimaryButtonLarge = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.lg}px ${theme.spacing.xxl}px`};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;

  /* シャドウ（Android） */
  elevation: 4;
`;

/**
 * 大きいプライマリボタンのテキスト
 */
export const SPrimaryButtonLargeText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.surface};
  text-align: center;
`;

// ===================
// Secondary Button
// ===================

/**
 * セカンダリボタン（サブアクション用）
 */
export const SSecondaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => `${theme.spacing.md}px ${theme.spacing.xl}px`};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.border};
`;

/**
 * セカンダリボタンのテキスト
 */
export const SSecondaryButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// ===================
// Icon Button
// ===================

/**
 * アイコンボタン（設定ボタンなど）
 */
export const SIconButton = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.surface};
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  align-items: center;
  justify-content: center;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;

  /* シャドウ（Android） */
  elevation: 2;
`;

/**
 * 小さいアイコンボタン（削除ボタンなど）
 */
export const SIconButtonSmall = styled.Pressable`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
`;
