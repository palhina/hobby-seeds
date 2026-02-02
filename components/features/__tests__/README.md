# components/features テスト

## 作成されたテストファイル

### 1. RatingButtons テスト
**ファイル**: `components/features/hobby/__tests__/RatingButtons.test.tsx`

評価ボタン（😐 🙂 😊）のインタラクションと表示をテスト。

**テストケース**:
- 3つの評価ボタンが正しく表示される
- 各ボタンのラベル（微妙・まあまあ・良かった）が表示される
- ボタン押下で正しいrating値（meh/good/great）が返される
- ハプティックフィードバックが発火する
- 選択状態が正しく表示される
- 複数回の押下が可能

**モック**:
- `expo-haptics` - ハプティックフィードバックをモック

---

### 2. HurdleIndicator テスト
**ファイル**: `components/features/hobby/__tests__/HurdleIndicator.test.tsx`

趣味のハードル表示（時間・コスト・場所）のロジックをテスト。

**テストケース**:
- 時間が正しく表示される（5分、15分、60分など）
- コストが正しく表示される（0円、100円、1000円など）
- 場所アイコンと文字が正しく表示される
  - 家: 🏠 + 「家」
  - 外: 🚶 + 「外」
  - どこでも: 🚶 + 「どこでも」
- 複合パターンで全ての情報が正しく表示される
- 絵文字（⏱️、💰）が表示される

**特徴**:
- 表示ロジックのみ、インタラクションなし
- 様々な組み合わせパターンをテスト

---

### 3. LogEntry テスト
**ファイル**: `components/features/log/__tests__/LogEntry.test.tsx`

趣味ログエントリーの表示と削除インタラクションをテスト。

**テストケース**:
- 趣味名・絵文字が表示される
- 評価の絵文字が正しく表示される（meh → 😐、good → 🙂、great → 😊）
- 日時がフォーマットされて表示される（ISO 8601 → 2026/02/02 10:30）
- onDeleteが渡されている場合のみ削除ボタンが表示される
- 削除ボタン押下でAlert.alertが表示される
- Alert確認後にonDeleteが呼ばれる
- Alertキャンセル時はonDeleteが呼ばれない

**モック**:
- `Alert.alert` - 削除確認ダイアログをモック
- `@/components/ui/icon-symbol` - IconSymbolコンポーネントをモック

**注意点**:
- 日時のテストはローカルタイムゾーンの影響を受ける可能性あり

---

### 4. StepUpCard テスト
**ファイル**: `components/features/stepup/__tests__/StepUpCard.test.tsx`

ステップアップ趣味カードの表示とインタラクションをテスト。

**テストケース**:
- 趣味名・絵文字・説明文が表示される
- マッチ度（%）が表示される
- 初期コスト・かかる時間が表示される
- マッチしたタグが正しく表示される
- タグが0〜3個の場合の表示
- 異なるマッチ度（0%、50%、100%）の表示
- カード押下でonPressが趣味IDと共に呼ばれる
- 複数回押下可能
- 異なる趣味データ（ヨガ、ランニング）の表示

**特徴**:
- 複雑なUIコンポーネントのため、多くのテストケース
- タグの動的表示をテスト

---

## テストユーティリティ

### test-utils.tsx
**ファイル**: `components/features/__tests__/test-utils.tsx`

全てのテストで共通で使用するヘルパー。

**提供する機能**:
- `renderWithTheme()` - styled-componentsのThemeProviderでラップしてレンダリング

**使用例**:
```typescript
import { renderWithTheme } from '../../__tests__/test-utils';

const { getByText } = renderWithTheme(
  <RatingButtons selectedRating={null} onRate={mockOnRate} />
);
```

---

## テスト実行方法

### 全てのテストを実行
```bash
npm test
```

### 特定のコンポーネントのテストのみ実行
```bash
npm test -- RatingButtons.test.tsx
npm test -- HurdleIndicator.test.tsx
npm test -- LogEntry.test.tsx
npm test -- StepUpCard.test.tsx
```

### カバレッジ付きで実行
```bash
npm test -- --coverage
```

### Watch モードで実行
```bash
npm test:watch
```

---

## テスト設計方針

このプロジェクトのテストは以下の方針に従っています:

### 1. 表示だけでなく振る舞いをテスト
単に「表示される」だけでなく、「ボタンを押したらコールバックが呼ばれる」などのインタラクションをテスト。

### 2. ユーザー視点でテスト
実装詳細（内部state、propsの型など）ではなく、ユーザーに見える振る舞い（表示されるテキスト、ボタンの動作）をテスト。

### 3. エッジケースをカバー
- タグが0個の場合
- コストが0円の場合
- 複数回押下した場合
など、境界値やエッジケースを積極的にテスト。

### 4. テストは読みやすく
テストケースの説明は日本語で、何をテストしているか明確に記述。

---

## モック設定

以下のモックは`jest.setup.js`で設定済み:

- `@react-native-async-storage/async-storage`
- `expo-router`
- `expo-haptics`
- `react-native-safe-area-context`
- `react-native-reanimated`
- `@/components/ui/icon-symbol`

追加のモックが必要な場合は`jest.setup.js`に追加してください。

---

## トラブルシューティング

### ThemeProviderエラーが出る場合
`renderWithTheme()`を使用してください。styled-componentsを使用するコンポーネントは必ずThemeProviderでラップする必要があります。

### IconSymbolが見つからない場合
`jest.setup.js`で既にモック化されているため、通常は問題ありません。もし問題があれば、モック定義を確認してください。

### Alertが動作しない場合
`jest.spyOn(Alert, 'alert')`を使用してモック化してください。

### 日時のテストが失敗する場合
タイムゾーンの影響を受けている可能性があります。正規表現で年月日のみをテストするなど、柔軟なアサーションを使用してください。

---

## 今後の拡張

以下のコンポーネントのテストが未作成です:

- `components/features/diagnosis/` 配下のコンポーネント
- 他のfeatures配下のコンポーネント

必要に応じて、同じパターンでテストを追加してください。
