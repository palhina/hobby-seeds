/**
 * StepUpCard
 *
 * ステップアップ趣味を表示するカードコンポーネント
 */

import React from 'react';
import styled from 'styled-components/native';

import {
  SCardPressable,
  SRow,
  SSectionDivider,
  STitle,
  SBodyText,
  SLabelSmall,
  SValue,
  SEmojiSmall,
  SBadge,
  SBadgeText,
  STagsContainerCompact,
  STagSecondary,
  STagSecondaryText,
} from '@/components/ui/primitives';

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
// Local Styles
// ===================

const SCard = styled(SCardPressable)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SHeader = styled(SRow)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SEmojiSpaced = styled(SEmojiSmall)`
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const STitleContainer = styled.View`
  flex: 1;
`;

const SName = styled(STitle)`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SDescription = styled(SBodyText)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const STagsSpaced = styled(STagsContainerCompact)`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const SInfoItem = styled(SRow)``;

const SInfoLabel = styled(SLabelSmall)`
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

// ===================
// Component
// ===================

export function StepUpCard({ hobby, matchScore, matchedTags, onPress }: StepUpCardProps) {
  return (
    <SCard onPress={() => onPress(hobby.id)}>
      <SHeader>
        <SEmojiSpaced>{hobby.emoji}</SEmojiSpaced>
        <STitleContainer>
          <SName>{hobby.name}</SName>
          <SBadge>
            <SBadgeText>マッチ度 {matchScore}%</SBadgeText>
          </SBadge>
        </STitleContainer>
      </SHeader>

      <SDescription>{hobby.description}</SDescription>

      <STagsSpaced>
        {matchedTags.map((tag) => (
          <STagSecondary key={tag}>
            <STagSecondaryText>#{tag}</STagSecondaryText>
          </STagSecondary>
        ))}
      </STagsSpaced>

      <SSectionDivider>
        <SInfoItem>
          <SInfoLabel>初期コスト</SInfoLabel>
          <SValue>{hobby.startCost}</SValue>
        </SInfoItem>
        <SInfoItem>
          <SInfoLabel>かかる時間</SInfoLabel>
          <SValue>{hobby.timeCommit}</SValue>
        </SInfoItem>
      </SSectionDivider>
    </SCard>
  );
}
