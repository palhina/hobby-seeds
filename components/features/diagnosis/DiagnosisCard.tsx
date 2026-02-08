/**
 * 診断選択肢カード
 */

import styled from 'styled-components/native';

import { SCardBordered, SLabel, SEmojiMedium } from '@/components/ui/primitives';

// ===================
// Types
// ===================

type DiagnosisCardProps = {
  emoji: string;
  label: string;
  onPress: () => void;
};

// ===================
// Local Styles
// ===================

const SCard = styled(SCardBordered)`
  flex-direction: row;
  align-items: center;
`;

const SEmojiSpaced = styled(SEmojiMedium)`
  font-size: 32px;
  margin-right: ${({ theme }) => theme.spacing.md}px;
  text-align: left;
`;

// ===================
// Component
// ===================

export function DiagnosisCard({ emoji, label, onPress }: DiagnosisCardProps) {
  return (
    <SCard onPress={onPress} activeOpacity={0.7}>
      <SEmojiSpaced>{emoji}</SEmojiSpaced>
      <SLabel>{label}</SLabel>
    </SCard>
  );
}
