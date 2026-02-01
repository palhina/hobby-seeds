# チケット 005: 気分診断画面

## 概要

3問の簡単な質問で今の気分を診断する画面を実装する。
診断結果をもとに趣味をフィルタリングするための回答データを生成。

## ステータス: 🟢 完了

## 依存関係

- **依存するチケット**: 001（型定義）, 002（テーマ設定）
- **このチケットに依存**: 010

## 作成ファイル

```
app/
└── diagnosis/
    ├── index.tsx         # 診断開始画面
    ├── question.tsx      # 質問画面（3問）
    └── _layout.tsx       # 診断フローレイアウト

components/
└── features/
    └── diagnosis/
        ├── DiagnosisCard.tsx      # 選択肢カード
        ├── ProgressBar.tsx        # 進捗バー
        └── QuestionText.tsx       # 質問テキスト

hooks/
└── use-diagnosis.ts      # 診断ロジックフック
```

---

## TODO

### 診断フロー設計
- [x] 質問内容の確定
  - [x] Q1: 今のエネルギーレベルは？（low/medium/high）
  - [x] Q2: 外に出たい気分？（はい/いいえ）
  - [x] Q3: 何かを作りたい or 眺めていたい？（active/passive）
- [x] 回答データ構造の確認（DiagnosisAnswer型）

### app/diagnosis/_layout.tsx
- [x] Stack Navigator 設定
- [x] アニメーション設定（slide_from_right）

### app/diagnosis/index.tsx
- [x] 診断開始画面UI
- [x] 「診断を始める」ボタン
- [x] やさしいメッセージング

### app/diagnosis/question.tsx
- [x] 質問表示ロジック（現在の質問番号管理）
- [x] 選択肢の表示（2-3択）
- [x] 回答選択時の状態更新
- [x] 進捗バー表示
- [x] 最後の質問後、結果画面への遷移

### components/features/diagnosis/
- [x] DiagnosisCard コンポーネント
  - [x] 選択肢の絵文字・テキスト表示
  - [x] 選択状態のスタイル
  - [x] タップ時のハプティックフィードバック
- [x] ProgressBar コンポーネント
  - [x] 進捗表示（1/3, 2/3, 3/3）
  - [x] アニメーション（オプション）
- [x] QuestionText コンポーネント
  - [x] 質問テキストの表示
  - [x] やさしいフォントサイズ

### hooks/use-diagnosis.ts
- [x] 回答状態の管理
- [x] 現在の質問番号管理
- [x] 回答更新関数
- [x] 診断完了判定

---

## 参考資料

- `types/diagnosis.ts` - DiagnosisAnswer, DiagnosisResult
- `docs/STYLING_RULES.md` - デザインガイド
- CLAUDE.md - 画面遷移、コンポーネント規約

---

## 画面デザイン案

### 診断開始画面
```
┌─────────────────────────┐
│                         │
│          🌱             │
│                         │
│    今日はどんな気分？    │
│                         │
│  3つの質問であなたに    │
│  ぴったりの趣味を       │
│  見つけます             │
│                         │
│   ┌─────────────────┐   │
│   │  診断を始める   │   │
│   └─────────────────┘   │
│                         │
└─────────────────────────┘
```

### 質問画面
```
┌─────────────────────────┐
│  ● ○ ○  (1/3)          │
├─────────────────────────┤
│                         │
│  今のエネルギーレベルは？ │
│                         │
│  ┌─────────────────┐    │
│  │ 😴 のんびり     │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ 😊 ふつう       │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ 🔥 元気いっぱい │    │
│  └─────────────────┘    │
│                         │
└─────────────────────────┘
```

---

## 質問定義

```typescript
const DIAGNOSIS_QUESTIONS = [
  {
    id: 1,
    text: '今のエネルギーレベルは？',
    options: [
      { value: 'low', label: 'のんびり', emoji: '😴' },
      { value: 'medium', label: 'ふつう', emoji: '😊' },
      { value: 'high', label: '元気いっぱい', emoji: '🔥' },
    ],
    answerKey: 'energy',
  },
  {
    id: 2,
    text: '外に出たい気分？',
    options: [
      { value: true, label: '外に出たい', emoji: '🚶' },
      { value: false, label: '家にいたい', emoji: '🏠' },
    ],
    answerKey: 'goOut',
  },
  {
    id: 3,
    text: '何をしたい気分？',
    options: [
      { value: 'active', label: '何かを作る・動く', emoji: '✨' },
      { value: 'passive', label: 'ぼんやり眺める・聴く', emoji: '👀' },
    ],
    answerKey: 'activityType',
  },
] as const;
```

---

## 完了条件

- [x] 診断フローが3画面で完結する
- [x] 回答データがDiagnosisAnswer型で取得できる
- [x] 進捗バーが正しく表示される
- [x] 選択状態がわかりやすく表示される
- [x] styled-componentsでテーマから値を参照している
- [x] `npx tsc --noEmit` でエラーがないこと

---

*最終更新: 2026年2月1日*
