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
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHobbyLog } from '@/hooks/use-hobby-log';
import { LogEntry } from '@/components/features/log/LogEntry';
import { LogStats } from '@/components/features/log/LogStats';
import { EmptyLogState } from '@/components/features/log/EmptyLogState';
import {
  SScreenContainer,
  SRow,
  SDisplayText,
  SSmallText,
  SCenteredContent,
} from '@/components/ui/primitives';

// 趣味データをインポート
import hobbiesData from '@/data/hobbies.json';

import type { HobbyLogEntry } from '@/types';

// ソート用の型（オリジナルインデックスを保持）
type SortedEntry = {
  entry: HobbyLogEntry;
  originalIndex: number;
};

// ===================
// Local Styles
// ===================

const SHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeaderTitle = styled(SDisplayText)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  text-align: left;
`;

const SHeaderSubtitle = styled(SSmallText)`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const SContentContainer = styled.View`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
`;

const SLoadingText = styled(SSmallText)`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
`;

const SStepUpHint = styled(SRow)`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SStepUpHintEmoji = styled.Text`
  font-size: 24px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const SStepUpHintText = styled(SSmallText)`
  flex: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.typography.fontSize.sm * 1.5}px;
`;

const SStepUpButton = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SStepUpButtonEmoji = styled.Text`
  font-size: 20px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const SStepUpButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: #FFFFFF;
`;

// ===================
// Component
// ===================

export default function LogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { log, isLoading, deleteEntry } = useHobbyLog();

  // エントリーを新しい順にソート（オリジナルインデックスを保持）
  const sortedEntries = useMemo(() => {
    return log.entries
      .map((entry, index) => ({ entry, originalIndex: index }))
      .sort((a, b) => {
        return new Date(b.entry.loggedAt).getTime() - new Date(a.entry.loggedAt).getTime();
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

  // 削除ハンドラ
  const handleDelete = async (originalIndex: number) => {
    await deleteEntry(originalIndex, hobbiesData);
  };

  // ログエントリーをレンダリング
  const renderLogEntry = ({ item }: { item: SortedEntry }) => {
    const { name, emoji } = getHobbyInfo(item.entry.hobbyId);
    return (
      <LogEntry
        entry={item.entry}
        hobbyName={name}
        hobbyEmoji={emoji}
        onDelete={() => handleDelete(item.originalIndex)}
      />
    );
  };

  // ステップアップ解放までの残り回数
  const remainingToUnlock = Math.max(0, 3 - log.greatCount);
  const isStepUpUnlocked = log.greatCount >= 3;

  // ステップアップ画面へ遷移
  const handleStepUpPress = () => {
    router.push('/stepup');
  };

  // ヘッダーコンポーネント
  const ListHeaderComponent = () => {
    if (log.entries.length === 0) {
      return null;
    }

    return (
      <>
        {/* ステップアップ解放済みの場合はボタンを表示 */}
        {isStepUpUnlocked && (
          <SStepUpButton onPress={handleStepUpPress}>
            <SStepUpButtonEmoji>🚀</SStepUpButtonEmoji>
            <SStepUpButtonText>ステップアップ趣味をみる</SStepUpButtonText>
          </SStepUpButton>
        )}
        {/* 未解放の場合はヒントを表示 */}
        {remainingToUnlock > 0 && (
          <SStepUpHint>
            <SStepUpHintEmoji>🌟</SStepUpHintEmoji>
            <SStepUpHintText>
              あと{remainingToUnlock}回の「楽しかった😊」を集めると、{'\n'}
              ステップアップ趣味が解放されます！
            </SStepUpHintText>
          </SStepUpHint>
        )}
        <LogStats
          totalCount={log.entries.length}
          greatCount={log.greatCount}
          topTags={log.topTags}
        />
      </>
    );
  };

  if (isLoading) {
    return (
      <SScreenContainer style={{ paddingTop: insets.top + 16 }}>
        <SHeader>
          <SHeaderTitle>記録</SHeaderTitle>
          <SHeaderSubtitle>試した趣味の履歴</SHeaderSubtitle>
        </SHeader>
        <SCenteredContent>
          <SLoadingText>読み込み中...</SLoadingText>
        </SCenteredContent>
      </SScreenContainer>
    );
  }

  return (
    <SScreenContainer style={{ paddingTop: insets.top + 16 }}>
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
            keyExtractor={(item) => `${item.entry.hobbyId}-${item.entry.loggedAt}-${item.originalIndex}`}
            ListHeaderComponent={ListHeaderComponent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </SContentContainer>
    </SScreenContainer>
  );
}
