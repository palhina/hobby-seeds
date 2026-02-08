/**
 * 趣味詳細画面
 *
 * 選択された趣味の詳細情報を表示
 */

import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import { HurdleIndicator } from '@/components/features/hobby/HurdleIndicator';
import { RatingButtons } from '@/components/features/hobby/RatingButtons';
import {
  SSafeContainer,
  SContent,
  SCenteredContent,
  SCard,
  STagsContainer,
  STag,
  STagText,
  SPrimaryButton,
  SPrimaryButtonText,
  SSecondaryButton,
  SSecondaryButtonText,
  STitle,
  SBodyText,
  STitleCentered,
  SEmojiLarge,
  SDisplayText,
  SMutedText,
} from '@/components/ui/primitives';
import { useHobbyLog } from '@/hooks/use-hobby-log';
import hobbiesData from '@/data/hobbies.json';

import type { YuruHobby, Rating } from '@/types';

// ===================
// Local Styles
// ===================

const SScrollView = styled(ScrollView)`
  flex: 1;
`;

const SContentPadded = styled(SContent)`
  padding-top: ${({ theme }) => theme.spacing.xxl}px;
`;

const SHeader = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SEmojiSpaced = styled(SEmojiLarge)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SName = styled(SDisplayText)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SHurdleContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const STryStepCard = styled(SCard)`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const STryStepTitle = styled(STitle)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const STagsSpaced = styled(STagsContainer)`
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

const SRatingSection = styled(SCard)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
`;

const SRatingTitle = styled(STitleCentered)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SSuccessMessage = styled.View`
  background-color: ${({ theme }) => theme.colors.rating.good};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
`;

const SUnlockMessage = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
`;

const SUnlockEmoji = styled.Text`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SUnlockTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #FFFFFF;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SUnlockText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: #FFFFFF;
  text-align: center;
  opacity: 0.9;
`;

const SSuccessEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SSuccessText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const SButtonContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SErrorEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SErrorText = styled(SMutedText)`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

// ===================
// Component
// ===================

export default function HobbyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addEntry, log } = useHobbyLog();

  // 評価選択の状態管理
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFirstUnlock, setIsFirstUnlock] = useState(false);

  // IDから趣味を検索
  const hobby = useMemo(() => {
    if (!id) {
      return null;
    }
    const hobbyId = parseInt(id, 10);
    return (hobbiesData as YuruHobby[]).find((h) => h.id === hobbyId) || null;
  }, [id]);

  const handleTryIt = () => {
    // 評価選択UIを表示
    setShowRating(true);
  };

  const handleRate = async (rating: Rating) => {
    if (!hobby || isSaving) return;

    setSelectedRating(rating);
    setIsSaving(true);

    // 保存前のgreatCountを記録（初回解放判定用）
    const previousGreatCount = log.greatCount;

    // ログを保存
    const success = await addEntry(hobby.id, rating, hobbiesData as YuruHobby[]);

    setIsSaving(false);

    if (success) {
      setIsSaved(true);

      // 初回ステップアップ解放の判定
      // 以前は3未満で、今回のレーティングで3以上になった場合
      const newGreatCount = previousGreatCount + (rating === 'great' ? 1 : 0);
      const isFirstStepUpUnlock = previousGreatCount < 3 && newGreatCount >= 3;

      if (isFirstStepUpUnlock) {
        setIsFirstUnlock(true);
      }

      // 常に記録画面へ遷移（ステップアップへの自動遷移は廃止）
      setTimeout(() => {
        router.push('/(tabs)/log');
      }, 1500);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!hobby) {
    return (
      <SSafeContainer>
        <SCenteredContent>
          <SErrorEmoji>😅</SErrorEmoji>
          <SErrorText>
            趣味が見つかりませんでした。
          </SErrorText>
          <SSecondaryButton onPress={handleBack} activeOpacity={0.8}>
            <SSecondaryButtonText>戻る</SSecondaryButtonText>
          </SSecondaryButton>
        </SCenteredContent>
      </SSafeContainer>
    );
  }

  return (
    <SSafeContainer>
      <SScrollView showsVerticalScrollIndicator={false}>
        <SContentPadded>
          <SHeader>
            <SEmojiSpaced>{hobby.emoji}</SEmojiSpaced>
            <SName>{hobby.name}</SName>
          </SHeader>

          <SHurdleContainer>
            <HurdleIndicator
              time={hobby.time}
              cost={hobby.cost}
              location={hobby.location}
            />
          </SHurdleContainer>

          <STryStepCard>
            <STryStepTitle>🌱 最初の一歩</STryStepTitle>
            <SBodyText>{hobby.tryStep}</SBodyText>
          </STryStepCard>

          <STagsSpaced>
            {hobby.tags.map((tag, index) => (
              <STag key={`${tag}-${index}`}>
                <STagText>#{tag}</STagText>
              </STag>
            ))}
          </STagsSpaced>

          {/* ステップアップ解放メッセージ */}
          {isSaved && isFirstUnlock && (
            <SUnlockMessage>
              <SUnlockEmoji>🎊</SUnlockEmoji>
              <SUnlockTitle>おめでとうございます！</SUnlockTitle>
              <SUnlockText>
                ステップアップ趣味が解放されました！{'\n'}
                記録画面から確認できます
              </SUnlockText>
            </SUnlockMessage>
          )}

          {/* 通常の保存成功メッセージ */}
          {isSaved && !isFirstUnlock && (
            <SSuccessMessage>
              <SSuccessEmoji>🎉</SSuccessEmoji>
              <SSuccessText>記録しました！ログ画面へ移動します...</SSuccessText>
            </SSuccessMessage>
          )}

          {/* 評価選択UI */}
          {showRating && !isSaved && (
            <SRatingSection>
              <SRatingTitle>どうでしたか？</SRatingTitle>
              <RatingButtons
                selectedRating={selectedRating}
                onRate={handleRate}
              />
            </SRatingSection>
          )}

          <SButtonContainer>
            {!showRating && !isSaved && (
              <SPrimaryButton onPress={handleTryIt} activeOpacity={0.8}>
                <SPrimaryButtonText>やってみた！</SPrimaryButtonText>
              </SPrimaryButton>
            )}

            {!isSaved && (
              <SSecondaryButton onPress={handleBack} activeOpacity={0.8}>
                <SSecondaryButtonText>戻る</SSecondaryButtonText>
              </SSecondaryButton>
            )}
          </SButtonContainer>
        </SContentPadded>
      </SScrollView>
    </SSafeContainer>
  );
}
