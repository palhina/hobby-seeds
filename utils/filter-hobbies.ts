/**
 * 趣味フィルタリング・選択ユーティリティ
 *
 * 診断結果に基づいて趣味をフィルタリングし、ランダムに選択する機能を提供します。
 */

import type { YuruHobby } from '@/types/hobby';
import type { DiagnosisAnswer } from '@/types/diagnosis';
import type { Category } from '@/types/common';

// ==========================================
// アクティビティタイプによるカテゴリ分類
// ==========================================

/**
 * パッシブタイプ向けのカテゴリ
 * 受動的な活動を好むユーザーに適した趣味
 */
const PASSIVE_CATEGORIES: Category[] = ['眺める', '聴く', '学ぶ', '整える', '遊ぶ'];

/**
 * アクティブタイプ向けのカテゴリ
 * 能動的な活動を好むユーザーに適した趣味
 */
const ACTIVE_CATEGORIES: Category[] = ['作る', '動く', '学ぶ', '整える', '遊ぶ'];

// ==========================================
// フィルタリング関数
// ==========================================

/**
 * 診断結果に基づいて趣味をフィルタリングする
 *
 * @param hobbies - フィルタリング対象の趣味リスト
 * @param answer - 診断回答データ
 * @returns フィルタリング後の趣味リスト
 *
 * @example
 * ```typescript
 * const answer = { energy: 'low', goOut: false, activityType: 'passive' };
 * const filtered = filterHobbiesByDiagnosis(allHobbies, answer);
 * // => 低エネルギー・室内・パッシブな趣味のみが返される
 * ```
 */
/**
 * エネルギーレベルの許容マッピング
 * ユーザーのエネルギーに応じて許容される趣味のエネルギーレベル
 */
const ALLOWED_ENERGY_LEVELS: Record<string, string[]> = {
  low: ['low'],              // のんびり → 低エネルギーのみ
  medium: ['low', 'medium'], // ふつう → 低〜中エネルギー
  high: ['medium', 'high'],  // 元気いっぱい → 中〜高エネルギー
};

export function filterHobbiesByDiagnosis(
  hobbies: YuruHobby[],
  answer: DiagnosisAnswer
): YuruHobby[] {
  return hobbies.filter((hobby) => {
    // エネルギーレベルフィルタ
    // ユーザーのエネルギーに応じた趣味のみ許容
    const allowedEnergies = ALLOWED_ENERGY_LEVELS[answer.energy] ?? ['low', 'medium', 'high'];
    if (!allowedEnergies.includes(hobby.energy)) {
      return false;
    }

    // 場所フィルタ
    // 外出したくない場合は、屋外専用の趣味を除外
    if (!answer.goOut && !hobby.indoor) {
      return false;
    }

    // アクティビティタイプフィルタ
    // パッシブ・アクティブそれぞれに適したカテゴリでフィルタ
    const targetCategories =
      answer.activityType === 'passive' ? PASSIVE_CATEGORIES : ACTIVE_CATEGORIES;

    if (!targetCategories.includes(hobby.category)) {
      return false;
    }

    return true;
  });
}

// ==========================================
// ランダム選択関数
// ==========================================

/**
 * 趣味リストからランダムにN個を選択する
 *
 * @param hobbies - 選択対象の趣味リスト
 * @param count - 選択する趣味の数
 * @returns ランダムに選択された趣味のリスト
 *
 * @example
 * ```typescript
 * const selected = selectRandomHobbies(filteredHobbies, 5);
 * // => filteredHobbiesから5つの趣味がランダムに選ばれる
 * ```
 *
 * @remarks
 * - 元のリストの順序は保持されません（ランダムに並び替えられます）
 * - リスト数がcount未満の場合、全ての趣味が返されます
 * - Fisher-Yatesアルゴリズムを使用してシャッフル
 */
export function selectRandomHobbies(hobbies: YuruHobby[], count: number): YuruHobby[] {
  // 元の配列を変更しないようコピーを作成
  const shuffled = [...hobbies];

  // Fisher-Yatesアルゴリズムでシャッフル
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  // 指定された数だけ返す（リストがcount未満の場合は全て返す）
  return shuffled.slice(0, count);
}


/**
 * 外出希望を考慮して趣味を優先選択する
 *
 * @param hobbies - 選択対象の趣味リスト
 * @param count - 選択する趣味の数
 * @param preferOutdoor - 屋外を優先するかどうか
 * @returns 優先度を考慮して選択された趣味のリスト
 *
 * @remarks
 * - preferOutdoor=true の場合、屋外趣味を優先的に選択
 * - 屋外趣味が足りない場合は室内趣味で補完
 * - preferOutdoor=false の場合は通常のランダム選択
 */
export function selectHobbiesWithPriority(
  hobbies: YuruHobby[],
  count: number,
  preferOutdoor: boolean
): YuruHobby[] {
  if (!preferOutdoor) {
    return selectRandomHobbies(hobbies, count);
  }

  // 屋外と室内で分離
  const outdoorHobbies = hobbies.filter((h) => !h.indoor);
  const indoorHobbies = hobbies.filter((h) => h.indoor);

  // 屋外趣味をランダムに選択
  const selectedOutdoor = selectRandomHobbies(outdoorHobbies, count);

  // 屋外趣味が足りない場合は室内で補完
  if (selectedOutdoor.length < count) {
    const remaining = count - selectedOutdoor.length;
    const selectedIndoor = selectRandomHobbies(indoorHobbies, remaining);
    return [...selectedOutdoor, ...selectedIndoor];
  }

  return selectedOutdoor;
}
