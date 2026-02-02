/**
 * analyze-tags.ts のユニットテスト
 */

import { analyzeUserTags, getTagFrequency, calculateTagScore } from '../analyze-tags';
import { mockHobbies } from '@/__mocks__/hobbies';
import type { HobbyLogEntry } from '@/types';

describe('analyzeUserTags', () => {
  describe('基本機能', () => {
    it('ログエントリーからタグを集計し上位3つを返す', () => {
      const entries: HobbyLogEntry[] = [
        { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' }, // 雲観察: 自然, リラックス, 観察
        { hobbyId: 3, rating: 'great', loggedAt: '2026-02-01T11:00:00Z' }, // ストレッチ: フィジカル, リラックス, 健康
      ];

      const result = analyzeUserTags(entries, mockHobbies, 3);

      expect(result.length).toBeLessThanOrEqual(3);
      // リラックスが2回出現するので含まれるはず
      expect(result).toContain('リラックス');
    });

    it('空のエントリーの場合、空配列を返す', () => {
      const result = analyzeUserTags([], mockHobbies, 3);

      expect(result).toEqual([]);
    });

    it('topNで返すタグ数を制限できる', () => {
      const entries: HobbyLogEntry[] = [
        { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' },
        { hobbyId: 2, rating: 'great', loggedAt: '2026-02-01T11:00:00Z' },
        { hobbyId: 3, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
      ];

      const result = analyzeUserTags(entries, mockHobbies, 2);

      expect(result.length).toBeLessThanOrEqual(2);
    });
  });

  describe('重み付けスコア', () => {
    it('great評価のタグが優先される', () => {
      const entries: HobbyLogEntry[] = [
        { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' }, // 雲観察: 自然, リラックス, 観察 (各3点)
        { hobbyId: 2, rating: 'meh', loggedAt: '2026-02-01T11:00:00Z' }, // 落書き: クリエイティブ, アート, 手作業 (各1点)
      ];

      const result = analyzeUserTags(entries, mockHobbies, 3);

      // greatの趣味のタグが上位に来るはず
      const hobby1Tags = mockHobbies.find((h) => h.id === 1)?.tags ?? [];
      expect(result.some((tag) => hobby1Tags.includes(tag))).toBe(true);
    });

    it('同じタグが複数回出現するとスコアが累積される', () => {
      // リラックスタグを持つ趣味を複数回評価
      const entries: HobbyLogEntry[] = [
        { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' }, // リラックス含む
        { hobbyId: 3, rating: 'great', loggedAt: '2026-02-01T11:00:00Z' }, // リラックス含む
        { hobbyId: 11, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' }, // リラックス含む
      ];

      const result = analyzeUserTags(entries, mockHobbies, 3);

      // リラックスが複数回出現するので上位に
      expect(result[0]).toBe('リラックス');
    });
  });

  describe('エッジケース', () => {
    it('存在しないhobbyIdのエントリーはスキップされる', () => {
      const entries: HobbyLogEntry[] = [
        { hobbyId: 9999, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' }, // 存在しない
        { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T11:00:00Z' },
      ];

      const result = analyzeUserTags(entries, mockHobbies, 3);

      // エラーなく処理され、有効なエントリーのタグが返される
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe('getTagFrequency', () => {
  it('タグの出現回数をカウントする', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' }, // 自然, リラックス, 観察
      { hobbyId: 3, rating: 'good', loggedAt: '2026-02-01T11:00:00Z' }, // フィジカル, リラックス, 健康
    ];

    const result = getTagFrequency(entries, mockHobbies);

    expect(result.get('リラックス')).toBe(2); // 2回出現
    expect(result.get('自然')).toBe(1);
    expect(result.get('フィジカル')).toBe(1);
  });

  it('評価による重み付けは行わない', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' },
      { hobbyId: 1, rating: 'meh', loggedAt: '2026-02-01T11:00:00Z' }, // 同じ趣味を2回
    ];

    const result = getTagFrequency(entries, mockHobbies);

    // 純粋な出現回数（2回）
    expect(result.get('自然')).toBe(2);
  });

  it('空のエントリーの場合、空のMapを返す', () => {
    const result = getTagFrequency([], mockHobbies);

    expect(result.size).toBe(0);
  });
});

describe('calculateTagScore', () => {
  it('特定のタグの重み付けスコアを計算する', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' }, // リラックス含む: 3点
      { hobbyId: 3, rating: 'good', loggedAt: '2026-02-01T11:00:00Z' }, // リラックス含む: 2点
    ];

    const result = calculateTagScore('リラックス', entries, mockHobbies);

    expect(result).toBe(5); // 3 + 2 = 5
  });

  it('タグが含まれない場合は0を返す', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' },
    ];

    const result = calculateTagScore('存在しないタグ', entries, mockHobbies);

    expect(result).toBe(0);
  });

  it('評価ごとに正しい重みを適用する', () => {
    // id:1の雲観察は「自然」タグを持つ
    const entriesGreat: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T10:00:00Z' },
    ];
    const entriesGood: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'good', loggedAt: '2026-02-01T10:00:00Z' },
    ];
    const entriesMeh: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'meh', loggedAt: '2026-02-01T10:00:00Z' },
    ];

    expect(calculateTagScore('自然', entriesGreat, mockHobbies)).toBe(3);
    expect(calculateTagScore('自然', entriesGood, mockHobbies)).toBe(2);
    expect(calculateTagScore('自然', entriesMeh, mockHobbies)).toBe(1);
  });
});
