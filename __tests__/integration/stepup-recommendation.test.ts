/**
 * ステップアップ趣味提案統合テスト
 *
 * ログ履歴からステップアップ趣味の提案までのフローをテスト
 * - 解放条件の判定
 * - タグマッチングによる趣味提案
 * - マッチ度計算
 */

import {
  isStepUpUnlocked,
  getRemainingToUnlock,
  matchStepUpHobbies,
} from '@/utils/match-stepup';
import { analyzeUserTags } from '@/utils/analyze-tags';
import { mockHobbies, mockHobbyById } from '@/__mocks__/hobbies';
import { mockStepUpHobbies } from '@/__mocks__/stepup-hobbies';

import type { HobbyLogEntry, Rating } from '@/types';

describe('ステップアップ趣味提案統合テスト', () => {
  // ヘルパー関数
  const createLogEntry = (
    hobbyId: number,
    rating: Rating,
    daysAgo: number = 0
  ): HobbyLogEntry => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
      hobbyId,
      rating,
      loggedAt: date.toISOString(),
    };
  };

  // greatの数をカウントするヘルパー
  const countGreatRatings = (logs: HobbyLogEntry[]): number => {
    return logs.filter((log) => log.rating === 'great').length;
  };

  describe('解放条件の判定フロー', () => {
    it('greatを3回記録するとステップアップが解放される', () => {
      const logs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0),
        createLogEntry(2, 'great', 1),
        createLogEntry(1, 'great', 2),
      ];

      const greatCount = countGreatRatings(logs);
      expect(isStepUpUnlocked(greatCount)).toBe(true);
    });

    it('greatが2回以下では解放されない', () => {
      const logs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0),
        createLogEntry(2, 'great', 1),
        createLogEntry(1, 'good', 2),
        createLogEntry(2, 'good', 3),
      ];

      const greatCount = countGreatRatings(logs);
      expect(isStepUpUnlocked(greatCount)).toBe(false);
      expect(getRemainingToUnlock(greatCount)).toBe(1);
    });

    it('greatのカウントが増えると残り回数が減る', () => {
      // 0回
      expect(getRemainingToUnlock(0)).toBe(3);

      // 1回
      expect(getRemainingToUnlock(1)).toBe(2);

      // 2回
      expect(getRemainingToUnlock(2)).toBe(1);

      // 3回
      expect(getRemainingToUnlock(3)).toBe(0);
    });
  });

  describe('タグベースのマッチング', () => {
    it('ログ履歴のタグに基づいてステップアップ趣味をマッチング', () => {
      // 「フィジカル」「リラックス」「健康」系の趣味をログ
      const logs: HobbyLogEntry[] = [
        createLogEntry(3, 'great', 0),  // ストレッチ（フィジカル, リラックス, 健康）
        createLogEntry(3, 'great', 1),
        createLogEntry(3, 'great', 2),
        createLogEntry(13, 'great', 3), // 深呼吸タイム（リラックス, 健康, マインドフルネス）
      ];

      // タグ分析
      const topTags = analyzeUserTags(logs, mockHobbies);

      // ステップアップ趣味マッチング（引数の順序: stepUpHobbies, userTopTags）
      const matched = matchStepUpHobbies(mockStepUpHobbies, topTags);

      expect(matched.length).toBeGreaterThan(0);
      // 「フィジカル」「リラックス」「健康」タグを持つヨガが候補に来るはず
    });

    it('マッチ度が高い順にソートされている', () => {
      const logs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0),
        createLogEntry(1, 'great', 1),
        createLogEntry(1, 'great', 2),
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);
      const matched = matchStepUpHobbies(mockStepUpHobbies, topTags);

      // マッチ度が降順であることを確認
      for (let i = 0; i < matched.length - 1; i++) {
        expect(matched[i].matchScore).toBeGreaterThanOrEqual(matched[i + 1].matchScore);
      }
    });
  });

  describe('完全なユーザーフロー', () => {
    it('フロー: ログ蓄積 → 解放判定 → タグ分析 → 趣味提案', () => {
      // Step 1: ユーザーが趣味をログ（解放条件を満たす）
      const logs: HobbyLogEntry[] = [
        createLogEntry(3, 'great', 0),  // ストレッチ（フィジカル, リラックス, 健康）
        createLogEntry(13, 'great', 1), // 深呼吸タイム（リラックス, 健康, マインドフルネス）
        createLogEntry(3, 'great', 2),  // ストレッチ
        createLogEntry(1, 'good', 3),
        createLogEntry(2, 'good', 4),
      ];

      // Step 2: 解放条件チェック
      const greatCount = countGreatRatings(logs);
      const isUnlocked = isStepUpUnlocked(greatCount);
      expect(isUnlocked).toBe(true);

      // Step 3: タグ分析
      const topTags = analyzeUserTags(logs, mockHobbies);
      expect(topTags.length).toBeGreaterThan(0);

      // Step 4: ステップアップ趣味マッチング
      const recommendations = matchStepUpHobbies(mockStepUpHobbies, topTags);
      expect(recommendations.length).toBeGreaterThan(0);

      // Step 5: 結果の検証
      recommendations.forEach((rec) => {
        expect(rec.hobby).toBeDefined();
        expect(rec.matchScore).toBeGreaterThanOrEqual(0);
        expect(rec.matchScore).toBeLessThanOrEqual(100);
        expect(rec.matchedTags).toBeDefined();
      });
    });

    it('フロー: 解放前のユーザーにはステップアップを提案しない', () => {
      const logs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0),
        createLogEntry(2, 'good', 1),  // goodはカウントしない
      ];

      const greatCount = countGreatRatings(logs);
      const isUnlocked = isStepUpUnlocked(greatCount);
      expect(isUnlocked).toBe(false);

      const remaining = getRemainingToUnlock(greatCount);
      expect(remaining).toBe(2);

      // 解放前はステップアップ提案をスキップ（アプリの動作として）
    });
  });

  describe('ユーザーシナリオ', () => {
    it('シナリオ: クリエイティブ系を好むユーザー', () => {
      // 落書き（クリエイティブ, アート, 手作業）を高評価でログ
      const logs: HobbyLogEntry[] = [
        createLogEntry(2, 'great', 0),
        createLogEntry(2, 'great', 1),
        createLogEntry(2, 'great', 2),
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);
      const matched = matchStepUpHobbies(mockStepUpHobbies, topTags);

      // クリエイティブ系のステップアップ趣味（デジタルイラストなど）が候補に
      expect(matched.length).toBeGreaterThan(0);
    });

    it('シナリオ: フィジカル系を好むユーザー', () => {
      // 軽いジョギング（フィジカル, 健康, 達成感）を高評価でログ
      const logs: HobbyLogEntry[] = [
        createLogEntry(72, 'great', 0),
        createLogEntry(72, 'great', 1),
        createLogEntry(72, 'great', 2),
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);
      const matched = matchStepUpHobbies(mockStepUpHobbies, topTags);

      // フィジカル系のステップアップ趣味（ヨガ、ランニング）が候補に
      expect(matched.length).toBeGreaterThan(0);
    });

    it('シナリオ: 様々な趣味をバランスよくログするユーザー', () => {
      const logs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0),  // 自然, リラックス, 観察
        createLogEntry(2, 'great', 1),  // クリエイティブ, アート, 手作業
        createLogEntry(3, 'great', 2),  // フィジカル, リラックス, 健康
        createLogEntry(35, 'great', 3), // 学び, 知識, 読む
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);
      const matched = matchStepUpHobbies(mockStepUpHobbies, topTags);

      // 複数のカテゴリにマッチする趣味が提案される
      expect(matched.length).toBeGreaterThan(0);
    });
  });

  describe('マッチ度の計算', () => {
    it('マッチしたタグがある場合、マッチ度が計算される', () => {
      // 特定のタグセットを持つログ
      const logs: HobbyLogEntry[] = [
        createLogEntry(3, 'great', 0),  // ストレッチのタグを使用（フィジカル, リラックス, 健康）
        createLogEntry(3, 'great', 1),
        createLogEntry(3, 'great', 2),
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);
      const matched = matchStepUpHobbies(mockStepUpHobbies, topTags);

      // 少なくとも1つはマッチするはず（ヨガがフィジカル, リラックス, 健康を持つ）
      expect(matched.length).toBeGreaterThan(0);

      // マッチ度は0-100の範囲
      matched.forEach((rec) => {
        expect(rec.matchScore).toBeGreaterThanOrEqual(0);
        expect(rec.matchScore).toBeLessThanOrEqual(100);
      });
    });

    it('マッチするタグがない場合は空の結果', () => {
      // ステップアップ趣味のmatchTagsと一致しないタグ
      const noMatchTags = ['存在しないタグ1', '存在しないタグ2'];
      const matched = matchStepUpHobbies(mockStepUpHobbies, noMatchTags);

      // マッチするものがない
      expect(matched.length).toBe(0);
    });
  });

  describe('エッジケース', () => {
    it('空のログ履歴でも例外が発生しない', () => {
      expect(() => {
        isStepUpUnlocked(0);
        getRemainingToUnlock(0);
      }).not.toThrow();

      const topTags = analyzeUserTags([], mockHobbies);
      expect(() => {
        matchStepUpHobbies(mockStepUpHobbies, topTags);
      }).not.toThrow();
    });

    it('空のステップアップ趣味リストでも例外が発生しない', () => {
      const topTags = analyzeUserTags(
        [createLogEntry(1, 'great', 0)],
        mockHobbies
      );

      expect(() => {
        matchStepUpHobbies([], topTags);
      }).not.toThrow();
    });
  });
});
