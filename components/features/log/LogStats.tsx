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

import {
  SRowBetween,
  STitle,
  SSmallText,
  SLabel,
  STagsContainerCompact,
} from '@/components/ui/primitives';

import type { Tag } from '@/types';

// ===================
// Local Styles
// ===================

const SContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const STitleSpaced = styled(STitle)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SStatsRow = styled(SRowBetween)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
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

const STagsSpaced = styled(STagsContainerCompact)`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
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
      <STitleSpaced>📊 あなたの記録</STitleSpaced>

      <SStatsRow>
        <SSmallText>試した趣味</SSmallText>
        <SLabel>{totalCount}回</SLabel>
      </SStatsRow>

      <SStatsRow>
        <SSmallText>😊（楽しかった！）</SSmallText>
        <SLabel>{greatCount}回</SLabel>
      </SStatsRow>

      {topTags.length > 0 && (
        <>
          <SDivider />
          <SSmallText>よく試している趣味のタイプ</SSmallText>
          <STagsSpaced>
            {topTags.map((tag, index) => (
              <STag key={`${tag}-${index}`}>
                <STagText>#{tag}</STagText>
              </STag>
            ))}
          </STagsSpaced>
        </>
      )}
    </SContainer>
  );
}
