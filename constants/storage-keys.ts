/**
 * AsyncStorage用のキー定数
 *
 * すべてのAsyncStorageキーはここで一元管理する。
 * プレフィックス: @hobby-seeds/
 */

export const STORAGE_KEYS = {
  /** 趣味ログ（試した趣味と評価） */
  HOBBY_LOG: '@hobby-seeds/hobby-log',

  /** 診断履歴 */
  DIAGNOSIS_HISTORY: '@hobby-seeds/diagnosis-history',

  /** ユーザー設定 */
  PREFERENCES: '@hobby-seeds/preferences',

  /** 初回起動フラグ */
  FIRST_LAUNCH: '@hobby-seeds/first-launch',

  /** ステップアップ解放フラグ */
  STEPUP_UNLOCKED: '@hobby-seeds/stepup-unlocked',
} as const;

/** ストレージキーの型 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
