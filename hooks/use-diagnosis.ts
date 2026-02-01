/**
 * 診断ロジックフック
 *
 * 3問の気分診断を管理するカスタムフック
 */

import { useState, useCallback } from 'react';

import type { DiagnosisAnswer, DiagnosisQuestion, EnergyLevel } from '@/types';

// 質問データ
export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 1,
    text: '今のエネルギーレベルは？',
    options: [
      { value: 'low', label: 'のんびり', emoji: '😴' },
      { value: 'medium', label: 'ふつう', emoji: '😊' },
      { value: 'high', label: '元気いっぱい', emoji: '🔥' },
    ],
    answerKey: 'energy',
  },
  {
    id: 2,
    text: '外に出たい気分？',
    options: [
      { value: true, label: '外に出たい', emoji: '🚶' },
      { value: false, label: '家にいたい', emoji: '🏠' },
    ],
    answerKey: 'goOut',
  },
  {
    id: 3,
    text: '何をしたい気分？',
    options: [
      { value: 'active', label: '何かを作る・動く', emoji: '✨' },
      { value: 'passive', label: 'ぼんやり眺める・聴く', emoji: '👀' },
    ],
    answerKey: 'activityType',
  },
];

// 初期状態
const INITIAL_ANSWERS: Partial<DiagnosisAnswer> = {};

export function useDiagnosis() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosisAnswer>>(INITIAL_ANSWERS);

  // 現在の質問
  const currentQuestion = DIAGNOSIS_QUESTIONS[currentQuestionIndex];

  // 総質問数
  const totalQuestions = DIAGNOSIS_QUESTIONS.length;

  // 進捗（0-1）
  const progress = (currentQuestionIndex + 1) / totalQuestions;

  // 完了判定
  const isCompleted = currentQuestionIndex >= totalQuestions;

  // 最後の質問かどうか
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // 回答を更新して次の質問へ
  const answerQuestion = useCallback((value: unknown) => {
    const question = DIAGNOSIS_QUESTIONS[currentQuestionIndex];

    setAnswers((prev) => ({
      ...prev,
      [question.answerKey]: value,
    }));

    // 次の質問へ（または完了）
    setCurrentQuestionIndex((prev) => prev + 1);
  }, [currentQuestionIndex]);

  // 診断をリセット
  const resetDiagnosis = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers(INITIAL_ANSWERS);
  }, []);

  // 完了した回答を取得（型安全）
  const getCompletedAnswers = useCallback((): DiagnosisAnswer | null => {
    if (!isCompleted) return null;

    // 全ての回答が揃っているか確認
    if (
      answers.energy === undefined ||
      answers.goOut === undefined ||
      answers.activityType === undefined
    ) {
      return null;
    }

    return answers as DiagnosisAnswer;
  }, [isCompleted, answers]);

  return {
    // 状態
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    isCompleted,
    isLastQuestion,
    answers,

    // アクション
    answerQuestion,
    resetDiagnosis,
    getCompletedAnswers,
  };
}
