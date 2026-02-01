/**
 * 結果画面（プレースホルダー）
 *
 * 本格的な実装はチケット006で行う
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import styled from 'styled-components/native';

import type { DiagnosisAnswer } from '@/types';

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
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SAnswerBox = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  width: 100%;
`;

const SAnswerText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`;

const SButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: #FFFFFF;
`;

// ===================
// Component
// ===================

export default function ResultsScreen() {
  const router = useRouter();
  const { answers: answersJson } = useLocalSearchParams<{ answers: string }>();

  // 回答データをパース
  const answers: DiagnosisAnswer | null = answersJson
    ? JSON.parse(answersJson)
    : null;

  const handleBackToDiagnosis = () => {
    router.replace('/diagnosis');
  };

  return (
    <SContainer>
      <SContent>
        <SEmoji>🎉</SEmoji>
        <STitle>診断完了！</STitle>
        <SDescription>
          あなたの回答を分析しています...{'\n'}
          （チケット006で趣味提案を実装予定）
        </SDescription>

        {answers && (
          <SAnswerBox>
            <SAnswerText>エネルギー: {answers.energy}</SAnswerText>
            <SAnswerText>外出: {answers.goOut ? 'はい' : 'いいえ'}</SAnswerText>
            <SAnswerText>タイプ: {answers.activityType}</SAnswerText>
          </SAnswerBox>
        )}

        <SButton onPress={handleBackToDiagnosis} activeOpacity={0.8}>
          <SButtonText>もう一度診断する</SButtonText>
        </SButton>
      </SContent>
    </SContainer>
  );
}
