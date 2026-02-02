# チケット 009: ステップアップ提案

## 概要

ユーザーが「😊 良かった」を3回以上記録したら、本格的な趣味（ステップアップ趣味）を提案する機能を実装。
タグ分析結果に基づいて、関連するステップアップ趣味をマッチング。

## ステータス: 🟢 完了

## 依存関係

- **依存するチケット**: 003（趣味データ）, 008（タグ分析）
- **このチケットに依存**: なし

## 作成ファイル

```
utils/
└── match-stepup.ts       # ステップアップマッチングロジック

app/
└── stepup/
    ├── index.tsx         # ステップアップ一覧画面
    └── [id].tsx          # ステップアップ詳細画面

components/
└── features/
    └── stepup/
        ├── StepUpCard.tsx        # ステップアップカード
        ├── StepUpDetail.tsx      # ステップアップ詳細
        ├── UnlockBanner.tsx      # 解放バナー（初回表示）
        └── NextStepList.tsx      # 次のステップリスト
```

---

## TODO

### ステップアップ解放条件
- [x] greatCount >= 3 で解放
- [x] 解放状態の保存（FIRST_STEPUP_SHOWN フラグ）
- [x] 解放時の通知表示

### utils/match-stepup.ts
- [x] matchStepUpHobbies 関数
  - [x] topTags と matchTags のマッチング
  - [x] スコア計算（マッチするタグ数）
  - [x] スコア順にソート
- [x] isStepUpUnlocked 関数
  - [x] greatCount の判定

### app/stepup/index.tsx
- [x] マッチしたステップアップ趣味の一覧表示
- [x] 解放バナー（初回のみ）
- [x] 空状態（マッチなしの場合）

### app/stepup/[id].tsx
- [x] ステップアップ趣味の詳細表示
- [x] 始め方ガイド
- [x] 次のステップリスト
- [x] 初期コスト・時間コミット表示

### components/features/stepup/StepUpCard.tsx
- [x] 趣味名・絵文字
- [x] 簡単な説明
- [x] マッチ度表示（オプション）

### components/features/stepup/StepUpDetail.tsx
- [x] 詳細説明
- [x] startGuide（始め方）
- [x] startCost（初期コスト）
- [x] timeCommit（時間コミット）

### components/features/stepup/NextStepList.tsx
- [x] nextSteps の表示
- [x] ステップ番号付きリスト

### components/features/stepup/UnlockBanner.tsx
- [x] 祝福メッセージ
- [x] アニメーション（オプション）

---

## 参考資料

- `types/hobby.ts` - StepUpHobby
- `data/stepup-hobbies.json`
- `utils/analyze-tags.ts`

---

## 画面デザイン案

### ステップアップ解放バナー
```
┌─────────────────────────┐
│  🎉                     │
│                         │
│  おめでとう！           │
│                         │
│  😊が3つ集まりました！  │
│                         │
│  本格的な趣味を         │
│  見てみませんか？       │
│                         │
│   ┌─────────────────┐   │
│   │  見てみる！     │   │
│   └─────────────────┘   │
└─────────────────────────┘
```

### ステップアップ一覧
```
┌─────────────────────────┐
│  ✨ ステップアップ      │
│     あなたにおすすめ    │
├─────────────────────────┤
│  ┌─────────────────┐    │
│  │ 📷 写真撮影      │    │
│  │               │    │
│  │ スマホでも始め  │    │
│  │ られる手軽な趣味│    │
│  │               │    │
│  │ マッチ度: ★★★  │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ 🎨 水彩画       │    │
│  │               │    │
│  │ 100円ショップで  │    │
│  │ 道具が揃う      │    │
│  │               │    │
│  │ マッチ度: ★★☆  │    │
│  └─────────────────┘    │
└─────────────────────────┘
```

### ステップアップ詳細
```
┌─────────────────────────┐
│  ← 戻る                 │
├─────────────────────────┤
│                         │
│          📷             │
│                         │
│       写真撮影          │
│                         │
│  スマホでも始められる   │
│  手軽な趣味             │
│                         │
├─────────────────────────┤
│  📝 始め方              │
│  散歩中に気になった     │
│  ものを撮ってみる       │
├─────────────────────────┤
│  💰 初期コスト          │
│  0円（スマホ）〜        │
├─────────────────────────┤
│  ⏰ 時間の目安          │
│  週に1-2時間            │
├─────────────────────────┤
│  🚀 次のステップ        │
│  1. SNSに投稿してみる   │
│  2. 編集アプリを試す    │
│  3. カメラ入門書を読む  │
└─────────────────────────┘
```

---

## 実装例

### utils/match-stepup.ts

```typescript
import type { StepUpHobby, Tag } from '@/types';

type MatchResult = {
  hobby: StepUpHobby;
  matchScore: number;
  matchedTags: Tag[];
};

/**
 * ユーザーのtopTagsに基づいてステップアップ趣味をマッチング
 */
export function matchStepUpHobbies(
  stepUpHobbies: StepUpHobby[],
  userTopTags: Tag[]
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const hobby of stepUpHobbies) {
    const matchedTags = hobby.matchTags.filter((tag) =>
      userTopTags.includes(tag)
    );

    if (matchedTags.length > 0) {
      results.push({
        hobby,
        matchScore: matchedTags.length,
        matchedTags,
      });
    }
  }

  // スコア順にソート
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * ステップアップが解放されているか判定
 */
export function isStepUpUnlocked(greatCount: number): boolean {
  return greatCount >= 3;
}

/**
 * 解放までの残り回数を計算
 */
export function getRemainingToUnlock(greatCount: number): number {
  return Math.max(0, 3 - greatCount);
}
```

---

## ナビゲーション連携

```typescript
// app/(tabs)/log.tsx または app/results/[id].tsx から

import { useRouter } from 'expo-router';

const router = useRouter();

// ステップアップ解放時
if (isStepUpUnlocked(greatCount) && !hasShownStepUpBanner) {
  // バナー表示 or 直接遷移
  router.push('/stepup');
}
```

---

## 完了条件

- [x] greatCount >= 3 でステップアップ画面にアクセス可能
- [x] タグマッチングが正しく動作する
- [x] ステップアップ詳細が表示される
- [x] 解放バナーが初回のみ表示される
- [x] styled-componentsでテーマから値を参照している
- [x] `npx tsc --noEmit` でエラーがないこと

---

*最終更新: 2026年2月1日*
