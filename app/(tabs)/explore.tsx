/**
 * 履歴タブ（プレースホルダー）
 *
 * チケット007（ログ機能）完了後に本格実装
 */

import React from 'react';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const SEmoji = styled.Text`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 24px;
`;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SContainer style={{ paddingTop: insets.top }}>
      <SContent>
        <SEmoji>📝</SEmoji>
        <STitle>やってみた記録</STitle>
        <SDescription>
          試した趣味の記録がここに表示されます{'\n'}
          （チケット007で実装予定）
        </SDescription>
      </SContent>
    </SContainer>
  );
}
