# チケット 001: 型定義の作成

## 概要

TypeScript型定義を `types/` 配下に作成する。
プロジェクト全体で使用する基本型を定義し、型安全な開発の基盤を整える。

## ステータス: 🟢 完了

## 依存関係

- **依存するチケット**: なし
- **このチケットに依存**: 003, 004, 005, 006, 007

## 作成ファイル

```
types/
├── index.ts          # 全型のre-export
├── common.ts         # 共通ユーティリティ型
├── hobby.ts          # 趣味関連の型
├── diagnosis.ts      # 診断関連の型
└── log.ts            # ログ関連の型
```

---

## TODO

### types/common.ts
- [x] `EnergyLevel` 型定義（'low' | 'medium' | 'high'）
- [x] `Location` 型定義（'家' | '外' | 'どこでも'）
- [x] `Category` 型定義（7カテゴリ）
- [x] `Rating` 型定義（'meh' | 'good' | 'great'）
- [x] `Tag` 型定義
- [x] 定数配列（ENERGY_LEVELS, LOCATIONS, CATEGORIES, RATINGS）

### types/hobby.ts
- [x] `HobbyBase` 型定義（id, name, emoji, tags）
- [x] `YuruHobby` 型定義（ゆる趣味）
- [x] `StepUpHobby` 型定義（ステップアップ趣味）

### types/diagnosis.ts
- [x] `DiagnosisAnswer` 型定義
- [x] `DiagnosisResult` 型定義
- [x] `DiagnosisQuestion` 型定義（オプション）

### types/log.ts
- [x] `HobbyLogEntry` 型定義
- [x] `HobbyLog` 型定義

### types/index.ts
- [x] 全型のre-export設定

---

## 参考資料

- `docs/TYPESCRIPT_RULES.md` - 型定義の詳細仕様
- CLAUDE.md - 命名規則

---

## 実装メモ

```typescript
// types/common.ts の例
export const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;
export type EnergyLevel = typeof ENERGY_LEVELS[number];

export const CATEGORIES = ['眺める', '作る', '動く', '聴く', '学ぶ', '整える', '遊ぶ'] as const;
export type Category = typeof CATEGORIES[number];
```

---

## 完了条件

- [x] 全ファイルが作成されている
- [x] `npx tsc --noEmit` でエラーがないこと
- [x] `@/types` からインポート可能

---

*最終更新: 2026年2月1日*
