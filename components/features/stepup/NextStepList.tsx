/**
 * NextStepList
 *
 * 次のステップを表示するリストコンポーネント
 */

import React from 'react';
import styled from 'styled-components/native';

// ===================
// Types
// ===================

type NextStepListProps = {
  steps: string[];
};

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SStepItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SStepNumber = styled.View`
  width: 28px;
  height: 28px;
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

export function NextStepList({ steps }: NextStepListProps) {
  return (
    <SContainer>
      <STitle>最初の3ステップ</STitle>
      {steps.map((step, index) => (
        <SStepItem key={index}>
          <SStepNumber>
            <SStepNumberText>{index + 1}</SStepNumberText>
          </SStepNumber>
          <SStepText>{step}</SStepText>
        </SStepItem>
      ))}
    </SContainer>
  );
}
