/**
 * HobbyCard
 *
 * 趣味を表示するカードコンポーネント
 * グリッドレイアウトで使用され、タップで詳細画面に遷移
 */

import React from 'react';
import styled from 'styled-components/native';

import { SCardPressable, SEmojiMedium, SLabel } from '@/components/ui/primitives';
import { HurdleIndicator } from './HurdleIndicator';

import type { YuruHobby } from '@/types';

// ===================
// Types
// ===================

type HobbyCardProps = {
  hobby: YuruHobby;
  onPress: (id: number) => void;
};

// ===================
// Local Styles
// ===================

const SCard = styled(SCardPressable)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  height: 220px;
`;

const SEmojiSpaced = styled(SEmojiMedium)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SName = styled(SLabel)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
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
      <SEmojiSpaced>{hobby.emoji}</SEmojiSpaced>
      <SName numberOfLines={2}>{hobby.name}</SName>
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
