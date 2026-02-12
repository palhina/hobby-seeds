/**
 * ログエントリー表示コンポーネント
 *
 * 1つの趣味ログエントリーを表示する。
 * 趣味名、絵文字、評価、日時を含む。
 */

import React from 'react';
import { Alert, Platform } from 'react-native';
import styled from 'styled-components/native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  SCardLight,
  SRow,
  SRowGap,
  SLabel,
  SMutedText,
  SEmojiSmall,
  SIconButtonSmall,
} from '@/components/ui/primitives';
import { theme } from '@/constants/theme';

import type { HobbyLogEntry, Rating } from '@/types';

// ===================
// Local Styles
// ===================

const SContainer = styled(SCardLight)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SLeftSection = styled(SRowGap)`
  flex: 1;
`;

const SInfoSection = styled.View`
  flex: 1;
`;

const SHobbyName = styled(SLabel)`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
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

const SRightSection = styled(SRow)`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

// ===================
// Helpers
// ===================

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

// ===================
// Component
// ===================

type LogEntryProps = {
  entry: HobbyLogEntry;
  hobbyName: string;
  hobbyEmoji: string;
  onDelete?: () => void;
};

export function LogEntry({ entry, hobbyName, hobbyEmoji, onDelete }: LogEntryProps) {
  const handleDeletePress = () => {
    if (Platform.OS === 'web') {
      // Web環境ではAlert.alertが使えないためwindow.confirmを使用
      const confirmed = window.confirm(`「${hobbyName}」の記録を削除しますか？`);
      if (confirmed) {
        onDelete?.();
      }
      return;
    }

    Alert.alert(
      '記録を削除',
      `「${hobbyName}」の記録を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <SContainer>
      <SLeftSection>
        <SEmojiSmall>{hobbyEmoji}</SEmojiSmall>
        <SInfoSection>
          <SHobbyName>{hobbyName}</SHobbyName>
          <SMutedText>{formatDateTime(entry.loggedAt)}</SMutedText>
        </SInfoSection>
      </SLeftSection>
      <SRightSection>
        <SRatingEmoji rating={entry.rating}>
          {getRatingEmoji(entry.rating)}
        </SRatingEmoji>
        {onDelete && (
          <SIconButtonSmall onPress={handleDeletePress}>
            <IconSymbol name="trash" size={18} color={theme.colors.textMuted} />
          </SIconButtonSmall>
        )}
      </SRightSection>
    </SContainer>
  );
}
