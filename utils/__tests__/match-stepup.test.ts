/**
 * match-stepup.ts のユニットテスト
 */

import {
  isStepUpUnlocked,
  getRemainingToUnlock,
  matchStepUpHobbies,
  findStepUpHobbyById,
  STEPUP_UNLOCK_THRESHOLD,
} from '../match-stepup';
import { mockStepUpHobbies } from '@/__mocks__/stepup-hobbies';
import type { Tag } from '@/types';

describe('isStepUpUnlocked', () => {
  it('greatCountが3以上の場合、trueを返す', () => {
    expect(isStepUpUnlocked(3)).toBe(true);
    expect(isStepUpUnlocked(4)).toBe(true);
    expect(isStepUpUnlocked(10)).toBe(true);
  });

  it('greatCountが3未満の場合、falseを返す', () => {
    expect(isStepUpUnlocked(0)).toBe(false);
    expect(isStepUpUnlocked(1)).toBe(false);
    expect(isStepUpUnlocked(2)).toBe(false);
  });

  it('閾値が正しく設定されている', () => {
    expect(STEPUP_UNLOCK_THRESHOLD).toBe(3);
  });
});

describe('getRemainingToUnlock', () => {
  it('解放までの残り回数を正しく計算する', () => {
    expect(getRemainingToUnlock(0)).toBe(3);
    expect(getRemainingToUnlock(1)).toBe(2);
    expect(getRemainingToUnlock(2)).toBe(1);
  });

  it('既に解放済みの場合、0を返す', () => {
    expect(getRemainingToUnlock(3)).toBe(0);
    expect(getRemainingToUnlock(5)).toBe(0);
  });
});

describe('matchStepUpHobbies', () => {
  describe('基本機能', () => {
    it('ユーザーのタグにマッチするステップアップ趣味を返す', () => {
      const userTopTags: Tag[] = ['クリエイティブ', 'アート'];

      const result = matchStepUpHobbies(mockStepUpHobbies, userTopTags);

      // デジタルイラスト（クリエイティブ、アート）がマッチするはず
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].hobby.name).toBe('デジタルイラスト');
    });

    it('マッチスコアを計算する', () => {
      const userTopTags: Tag[] = ['クリエイティブ', 'アート'];

      const result = matchStepUpHobbies(mockStepUpHobbies, userTopTags);

      // 2つのタグのうち2つがマッチ → 100%
      expect(result[0].matchScore).toBe(100);
    });

    it('マッチしたタグを返す', () => {
      const userTopTags: Tag[] = ['クリエイティブ', 'アート', 'その他'];

      const result = matchStepUpHobbies(mockStepUpHobbies, userTopTags);

      const digitalIllust = result.find((r) => r.hobby.id === 101);
      expect(digitalIllust?.matchedTags).toContain('クリエイティブ');
      expect(digitalIllust?.matchedTags).toContain('アート');
    });
  });

  describe('ソート', () => {
    it('マッチスコア降順でソートされる', () => {
      const userTopTags: Tag[] = ['フィジカル', 'リラックス', '健康'];

      const result = matchStepUpHobbies(mockStepUpHobbies, userTopTags);

      // スコアが降順であることを確認
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].matchScore).toBeGreaterThanOrEqual(result[i].matchScore);
      }
    });

    it('同スコアの場合、マッチしたタグ数でソートされる', () => {
      const userTopTags: Tag[] = ['フィジカル', '健康'];

      const result = matchStepUpHobbies(mockStepUpHobbies, userTopTags);

      // 同スコアならマッチタグ数が多い方が先
      for (let i = 1; i < result.length; i++) {
        if (result[i - 1].matchScore === result[i].matchScore) {
          expect(result[i - 1].matchedTags.length).toBeGreaterThanOrEqual(
            result[i].matchedTags.length
          );
        }
      }
    });
  });

  describe('エッジケース', () => {
    it('ユーザーのタグが空の場合、空配列を返す', () => {
      const result = matchStepUpHobbies(mockStepUpHobbies, []);

      expect(result).toEqual([]);
    });

    it('マッチするタグがない場合、結果に含まれない', () => {
      const userTopTags: Tag[] = ['存在しないタグ1', '存在しないタグ2'];

      const result = matchStepUpHobbies(mockStepUpHobbies, userTopTags);

      expect(result).toEqual([]);
    });

    it('ステップアップ趣味が空の場合、空配列を返す', () => {
      const userTopTags: Tag[] = ['クリエイティブ', 'アート'];

      const result = matchStepUpHobbies([], userTopTags);

      expect(result).toEqual([]);
    });
  });

  describe('マッチスコア計算', () => {
    it('部分マッチの場合、正しいスコアを計算する', () => {
      // ヨガ: matchTags = ['フィジカル', 'リラックス', '健康']
      const userTopTags: Tag[] = ['フィジカル', '他のタグ', 'さらに別のタグ'];

      const result = matchStepUpHobbies(mockStepUpHobbies, userTopTags);

      const yoga = result.find((r) => r.hobby.id === 102);
      // 3つのタグのうち1つがマッチ → 33%
      expect(yoga?.matchScore).toBe(33);
    });
  });
});

describe('findStepUpHobbyById', () => {
  it('IDで趣味を検索できる', () => {
    const result = findStepUpHobbyById(mockStepUpHobbies, 101);

    expect(result).toBeDefined();
    expect(result?.name).toBe('デジタルイラスト');
  });

  it('存在しないIDの場合、undefinedを返す', () => {
    const result = findStepUpHobbyById(mockStepUpHobbies, 9999);

    expect(result).toBeUndefined();
  });

  it('空配列の場合、undefinedを返す', () => {
    const result = findStepUpHobbyById([], 101);

    expect(result).toBeUndefined();
  });
});
