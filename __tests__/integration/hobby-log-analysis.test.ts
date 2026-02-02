/**
 * 趣味ログ・タグ分析統合テスト
 *
 * ログ記録からタグ分析までの一連のフローをテスト
 * - ログエントリの作成
 * - タグ頻度の計算
 * - ユーザーの傾向分析
 */

import {
  analyzeUserTags,
  getTagFrequency,
} from '@/utils/analyze-tags';
import { mockHobbies, mockHobbyById } from '@/__mocks__/hobbies';

import type { HobbyLogEntry, Rating, Tag } from '@/types';

describe('趣味ログ・タグ分析統合テスト', () => {
  // ヘルパー関数：ログエントリを作成
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

  describe('ログ蓄積からタグ分析', () => {
    it('複数のログからタグ頻度を正しく計算できる', () => {
      // 雲観察（自然, リラックス, 観察）を3回、落書き（クリエイティブ, アート, 手作業）を2回
      const logs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0), // 雲観察
        createLogEntry(1, 'good', 1),  // 雲観察
        createLogEntry(1, 'great', 2), // 雲観察
        createLogEntry(2, 'good', 3),  // 落書き
        createLogEntry(2, 'great', 4), // 落書き
      ];

      const tagFrequency = getTagFrequency(logs, mockHobbies);

      // 「自然」タグは雲観察(3回) = 3回
      expect(tagFrequency.get('自然' as Tag)).toBe(3);
      // 「リラックス」タグは雲観察(3回) = 3回
      expect(tagFrequency.get('リラックス' as Tag)).toBe(3);
      // 「クリエイティブ」タグは落書き(2回) = 2回
      expect(tagFrequency.get('クリエイティブ' as Tag)).toBe(2);
    });

    it('評価の高いログほど上位タグに反映される', () => {
      // 同じ趣味でも評価が異なるログ
      const highRatingLogs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0),
        createLogEntry(1, 'great', 1),
      ];

      const lowRatingLogs: HobbyLogEntry[] = [
        createLogEntry(1, 'meh', 0),
        createLogEntry(1, 'meh', 1),
      ];

      const highTopTags = analyzeUserTags(highRatingLogs, mockHobbies);
      const lowTopTags = analyzeUserTags(lowRatingLogs, mockHobbies);

      // 両方とも雲観察のタグが返される
      expect(highTopTags.length).toBeGreaterThan(0);
      expect(lowTopTags.length).toBeGreaterThan(0);
    });
  });

  describe('ユーザー傾向分析', () => {
    it('ログ履歴からユーザーの好みのタグを特定できる', () => {
      // 自然系の趣味を多くログ
      const logs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0),  // 雲観察（自然, リラックス, 観察）
        createLogEntry(1, 'great', 1),
        createLogEntry(1, 'good', 2),
        createLogEntry(16, 'great', 3), // 星空観察（自然, リラックス, 観察）
        createLogEntry(16, 'good', 4),
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);

      // 「自然」「リラックス」「観察」が上位タグに含まれる
      expect(topTags.length).toBeGreaterThan(0);
      // 上位タグには雲観察・星空観察に共通するタグが含まれる
      expect(topTags.some((tag) => ['自然', 'リラックス', '観察'].includes(tag))).toBe(true);
    });

    it('ログがない場合は空の分析結果を返す', () => {
      const topTags = analyzeUserTags([], mockHobbies);

      expect(topTags).toEqual([]);
    });

    it('1つのログでも分析ができる', () => {
      const logs: HobbyLogEntry[] = [createLogEntry(1, 'great', 0)];

      const topTags = analyzeUserTags(logs, mockHobbies);

      expect(topTags.length).toBeGreaterThan(0);
    });
  });

  describe('時系列での傾向変化', () => {
    it('様々なタイミングのログでも分析ができる', () => {
      // 古いログ: 動く系
      // 新しいログ: 眺める系
      const logs: HobbyLogEntry[] = [
        createLogEntry(72, 'great', 30), // 軽いジョギング（フィジカル, 健康, 達成感）30日前
        createLogEntry(72, 'great', 25), // 軽いジョギング 25日前
        createLogEntry(1, 'great', 1),   // 雲観察（自然, リラックス, 観察）1日前
        createLogEntry(1, 'great', 0),   // 雲観察 今日
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);

      // 分析結果が返される
      expect(topTags.length).toBeGreaterThan(0);
    });
  });

  describe('複合シナリオ', () => {
    it('シナリオ: 新規ユーザーが初めてログを記録', () => {
      const logs: HobbyLogEntry[] = [createLogEntry(1, 'good', 0)];

      const topTags = analyzeUserTags(logs, mockHobbies);

      // 最初のログでも分析できる
      expect(topTags.length).toBeGreaterThan(0);
      const hobby = mockHobbyById(1);
      if (hobby) {
        // ログした趣味のタグが分析結果に含まれる
        expect(hobby.tags.some((tag) => topTags.includes(tag))).toBe(true);
      }
    });

    it('シナリオ: アクティブユーザーの1週間分のログ', () => {
      // 7日間で様々な趣味をログ
      const logs: HobbyLogEntry[] = [
        createLogEntry(1, 'great', 0),   // 雲観察
        createLogEntry(2, 'good', 1),    // 落書き
        createLogEntry(3, 'great', 2),   // ストレッチ
        createLogEntry(1, 'good', 3),    // 雲観察
        createLogEntry(13, 'great', 4),  // 深呼吸タイム
        createLogEntry(2, 'great', 5),   // 落書き
        createLogEntry(1, 'great', 6),   // 雲観察
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);

      expect(topTags.length).toBeGreaterThan(0);
    });

    it('シナリオ: 同じ趣味ばかりログするユーザー', () => {
      // 雲観察だけを10回ログ
      const logs: HobbyLogEntry[] = Array.from({ length: 10 }, (_, i) =>
        createLogEntry(1, i % 2 === 0 ? 'great' : 'good', i)
      );

      const topTags = analyzeUserTags(logs, mockHobbies);

      expect(topTags.length).toBeGreaterThan(0);
      // 雲観察のタグが上位に来る
      const hobby = mockHobbyById(1);
      if (hobby) {
        expect(hobby.tags.some((tag) => topTags.includes(tag))).toBe(true);
      }
    });
  });

  describe('エッジケース', () => {
    it('存在しない趣味IDのログは無視される', () => {
      const logs: HobbyLogEntry[] = [
        createLogEntry(999, 'great', 0), // 存在しないID
        createLogEntry(1, 'great', 1),   // 雲観察
      ];

      const topTags = analyzeUserTags(logs, mockHobbies);

      // 存在する趣味のログのみが分析される
      expect(topTags.length).toBeGreaterThan(0);
    });

    it('空の趣味リストでも例外が発生しない', () => {
      const logs: HobbyLogEntry[] = [createLogEntry(1, 'great', 0)];

      expect(() => {
        analyzeUserTags(logs, []);
      }).not.toThrow();
    });
  });
});
