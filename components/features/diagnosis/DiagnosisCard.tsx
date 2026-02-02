/**
 * 診断選択肢カード
 */

import styled from 'styled-components/native';

// ===================
// Types
// ===================

type DiagnosisCardProps = {
  emoji: string;
  label: string;
  onPress: () => void;
};

// ===================
// Styled Components
// ===================

const SCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const SEmoji = styled.Text`
  font-size: 32px;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const SLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// ===================
// Component
// ===================

export function DiagnosisCard({ emoji, label, onPress }: DiagnosisCardProps) {
  return (
    <SCard onPress={onPress} activeOpacity={0.7}>
      <SEmoji>{emoji}</SEmoji>
      <SLabel>{label}</SLabel>
    </SCard>
  );
}
