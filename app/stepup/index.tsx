/**
 * ステップアップ一覧画面
 *
 * マッチしたステップアップ趣味を一覧表示
 */

import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { matchStepUpHobbies, isStepUpUnlocked, getRemainingToUnlock } from '@/utils/match-stepup';
import { StepUpCard, UnlockBanner } from '@/components/features/stepup';

import type { StepUpHobby, HobbyLog } from '@/types';
import type { MatchResult } from '@/utils/match-stepup';

// データのインポート
import stepUpHobbiesData from '@/data/stepup-hobbies.json';

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SEmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl}px;
`;

const SEmptyEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SEmptyTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SEmptyMessage = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.fontSize.md * 1.5}px;
`;

const SLockedContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl}px;
`;

const SLockedEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SLockedTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SLockedMessage = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.fontSize.md * 1.5}px;
`;

const SProgressBar = styled.View`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  overflow: hidden;
`;

type SProgressFillProps = {
  progress: number;
};

const SProgressFill = styled.View<SProgressFillProps>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const SIntroSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SIntroTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SIntroText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.fontSize.md * 1.6}px;
`;

// ===================
// Component
// ===================

export default function StepUpScreen() {
  const router = useRouter();
  const [matchedHobbies, setMatchedHobbies] = useState<MatchResult[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [remaining, setRemaining] = useState(3);
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStepUpData();
  }, []);

  const loadStepUpData = async () => {
    try {
      // AsyncStorageからログデータを取得
      const logJson = await AsyncStorage.getItem('@hobby-seeds/hobby-log');

      if (!logJson) {
        setLoading(false);
        return;
      }

      const hobbyLog: HobbyLog = JSON.parse(logJson);
      const unlocked = isStepUpUnlocked(hobbyLog.greatCount);
      const remainingCount = getRemainingToUnlock(hobbyLog.greatCount);

      setIsUnlocked(unlocked);
      setRemaining(remainingCount);

      // 解放されていない場合は早期リターン
      if (!unlocked) {
        setLoading(false);
        return;
      }

      // 初回解放時のバナー表示判定
      const bannerShownKey = '@hobby-seeds/stepup-banner-shown';
      const bannerShown = await AsyncStorage.getItem(bannerShownKey);

      if (!bannerShown) {
        setShowBanner(true);
        await AsyncStorage.setItem(bannerShownKey, 'true');
      }

      // マッチング処理
      const stepUpHobbies = stepUpHobbiesData as StepUpHobby[];
      const matches = matchStepUpHobbies(stepUpHobbies, hobbyLog.topTags);

      setMatchedHobbies(matches);
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to load step-up data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (id: number) => {
    router.push(`/stepup/${id}`);
  };

  // ローディング中
  if (loading) {
    return (
      <SContainer>
        <SEmptyContainer>
          <SEmptyMessage>読み込み中...</SEmptyMessage>
        </SEmptyContainer>
      </SContainer>
    );
  }

  // 未解放状態
  if (!isUnlocked) {
    const progress = ((3 - remaining) / 3) * 100;

    return (
      <SContainer>
        <SLockedContainer>
          <SLockedEmoji>🔒</SLockedEmoji>
          <SLockedTitle>あと{remaining}回で解放！</SLockedTitle>
          <SLockedMessage>
            趣味を試して😊を{remaining}回記録すると{'\n'}
            ステップアップ趣味が提案されます
          </SLockedMessage>
          <SProgressBar>
            <SProgressFill progress={progress} />
          </SProgressBar>
        </SLockedContainer>
      </SContainer>
    );
  }

  // 解放済みだがマッチなし
  if (matchedHobbies.length === 0) {
    return (
      <SContainer>
        <SEmptyContainer>
          <SEmptyEmoji>🌱</SEmptyEmoji>
          <SEmptyTitle>まだ提案できません</SEmptyTitle>
          <SEmptyMessage>
            もう少し色々な趣味を試してみてください{'\n'}
            あなたに合った趣味が見つかります
          </SEmptyMessage>
        </SEmptyContainer>
      </SContainer>
    );
  }

  // ヘッダーコンポーネント
  const ListHeader = () => (
    <>
      {showBanner && <UnlockBanner />}
      <SIntroSection>
        <SIntroTitle>🚀 次のステップへ</SIntroTitle>
        <SIntroText>
          ゆる趣味を楽しんでくれてありがとう！{'\n'}
          もし「もう少し深めてみたいな」と思ったら、{'\n'}
          こちらの趣味にチャレンジしてみませんか？{'\n'}
          無理せず、気になったときだけでOKです。
        </SIntroText>
      </SIntroSection>
    </>
  );

  // マッチング結果を表示
  return (
    <SContainer>
      <FlatList
        data={matchedHobbies}
        renderItem={({ item }) => (
          <StepUpCard
            hobby={item.hobby}
            matchScore={item.matchScore}
            matchedTags={item.matchedTags}
            onPress={handlePress}
          />
        )}
        keyExtractor={(item) => item.hobby.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<ListHeader />}
      />
    </SContainer>
  );
}
