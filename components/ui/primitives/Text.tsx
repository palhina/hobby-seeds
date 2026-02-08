/**
 * Text プリミティブ
 *
 * アプリ全体で使用する共通テキストスタイル
 */

import styled from 'styled-components/native';

// ===================
// Headings
// ===================

/**
 * ディスプレイテキスト（ホーム画面タイトルなど）
 */
export const SDisplayText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

/**
 * タイトル（セクションヘッダーなど）
 */
export const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/**
 * 中央揃えタイトル
 */
export const STitleCentered = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

// ===================
// Body Text
// ===================

/**
 * 本文テキスト
 */
export const SBodyText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.relaxed}px;
`;

/**
 * サブテキスト（説明文など）
 */
export const SSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 24px;
`;

/**
 * 小さいテキスト
 */
export const SSmallText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/**
 * 補足テキスト（日時、ヒントなど）
 */
export const SMutedText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ===================
// Labels
// ===================

/**
 * ラベル（フォームラベル、情報ラベルなど）
 */
export const SLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/**
 * 小さいラベル
 */
export const SLabelSmall = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * 値表示（情報値など）
 */
export const SValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// ===================
// Emoji
// ===================

/**
 * 大きい絵文字（メインビジュアル）
 */
export const SEmojiLarge = styled.Text`
  font-size: 80px;
  text-align: center;
`;

/**
 * 中くらいの絵文字（カード内など）
 */
export const SEmojiMedium = styled.Text`
  font-size: 40px;
  text-align: center;
`;

/**
 * 小さい絵文字（リスト項目など）
 */
export const SEmojiSmall = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
`;
