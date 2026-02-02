/**
 * 空状態表示コンポーネント
 *
 * ログが1つもない場合に表示するメッセージ。
 * ユーザーに趣味を試すことを促す。
 */

import React from 'react';
import styled from 'styled-components/native';

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const SEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display * 1.5}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: ${({ theme }) =>
    theme.typography.fontSize.md * theme.typography.lineHeight.relaxed}px;
`;

// ===================
// Component
// ===================

export function EmptyLogState() {
  return (
    <SContainer>
      <SEmoji>📝</SEmoji>
      <STitle>まだ記録がありません</STitle>
      <SDescription>
        ホーム画面から趣味を選んで{'\n'}
        「やってみた」を記録してみましょう
      </SDescription>
    </SContainer>
  );
}
