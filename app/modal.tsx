/**
 * モーダル画面（プレースホルダー）
 *
 * 必要に応じて機能を追加
 */

import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

const SContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SButton = styled.Pressable`
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
`;

const SButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default function ModalScreen() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <SContainer>
      <STitle>モーダル</STitle>
      <SButton onPress={handleClose}>
        <SButtonText>閉じる</SButtonText>
      </SButton>
    </SContainer>
  );
}
