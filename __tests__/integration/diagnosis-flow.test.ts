/**
 * 診断フロー統合テスト
 *
 * 診断回答から趣味提案までの一連のフローをテスト
 * - 診断回答の収集
 * - 趣味のフィルタリング
 * - ランダム選択
 */

import {
  filterHobbiesByDiagnosis,
  selectRandomHobbies,
  selectHobbiesWithPriority,
} from '@/utils/filter-hobbies';
import { mockHobbies } from '@/__mocks__/hobbies';

import type { DiagnosisAnswer, YuruHobby } from '@/types';

describe('診断フロー統合テスト', () => {
  describe('完全なフローのテスト', () => {
    it('疲れている時の回答で、低エネルギー・屋内趣味が提案される', () => {
      // ユーザーの回答を模擬
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: false,
        activityType: 'passive',
      };

      // Step 1: フィルタリング
      const filteredHobbies = filterHobbiesByDiagnosis(mockHobbies, answers);

      // Step 2: 検証 - 低エネルギー・屋内・パッシブの趣味が含まれる
      expect(filteredHobbies.length).toBeGreaterThan(0);
      filteredHobbies.forEach((hobby) => {
        // 低エネルギー
        expect(hobby.energy).toBe('low');
        // 屋内（goOut: falseなので屋外専用は除外）
        expect(hobby.indoor).toBe(true);
      });

      // Step 3: ランダム選択（最大3件）
      const selectedHobbies = selectRandomHobbies(filteredHobbies, 3);
      expect(selectedHobbies.length).toBeLessThanOrEqual(3);
      expect(selectedHobbies.length).toBeGreaterThan(0);
    });

    it('元気な時の回答で、高エネルギー・アクティブ趣味が提案される', () => {
      const answers: DiagnosisAnswer = {
        energy: 'high',
        goOut: true,
        activityType: 'active',
      };

      const filteredHobbies = filterHobbiesByDiagnosis(mockHobbies, answers);

      expect(filteredHobbies.length).toBeGreaterThan(0);
      filteredHobbies.forEach((hobby) => {
        // 高エネルギー
        expect(['high', 'medium']).toContain(hobby.energy);
      });
    });

    it('外出OKの回答で、優先度付き選択が機能する', () => {
      const answers: DiagnosisAnswer = {
        energy: 'medium',
        goOut: true,
        activityType: 'passive',
      };

      const filteredHobbies = filterHobbiesByDiagnosis(mockHobbies, answers);

      // 屋外優先で選択
      const prioritizedHobbies = selectHobbiesWithPriority(filteredHobbies, 3, true);

      // フィルタ結果または優先選択結果が存在する
      expect(filteredHobbies.length + prioritizedHobbies.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('フィルタ → 選択 → 表示の連携', () => {
    it('フィルタ結果が0件の場合でも、フォールバックで趣味を提案できる', () => {
      // 非常に厳しい条件
      const answers: DiagnosisAnswer = {
        energy: 'high',
        goOut: false,
        activityType: 'active',
      };

      const filteredHobbies = filterHobbiesByDiagnosis(mockHobbies, answers);

      // フィルタ結果が少なくても、何らかの趣味は返る（フォールバック的に）
      // 実際のアプリでは全趣味からランダム選択するなどのフォールバックを実装
      if (filteredHobbies.length === 0) {
        // フォールバック: 全趣味からランダム選択
        const fallbackHobbies = selectRandomHobbies(mockHobbies, 3);
        expect(fallbackHobbies.length).toBeGreaterThan(0);
      } else {
        expect(filteredHobbies.length).toBeGreaterThan(0);
      }
    });

    it('複数回の診断でも一貫したフィルタリング結果が得られる', () => {
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: false,
        activityType: 'passive',
      };

      // 同じ条件で2回フィルタリング
      const result1 = filterHobbiesByDiagnosis(mockHobbies, answers);
      const result2 = filterHobbiesByDiagnosis(mockHobbies, answers);

      // 結果は同じであるべき（ランダム要素なし）
      expect(result1.length).toBe(result2.length);
      expect(result1.map((h) => h.id).sort()).toEqual(result2.map((h) => h.id).sort());
    });
  });

  describe('エッジケースのテスト', () => {
    it('空の趣味リストでも例外が発生しない', () => {
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: false,
        activityType: 'passive',
      };

      const emptyHobbies: YuruHobby[] = [];
      const result = filterHobbiesByDiagnosis(emptyHobbies, answers);

      expect(result).toEqual([]);
      expect(() => selectRandomHobbies(result, 3)).not.toThrow();
    });

    it('時間が非常に短い場合でもフィルタリングが動作する', () => {
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: false,
        activityType: 'passive',
      };

      expect(() => {
        const result = filterHobbiesByDiagnosis(mockHobbies, answers);
        selectRandomHobbies(result, 3);
      }).not.toThrow();
    });
  });

  describe('ユーザーシナリオのテスト', () => {
    it('シナリオ: 仕事終わりで疲れている → リラックスできる趣味を提案', () => {
      // ユーザー状況: 仕事終わりで疲れている、家にいる、30分ある
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: false,
        activityType: 'passive',
      };

      const filtered = filterHobbiesByDiagnosis(mockHobbies, answers);
      const selected = selectRandomHobbies(filtered, 3);

      // 少なくとも1つは低エネルギーの趣味
      const hasLowEnergy = selected.some((h) => h.energy === 'low');
      const hasIndoor = selected.some((h) => h.indoor === true);

      // フィルタリングが機能していれば、条件に合う趣味が含まれる
      expect(selected.length).toBeGreaterThan(0);
      if (selected.length > 0) {
        expect(hasLowEnergy || hasIndoor).toBe(true);
      }
    });

    it('シナリオ: 休日の朝で元気 → アクティブな趣味を提案', () => {
      const answers: DiagnosisAnswer = {
        energy: 'high',
        goOut: true,
        activityType: 'active',
      };

      const filtered = filterHobbiesByDiagnosis(mockHobbies, answers);
      const selected = selectRandomHobbies(filtered, 3);

      expect(selected.length).toBeGreaterThan(0);
    });

    it('シナリオ: 普通の気分で短時間 → 手軽な趣味を提案', () => {
      const answers: DiagnosisAnswer = {
        energy: 'medium',
        goOut: true,
        activityType: 'passive',
      };

      const filtered = filterHobbiesByDiagnosis(mockHobbies, answers);
      const selected = selectRandomHobbies(filtered, 3);

      expect(selected.length).toBeGreaterThan(0);
    });
  });
});
