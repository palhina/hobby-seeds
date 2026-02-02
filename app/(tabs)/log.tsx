/**
 * ログ画面
 *
 * ユーザーが試した趣味の履歴を表示する。
 * - 統計情報（総試行数、😊の数、よく試すタグ）
 * - ログエントリー一覧（FlatList）
 * - 空状態表示
 */

import React, { useMemo } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

import { useHobbyLog } from '@/hooks/use-hobby-log';
import { LogEntry } from '@/components/features/log/LogEntry';
import { LogStats } from '@/components/features/log/LogStats';
import { EmptyLogState } from '@/components/features/log/EmptyLogState';

// 趣味データをインポート
import hobbiesData from '@/data/hobbies.json';

import type { HobbyLogEntry } from '@/types';

// ===================
// Styled Components
// ===================

const SContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SHeaderSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const SContentContainer = styled.View`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
`;

const SLoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SLoadingText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// ===================
// Component
// ===================

export default function LogScreen() {
  const { log, isLoading } = useHobbyLog();

  // エントリーを新しい順にソート
  const sortedEntries = useMemo(() => {
    return [...log.entries].sort((a, b) => {
      return new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime();
    });
  }, [log.entries]);

  // 趣味情報を取得するヘルパー関数
  const getHobbyInfo = (hobbyId: number) => {
    const hobby = hobbiesData.find(h => h.id === hobbyId);
    return {
      name: hobby?.name ?? '不明な趣味',
      emoji: hobby?.emoji ?? '❓',
    };
  };

  // ログエントリーをレンダリング
  const renderLogEntry = ({ item }: { item: HobbyLogEntry }) => {
    const { name, emoji } = getHobbyInfo(item.hobbyId);
    return (
      <LogEntry
        entry={item}
        hobbyName={name}
        hobbyEmoji={emoji}
      />
    );
  };

  // ヘッダーコンポーネント
  const ListHeaderComponent = () => {
    if (log.entries.length === 0) {
      return null;
    }

    return (
      <LogStats
        totalCount={log.entries.length}
        greatCount={log.greatCount}
        topTags={log.topTags}
      />
    );
  };

  if (isLoading) {
    return (
      <SContainer>
        <SHeader>
          <SHeaderTitle>記録</SHeaderTitle>
          <SHeaderSubtitle>試した趣味の履歴</SHeaderSubtitle>
        </SHeader>
        <SLoadingContainer>
          <SLoadingText>読み込み中...</SLoadingText>
        </SLoadingContainer>
      </SContainer>
    );
  }

  return (
    <SContainer>
      <SHeader>
        <SHeaderTitle>記録</SHeaderTitle>
        <SHeaderSubtitle>試した趣味の履歴</SHeaderSubtitle>
      </SHeader>
      <SContentContainer>
        {log.entries.length === 0 ? (
          <EmptyLogState />
        ) : (
          <FlatList
            data={sortedEntries}
            renderItem={renderLogEntry}
            keyExtractor={(item, index) => `${item.hobbyId}-${item.loggedAt}-${index}`}
            ListHeaderComponent={ListHeaderComponent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </SContentContainer>
    </SContainer>
  );
}
