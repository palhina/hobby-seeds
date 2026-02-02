/**
 * タグ分析ユーティリティ
 *
 * ユーザーのログからタグの傾向を分析し、よく評価されているタグを抽出する機能を提供します。
 */

import type { HobbyLogEntry, Rating, Tag } from '@/types';
import type { YuruHobby } from '@/types';

// ==========================================
// 定数定義
// ==========================================

/**
 * 評価ごとの重み付けスコア
 * great: 3点、good: 2点、meh: 1点
 */
const RATING_WEIGHTS: Record<Rating, number> = {
  great: 3,
  good: 2,
  meh: 1,
};

// ==========================================
// 型定義
// ==========================================

/**
 * タグのスコア情報
 */
type TagScore = {
  /** タグ名 */
  tag: Tag;
  /** 重み付けスコア（評価に基づく） */
  score: number;
  /** 出現回数 */
  count: number;
};

// ==========================================
// 分析関数
// ==========================================

/**
 * ログエントリーからタグを集計・分析し、上位N個のタグを抽出する
 *
 * @param entries - 趣味ログエントリーの配列
 * @param hobbies - 全趣味データ（タグ情報取得用）
 * @param topN - 抽出する上位タグの数（デフォルト: 3）
 * @returns 上位N個のタグ名の配列（スコア降順）
 *
 * @example
 * ```typescript
 * const entries = [
 *   { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' },
 *   { hobbyId: 2, rating: 'good', loggedAt: '2026-02-01T11:00:00Z' },
 * ];
 * const topTags = analyzeUserTags(entries, hobbies, 3);
 * // => ['リラックス', '自然', 'クリエイティブ']
 * ```
 *
 * @remarks
 * - 評価による重み付け: great=3点、good=2点、meh=1点
 * - 同じタグが複数の趣味に含まれる場合、スコアが累積される
 * - スコアが同じ場合は出現回数で順位を決定
 * - エントリーが空の場合は空配列を返す
 */
export function analyzeUserTags(
  entries: HobbyLogEntry[],
  hobbies: YuruHobby[],
  topN: number = 3
): Tag[] {
  // エントリーが空の場合は空配列を返す
  if (entries.length === 0) {
    return [];
  }

  // 趣味IDからYuruHobbyを引けるMapを作成
  const hobbyMap = new Map<number, YuruHobby>();
  for (const hobby of hobbies) {
    hobbyMap.set(hobby.id, hobby);
  }

  // タグごとのスコアと出現回数を集計
  const tagScores = new Map<Tag, { score: number; count: number }>();

  for (const entry of entries) {
    const hobby = hobbyMap.get(entry.hobbyId);
    if (!hobby) {
      // 趣味が見つからない場合はスキップ
      continue;
    }

    const weight = RATING_WEIGHTS[entry.rating];

    // 趣味に含まれる各タグのスコアを加算
    for (const tag of hobby.tags) {
      const current = tagScores.get(tag) ?? { score: 0, count: 0 };
      tagScores.set(tag, {
        score: current.score + weight,
        count: current.count + 1,
      });
    }
  }

  // TagScoreの配列に変換
  const tagScoreArray: TagScore[] = Array.from(tagScores.entries()).map(
    ([tag, { score, count }]) => ({
      tag,
      score,
      count,
    })
  );

  // スコア降順、同点の場合は出現回数降順でソート
  tagScoreArray.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.count - a.count;
  });

  // 上位N個のタグ名のみを抽出
  return tagScoreArray.slice(0, topN).map((item) => item.tag);
}

// ==========================================
// タグ頻度分析関数
// ==========================================

/**
 * タグの出現頻度をカウントする
 *
 * @param entries - 趣味ログエントリーの配列
 * @param hobbies - 全趣味データ（タグ情報取得用）
 * @returns タグ名をキー、出現回数を値とするMap
 *
 * @example
 * ```typescript
 * const frequency = getTagFrequency(entries, hobbies);
 * // => Map { 'リラックス' => 5, '自然' => 3, ... }
 * ```
 *
 * @remarks
 * - 評価による重み付けは行わず、純粋な出現回数をカウント
 * - 同じタグが複数回出現した場合、その回数分カウントされる
 */
export function getTagFrequency(
  entries: HobbyLogEntry[],
  hobbies: YuruHobby[]
): Map<Tag, number> {
  const hobbyMap = new Map<number, YuruHobby>();
  for (const hobby of hobbies) {
    hobbyMap.set(hobby.id, hobby);
  }

  const frequency = new Map<Tag, number>();

  for (const entry of entries) {
    const hobby = hobbyMap.get(entry.hobbyId);
    if (!hobby) {
      continue;
    }

    for (const tag of hobby.tags) {
      frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
    }
  }

  return frequency;
}

// ==========================================
// スコア計算関数
// ==========================================

/**
 * 特定のタグの重み付けスコアを計算する
 *
 * @param tag - スコアを計算したいタグ名
 * @param entries - 趣味ログエントリーの配列
 * @param hobbies - 全趣味データ（タグ情報取得用）
 * @returns 重み付けスコア（0以上の整数）
 *
 * @example
 * ```typescript
 * const score = calculateTagScore('リラックス', entries, hobbies);
 * // => 12 (great 2回 + good 3回 = 3*2 + 2*3 = 12)
 * ```
 *
 * @remarks
 * - 評価による重み付け: great=3点、good=2点、meh=1点
 * - タグが見つからない場合は0を返す
 */
export function calculateTagScore(
  tag: Tag,
  entries: HobbyLogEntry[],
  hobbies: YuruHobby[]
): number {
  const hobbyMap = new Map<number, YuruHobby>();
  for (const hobby of hobbies) {
    hobbyMap.set(hobby.id, hobby);
  }

  let score = 0;

  for (const entry of entries) {
    const hobby = hobbyMap.get(entry.hobbyId);
    if (!hobby || !hobby.tags.includes(tag)) {
      continue;
    }

    score += RATING_WEIGHTS[entry.rating];
  }

  return score;
}
