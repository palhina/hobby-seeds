/**
 * 診断質問テキスト
 */

import styled from 'styled-components/native';

// ===================
// Types
// ===================

type QuestionTextProps = {
  text: string;
};

// ===================
// Styled Components
// ===================

const SText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.fontSize.xl * theme.typography.lineHeight.normal}px;
`;

// ===================
// Component
// ===================

export function QuestionText({ text }: QuestionTextProps) {
  return <SText>{text}</SText>;
}
