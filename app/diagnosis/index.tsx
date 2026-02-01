/**
 * 診断開始画面
 *
 * ユーザーに気分診断の開始を促す画面。
 * 3つの質問で趣味を提案することを説明し、診断画面へ遷移する。
 */

import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

// ===================
// Styled Components
// ===================

const SContainer = styled.SafeAreaView`
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
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
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
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.relaxed}px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

const SButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`;

const SButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: #FFFFFF;
`;

// ===================
// Component
// ===================

export default function DiagnosisStartScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/diagnosis/question');
  };

  return (
    <SContainer>
      <SContent>
        <SEmoji>🌱</SEmoji>
        <STitle>今日はどんな気分？</STitle>
        <SDescription>
          3つの質問であなたに{'\n'}
          ぴったりの趣味を見つけます
        </SDescription>
        <SButton onPress={handleStart} activeOpacity={0.8}>
          <SButtonText>診断を始める</SButtonText>
        </SButton>
      </SContent>
    </SContainer>
  );
}
