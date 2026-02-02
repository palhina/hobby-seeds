/**
 * RatingButtons
 *
 * 趣味の評価を選択する3つのボタン（😐 🙂 😊）
 * 選択状態のスタイリングとハプティックフィードバック付き
 */

import React from 'react';
import styled from 'styled-components/native';
import * as Haptics from 'expo-haptics';

import type { Rating } from '@/types';

// ===================
// Types
// ===================

type RatingButtonsProps = {
  selectedRating: Rating | null;
  onRate: (rating: Rating) => void;
};

type RatingOption = {
  value: Rating;
  emoji: string;
  label: string;
};

// ===================
// Constants
// ===================

const RATING_OPTIONS: RatingOption[] = [
  { value: 'meh', emoji: '😐', label: '微妙' },
  { value: 'good', emoji: '🙂', label: 'まあまあ' },
  { value: 'great', emoji: '😊', label: '良かった' },
];

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const SButton = styled.Pressable<{ selected: boolean; rating: Rating }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ theme, selected, rating }) => {
    if (!selected) return theme.colors.backgroundAlt;

    // 選択時は評価に応じた色を適用
    switch (rating) {
      case 'meh':
        return theme.colors.rating.meh;
      case 'good':
        return theme.colors.rating.ok;
      case 'great':
        return theme.colors.rating.good;
      default:
        return theme.colors.backgroundAlt;
    }
  }};
  border: 2px solid ${({ theme, selected }) =>
    selected ? theme.colors.primary : 'transparent'};
  align-items: center;
  justify-content: center;
`;

const SButtonContent = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const SEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
`;

const SLabel = styled.Text<{ selected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme, selected }) =>
    selected ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ theme, selected }) =>
    selected ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
`;

// ===================
// Component
// ===================

export function RatingButtons({ selectedRating, onRate }: RatingButtonsProps) {
  const handlePress = async (rating: Rating) => {
    // ハプティックフィードバック
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRate(rating);
  };

  return (
    <SContainer>
      {RATING_OPTIONS.map((option) => {
        const isSelected = selectedRating === option.value;

        return (
          <SButton
            key={option.value}
            testID={`rating-button-${option.value}`}
            selected={isSelected}
            rating={option.value}
            onPress={() => handlePress(option.value)}
          >
            <SButtonContent>
              <SEmoji>{option.emoji}</SEmoji>
              <SLabel selected={isSelected}>{option.label}</SLabel>
            </SButtonContent>
          </SButton>
        );
      })}
    </SContainer>
  );
}
