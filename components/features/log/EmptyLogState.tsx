/**
 * 空状態表示コンポーネント
 *
 * ログが1つもない場合に表示するメッセージ。
 * ユーザーに趣味を試すことを促す。
 */

import React from 'react';
import styled from 'styled-components/native';

import {
  SCenteredContent,
  SDisplayText,
  SBodyText,
} from '@/components/ui/primitives';

// ===================
// Local Styles
// ===================

const SEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display * 1.5}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const STitle = styled(SDisplayText)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SDescription = styled(SBodyText)`
  text-align: center;
`;

// ===================
// Component
// ===================

export function EmptyLogState() {
  return (
    <SCenteredContent>
      <SEmoji>📝</SEmoji>
      <STitle>まだ記録がありません</STitle>
      <SDescription>
        ホーム画面から趣味を選んで{'\n'}
        「やってみた」を記録してみましょう
      </SDescription>
    </SCenteredContent>
  );
}
