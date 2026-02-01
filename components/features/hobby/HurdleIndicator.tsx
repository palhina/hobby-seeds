/**
 * HurdleIndicator
 *
 * 趣味のハードル（時間・コスト・場所）を表示するコンパクトなバッジコンポーネント
 */

import React from 'react';
import styled from 'styled-components/native';

import type { Location } from '@/types';

// ===================
// Types
// ===================

type HurdleIndicatorProps = {
  time: number;
  cost: number;
  location: Location;
};

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const SBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

const SBadgeText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

// ===================
// Component
// ===================

export function HurdleIndicator({ time, cost, location }: HurdleIndicatorProps) {
  // 0円の場合は"0円"、それ以外は実際の金額を表示
  const costDisplay = cost === 0 ? '0円' : `${cost}円`;

  return (
    <SContainer>
      <SBadge>
        <SBadgeText>⏱️ {time}分</SBadgeText>
      </SBadge>

      <SBadge>
        <SBadgeText>💰 {costDisplay}</SBadgeText>
      </SBadge>

      <SBadge>
        <SBadgeText>🏠 {location}</SBadgeText>
      </SBadge>
    </SContainer>
  );
}
