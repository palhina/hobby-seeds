/**
 * UnlockBanner
 *
 * ステップアップ機能解放時に表示するバナーコンポーネント
 */

import React from 'react';
import styled from 'styled-components/native';

// ===================
// Styled Components
// ===================

const SBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 12px;
  elevation: 6;
`;

const SEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.surface};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SMessage = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.surface};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.relaxed}px;
`;

// ===================
// Component
// ===================

export function UnlockBanner() {
  return (
    <SBanner>
      <SEmoji>🎉</SEmoji>
      <STitle>ステップアップ解放！</STitle>
      <SMessage>
        😊を3回記録したあなたに{'\n'}
        もっと深く楽しめる趣味を提案します
      </SMessage>
    </SBanner>
  );
}
