/**
 * 診断進捗バー
 */

import styled from 'styled-components/native';

// ===================
// Types
// ===================

type ProgressBarProps = {
  current: number;
  total: number;
  progress: number;
};

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const SBarContainer = styled.View`
  height: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  overflow: hidden;
`;

const SBar = styled.View<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress * 100}%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

const SText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: right;
`;

// ===================
// Component
// ===================

export function ProgressBar({ current, total, progress }: ProgressBarProps) {
  return (
    <SContainer>
      <SBarContainer>
        <SBar progress={progress} />
      </SBarContainer>
      <SText>{current} / {total}</SText>
    </SContainer>
  );
}
