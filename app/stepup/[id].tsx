/**
 * ステップアップ詳細画面
 *
 * ステップアップ趣味の詳細を表示
 */

import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import styled from 'styled-components/native';

import { findStepUpHobbyById } from '@/utils/match-stepup';
import { StepUpDetail } from '@/components/features/stepup';
import {
  SScreenContainer,
  SCenteredContent,
  SDisplayText,
  SBodyText,
  SEmojiLarge,
} from '@/components/ui/primitives';

import type { StepUpHobby } from '@/types';

// データのインポート
import stepUpHobbiesData from '@/data/stepup-hobbies.json';

// ===================
// Local Styles
// ===================

const SErrorEmoji = styled(SEmojiLarge)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SErrorTitle = styled(SDisplayText)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SErrorMessage = styled(SBodyText)`
  text-align: center;
`;

// ===================
// Component
// ===================

export default function StepUpDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hobby, setHobby] = useState<StepUpHobby | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHobby();
  }, [id]);

  const loadHobby = () => {
    try {
      const hobbyId = parseInt(id, 10);

      if (isNaN(hobbyId)) {
        setLoading(false);
        return;
      }

      const stepUpHobbies = stepUpHobbiesData as StepUpHobby[];
      const foundHobby = findStepUpHobbyById(stepUpHobbies, hobbyId);

      setHobby(foundHobby || null);
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to load hobby:', error);
      }
      setHobby(null);
    } finally {
      setLoading(false);
    }
  };

  // ローディング中
  if (loading) {
    return (
      <SScreenContainer>
        <SCenteredContent>
          <SErrorMessage>読み込み中...</SErrorMessage>
        </SCenteredContent>
      </SScreenContainer>
    );
  }

  // 趣味が見つからない
  if (!hobby) {
    return (
      <SScreenContainer>
        <SCenteredContent>
          <SErrorEmoji>🤔</SErrorEmoji>
          <SErrorTitle>趣味が見つかりません</SErrorTitle>
          <SErrorMessage>この趣味は存在しないか、削除されました</SErrorMessage>
        </SCenteredContent>
      </SScreenContainer>
    );
  }

  // 詳細を表示
  return (
    <SScreenContainer>
      <StepUpDetail hobby={hobby} />
    </SScreenContainer>
  );
}
