/**
 * HobbyCard
 *
 * 趣味を表示するカードコンポーネント
 * グリッドレイアウトで使用され、タップで詳細画面に遷移
 */

import React from 'react';
import styled from 'styled-components/native';

import type { YuruHobby } from '@/types';
import { HurdleIndicator } from './HurdleIndicator';

// ===================
// Types
// ===================

type HobbyCardProps = {
  hobby: YuruHobby;
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
  height: 220px;

  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;

  /* シャドウ（Android） */
  elevation: 3;
`;

const SEmoji = styled.Text`
  font-size: 40px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  number-of-lines: 2;
`;

const SHurdleContainer = styled.View`
  margin-top: auto;
`;

// ===================
// Component
// ===================

export function HobbyCard({ hobby, onPress }: HobbyCardProps) {
  return (
    <SCard onPress={() => onPress(hobby.id)}>
      <SEmoji>{hobby.emoji}</SEmoji>
      <SName>{hobby.name}</SName>
      <SHurdleContainer>
        <HurdleIndicator
          time={hobby.time}
          cost={hobby.cost}
          location={hobby.location}
        />
      </SHurdleContainer>
    </SCard>
  );
}
