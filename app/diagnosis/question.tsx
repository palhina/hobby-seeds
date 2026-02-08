/**
 * 診断質問画面
 *
 * 3問の気分診断を1問ずつ表示し、回答を収集する画面
 */

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import * as Haptics from 'expo-haptics';

import { useDiagnosis } from '@/hooks/use-diagnosis';
import { DiagnosisHeader } from '@/components/features/diagnosis/DiagnosisHeader';
import { ProgressBar } from '@/components/features/diagnosis/ProgressBar';
import { QuestionText } from '@/components/features/diagnosis/QuestionText';
import { DiagnosisCard } from '@/components/features/diagnosis/DiagnosisCard';
import { SSafeContainer, SContent } from '@/components/ui/primitives';

// ===================
// Local Styles
// ===================

const SHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-top: 0;
`;

const SQuestionContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SOptionsContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

// ===================
// Component
// ===================

export default function DiagnosisQuestionScreen() {
  const router = useRouter();
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    isCompleted,
    answerQuestion,
    answers,
  } = useDiagnosis();

  // 診断完了時に結果画面へ遷移
  useEffect(() => {
    if (isCompleted) {
      // 回答データをJSON文字列化してパラメータとして渡す
      router.replace({
        pathname: '/results',
        params: { answers: JSON.stringify(answers) },
      });
    }
  }, [isCompleted, answers, router]);

  // 質問がない場合（完了直後など）
  if (!currentQuestion) {
    return null;
  }

  const handleOptionPress = (value: unknown) => {
    // ハプティックフィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    answerQuestion(value);
  };

  return (
    <SSafeContainer>
      <DiagnosisHeader />
      <SHeader>
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          progress={progress}
        />
      </SHeader>

      <SContent>
        <SQuestionContainer>
          <QuestionText text={currentQuestion.text} />
        </SQuestionContainer>

        <SOptionsContainer>
          {currentQuestion.options.map((option) => (
            <DiagnosisCard
              key={String(option.value)}
              emoji={option.emoji}
              label={option.label}
              onPress={() => handleOptionPress(option.value)}
            />
          ))}
        </SOptionsContainer>
      </SContent>
    </SSafeContainer>
  );
}
