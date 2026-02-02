/**
 * 結果一覧画面
 *
 * 診断結果に基づいて提案された趣味を2列グリッドで表示
 * 「他にもみる」で同じ条件の別の趣味を表示
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HobbyCard } from '@/components/features/hobby/HobbyCard';
import { filterHobbiesByDiagnosis, selectRandomHobbies } from '@/utils/filter-hobbies';
import hobbiesData from '@/data/hobbies.json';

import type { DiagnosisAnswer, YuruHobby } from '@/types';

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  padding-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SHeaderText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const SContent = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
`;

const SGridContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SColumnWrapper = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.xs}px;
`;

const SEmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const SEmptyEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SEmptyText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SFooter = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const SPrimaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
`;

const SPrimaryButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.surface};
`;

const SSecondaryButton = styled.TouchableOpacity`
  background-color: transparent;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.primary};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
`;

const SSecondaryButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

// ===================
// Constants
// ===================

const HOBBIES_PER_PAGE = 4;

// ===================
// Component
// ===================

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { answers: answersJson } = useLocalSearchParams<{ answers: string }>();

  // 回答データをパース
  const answers: DiagnosisAnswer | null = answersJson
    ? JSON.parse(answersJson)
    : null;

  // フィルタリングされた趣味一覧（診断条件に合うもの全て）
  const filteredHobbies = useMemo(() => {
    if (!answers) {
      return [];
    }
    return filterHobbiesByDiagnosis(hobbiesData as YuruHobby[], answers);
  }, [answers]);

  // 表示中の趣味（4つ）
  const [displayedHobbies, setDisplayedHobbies] = useState<YuruHobby[]>([]);

  // filteredHobbiesが変わったら表示をリセット
  useEffect(() => {
    if (filteredHobbies.length > 0) {
      setDisplayedHobbies(selectRandomHobbies(filteredHobbies, HOBBIES_PER_PAGE));
    }
  }, [filteredHobbies]);

  // 「他にもみる」で別の趣味を表示
  const handleShowMore = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 現在表示中のIDを除外して選択（可能であれば）
    const currentIds = new Set(displayedHobbies.map((h) => h.id));
    const remainingHobbies = filteredHobbies.filter((h) => !currentIds.has(h.id));

    if (remainingHobbies.length >= HOBBIES_PER_PAGE) {
      // 未表示の趣味が十分ある場合はそこから選択
      setDisplayedHobbies(selectRandomHobbies(remainingHobbies, HOBBIES_PER_PAGE));
    } else if (remainingHobbies.length > 0) {
      // 未表示の趣味が足りない場合は、未表示分＋既存からランダムに補完
      const fromRemaining = remainingHobbies;
      const needed = HOBBIES_PER_PAGE - fromRemaining.length;
      const fromExisting = selectRandomHobbies(
        filteredHobbies.filter((h) => !remainingHobbies.some((r) => r.id === h.id)),
        needed
      );
      setDisplayedHobbies([...fromRemaining, ...fromExisting]);
    } else {
      // 全て表示済みの場合はシャッフルして再表示
      setDisplayedHobbies(selectRandomHobbies(filteredHobbies, HOBBIES_PER_PAGE));
    }
  }, [filteredHobbies, displayedHobbies]);

  // 2列グリッド用にデータを分割
  const leftColumnData = displayedHobbies.filter((_, index) => index % 2 === 0);
  const rightColumnData = displayedHobbies.filter((_, index) => index % 2 === 1);

  const handleHobbyPress = (id: number) => {
    router.push({
      pathname: '/results/[id]' as const,
      params: { id: id.toString() },
    });
  };

  const handleBackToDiagnosis = () => {
    router.replace('/diagnosis');
  };

  // 空状態
  if (!answers || filteredHobbies.length === 0) {
    return (
      <SContainer style={{ paddingTop: insets.top + 16 }}>
        <SHeader>
          <SHeaderText>🌱 今日のおすすめ</SHeaderText>
        </SHeader>
        <SEmptyContainer>
          <SEmptyEmoji>😅</SEmptyEmoji>
          <SEmptyText>
            おすすめの趣味が見つかりませんでした。{'\n'}
            もう一度診断してみてください。
          </SEmptyText>
          <SPrimaryButton onPress={handleBackToDiagnosis} activeOpacity={0.8}>
            <SPrimaryButtonText>もう一度診断する</SPrimaryButtonText>
          </SPrimaryButton>
        </SEmptyContainer>
      </SContainer>
    );
  }

  // 「他にもみる」ボタンを表示するかどうか（フィルタ結果が4件超の場合のみ意味がある）
  const showMoreButton = filteredHobbies.length > HOBBIES_PER_PAGE;

  return (
    <SContainer style={{ paddingTop: insets.top + 16 }}>
      <SHeader>
        <SHeaderText>🌱 今日のおすすめ</SHeaderText>
      </SHeader>

      <SContent>
        <SGridContainer>
          <SColumnWrapper>
            <FlatList
              data={leftColumnData}
              renderItem={({ item }) => (
                <HobbyCard hobby={item} onPress={handleHobbyPress} />
              )}
              keyExtractor={(item) => `left-${item.id}`}
              showsVerticalScrollIndicator={false}
            />
          </SColumnWrapper>

          <SColumnWrapper>
            <FlatList
              data={rightColumnData}
              renderItem={({ item }) => (
                <HobbyCard hobby={item} onPress={handleHobbyPress} />
              )}
              keyExtractor={(item) => `right-${item.id}`}
              showsVerticalScrollIndicator={false}
            />
          </SColumnWrapper>
        </SGridContainer>
      </SContent>

      <SFooter>
        {showMoreButton && (
          <SSecondaryButton onPress={handleShowMore} activeOpacity={0.8}>
            <SSecondaryButtonText>🔄 他にもみる</SSecondaryButtonText>
          </SSecondaryButton>
        )}
        <SPrimaryButton onPress={handleBackToDiagnosis} activeOpacity={0.8}>
          <SPrimaryButtonText>もう一度診断する</SPrimaryButtonText>
        </SPrimaryButton>
      </SFooter>
    </SContainer>
  );
}
