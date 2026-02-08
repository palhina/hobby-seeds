/**
 * useAsyncStorage カスタムフックのテスト
 *
 * AsyncStorageの型安全なラッパーフック。
 * 初期状態、データ保存、データ取得、エラーハンドリングをテスト
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAsyncStorage } from '../use-async-storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

import type { HobbyLog } from '@/types';

describe('useAsyncStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('getItem', () => {
    it('保存されたデータを正しく取得できる', async () => {
      const testData: HobbyLog = {
        entries: [],
        greatCount: 0,
        topTags: [],
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(testData)
      );

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let retrievedData: HobbyLog | null = null;
      await act(async () => {
        retrievedData = await result.current.getItem();
      });

      expect(retrievedData).toEqual(testData);
    });

    it('データが存在しない場合はnullを返す', async () => {
      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let retrievedData: HobbyLog | null = null;
      await act(async () => {
        retrievedData = await result.current.getItem();
      });

      expect(retrievedData).toBeNull();
    });

    it('複雑なデータ構造を正しく復元できる', async () => {
      const complexData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
          { hobbyId: 2, rating: 'good', loggedAt: '2026-02-02T12:00:00Z' },
        ],
        greatCount: 1,
        topTags: ['自然', 'リラックス'],
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(complexData)
      );

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let retrievedData: HobbyLog | null = null;
      await act(async () => {
        retrievedData = await result.current.getItem();
      });

      expect(retrievedData).toEqual(complexData);
    });

    it('不正なJSONデータの場合はnullを返す', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        'invalid json data'
      );

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let retrievedData: HobbyLog | null = null;
      await act(async () => {
        retrievedData = await result.current.getItem();
      });

      expect(retrievedData).toBeNull();
    });
  });

  describe('setItem', () => {
    it('データを正しく保存できる', async () => {
      const testData: HobbyLog = {
        entries: [],
        greatCount: 0,
        topTags: [],
      };

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let success = false;
      await act(async () => {
        success = await result.current.setItem(testData);
      });

      expect(success).toBe(true);

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HOBBY_LOG);
      expect(JSON.parse(stored!)).toEqual(testData);
    });

    it('既存データを上書きできる', async () => {
      const initialData: HobbyLog = {
        entries: [],
        greatCount: 0,
        topTags: [],
      };

      const updatedData: HobbyLog = {
        entries: [
          { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01T12:00:00Z' },
        ],
        greatCount: 1,
        topTags: ['自然'],
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(initialData)
      );

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      await act(async () => {
        await result.current.setItem(updatedData);
      });

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HOBBY_LOG);
      expect(JSON.parse(stored!)).toEqual(updatedData);
    });

    it('複数の異なるキーにデータを保存できる', async () => {
      const hobbyLogData: HobbyLog = {
        entries: [],
        greatCount: 0,
        topTags: [],
      };

      const preferencesData = {
        theme: 'dark',
        notifications: true,
      };

      const { result: hobbyLogResult } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      const { result: preferencesResult } = renderHook(() =>
        useAsyncStorage<typeof preferencesData>(STORAGE_KEYS.PREFERENCES)
      );

      await act(async () => {
        await hobbyLogResult.current.setItem(hobbyLogData);
        await preferencesResult.current.setItem(preferencesData);
      });

      const storedHobbyLog = await AsyncStorage.getItem(STORAGE_KEYS.HOBBY_LOG);
      const storedPreferences = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);

      expect(JSON.parse(storedHobbyLog!)).toEqual(hobbyLogData);
      expect(JSON.parse(storedPreferences!)).toEqual(preferencesData);
    });
  });

  describe('removeItem', () => {
    it('データを削除できる', async () => {
      const testData: HobbyLog = {
        entries: [],
        greatCount: 0,
        topTags: [],
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(testData)
      );

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let success = false;
      await act(async () => {
        success = await result.current.removeItem();
      });

      expect(success).toBe(true);

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HOBBY_LOG);
      expect(stored).toBeNull();
    });

    it('存在しないデータを削除してもエラーにならない', async () => {
      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let success = false;
      await act(async () => {
        success = await result.current.removeItem();
      });

      expect(success).toBe(true);
    });
  });

  describe('型安全性', () => {
    it('保存・取得で型が保持される', async () => {
      type TestType = {
        id: number;
        name: string;
        active: boolean;
      };

      const testData: TestType = {
        id: 123,
        name: 'Test',
        active: true,
      };

      const { result } = renderHook(() =>
        useAsyncStorage<TestType>(STORAGE_KEYS.HOBBY_LOG)
      );

      await act(async () => {
        await result.current.setItem(testData);
      });

      let retrievedData: TestType | null = null;
      await act(async () => {
        retrievedData = await result.current.getItem();
      });

      expect(retrievedData).toEqual(testData);
    });
  });

  describe('エラーハンドリング', () => {
    it('AsyncStorageのエラー時にgetItemはnullを返す', async () => {
      const mockError = new Error('Storage error');
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(mockError);

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let retrievedData: HobbyLog | null = null;
      await act(async () => {
        retrievedData = await result.current.getItem();
      });

      expect(retrievedData).toBeNull();
    });

    it('AsyncStorageのエラー時にsetItemはfalseを返す', async () => {
      const mockError = new Error('Storage error');
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(mockError);

      const testData: HobbyLog = {
        entries: [],
        greatCount: 0,
        topTags: [],
      };

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let success = true;
      await act(async () => {
        success = await result.current.setItem(testData);
      });

      expect(success).toBe(false);
    });

    it('AsyncStorageのエラー時にremoveItemはfalseを返す', async () => {
      const mockError = new Error('Storage error');
      jest.spyOn(AsyncStorage, 'removeItem').mockRejectedValueOnce(mockError);

      const { result } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      let success = true;
      await act(async () => {
        success = await result.current.removeItem();
      });

      expect(success).toBe(false);
    });
  });

  describe('useCallbackの動作確認', () => {
    it('keyが変わらない限り関数が再生成されない', () => {
      const { result, rerender } = renderHook(() =>
        useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG)
      );

      const firstGetItem = result.current.getItem;
      const firstSetItem = result.current.setItem;
      const firstRemoveItem = result.current.removeItem;

      // 再レンダリングをトリガー（propsが変わらない場合）
      rerender({});

      expect(result.current.getItem).toBe(firstGetItem);
      expect(result.current.setItem).toBe(firstSetItem);
      expect(result.current.removeItem).toBe(firstRemoveItem);
    });
  });
});
