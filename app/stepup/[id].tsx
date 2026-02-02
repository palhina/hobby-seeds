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

import type { StepUpHobby } from '@/types';

// データのインポート
import stepUpHobbiesData from '@/data/stepup-hobbies.json';

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SErrorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl}px;
`;

const SErrorEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SErrorTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SErrorMessage = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
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
      <SContainer>
        <SErrorContainer>
          <SErrorMessage>読み込み中...</SErrorMessage>
        </SErrorContainer>
      </SContainer>
    );
  }

  // 趣味が見つからない
  if (!hobby) {
    return (
      <SContainer>
        <SErrorContainer>
          <SErrorEmoji>🤔</SErrorEmoji>
          <SErrorTitle>趣味が見つかりません</SErrorTitle>
          <SErrorMessage>この趣味は存在しないか、削除されました</SErrorMessage>
        </SErrorContainer>
      </SContainer>
    );
  }

  // 詳細を表示
  return (
    <SContainer>
      <StepUpDetail hobby={hobby} />
    </SContainer>
  );
}
