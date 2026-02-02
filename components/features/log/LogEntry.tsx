/**
 * ログエントリー表示コンポーネント
 *
 * 1つの趣味ログエントリーを表示する。
 * 趣味名、絵文字、評価、日時を含む。
 */

import React from 'react';
import styled from 'styled-components/native';

import type { HobbyLogEntry, Rating } from '@/types';

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;
  elevation: 2;
`;

const SLeftSection = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const SEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
`;

const SInfoSection = styled.View`
  flex: 1;
`;

const SHobbyName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SDateTime = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

type SRatingEmojiProps = {
  rating: Rating;
};

const SRatingEmoji = styled.Text<SRatingEmojiProps>`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme, rating }) => {
    switch (rating) {
      case 'meh': return theme.colors.rating.meh;
      case 'good': return theme.colors.rating.ok;
      case 'great': return theme.colors.rating.good;
      default: return theme.colors.backgroundAlt;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

// ===================
// Component
// ===================

type LogEntryProps = {
  entry: HobbyLogEntry;
  hobbyName: string;
  hobbyEmoji: string;
};

/**
 * 評価から絵文字を取得
 */
function getRatingEmoji(rating: Rating): string {
  switch (rating) {
    case 'meh': return '😐';
    case 'good': return '🙂';
    case 'great': return '😊';
    default: return '😐';
  }
}

/**
 * ISO 8601日時をユーザーフレンドリーな形式に変換
 * 例: 2026-02-02T10:30:00.000Z → 2026/02/02 10:30
 */
function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to format date:', error);
    }
    return isoString;
  }
}

export function LogEntry({ entry, hobbyName, hobbyEmoji }: LogEntryProps) {
  return (
    <SContainer>
      <SLeftSection>
        <SEmoji>{hobbyEmoji}</SEmoji>
        <SInfoSection>
          <SHobbyName>{hobbyName}</SHobbyName>
          <SDateTime>{formatDateTime(entry.loggedAt)}</SDateTime>
        </SInfoSection>
      </SLeftSection>
      <SRatingEmoji rating={entry.rating}>
        {getRatingEmoji(entry.rating)}
      </SRatingEmoji>
    </SContainer>
  );
}
