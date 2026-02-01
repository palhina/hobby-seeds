# チケット 007: ログ機能

## 概要

ユーザーが「やってみた」趣味を記録する機能を実装する。
評価（😐🙂😊）と一緒にAsyncStorageに保存し、履歴を閲覧できるようにする。

## ステータス: 🔴 未着手

## 依存関係

- **依存するチケット**: 001（型定義）, 004（AsyncStorageフック）
- **このチケットに依存**: 008

## 作成ファイル

```
hooks/
└── use-hobby-log.ts      # ログ管理フック

app/
└── (tabs)/
    └── log.tsx           # ログ一覧画面（タブに追加）

components/
└── features/
    └── log/
        ├── LogEntry.tsx          # ログエントリー表示
        ├── EmptyLogState.tsx     # 空状態表示
        └── LogStats.tsx          # 統計表示（😊の数など）
```

---

## TODO

### hooks/use-hobby-log.ts
- [ ] useHobbyLog フック
  - [ ] ログの読み込み（loadLog）
  - [ ] ログの追加（addEntry）
  - [ ] greatCount の更新
  - [ ] topTags の更新（オプション、008で実装）
- [ ] HobbyLog 型の初期値定義
- [ ] useAsyncStorage との連携

### app/(tabs)/log.tsx
- [ ] ログ一覧の表示
- [ ] FlatList での効率的なレンダリング
- [ ] 空状態の表示
- [ ] 統計サマリー表示

### app/(tabs)/_layout.tsx
- [ ] ログタブの追加
- [ ] アイコン設定（📝 など）

### components/features/log/LogEntry.tsx
- [ ] 趣味名・絵文字表示
- [ ] 評価アイコン表示
- [ ] 日時表示
- [ ] カードスタイル

### components/features/log/EmptyLogState.tsx
- [ ] やさしいメッセージ表示
- [ ] 「診断を始める」ボタン

### components/features/log/LogStats.tsx
- [ ] 総ログ数
- [ ] 😊 の数
- [ ] ステップアップ解放までの数

---

## 参考資料

- `types/log.ts` - HobbyLog, HobbyLogEntry
- `hooks/use-async-storage.ts`
- CLAUDE.md - AsyncStorage規約

---

## 画面デザイン案

### ログ一覧画面
```
┌─────────────────────────┐
│  📝 やってみた記録      │
├─────────────────────────┤
│  ┌─────────────────┐    │
│  │ 😊 3回          │    │
│  │ あと2回で       │    │
│  │ ステップアップ！│    │
│  └─────────────────┘    │
├─────────────────────────┤
│  今日                   │
│  ┌─────────────────┐    │
│  │ 🪟 窓の外を眺める│    │
│  │ 😊 良かった！    │    │
│  │ 14:30           │    │
│  └─────────────────┘    │
│                         │
│  昨日                   │
│  ┌─────────────────┐    │
│  │ 🎧 好きな曲を聴く│    │
│  │ 🙂 まあまあ     │    │
│  │ 20:15           │    │
│  └─────────────────┘    │
│                         │
└─────────────────────────┘
```

### 空状態
```
┌─────────────────────────┐
│                         │
│          🌱             │
│                         │
│  まだ記録がありません    │
│                         │
│  趣味を試してみて       │
│  感想を記録しましょう！  │
│                         │
│   ┌─────────────────┐   │
│   │  診断を始める   │   │
│   └─────────────────┘   │
│                         │
└─────────────────────────┘
```

---

## 実装例

### hooks/use-hobby-log.ts

```typescript
import { useState, useEffect, useCallback } from 'react';

import { useAsyncStorage } from '@/hooks/use-async-storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

import type { HobbyLog, HobbyLogEntry, Rating } from '@/types';

const INITIAL_LOG: HobbyLog = {
  entries: [],
  greatCount: 0,
  topTags: [],
};

export function useHobbyLog() {
  const { getItem, setItem } = useAsyncStorage<HobbyLog>(STORAGE_KEYS.HOBBY_LOG);
  const [log, setLog] = useState<HobbyLog>(INITIAL_LOG);
  const [isLoading, setIsLoading] = useState(true);

  // ログの読み込み
  const loadLog = useCallback(async () => {
    setIsLoading(true);
    const storedLog = await getItem();
    setLog(storedLog ?? INITIAL_LOG);
    setIsLoading(false);
  }, [getItem]);

  // ログの追加
  const addEntry = useCallback(async (
    hobbyId: number,
    rating: Rating
  ): Promise<boolean> => {
    const newEntry: HobbyLogEntry = {
      hobbyId,
      rating,
      loggedAt: new Date().toISOString(),
    };

    const updatedLog: HobbyLog = {
      ...log,
      entries: [...log.entries, newEntry],
      greatCount: rating === 'great' ? log.greatCount + 1 : log.greatCount,
    };

    const success = await setItem(updatedLog);
    if (success) {
      setLog(updatedLog);
    }
    return success;
  }, [log, setItem]);

  // 初回読み込み
  useEffect(() => {
    loadLog();
  }, [loadLog]);

  return {
    log,
    isLoading,
    addEntry,
    loadLog,
  };
}
```

---

## 完了条件

- [ ] ログの保存・読み込みが動作する
- [ ] ログ一覧画面が表示される
- [ ] 空状態が適切に表示される
- [ ] greatCount が正しくカウントされる
- [ ] タブナビゲーションに追加されている
- [ ] styled-componentsでテーマから値を参照している
- [ ] `npx tsc --noEmit` でエラーがないこと

---

*最終更新: 2026年2月1日*
