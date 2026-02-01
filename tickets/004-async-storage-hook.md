# チケット 004: AsyncStorageフック

## 概要

AsyncStorageを型安全に使用するためのカスタムフック `useAsyncStorage` を作成する。
ストレージキーの定数も合わせて定義する。

## ステータス: 🔴 未着手

## 依存関係

- **依存するチケット**: 001（型定義）
- **このチケットに依存**: 007

## 作成ファイル

```
constants/
└── storage-keys.ts       # ストレージキー定数

hooks/
└── use-async-storage.ts  # 汎用AsyncStorageフック
```

---

## TODO

### constants/storage-keys.ts
- [ ] STORAGE_KEYS オブジェクト定義
  - [ ] HOBBY_LOG: '@hobby-seeds/hobby-log'
  - [ ] DIAGNOSIS_HISTORY: '@hobby-seeds/diagnosis-history'
  - [ ] PREFERENCES: '@hobby-seeds/preferences'
  - [ ] FIRST_LAUNCH: '@hobby-seeds/first-launch'
- [ ] StorageKey 型のエクスポート

### hooks/use-async-storage.ts
- [ ] useAsyncStorage<T> ジェネリックフック
- [ ] getItem 関数（null返却でエラーハンドリング）
- [ ] setItem 関数（boolean返却でエラーハンドリング）
- [ ] removeItem 関数（オプション）
- [ ] __DEV__ での console.error ログ

---

## 参考資料

- CLAUDE.md - AsyncStorage規約
- `docs/TYPESCRIPT_RULES.md` - ジェネリクスの活用

---

## 実装例

### constants/storage-keys.ts

```typescript
export const STORAGE_KEYS = {
  HOBBY_LOG: '@hobby-seeds/hobby-log',
  DIAGNOSIS_HISTORY: '@hobby-seeds/diagnosis-history',
  PREFERENCES: '@hobby-seeds/preferences',
  FIRST_LAUNCH: '@hobby-seeds/first-launch',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
```

### hooks/use-async-storage.ts

```typescript
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StorageKey } from '@/constants/storage-keys';

export function useAsyncStorage<T>(key: StorageKey) {
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
```

---

## 使用例

```typescript
import { useAsyncStorage } from '@/hooks/use-async-storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import type { HobbyLog } from '@/types';

function useHobbyLog() {
  const { getItem, setItem } = useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG);

  const loadLog = async () => {
    const log = await getItem();
    return log ?? { entries: [], greatCount: 0, topTags: [] };
  };

  // ...
}
```

---

## 完了条件

- [ ] STORAGE_KEYS が定義されている
- [ ] useAsyncStorage フックが実装されている
- [ ] ジェネリクスで型安全にデータ取得/保存できる
- [ ] エラーハンドリングが適切に行われている
- [ ] `npx tsc --noEmit` でエラーがないこと

---

*最終更新: 2026年2月1日*
