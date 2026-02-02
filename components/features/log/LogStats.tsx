/**
 * ログ統計表示コンポーネント
 *
 * 試した趣味の統計情報を表示する。
 * - 総試行数
 * - 😊の数
 * - よく試すタグ（topTags）
 */

import React from 'react';
import styled from 'styled-components/native';

import type { Tag } from '@/types';

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SStatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SStatLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SStatValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const STagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const STag = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

const STagText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const SDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.md}px 0;
`;

// ===================
// Component
// ===================

type LogStatsProps = {
  totalCount: number;
  greatCount: number;
  topTags: Tag[];
};

export function LogStats({ totalCount, greatCount, topTags }: LogStatsProps) {
  return (
    <SContainer>
      <STitle>📊 あなたの記録</STitle>

      <SStatsRow>
        <SStatLabel>試した趣味</SStatLabel>
        <SStatValue>{totalCount}回</SStatValue>
      </SStatsRow>

      <SStatsRow>
        <SStatLabel>😊（楽しかった！）</SStatLabel>
        <SStatValue>{greatCount}回</SStatValue>
      </SStatsRow>

      {topTags.length > 0 && (
        <>
          <SDivider />
          <SStatLabel>よく試している趣味のタイプ</SStatLabel>
          <STagsContainer>
            {topTags.map((tag, index) => (
              <STag key={`${tag}-${index}`}>
                <STagText>#{tag}</STagText>
              </STag>
            ))}
          </STagsContainer>
        </>
      )}
    </SContainer>
  );
}
