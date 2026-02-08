/**
 * Tag プリミティブ
 *
 * タグ表示用の共通スタイル
 */

import styled from 'styled-components/native';

// ===================
// Tag Container
// ===================

/**
 * タグを並べるコンテナ
 */
export const STagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

/**
 * 小さいギャップのタグコンテナ
 */
export const STagsContainerCompact = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

// ===================
// Tags
// ===================

/**
 * プライマリタグ（メインカラー背景）
 */
export const STag = styled.View`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.md}px`};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

/**
 * タグのテキスト
 */
export const STagText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

/**
 * セカンダリタグ（グレー背景）
 */
export const STagSecondary = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

/**
 * セカンダリタグのテキスト
 */
export const STagSecondaryText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// ===================
// Badge
// ===================

/**
 * バッジ（マッチ度表示など）
 */
export const SBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.md}px`};
  align-self: flex-start;
`;

/**
 * バッジのテキスト
 */
export const SBadgeText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;
