# チケット 006: 趣味提案画面

## 概要

診断結果をもとに、ユーザーに合った「ゆる趣味」を提案する画面を実装する。
フィルタリングロジックで適切な趣味を選び、カード形式で表示。

## ステータス: 🔴 未着手

## 依存関係

- **依存するチケット**: 001（型定義）, 002（テーマ設定）, 003（趣味データ）
- **このチケットに依存**: 010

## 作成ファイル

```
app/
└── results/
    ├── index.tsx         # 提案結果一覧画面
    └── [id].tsx          # 趣味詳細画面

components/
└── features/
    └── hobby/
        ├── HobbyCard.tsx         # 趣味カード
        ├── HobbyDetail.tsx       # 趣味詳細表示
        ├── HardleIndicator.tsx   # ハードル表示（時間・コスト・場所）
        └── RatingButtons.tsx     # 評価ボタン（😐🙂😊）

utils/
└── filter-hobbies.ts     # フィルタリングロジック
```

---

## TODO

### フィルタリングロジック（utils/filter-hobbies.ts）
- [ ] filterHobbiesByDiagnosis 関数
  - [ ] エネルギーレベルでフィルタ
  - [ ] 外出意欲でフィルタ（location）
  - [ ] アクティビティタイプでフィルタ（category）
- [ ] ランダム選出（3-5個）
- [ ] 優先度スコアリング（オプション）

### app/results/index.tsx
- [ ] 診断結果の受け取り（useLocalSearchParams）
- [ ] フィルタリング実行
- [ ] 趣味カードのグリッド表示（2列）
- [ ] 空状態の表示（該当なしの場合）
- [ ] 「もう一度診断」ボタン

### app/results/[id].tsx
- [ ] 趣味IDの受け取り
- [ ] 趣味データの取得
- [ ] 詳細表示
- [ ] 「やってみた」ボタン（ログ画面へ）

### components/features/hobby/HobbyCard.tsx
- [ ] 絵文字の大きな表示
- [ ] 趣味名
- [ ] ハードルインジケーター
- [ ] タップで詳細画面へ

### components/features/hobby/HobbyDetail.tsx
- [ ] 趣味名・絵文字
- [ ] tryStep（最初の一歩）の表示
- [ ] タグ表示
- [ ] ハードル詳細

### components/features/hobby/HardleIndicator.tsx
- [ ] 時間表示（⏱️ 5分）
- [ ] コスト表示（💰 0円）
- [ ] 場所表示（🏠 家）
- [ ] コンパクトなバッジスタイル

### components/features/hobby/RatingButtons.tsx
- [ ] 3つの評価ボタン（😐 微妙 / 🙂 まあまあ / 😊 良かった）
- [ ] 選択状態のスタイル
- [ ] 選択時のハプティック
- [ ] onRate コールバック

---

## 参考資料

- `types/hobby.ts` - YuruHobby
- `types/diagnosis.ts` - DiagnosisAnswer
- `docs/STYLING_RULES.md` - カードスタイル、評価ボタン

---

## 画面デザイン案

### 提案結果画面
```
┌─────────────────────────┐
│  🌱 今日のおすすめ      │
├─────────────────────────┤
│ ┌─────────┐ ┌─────────┐ │
│ │   🪟    │ │   🎧    │ │
│ │窓の外を │ │好きな曲 │ │
│ │眺める   │ │を聴く   │ │
│ │⏱️5分 💰0│ │⏱️3分 💰0│ │
│ └─────────┘ └─────────┘ │
│ ┌─────────┐ ┌─────────┐ │
│ │   🧘    │ │   📱    │ │
│ │ストレッ │ │雑学     │ │
│ │チ1種類 │ │クイズ   │ │
│ │⏱️3分 💰0│ │⏱️5分 💰0│ │
│ └─────────┘ └─────────┘ │
│                         │
│   ┌─────────────────┐   │
│   │ もう一度診断する │   │
│   └─────────────────┘   │
└─────────────────────────┘
```

### 趣味詳細画面
```
┌─────────────────────────┐
│  ← 戻る                 │
├─────────────────────────┤
│                         │
│          🪟             │
│                         │
│    窓の外を眺める        │
│                         │
│  ┌─────────────────┐    │
│  │ 最初の一歩       │    │
│  │                 │    │
│  │ 窓際に座って、   │    │
│  │ 5分だけ外の景色  │    │
│  │ を眺めてみる     │    │
│  └─────────────────┘    │
│                         │
│  ⏱️ 5分  💰 0円  🏠 家   │
│                         │
│  #リラックス #静か #一人 │
│                         │
│  ┌─────────────────────┐│
│  │   やってみた！      ││
│  └─────────────────────┘│
│                         │
└─────────────────────────┘
```

---

## フィルタリングロジック

```typescript
// utils/filter-hobbies.ts

import type { YuruHobby } from '@/types';
import type { DiagnosisAnswer } from '@/types';

export function filterHobbiesByDiagnosis(
  hobbies: YuruHobby[],
  answers: DiagnosisAnswer
): YuruHobby[] {
  return hobbies.filter((hobby) => {
    // エネルギーレベルでフィルタ
    if (answers.energy === 'low' && hobby.energy === 'high') {
      return false;
    }

    // 外出意欲でフィルタ
    if (!answers.goOut && hobby.location === '外') {
      return false;
    }
    if (answers.goOut && hobby.indoor) {
      return false; // 外に出たいのに室内のみは除外（ゆるめに）
    }

    // アクティビティタイプでフィルタ
    const passiveCategories = ['眺める', '聴く'];
    const activeCategories = ['作る', '動く'];

    if (answers.activityType === 'passive') {
      if (activeCategories.includes(hobby.category)) {
        return false;
      }
    } else {
      if (passiveCategories.includes(hobby.category)) {
        return false;
      }
    }

    return true;
  });
}

export function selectRandomHobbies(
  hobbies: YuruHobby[],
  count: number = 4
): YuruHobby[] {
  const shuffled = [...hobbies].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
```

---

## 完了条件

- [ ] 診断結果から適切な趣味がフィルタリングされる
- [ ] 趣味カードがグリッド表示される
- [ ] 詳細画面で tryStep が表示される
- [ ] ハードルインジケーターが正しく表示される
- [ ] 評価ボタンが動作する
- [ ] styled-componentsでテーマから値を参照している
- [ ] `npx tsc --noEmit` でエラーがないこと

---

*最終更新: 2026年2月1日*
