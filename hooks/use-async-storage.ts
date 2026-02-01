/**
 * AsyncStorage用の汎用カスタムフック
 *
 * 型安全にAsyncStorageを操作するためのフック。
 * エラーハンドリングも含む。
 *
 * @example
 * const { getItem, setItem } = useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG);
 * const log = await getItem();
 */

import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StorageKey } from '@/constants/storage-keys';

export function useAsyncStorage<T>(key: StorageKey) {
  /**
   * データを取得する
   * @returns 保存されたデータ、または null
   */
  const getItem = useCallback(async (): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      if (__DEV__) {
        console.error(`Failed to get ${key}:`, error);
      }
      return null;
    }
  }, [key]);

  /**
   * データを保存する
   * @param value 保存するデータ
   * @returns 成功したら true
   */
  const setItem = useCallback(async (value: T): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (__DEV__) {
        console.error(`Failed to set ${key}:`, error);
      }
      return false;
    }
  }, [key]);

  /**
   * データを削除する
   * @returns 成功したら true
   */
  const removeItem = useCallback(async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      if (__DEV__) {
        console.error(`Failed to remove ${key}:`, error);
      }
      return false;
    }
  }, [key]);

  return { getItem, setItem, removeItem };
}
