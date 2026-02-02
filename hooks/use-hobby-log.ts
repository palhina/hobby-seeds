/**
 * 趣味ログ管理カスタムフック
 *
 * ユーザーが「やってみた」趣味の記録を管理する。
 * AsyncStorageに保存し、履歴の取得・追加・統計計算を行う。
 */

import { useState, useEffect, useCallback } from 'react';

import { useAsyncStorage } from './use-async-storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

import type { HobbyLog, HobbyLogEntry, Rating, Tag } from '@/types';

/**
 * 空のログデータを生成
 */
function createEmptyLog(): HobbyLog {
  return {
    entries: [],
    greatCount: 0,
    topTags: [],
  };
}

/**
 * タグの出現頻度を計算し、上位3つを返す
 */
function calculateTopTags(entries: HobbyLogEntry[], hobbiesData: any[]): Tag[] {
  const tagCount: Record<string, number> = {};

  // 各エントリーの趣味からタグを集計
  entries.forEach(entry => {
    const hobby = hobbiesData.find(h => h.id === entry.hobbyId);
    if (hobby && hobby.tags) {
      hobby.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  // 出現頻度順にソートして上位3つを取得
  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);
}

/**
 * 😊（great）の数をカウント
 */
function countGreatRatings(entries: HobbyLogEntry[]): number {
  return entries.filter(entry => entry.rating === 'great').length;
}

export function useHobbyLog() {
  const { getItem, setItem } = useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG);

  const [log, setLog] = useState<HobbyLog>(createEmptyLog());
  const [isLoading, setIsLoading] = useState(true);

  /**
   * ログをAsyncStorageから読み込む
   */
  const loadLog = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedLog = await getItem();
      setLog(savedLog ?? createEmptyLog());
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to load hobby log:', error);
      }
      setLog(createEmptyLog());
    } finally {
      setIsLoading(false);
    }
  }, [getItem]);

  /**
   * 新しいログエントリーを追加
   * AsyncStorageから最新のデータを取得してから追加する（競合回避）
   */
  const addEntry = useCallback(async (
    hobbyId: number,
    rating: Rating,
    hobbiesData: any[]
  ): Promise<boolean> => {
    try {
      // AsyncStorageから最新のログを取得（state の古いデータを使わない）
      const currentLog = await getItem() ?? createEmptyLog();

      const newEntry: HobbyLogEntry = {
        hobbyId,
        rating,
        loggedAt: new Date().toISOString(),
      };

      const updatedEntries = [...currentLog.entries, newEntry];
      const greatCount = countGreatRatings(updatedEntries);
      const topTags = calculateTopTags(updatedEntries, hobbiesData);

      const updatedLog: HobbyLog = {
        entries: updatedEntries,
        greatCount,
        topTags,
      };

      const success = await setItem(updatedLog);

      if (success) {
        setLog(updatedLog);
      }

      return success;
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to add log entry:', error);
      }
      return false;
    }
  }, [getItem, setItem]);

  /**
   * ログエントリーを削除
   * indexで指定したエントリーを削除する
   * AsyncStorageから最新のデータを取得してから削除する（競合回避）
   */
  const deleteEntry = useCallback(async (
    index: number,
    hobbiesData: any[]
  ): Promise<boolean> => {
    try {
      // AsyncStorageから最新のログを取得
      const currentLog = await getItem() ?? createEmptyLog();

      const updatedEntries = currentLog.entries.filter((_, i) => i !== index);
      const greatCount = countGreatRatings(updatedEntries);
      const topTags = calculateTopTags(updatedEntries, hobbiesData);

      const updatedLog: HobbyLog = {
        entries: updatedEntries,
        greatCount,
        topTags,
      };

      const success = await setItem(updatedLog);

      if (success) {
        setLog(updatedLog);
      }

      return success;
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to delete log entry:', error);
      }
      return false;
    }
  }, [getItem, setItem]);

  /**
   * ステップアップ趣味が解放されているかチェック
   * 😊が3つ以上で解放
   */
  const isStepUpUnlocked = useCallback((): boolean => {
    return log.greatCount >= 3;
  }, [log.greatCount]);

  // 初回マウント時にログを読み込む
  useEffect(() => {
    loadLog();
  }, [loadLog]);

  return {
    log,
    isLoading,
    loadLog,
    addEntry,
    deleteEntry,
    isStepUpUnlocked,
  };
}
