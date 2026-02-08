/**
 * Card プリミティブ
 *
 * アプリ全体で使用する共通カードスタイル
 */

import styled from 'styled-components/native';

// ===================
// Base Card
// ===================

/**
 * 基本カード（シャドウ付き）
 * 趣味カード、診断カード、ログエントリーなどで使用
 */
export const SCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;

  /* シャドウ（Android） */
  elevation: 3;
`;

/**
 * タップ可能なカード
 */
export const SCardPressable = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;

  /* シャドウ（Android） */
  elevation: 3;
`;

/**
 * TouchableOpacity版カード
 */
export const SCardTouchable = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;

  /* シャドウ（Android） */
  elevation: 3;
`;

/**
 * 軽いシャドウのカード（ログエントリーなど）
 */
export const SCardLight = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;

  /* シャドウ（Android） */
  elevation: 2;
`;

/**
 * ボーダー付きカード（診断選択肢など）
 */
export const SCardBordered = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;
