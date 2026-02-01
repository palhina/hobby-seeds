/**
 * 診断関連の型定義
 *
 * このファイルには気分診断に関連する型を定義します。
 */

import type { EnergyLevel } from './common';

// ==========================================
// 診断回答
// ==========================================

/**
 * 診断の回答データ
 * 3つの質問に対するユーザーの回答を保持
 */
export type DiagnosisAnswer = {
  energy: EnergyLevel;
  goOut: boolean;
  activityType: 'passive' | 'active';
};

// ==========================================
// 診断結果
// ==========================================

/**
 * 診断結果データ
 * 回答内容と提案された趣味のIDリスト、作成日時を保持
 */
export type DiagnosisResult = {
  answers: DiagnosisAnswer;
  suggestedHobbies: number[];
  createdAt: string;
};

// ==========================================
// 診断質問
// ==========================================

/**
 * 診断質問の選択肢
 * ジェネリック型Tは選択肢の値の型
 */
export type DiagnosisQuestionOption<T> = {
  value: T;
  label: string;
  emoji: string;
};

/**
 * 診断質問データ
 * 質問文、選択肢、回答キーを保持
 */
export type DiagnosisQuestion = {
  id: number;
  text: string;
  options: DiagnosisQuestionOption<unknown>[];
  answerKey: keyof DiagnosisAnswer;
};
