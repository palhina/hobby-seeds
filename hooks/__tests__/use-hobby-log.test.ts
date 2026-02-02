/**
 * useHobbyLog カスタムフックのテスト
 *
 * 趣味ログ管理フック。
 * 初期状態、ログ追加、ログ削除、統計計算、ステップアップ解放判定をテスト
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useHobbyLog } from '../use-hobby-log';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { mockHobbies } from '@/__mocks__/hobbies';

import type { HobbyLog, HobbyLogEntry } from '@/types';

describe('useHobbyLog', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('初期化', () => {
    it('データがない場合、空の状態で初期化する', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.log).toEqual({
        entries: [],
        greatCount: 0,
        topTags: [],
      });
    });

    it('AsyncStorageから既存データを読み込む', async () => {
      const existingData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
          { hobbyId: 2, rating: 'good', loggedAt: '2026-02-02T12:00:00Z' },
        ],
        greatCount: 1,
        topTags: ['自然', 'リラックス'],
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(existingData)
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.log.entries).toHaveLength(2);
      expect(result.current.log.greatCount).toBe(1);
      expect(result.current.log.topTags).toEqual(['自然', 'リラックス']);
    });

    it('初期状態でisLoadingがtrueになる', () => {
      const { result } = renderHook(() => useHobbyLog());

      expect(result.current.isLoading).toBe(true);
    });

    it('読み込み完了後isLoadingがfalseになる', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('addEntry', () => {
    it('新しいログエントリを追加できる', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.addEntry(1, 'great', mockHobbies);
      });

      expect(success).toBe(true);
      expect(result.current.log.entries).toHaveLength(1);
      expect(result.current.log.entries[0]).toMatchObject({
        hobbyId: 1,
        rating: 'great',
      });
    });

    it('追加したエントリがAsyncStorageに保存される', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addEntry(1, 'good', mockHobbies);
      });

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HOBBY_LOG);
      const parsed: HobbyLog = JSON.parse(stored!);

      expect(parsed.entries).toHaveLength(1);
      expect(parsed.entries[0]).toMatchObject({
        hobbyId: 1,
        rating: 'good',
      });
    });

    it('複数のエントリを追加できる', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
        await result.current.addEntry(2, 'good', mockHobbies);
        await result.current.addEntry(3, 'great', mockHobbies);
      });

      expect(result.current.log.entries).toHaveLength(3);
    });

    it('エントリにloggedAtが自動で設定される', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const beforeTime = new Date().toISOString();

      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
      });

      const afterTime = new Date().toISOString();

      expect(result.current.log.entries[0].loggedAt).toBeTruthy();
      expect(result.current.log.entries[0].loggedAt >= beforeTime).toBe(true);
      expect(result.current.log.entries[0].loggedAt <= afterTime).toBe(true);
    });

    it('AsyncStorageから最新データを取得してから追加する', async () => {
      // 事前にAsyncStorageにデータを保存
      const existingData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
        ],
        greatCount: 1,
        topTags: ['自然'],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(existingData)
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 外部でデータを更新（競合をシミュレート）
      const updatedData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
          { hobbyId: 2, rating: 'good', loggedAt: '2026-02-02T12:00:00Z' },
        ],
        greatCount: 1,
        topTags: ['自然', 'リラックス'],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(updatedData)
      );

      // addEntryは最新のAsyncStorageデータから追加する
      await act(async () => {
        await result.current.addEntry(3, 'great', mockHobbies);
      });

      // 3つのエントリが保存されているべき（古いstateではなく最新データから追加）
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HOBBY_LOG);
      const parsed: HobbyLog = JSON.parse(stored!);
      expect(parsed.entries).toHaveLength(3);
    });
  });

  describe('deleteEntry', () => {
    it('指定したindexのエントリを削除できる', async () => {
      const existingData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
          { hobbyId: 2, rating: 'good', loggedAt: '2026-02-02T12:00:00Z' },
          { hobbyId: 3, rating: 'great', loggedAt: '2026-02-03T12:00:00Z' },
        ],
        greatCount: 2,
        topTags: ['自然', 'リラックス'],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(existingData)
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.deleteEntry(1, mockHobbies);
      });

      expect(success).toBe(true);
      expect(result.current.log.entries).toHaveLength(2);
      expect(result.current.log.entries.find((e) => e.hobbyId === 2)).toBeUndefined();
    });

    it('削除後にAsyncStorageが更新される', async () => {
      const existingData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
          { hobbyId: 2, rating: 'good', loggedAt: '2026-02-02T12:00:00Z' },
        ],
        greatCount: 1,
        topTags: ['自然'],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(existingData)
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteEntry(0, mockHobbies);
      });

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HOBBY_LOG);
      const parsed: HobbyLog = JSON.parse(stored!);

      expect(parsed.entries).toHaveLength(1);
      expect(parsed.entries[0].hobbyId).toBe(2);
    });

    it('削除後にgreatCountが再計算される', async () => {
      const existingData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
          { hobbyId: 2, rating: 'great', loggedAt: '2026-02-02T12:00:00Z' },
          { hobbyId: 3, rating: 'good', loggedAt: '2026-02-03T12:00:00Z' },
        ],
        greatCount: 2,
        topTags: [],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(existingData)
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // great のエントリ（index 0）を削除
      await act(async () => {
        await result.current.deleteEntry(0, mockHobbies);
      });

      expect(result.current.log.greatCount).toBe(1);
    });

    it('削除後にtopTagsが再計算される', async () => {
      // hobbyId 1: ['自然', 'リラックス', '観察']
      // hobbyId 2: ['クリエイティブ', 'アート', '手作業']
      const existingData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
          { hobbyId: 2, rating: 'great', loggedAt: '2026-02-02T12:00:00Z' },
        ],
        greatCount: 2,
        topTags: ['自然', 'リラックス', '観察'],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(existingData)
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // hobbyId 1 を削除
      await act(async () => {
        await result.current.deleteEntry(0, mockHobbies);
      });

      // hobbyId 2のタグのみになる
      expect(result.current.log.topTags).toContain('クリエイティブ');
    });
  });

  describe('greatCount', () => {
    it('great 評価の数を正しくカウントする', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
        await result.current.addEntry(2, 'good', mockHobbies);
        await result.current.addEntry(3, 'great', mockHobbies);
        await result.current.addEntry(4, 'meh', mockHobbies);
        await result.current.addEntry(10, 'great', mockHobbies);
      });

      expect(result.current.log.greatCount).toBe(3);
    });

    it('great 評価がない場合、greatCountは0', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addEntry(1, 'good', mockHobbies);
        await result.current.addEntry(2, 'meh', mockHobbies);
      });

      expect(result.current.log.greatCount).toBe(0);
    });

    it('エントリー追加でgreatCountが更新される', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.log.greatCount).toBe(0);

      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
      });

      expect(result.current.log.greatCount).toBe(1);

      await act(async () => {
        await result.current.addEntry(2, 'great', mockHobbies);
      });

      expect(result.current.log.greatCount).toBe(2);
    });
  });

  describe('topTags', () => {
    it('評価された趣味のタグから上位3つを抽出する', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // hobbyId 1: ['自然', 'リラックス', '観察']
      // hobbyId 3: ['フィジカル', 'リラックス', '健康']
      // hobbyId 13: ['リラックス', '健康', 'マインドフルネス']
      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
        await result.current.addEntry(3, 'great', mockHobbies);
        await result.current.addEntry(13, 'great', mockHobbies);
      });

      // 'リラックス'が3回、'健康'が2回、'自然'が1回
      expect(result.current.log.topTags).toHaveLength(3);
      expect(result.current.log.topTags[0]).toBe('リラックス');
      expect(result.current.log.topTags).toContain('健康');
    });

    it('タグが3つ未満の場合、存在する分だけ返す', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // hobbyId 1: ['自然', 'リラックス', '観察']
      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
      });

      expect(result.current.log.topTags.length).toBeLessThanOrEqual(3);
    });

    it('ログが空の場合、topTagsは空配列', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.log.topTags).toEqual([]);
    });

    it('タグの出現頻度順にソートされる', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 'リラックス'を多く含む趣味を追加
      // hobbyId 1: ['自然', 'リラックス', '観察']
      // hobbyId 3: ['フィジカル', 'リラックス', '健康']
      // hobbyId 13: ['リラックス', '健康', 'マインドフルネス']
      // hobbyId 11: ['音声', 'リラックス', '発見']
      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
        await result.current.addEntry(3, 'great', mockHobbies);
        await result.current.addEntry(13, 'great', mockHobbies);
        await result.current.addEntry(11, 'great', mockHobbies);
      });

      // 'リラックス'が4回で最多
      expect(result.current.log.topTags[0]).toBe('リラックス');
    });
  });

  describe('isStepUpUnlocked', () => {
    it('😊が3つ以上でステップアップを解放する', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
        await result.current.addEntry(2, 'great', mockHobbies);
        await result.current.addEntry(3, 'great', mockHobbies);
      });

      expect(result.current.isStepUpUnlocked()).toBe(true);
    });

    it('😊が2つ以下では解放しない', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
        await result.current.addEntry(2, 'great', mockHobbies);
        await result.current.addEntry(3, 'good', mockHobbies);
      });

      expect(result.current.isStepUpUnlocked()).toBe(false);
    });

    it('😊が0の場合は解放しない', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isStepUpUnlocked()).toBe(false);
    });

    it('😊がちょうど3つの場合は解放する', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addEntry(1, 'great', mockHobbies);
        await result.current.addEntry(2, 'great', mockHobbies);
        await result.current.addEntry(3, 'great', mockHobbies);
      });

      expect(result.current.log.greatCount).toBe(3);
      expect(result.current.isStepUpUnlocked()).toBe(true);
    });
  });

  describe('loadLog', () => {
    it('loadLogを手動で呼び出して再読み込みできる', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 初期状態
      expect(result.current.log.entries).toHaveLength(0);

      // 外部でAsyncStorageを更新
      const newData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
        ],
        greatCount: 1,
        topTags: ['自然'],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(newData)
      );

      // 再読み込み
      await act(async () => {
        await result.current.loadLog();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.log.entries).toHaveLength(1);
    });
  });

  describe('エラーハンドリング', () => {
    it('AsyncStorageエラー時に空のログで初期化する', async () => {
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(
        new Error('Storage error')
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.log).toEqual({
        entries: [],
        greatCount: 0,
        topTags: [],
      });
    });

    it('addEntry失敗時にfalseを返す', async () => {
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(
        new Error('Storage error')
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success = true;
      await act(async () => {
        success = await result.current.addEntry(1, 'great', mockHobbies);
      });

      expect(success).toBe(false);
    });

    it('deleteEntry失敗時にfalseを返す', async () => {
      const existingData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
        ],
        greatCount: 1,
        topTags: ['自然'],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(existingData)
      );

      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(
        new Error('Storage error')
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success = true;
      await act(async () => {
        success = await result.current.deleteEntry(0, mockHobbies);
      });

      expect(success).toBe(false);
    });
  });
});
