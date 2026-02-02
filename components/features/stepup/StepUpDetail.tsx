/**
 * StepUpDetail
 *
 * ステップアップ趣味の詳細情報を表示するコンポーネント
 */

import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import type { StepUpHobby } from '@/types';

// ===================
// Types
// ===================

type StepUpDetailProps = {
  hobby: StepUpHobby;
};

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeader = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const SEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.relaxed}px;
`;

const SContent = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const SSection = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SSectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SSectionText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.relaxed}px;
`;

const SInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SInfoCard = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  flex: 1;
  margin: 0 ${({ theme }) => theme.spacing.xs}px;
`;

const SInfoLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SInfoValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const SStepItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SStepNumber = styled.View`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const SStepNumberText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.surface};
`;

const SStepText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
`;

// ===================
// Component
// ===================

export function StepUpDetail({ hobby }: StepUpDetailProps) {
  return (
    <SContainer>
      <ScrollView>
        <SHeader>
          <SEmoji>{hobby.emoji}</SEmoji>
          <SName>{hobby.name}</SName>
          <SDescription>{hobby.description}</SDescription>
        </SHeader>

        <SContent>
          <SInfoRow>
            <SInfoCard>
              <SInfoLabel>初期コスト</SInfoLabel>
              <SInfoValue>{hobby.startCost}</SInfoValue>
            </SInfoCard>
            <SInfoCard>
              <SInfoLabel>時間コミット</SInfoLabel>
              <SInfoValue>{hobby.timeCommit}</SInfoValue>
            </SInfoCard>
          </SInfoRow>

          <SSection>
            <SSectionTitle>始め方ガイド</SSectionTitle>
            <SSectionText>{hobby.startGuide}</SSectionText>
          </SSection>

          <SSection>
            <SSectionTitle>最初の3ステップ</SSectionTitle>
            {hobby.nextSteps.map((step, index) => (
              <SStepItem key={index}>
                <SStepNumber>
                  <SStepNumberText>{index + 1}</SStepNumberText>
                </SStepNumber>
                <SStepText>{step}</SStepText>
              </SStepItem>
            ))}
          </SSection>
        </SContent>
      </ScrollView>
    </SContainer>
  );
}
