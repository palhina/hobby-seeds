/**
 * StepUpCard
 *
 * ステップアップ趣味を表示するカードコンポーネント
 */

import React from 'react';
import styled from 'styled-components/native';

import type { StepUpHobby, Tag } from '@/types';

// ===================
// Types
// ===================

type StepUpCardProps = {
  hobby: StepUpHobby;
  matchScore: number;
  matchedTags: Tag[];
  onPress: (id: number) => void;
};

// ===================
// Styled Components
// ===================

const SCard = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;
  elevation: 3;
`;

const SHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const STitleContainer = styled.View`
  flex: 1;
`;

const SName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.relaxed}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SMatchBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  align-self: flex-start;
`;

const SMatchText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const STagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const STag = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
`;

const STagText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

const SInfoItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SInfoLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const SInfoValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// ===================
// Component
// ===================

export function StepUpCard({ hobby, matchScore, matchedTags, onPress }: StepUpCardProps) {
  return (
    <SCard onPress={() => onPress(hobby.id)}>
      <SHeader>
        <SEmoji>{hobby.emoji}</SEmoji>
        <STitleContainer>
          <SName>{hobby.name}</SName>
          <SMatchBadge>
            <SMatchText>マッチ度 {matchScore}%</SMatchText>
          </SMatchBadge>
        </STitleContainer>
      </SHeader>

      <SDescription>{hobby.description}</SDescription>

      <STagsContainer>
        {matchedTags.map((tag) => (
          <STag key={tag}>
            <STagText>#{tag}</STagText>
          </STag>
        ))}
      </STagsContainer>

      <SInfoRow>
        <SInfoItem>
          <SInfoLabel>初期コスト</SInfoLabel>
          <SInfoValue>{hobby.startCost}</SInfoValue>
        </SInfoItem>
        <SInfoItem>
          <SInfoLabel>時間コミット</SInfoLabel>
          <SInfoValue>{hobby.timeCommit}</SInfoValue>
        </SInfoItem>
      </SInfoRow>
    </SCard>
  );
}
