# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

---

## 🎯 プロジェクト概要

**プロジェクト名**: 趣味のたね (hobby-seeds)

**コンセプト**: 「何かしなきゃ」を「ちょっと試してみた」に変える

休日にダラダラしてしまう罪悪感を解消するため、**超低ハードル**の趣味を提案し、小さな達成感を積み重ねるアプリ。iOSリリース練習用として開発。

### キーメッセージ
> 「続かなくても大丈夫。試すことに意味がある」

---

## 📚 重要ドキュメント

コード作成前に必ず以下のドキュメントを参照してください：

| ドキュメント | 用途 | パス |
|------------|------|------|
| **TypeScript規約** | 型定義・命名規則 | `docs/TYPESCRIPT_RULES.md` |
| **スタイリング規約** | styled-components・デザイン | `docs/STYLING_RULES.md` |
| **テスト規約** | テストの書き方 | `docs/TESTING_RULES.md` |
| **プロジェクト詳細** | 機能仕様・データ構造 | `PROJECT_SUMMARY.md` |
| **開発規約** | コーディング規約全般 | `CLAUDE_MD_RULES.md` |

---

## 🛠️ 技術スタック

- **フレームワーク**: Expo SDK 54 (React Native 0.81.5)
- **言語**: TypeScript (strict mode)
- **UI**: React 19.1.0 + React Compiler (experimental)
- **ルーティング**: Expo Router v6 (file-based routing + typed routes)
- **スタイリング**: styled-components/native
- **状態管理**: なし (AsyncStorage + カスタムフック)
- **データ保存**: AsyncStorage (ローカル永続化)
- **趣味データ**: JSON (アプリ内バンドル)
- **バックエンド**: なし (完全ローカル完結)

### Expo設定
- **New Architecture**: 有効
- **React Compiler**: 有効
- **Typed Routes**: 有効
- **カスタムURLスキーム**: `hobbyseeds://`

---

## 📁 ディレクトリ構成

```
hobby-seeds/
├── app/                      # Expo Router（ファイルベースルーティング）
│   ├── _layout.tsx           # ルートレイアウト（テーマプロバイダー）
│   ├── (tabs)/               # タブナビゲーション
│   │   ├── _layout.tsx       # タブレイアウト
│   │   ├── index.tsx         # ホーム画面
│   │   └── explore.tsx       # 探索画面
│   └── modal.tsx             # モーダル画面
├── components/               # 再利用可能コンポーネント
│   ├── ui/                   # 汎用UIコンポーネント
│   │   ├── icon-symbol.tsx   # アイコンコンポーネント
│   │   └── collapsible.tsx   # 折りたたみコンポーネント
│   ├── themed-*.tsx          # テーマ対応コンポーネント
│   └── features/             # 機能別コンポーネント（今後追加）
├── constants/                # 定数定義
│   └── theme.ts              # カラー・フォント定義
├── hooks/                    # カスタムフック
│   ├── use-color-scheme.ts   # カラースキームフック
│   └── use-theme-color.ts    # テーマカラーフック
├── types/                    # TypeScript型定義（今後追加）
│   └── index.ts              # 全型のre-export
├── utils/                    # ユーティリティ関数（今後追加）
├── data/                     # 静的データ（今後追加）
│   └── hobbies.json          # 趣味データ
├── docs/                     # ドキュメント
│   ├── TYPESCRIPT_RULES.md   # TypeScript規約
│   └── TESTING_RULES.md      # テスト規約
└── assets/                   # 画像・フォントなどのアセット
```

---

## 🚀 開発コマンド

### 開発サーバー起動
```bash
# Metro bundler起動（WSL2環境のためトンネルモードを使用）
npx expo start --tunnel

# または
npm start -- --tunnel
```

起動後、以下のオプションが利用可能：
- **Android**: `npm run android` または `a` キー
- **iOS**: `npm run ios` または `i` キー
- **Web**: `npm run web` または `w` キー

### リンティング
```bash
npm run lint
```

### TypeScript型チェック
```bash
npx tsc --noEmit
```
プロジェクトはstrict modeを使用しているため、型エラーは必ず修正してください。

### テスト実行（今後追加予定）
```bash
# 全テスト実行
npm test

# カバレッジ付き
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### プロジェクトリセット
```bash
npm run reset-project
```
スターターコードを`app-example/`に移動し、空の`app/`ディレクトリを作成します。

---

## 🏗️ アーキテクチャ

### ルーティング構造

**Expo Routerのファイルベースルーティング**を使用：

- **`app/_layout.tsx`**: ルートレイアウト
  - ThemeProviderでダークモード対応
  - StatusBarの設定
  - `unstable_settings.anchor: '(tabs)'`でディープリンク対応

- **`app/(tabs)/_layout.tsx`**: タブナビゲーター
  - ハプティックフィードバック付きタブバー
  - SF Symbolsアイコン使用
  - テーマカラー連動

- **`app/(tabs)/index.tsx`**: ホーム画面
- **`app/(tabs)/explore.tsx`**: 探索画面
- **`app/modal.tsx`**: モーダル画面の例

### パスエイリアス

`tsconfig.json`で`@/*`エイリアスを設定：

```typescript
// ✅ エイリアスパスを使用
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ❌ 相対パスは使わない（長くなる場合）
import { Colors } from '../../../constants/theme';
```

### プラットフォーム別ファイル

プラットフォーム固有の実装が必要な場合、拡張子で分離：

- `component.tsx` - 共通実装
- `component.ios.tsx` - iOS固有
- `component.web.ts` - Web固有

例：`use-color-scheme.ts`と`use-color-scheme.web.ts`

### テーマシステム

**React Navigationのテーマ**と**カスタムカラー定数**を併用：

```typescript
// constants/theme.ts
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};
```

**プラットフォーム別フォント**も定義されています（`Fonts`オブジェクト参照）。

---

## 📝 コーディング規約

### 共通ルール

- **ロジック重複禁止** - コードを書く前に既存のコードを探す
- **新規ファイル作成前に既存構成を確認** - 同様の機能が既にないか確認
- **3回以上使われたら共通化** - 同じコードが3回出現したらユーティリティ化を検討

### インポート順序

以下の順序で記述し、**グループ間は空行**で区切る：

```typescript
// 1. React / React Native
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';

// 2. 外部ライブラリ
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';

// 3. 内部モジュール（エイリアスパス）
import { useHobbyLog } from '@/hooks/useHobbyLog';
import { filterHobbies } from '@/utils/filterHobby';
import { STORAGE_KEYS } from '@/constants/storageKeys';

// 4. 型（type-only import）
import type { YuruHobby, Rating } from '@/types';

// 5. ローカルファイル（相対パス）
import { SCardContainer, STitle } from './styles';
```

### コンポーネント規約

#### 基本構成

```typescript
// 1. インポート
import React from 'react';
import styled from 'styled-components/native';
import type { YuruHobby } from '@/types';

// 2. 型定義（Props）
type HobbyCardProps = {
  hobby: YuruHobby;
  onPress: (id: number) => void;
};

// 3. スタイルドコンポーネント（Sプレフィックス必須）
const SContainer = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// 4. コンポーネント本体（named export）
export function HobbyCard({ hobby, onPress }: HobbyCardProps) {
  return (
    <SContainer onPress={() => onPress(hobby.id)}>
      <STitle>{hobby.emoji} {hobby.name}</STitle>
    </SContainer>
  );
}
```

#### 禁止パターン

```typescript
// ❌ default export は使わない
export default function HobbyCard() { }

// ✅ named export を使用
export function HobbyCard() { }

// ❌ インラインスタイル
<View style={{ padding: 16 }}>

// ✅ styled-components（Sプレフィックス必須）
const SContainer = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

// ❌ Sプレフィックスなし
const Container = styled.View``;

// ✅ Sプレフィックス付き
const SContainer = styled.View``;

// ❌ 匿名関数コンポーネント
const HobbyCard = () => { };

// ✅ 名前付き関数
export function HobbyCard() { }

// ❌ console.logの残置（本番コード）
console.log('Debug info'); // 開発時のみOK、本番前に削除

// ✅ エラーログは __DEV__ で判定
if (__DEV__) {
  console.error('Error:', error);
}

// ❌ コメントアウトされたコードの残置
// const oldFunction = () => { ... };

// ❌ 未使用のimport
import { SomeUnusedComponent } from '@/components';

// ✅ 必要なもののみimport
import { UsedComponent } from '@/components';
```

### 命名規則

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `HobbyCard`, `RatingButton` |
| Props型 | `{Component}Props` | `HobbyCardProps` |
| スタイル | PascalCase（意味のある名前） | `Container`, `Title`, `ActionButton` |
| 変数 | camelCase | `selectedHobby`, `userAnswers` |
| 定数 | SCREAMING_SNAKE_CASE | `STORAGE_KEYS`, `MAX_SUGGESTIONS` |
| Boolean | is/has/can 接頭辞 | `isLoading`, `hasLiked` |
| ハンドラ関数 | `handle{Action}` | `handlePress`, `handleSubmit` |
| イベントハンドラProp | `on{Action}` | `onPress`, `onSubmit` |
| カスタムフック | `use{Name}` | `useHobbyLog`, `useColorScheme` |

---

## 💾 AsyncStorage規約

### キー命名規則

```typescript
// constants/storageKeys.ts
export const STORAGE_KEYS = {
  // プレフィックス: @hobby-seeds/
  HOBBY_LOG: '@hobby-seeds/hobby-log',
  DIAGNOSIS_HISTORY: '@hobby-seeds/diagnosis-history',
  PREFERENCES: '@hobby-seeds/preferences',
  FIRST_LAUNCH: '@hobby-seeds/first-launch',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
```

### カスタムフックでラップ

```typescript
// hooks/useAsyncStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageKey } from '@/constants/storageKeys';

export function useAsyncStorage<T>(key: StorageKey) {
  const getItem = async (): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      if (__DEV__) {
        console.error(`Failed to get ${key}:`, error);
      }
      return null;
    }
  };

  const setItem = async (value: T): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (__DEV__) {
        console.error(`Failed to set ${key}:`, error);
      }
      return false;
    }
  };

  return { getItem, setItem };
}
```

---

## ⚠️ エラーハンドリング

### 基本方針

1. **AsyncStorage操作**: try-catchで囲み、エラー時は`null`または`false`を返す
2. **ユーザーへの通知**: 致命的でなければ静かに失敗（ログのみ）
3. **コンソールログ**: 開発時のみ出力（`__DEV__`で判定）

```typescript
// ✅ AsyncStorage操作
async function saveLog(entry: HobbyLogEntry): Promise<boolean> {
  try {
    const logs = await getItem<HobbyLog[]>(STORAGE_KEYS.HOBBY_LOG) ?? [];
    logs.push(entry);
    await setItem(STORAGE_KEYS.HOBBY_LOG, logs);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to save log:', error);
    }
    return false;
  }
}
```

---

## 💬 コメント規約

### 書くべきコメント

```typescript
// ✅ 「なぜ」を説明するコメント
// 😊が3つ以上でステップアップ趣味を解放する仕様のため
if (greatCount >= 3) {
  showStepUpHobbies();
}

// ✅ 複雑なロジックの説明
// タグの出現頻度を計算し、上位3つを抽出
const topTags = Object.entries(tagCount)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 3)
  .map(([tag]) => tag);

// ✅ TODO（必ず理由と担当を記載）
// TODO(username): API連携時にサーバーから取得するよう変更
const hobbies = require('@/data/hobbies.json');
```

### 書かないコメント

```typescript
// ❌ コードを読めばわかるコメント
// hobbyのidを取得
const hobbyId = hobby.id;

// ❌ 古くなる可能性のあるコメント
// 現在45個の趣味がある
const hobbies = getHobbies();
```

---

## 🔄 画面遷移（Expo Router）

### パラメータの受け渡し

```typescript
// 遷移元
import { useRouter } from 'expo-router';

function DiagnosisScreen() {
  const router = useRouter();

  const handleComplete = (answers: DiagnosisAnswer) => {
    // パラメータはJSON文字列化して渡す
    router.push({
      pathname: '/results',
      params: { answers: JSON.stringify(answers) },
    });
  };
}

// 遷移先
import { useLocalSearchParams } from 'expo-router';

function ResultsScreen() {
  const { answers: answersJson } = useLocalSearchParams<{ answers: string }>();
  const answers: DiagnosisAnswer = JSON.parse(answersJson);
}
```

---

## 🧪 TypeScript規約

**詳細は `docs/TYPESCRIPT_RULES.md` を参照してください。**

### 重要なポイント

1. **新規型作成前に必ず既存型を確認**
   - `src/types/` を確認
   - `Omit` / `Pick` / `Partial` を活用

2. **`any`の使用禁止**
   - `unknown`を使用し、型ガードで絞り込む

3. **`interface`より`type`を優先**
   - Omit/Pickとの相性が良い

4. **リテラル型とユニオン型を活用**
   ```typescript
   type EnergyLevel = 'low' | 'medium' | 'high';
   type Rating = 'meh' | 'good' | 'great';
   ```

5. **型のエクスポートは`@/types`から**
   ```typescript
   import type { YuruHobby, Rating } from '@/types';
   ```

---

## 🧪 テスト規約

**詳細は `docs/TESTING_RULES.md` を参照してください。**

### カバレッジ目標

| 対象 | 目標 | 優先度 |
|------|------|--------|
| utils（ロジック） | 80%以上 | 最優先 |
| hooks | 70%以上 | 高 |
| コンポーネント | 70%以上 | 中 |

### テストの配置

```
src/
├── utils/
│   ├── filterHobby.ts
│   └── __tests__/
│       └── filterHobby.test.ts
├── hooks/
│   ├── useHobbyLog.ts
│   └── __tests__/
│       └── useHobbyLog.test.ts
```

### 重要な原則

1. **ロジックの正確性を検証する**（表示確認だけに終始しない）
2. **ユーザー視点でテストを書く**（実装詳細に依存しない）
3. **重要なビジネスロジックを優先的にカバー**

---

## 🎨 スタイリング規約

**詳細は `docs/STYLING_RULES.md` を参照してください。**

### 重要なポイント

1. **styled-componentsには必ずSプレフィックスを付ける**
   ```typescript
   // ✅ 正しい
   const SContainer = styled.View``;
   const STitle = styled.Text``;
   const SButton = styled.TouchableOpacity``;

   // ❌ 間違い
   const Container = styled.View``;
   const StyledContainer = styled.View``;
   ```

2. **必ずthemeから値を参照する**
   ```typescript
   // ✅ 正しい
   const SContainer = styled.View`
     background-color: ${({ theme }) => theme.colors.surface};
     padding: ${({ theme }) => theme.spacing.lg}px;
     border-radius: ${({ theme }) => theme.borderRadius.lg}px;
   `;

   // ❌ 間違い（マジックナンバー・ハードコードされた色）
   const SContainer = styled.View`
     background-color: #ffffff;
     padding: 16px;
     border-radius: 12px;
   `;
   ```

3. **インラインスタイル禁止**
   ```typescript
   // ❌ 禁止
   <View style={{ padding: 16, backgroundColor: '#fff' }}>

   // ✅ 正しい
   <SContainer>
   ```

4. **デザインコンセプトを理解する**
   - あたたかみ（ベージュ・オレンジ系）
   - やわらかさ（丸みのあるUI）
   - 肯定的（「できた」を応援）

5. **主要カラーパレット**（詳細は`docs/STYLING_RULES.md`参照）
   ```typescript
   theme.colors = {
     primary: '#FF9F7A',        // コーラルオレンジ
     background: '#FFF8F3',     // クリームホワイト
     textPrimary: '#4A3728',    // ダークブラウン
     // ...
   }
   ```

---

## ✅ 開発時のチェックリスト

### 新しいコンポーネント作成時

- [ ] `docs/TYPESCRIPT_RULES.md`を確認し、既存の型を活用
- [ ] `docs/STYLING_RULES.md`を確認し、デザインコンセプトを理解
- [ ] Props型を定義（`{Component}Props`）
- [ ] named exportを使用
- [ ] スタイルはstyled-componentsで定義（**Sプレフィックス必須**）
- [ ] themeから値を参照（マジックナンバー禁止）
- [ ] インポート順序を守る
- [ ] プラットフォーム固有の処理が必要か検討

### 新しい型を作成する場合

- [ ] `src/types/`の既存型でOmit/Pick/Partialで対応できないか確認
- [ ] 対応できない場合のみ新規作成
- [ ] `src/types/index.ts`に追加
- [ ] リテラル型で値を制限できないか検討

### AsyncStorageを使う場合

- [ ] `constants/storageKeys.ts`にキーを追加
- [ ] `useAsyncStorage`フックを使用
- [ ] try-catchでエラーハンドリング
- [ ] デフォルト値を設定

### テストを書く場合

- [ ] `docs/TESTING_RULES.md`を参照
- [ ] ユニットテスト（utils）を優先
- [ ] 実装詳細ではなく、振る舞いをテスト
- [ ] カバレッジ目標を確認

---

## 📖 参考ファイル

- **`PROJECT_SUMMARY.md`** - プロジェクト全体の詳細まとめ（機能仕様・データ構造）
- **`CLAUDE_MD_RULES.md`** - 開発規約の詳細
- **`docs/TYPESCRIPT_RULES.md`** - TypeScript規約
- **`docs/STYLING_RULES.md`** - スタイリング規約（カラーパレット、コンポーネントスタイル）
- **`docs/TESTING_RULES.md`** - テスト規約
- **`constants/theme.ts`** - カラー・フォント定義（実装ファイル）

---

## ⭐ 重要事項

このプロジェクトで開発を進める際の基本方針：

- **日本語のコメント・ドキュメントOK** - コード内のコメントやドキュメントは日本語で記述可能
- **コミットメッセージは日本語OK** - Git commitメッセージも日本語で記述可能
- **迷ったらシンプルな実装を優先する** - 過度な抽象化や複雑な設計より、わかりやすい実装を選択
- **公式ドキュメント・推奨パターンを優先し、独自ルールは作らない** - Expo、React Native、TypeScriptの公式推奨に従う

---

## 🚫 注意事項

- **バックエンドなし**: すべてローカル完結
- **データ消失**: アプリ削除でログは消える（練習用なので問題なし）
- **マネタイズ考慮なし**: iOSリリース練習が目的
- **日本語のみ**: ローカライズ不要
- **TypeScript strict mode**: 型エラーは必ず修正
- **React Native New Architecture**: 有効化されているため、古いAPIは使用しない
- **Expo公式APIのみ使用**: ネイティブモジュールの直接編集は禁止

---

## 🎯 開発の優先順位

### Phase 1: 基本セットアップ
1. ディレクトリ構成の整備（types/, utils/, data/）
2. 趣味データの準備（hobbies.json）
3. 基本型定義（YuruHobby, StepUpHobby, etc.）

### Phase 2: 基本機能実装
4. 気分診断画面（3問）
5. 趣味提案画面（フィルタリングロジック）
6. AsyncStorage連携（ログ機能）

### Phase 3: 高度な機能
7. タグ分析ロジック
8. ステップアップ提案
9. アニメーション・デザイン調整

### Phase 4: 仕上げ
10. テストの追加
11. 実機テスト
12. App Store提出準備

---

*最終更新: 2026年2月1日*
