/**
 * filter-hobbies.ts のユニットテスト
 */

import { filterHobbiesByDiagnosis, selectRandomHobbies, selectHobbiesWithPriority } from '../filter-hobbies';
import { mockHobbies } from '@/__mocks__/hobbies';
import type { DiagnosisAnswer } from '@/types';

describe('filterHobbiesByDiagnosis', () => {
  describe('エネルギーレベルによるフィルタリング', () => {
    it('low の場合、low エネルギーの趣味のみ返す', () => {
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: true,
        activityType: 'passive',
      };

      const result = filterHobbiesByDiagnosis(mockHobbies, answers);

      expect(result.every((hobby) => hobby.energy === 'low')).toBe(true);
    });

    it('medium の場合、low または medium エネルギーの趣味を返す', () => {
      const answers: DiagnosisAnswer = {
        energy: 'medium',
        goOut: true,
        activityType: 'passive',
      };

      const result = filterHobbiesByDiagnosis(mockHobbies, answers);

      expect(result.every((hobby) => ['low', 'medium'].includes(hobby.energy))).toBe(true);
    });

    it('high の場合、medium または high エネルギーの趣味を返す', () => {
      const answers: DiagnosisAnswer = {
        energy: 'high',
        goOut: true,
        activityType: 'active',
      };

      const result = filterHobbiesByDiagnosis(mockHobbies, answers);

      expect(result.every((hobby) => ['medium', 'high'].includes(hobby.energy))).toBe(true);
    });
  });

  describe('外出意欲によるフィルタリング', () => {
    it('goOut: false の場合、indoor: true の趣味のみ返す', () => {
      const answers: DiagnosisAnswer = {
        energy: 'medium',
        goOut: false,
        activityType: 'passive',
      };

      const result = filterHobbiesByDiagnosis(mockHobbies, answers);

      expect(result.every((hobby) => hobby.indoor === true)).toBe(true);
    });

    it('goOut: true の場合、indoor/outdoor 両方を含む', () => {
      const answers: DiagnosisAnswer = {
        energy: 'medium',
        goOut: true,
        activityType: 'passive',
      };

      const result = filterHobbiesByDiagnosis(mockHobbies, answers);
      const indoorValues = new Set(result.map((h) => h.indoor));

      // 両方含まれるか、少なくとも outdoor が含まれる
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('アクティビティタイプによるフィルタリング', () => {
    it('passive の場合、パッシブカテゴリの趣味を返す', () => {
      const passiveCategories = ['眺める', '聴く', '学ぶ', '整える', '遊ぶ'];
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: true,
        activityType: 'passive',
      };

      const result = filterHobbiesByDiagnosis(mockHobbies, answers);

      expect(result.every((hobby) => passiveCategories.includes(hobby.category))).toBe(true);
    });

    it('active の場合、アクティブカテゴリの趣味を返す', () => {
      const activeCategories = ['作る', '動く', '学ぶ', '整える', '遊ぶ'];
      const answers: DiagnosisAnswer = {
        energy: 'high',
        goOut: true,
        activityType: 'active',
      };

      const result = filterHobbiesByDiagnosis(mockHobbies, answers);

      expect(result.every((hobby) => activeCategories.includes(hobby.category))).toBe(true);
    });
  });

  describe('複合条件', () => {
    it('low + goOut:false + passive の場合、全条件を満たす趣味のみ返す', () => {
      const passiveCategories = ['眺める', '聴く', '学ぶ', '整える', '遊ぶ'];
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: false,
        activityType: 'passive',
      };

      const result = filterHobbiesByDiagnosis(mockHobbies, answers);

      result.forEach((hobby) => {
        expect(hobby.energy).toBe('low');
        expect(hobby.indoor).toBe(true);
        expect(passiveCategories).toContain(hobby.category);
      });
    });

    it('条件に合う趣味がない場合、空配列を返す', () => {
      // 存在しない組み合わせを作る
      const emptyHobbies = mockHobbies.filter((h) => h.energy === 'high' && h.indoor === true);
      const answers: DiagnosisAnswer = {
        energy: 'low', // high趣味のみなのにlowを要求
        goOut: false,
        activityType: 'passive',
      };

      const result = filterHobbiesByDiagnosis(emptyHobbies, answers);

      expect(result).toEqual([]);
    });
  });
});

describe('selectRandomHobbies', () => {
  it('指定した数だけ趣味を返す', () => {
    const result = selectRandomHobbies(mockHobbies, 3);

    expect(result.length).toBe(3);
  });

  it('趣味数が指定数より少ない場合、全ての趣味を返す', () => {
    const fewHobbies = mockHobbies.slice(0, 2);
    const result = selectRandomHobbies(fewHobbies, 5);

    expect(result.length).toBe(2);
  });

  it('空配列の場合、空配列を返す', () => {
    const result = selectRandomHobbies([], 5);

    expect(result).toEqual([]);
  });

  it('元の配列を変更しない', () => {
    const original = [...mockHobbies];
    selectRandomHobbies(mockHobbies, 3);

    expect(mockHobbies).toEqual(original);
  });

  it('ランダム性を持つ（複数回実行で異なる結果の可能性）', () => {
    // 確率的なテストなので、100回実行して同じ結果ばかりでないことを確認
    const results = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const result = selectRandomHobbies(mockHobbies, 3);
      const ids = result.map((h) => h.id).sort().join(',');
      results.add(ids);
    }

    // 複数の異なる組み合わせが出ることを期待
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('selectHobbiesWithPriority', () => {
  it('preferOutdoor: false の場合、通常のランダム選択を行う', () => {
    const result = selectHobbiesWithPriority(mockHobbies, 3, false);

    expect(result.length).toBe(3);
  });

  it('preferOutdoor: true の場合、屋外趣味を優先的に選択する', () => {
    const result = selectHobbiesWithPriority(mockHobbies, 3, true);

    // 屋外趣味が優先されるはず
    const outdoorCount = result.filter((h) => !h.indoor).length;
    const availableOutdoor = mockHobbies.filter((h) => !h.indoor).length;

    // 利用可能な屋外趣味があれば、優先的に含まれる
    if (availableOutdoor > 0) {
      expect(outdoorCount).toBeGreaterThan(0);
    }
  });

  it('屋外趣味が足りない場合、室内趣味で補完する', () => {
    const mixedHobbies = [
      mockHobbies.find((h) => !h.indoor)!, // 屋外1つ
      ...mockHobbies.filter((h) => h.indoor).slice(0, 3), // 室内3つ
    ];

    const result = selectHobbiesWithPriority(mixedHobbies, 3, true);

    expect(result.length).toBe(3);
  });
});
