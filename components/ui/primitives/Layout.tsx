/**
 * Layout プリミティブ
 *
 * 共通レイアウトスタイル
 */

import styled from 'styled-components/native';

// ===================
// Containers
// ===================

/**
 * 画面全体のコンテナ
 */
export const SScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

/**
 * SafeAreaView版スクリーンコンテナ
 */
export const SSafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

/**
 * コンテンツエリア（パディング付き）
 */
export const SContent = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

/**
 * 中央揃えコンテンツ
 */
export const SCenteredContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

// ===================
// Flex Helpers
// ===================

/**
 * 横並びコンテナ
 */
export const SRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

/**
 * 横並び（両端揃え）
 */
export const SRowBetween = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

/**
 * 横並び（ギャップ付き）
 */
export const SRowGap = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

// ===================
// Sections
// ===================

/**
 * セクション区切り（上ボーダー付き）
 */
export const SSectionDivider = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

/**
 * フッターエリア
 */
export const SFooter = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
`;

/**
 * ヘッダーエリア（絶対配置）
 */
export const SAbsoluteHeader = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  padding: ${({ theme }) => theme.spacing.md}px;
`;
