# チケット 002: テーマ設定

## 概要

styled-components/native 用のテーマを設定する。
デザインコンセプト（あたたかみ・やわらかさ・肯定的）に沿ったカラーパレットとスタイル定数を定義。

## ステータス: 🟢 完了

## 依存関係

- **依存するチケット**: なし
- **このチケットに依存**: 005, 006

## 作成・更新ファイル

```
constants/
├── theme.ts          # メインテーマ定義（更新）
styled.d.ts           # styled-components型拡張
app/_layout.tsx       # ThemeProvider設定（更新）
```

---

## TODO

### constants/theme.ts
- [x] カラーパレット定義
  - [x] プライマリカラー（primary, primaryLight, primaryDark）
  - [x] ベースカラー（background, backgroundAlt, surface）
  - [x] テキストカラー（textPrimary, textSecondary, textMuted）
  - [x] セマンティックカラー（success, warning, error, info）
  - [x] 評価カラー（rating: meh, ok, good）
  - [x] ボーダー・シャドウカラー
- [x] スペーシング定義（xs, sm, md, lg, xl, xxl）
- [x] タイポグラフィ定義
  - [x] フォントサイズ（xs〜display）
  - [x] フォントウェイト
  - [x] 行間
- [x] ボーダー半径定義（sm, md, lg, xl, full）
- [x] シャドウ定義（sm, md, lg）
- [x] `Theme` 型のエクスポート

### styled.d.ts
- [x] DefaultTheme の型拡張

### app/_layout.tsx
- [x] ThemeProvider のインポート
- [x] theme のインポート
- [x] ThemeProvider でラップ

---

## 参考資料

- `docs/STYLING_RULES.md` - カラーパレット、スタイルガイド
- CLAUDE.md - デザインコンセプト

---

## 実装メモ

```typescript
// constants/theme.ts
export const theme = {
  colors: {
    primary: '#FF9F7A',        // コーラルオレンジ
    primaryLight: '#FFD4C4',
    primaryDark: '#E8845A',

    background: '#FFF8F3',     // クリームホワイト
    backgroundAlt: '#FFF0E6',
    surface: '#FFFFFF',

    textPrimary: '#4A3728',    // ダークブラウン
    textSecondary: '#8B7355',
    textMuted: '#B8A089',

    // ...
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  // ...
};

export type Theme = typeof theme;
```

```typescript
// styled.d.ts
import 'styled-components/native';
import { Theme } from './constants/theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}
```

---

## 完了条件

- [x] theme.ts にデザインコンセプトに沿った値が定義されている
- [x] styled.d.ts で型拡張されている
- [x] ThemeProvider が設定されている
- [x] `npx tsc --noEmit` でエラーがないこと
- [x] 任意のコンポーネントで `${({ theme }) => theme.colors.primary}` が動作する

---

*最終更新: 2026年2月1日*
