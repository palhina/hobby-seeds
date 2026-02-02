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
import { useHobbyLog } from '@/hooks/use-hobby-log';
import hobbiesData from '@/data/hobbies.json';

import type { YuruHobby, Rating } from '@/types';

// ===================
// Styled Components
// ===================

const SContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SScrollView = styled(ScrollView)`
  flex: 1;
`;

const SContent = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.xxl}px;
`;

const SHeader = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SEmoji = styled.Text`
  font-size: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SHurdleContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const STryStepCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;

  /* シャドウ（Android） */
  elevation: 3;
`;

const STryStepTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const STryStepText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.relaxed}px;
`;

const STagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

const STag = styled.View`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.md}px`};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

const STagText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const SButtonContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SRatingSection = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;

  /* シャドウ（Android） */
  elevation: 3;
`;

const SRatingTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  text-align: center;
`;

const SSuccessMessage = styled.View`
  background-color: ${({ theme }) => theme.colors.rating.good};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
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

const SPrimaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
`;

const SSecondaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const SPrimaryButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: #FFFFFF;
`;

const SSecondaryButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const SErrorEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SErrorText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

// ===================
// Component
// ===================

export default function HobbyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addEntry } = useHobbyLog();

  // 評価選択の状態管理
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

    // ログを保存
    const success = await addEntry(hobby.id, rating, hobbiesData as YuruHobby[]);

    setIsSaving(false);

    if (success) {
      setIsSaved(true);
      // 2秒後にログ画面へ遷移
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
      <SContainer>
        <SErrorContainer>
          <SErrorEmoji>😅</SErrorEmoji>
          <SErrorText>
            趣味が見つかりませんでした。
          </SErrorText>
          <SSecondaryButton onPress={handleBack} activeOpacity={0.8}>
            <SSecondaryButtonText>戻る</SSecondaryButtonText>
          </SSecondaryButton>
        </SErrorContainer>
      </SContainer>
    );
  }

  return (
    <SContainer>
      <SScrollView showsVerticalScrollIndicator={false}>
        <SContent>
          <SHeader>
            <SEmoji>{hobby.emoji}</SEmoji>
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
            <STryStepText>{hobby.tryStep}</STryStepText>
          </STryStepCard>

          <STagsContainer>
            {hobby.tags.map((tag, index) => (
              <STag key={`${tag}-${index}`}>
                <STagText>#{tag}</STagText>
              </STag>
            ))}
          </STagsContainer>

          {/* 保存成功メッセージ */}
          {isSaved && (
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

            <SSecondaryButton onPress={handleBack} activeOpacity={0.8}>
              <SSecondaryButtonText>戻る</SSecondaryButtonText>
            </SSecondaryButton>
          </SButtonContainer>
        </SContent>
      </SScrollView>
    </SContainer>
  );
}
