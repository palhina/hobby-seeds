/**
 * ステップアップマッチングユーティリティ
 *
 * ユーザーのタグ傾向に基づいてステップアップ趣味をマッチングする機能を提供します。
 */

import type { StepUpHobby, Tag } from '@/types';

// ==========================================
// 定数定義
// ==========================================

/**
 * ステップアップ解放に必要な😊（great）の回数
 */
export const STEPUP_UNLOCK_THRESHOLD = 3;

// ==========================================
// 型定義
// ==========================================

/**
 * マッチング結果
 */
export type MatchResult = {
  /** ステップアップ趣味 */
  hobby: StepUpHobby;
  /** マッチスコア（0〜100） */
  matchScore: number;
  /** マッチしたタグの配列 */
  matchedTags: Tag[];
};

// ==========================================
// 解放判定関数
// ==========================================

/**
 * ステップアップ機能が解放されているか判定する
 */
export function isStepUpUnlocked(greatCount: number): boolean {
  return greatCount >= STEPUP_UNLOCK_THRESHOLD;
}

/**
 * ステップアップ解放までの残り回数を計算する
 */
export function getRemainingToUnlock(greatCount: number): number {
  const remaining = STEPUP_UNLOCK_THRESHOLD - greatCount;
  return remaining > 0 ? remaining : 0;
}

// ==========================================
// マッチング関数
// ==========================================

/**
 * ユーザーのトップタグに基づいてステップアップ趣味をマッチングする
 */
export function matchStepUpHobbies(
  stepUpHobbies: StepUpHobby[],
  userTopTags: Tag[]
): MatchResult[] {
  // ユーザーのトップタグが空の場合は空配列を返す
  if (userTopTags.length === 0) {
    return [];
  }

  const results: MatchResult[] = [];

  // 各ステップアップ趣味について、ユーザーのタグとマッチするかをチェック
  for (const hobby of stepUpHobbies) {
    // ステップアップ趣味のmatchTagsとユーザーのtopTagsの共通部分を取得
    const matchedTags = hobby.matchTags.filter((tag) =>
      userTopTags.includes(tag)
    );

    // マッチしたタグがない場合はスキップ
    if (matchedTags.length === 0) {
      continue;
    }

    // マッチスコアを計算（0〜100）
    const matchScore = Math.round((matchedTags.length / userTopTags.length) * 100);

    results.push({
      hobby,
      matchScore,
      matchedTags,
    });
  }

  // マッチスコア降順、同点の場合はマッチしたタグ数降順でソート
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return b.matchedTags.length - a.matchedTags.length;
  });

  return results;
}

// ==========================================
// ID検索関数
// ==========================================

/**
 * IDからステップアップ趣味を検索する
 */
export function findStepUpHobbyById(
  stepUpHobbies: StepUpHobby[],
  id: number
): StepUpHobby | undefined {
  return stepUpHobbies.find((hobby) => hobby.id === id);
}
