# 趣味のたね - スタイルガイド (STYLING.md)

## 📋 概要

このドキュメントは「趣味のたね」アプリのスタイル設計指針をまとめたものです。  
**Claude Code** での開発時に参照してください。

---

## 🎨 デザインコンセプト

### トーン & ムード
- **あたたかみ**：ベージュ・オレンジ系のやさしい色合い
- **やわらかさ**：丸みのあるUI、プレッシャーを与えない
- **肯定的**：「できた」を応援するメッセージング

### キーワード
> ゆるい / 安心 / 小さな達成感 / 罪悪感ゼロ

---

## 🎨 カラーパレット

### プライマリカラー
```typescript
const colors = {
  // メインカラー（あたたかみ）
  primary: '#FF9F7A',        // コーラルオレンジ - CTA、アクセント
  primaryLight: '#FFD4C4',   // 淡いピーチ - 背景のアクセント
  primaryDark: '#E8845A',    // 濃いオレンジ - ホバー、アクティブ

  // ベースカラー（安心感）
  background: '#FFF8F3',     // クリームホワイト - メイン背景
  backgroundAlt: '#FFF0E6',  // ライトベージュ - カード背景
  surface: '#FFFFFF',        // 純白 - カード、モーダル

  // テキストカラー
  textPrimary: '#4A3728',    // ダークブラウン - メインテキスト
  textSecondary: '#8B7355',  // ミディアムブラウン - サブテキスト
  textMuted: '#B8A089',      // ライトブラウン - 補足テキスト

  // セマンティックカラー
  success: '#7BC47F',        // やさしいグリーン
  warning: '#FFB84D',        // やわらかイエロー
  error: '#FF8A80',          // 控えめレッド
  info: '#81D4FA',           // 淡いブルー

  // ボーダー & シャドウ
  border: '#E8DED4',         // ベージュグレー
  shadow: 'rgba(74, 55, 40, 0.08)', // ブラウン系シャドウ
};
```

### 評価カラー
```typescript
const ratingColors = {
  meh: '#D4C5B5',      // 😐 グレーベージュ
  ok: '#FFD4A3',       // 🙂 やさしいオレンジ
  good: '#FF9F7A',     // 😊 コーラルオレンジ
};
```

---

## 📐 スペーシング

### 基本単位
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### 使用ガイドライン
| 用途 | サイズ |
|------|--------|
| アイコンと文字の間 | `xs` (4px) |
| 要素内のパディング | `sm` - `md` (8-16px) |
| カード内のパディング | `lg` (24px) |
| セクション間のマージン | `xl` - `xxl` (32-48px) |

---

## 📝 タイポグラフィ

### フォント設定
```typescript
const typography = {
  // フォントファミリー
  fontFamily: {
    primary: '"Noto Sans JP", "Hiragino Sans", sans-serif',
    emoji: 'Apple Color Emoji, Segoe UI Emoji',
  },

  // フォントサイズ
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    display: 48,
  },

  // フォントウェイト
  fontWeight: {
    normal: '400',
    medium: '500',
    bold: '700',
  },

  // 行間
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};
```

### テキストスタイル例
| 用途 | サイズ | ウェイト | 色 |
|------|--------|----------|-----|
| 見出し（画面タイトル） | `xl` (24px) | `bold` | `textPrimary` |
| サブ見出し | `lg` (18px) | `medium` | `textPrimary` |
| 本文 | `md` (16px) | `normal` | `textPrimary` |
| 補足テキスト | `sm` (14px) | `normal` | `textSecondary` |
| ラベル | `xs` (12px) | `medium` | `textMuted` |
| 絵文字（大） | `display` (48px) | - | - |

---

## 🔲 コンポーネントスタイル

### ボーダー半径
```typescript
const borderRadius = {
  sm: 8,      // 小さいボタン、タグ
  md: 12,     // 一般的なボタン、入力欄
  lg: 16,     // カード
  xl: 24,     // 大きなカード、モーダル
  full: 9999, // 完全な丸（アイコン、バッジ）
};
```

### シャドウ
```typescript
const shadows = {
  sm: '0 2px 4px rgba(74, 55, 40, 0.06)',
  md: '0 4px 12px rgba(74, 55, 40, 0.08)',
  lg: '0 8px 24px rgba(74, 55, 40, 0.12)',
};
```

---

## 🧩 styled-components ガイドライン

### 命名規則

**重要**: スタイル付きコンポーネントは必ず `S` プレフィックスをつける

```typescript
// ✅ 正しい命名
const SContainer = styled.View`...`;
const SHeader = styled.View`...`;
const STitle = styled.Text`...`;
const SButton = styled.TouchableOpacity`...`;
const SCard = styled.View`...`;

// ❌ 間違った命名
const Container = styled.View`...`;     // Sプレフィックスがない
const StyledContainer = styled.View`...`; // 長すぎる
const ContainerStyle = styled.View`...`;  // 一貫性がない
```

### ファイル構成

```typescript
// components/HobbyCard.tsx

import styled from 'styled-components/native';

// ===================
// Styled Components
// ===================

const SCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;
  elevation: 3;
`;

const SEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.display}px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const SDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => 
    theme.typography.fontSize.sm * theme.typography.lineHeight.relaxed}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

// ===================
// Component
// ===================

interface HobbyCardProps {
  emoji: string;
  title: string;
  description: string;
}

export const HobbyCard: React.FC<HobbyCardProps> = ({
  emoji,
  title,
  description,
}) => {
  return (
    <SCard>
      <SEmoji>{emoji}</SEmoji>
      <STitle>{title}</STitle>
      <SDescription>{description}</SDescription>
    </SCard>
  );
};
```

### 条件付きスタイル

```typescript
// Props に基づくスタイル変更
interface SButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const SButton = styled.TouchableOpacity<SButtonProps>`
  background-color: ${({ theme, variant = 'primary', disabled }) => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.backgroundAlt;
      case 'ghost': return 'transparent';
      default: return theme.colors.primary;
    }
  }};
  
  padding: ${({ theme, size = 'md' }) => {
    switch (size) {
      case 'sm': return `${theme.spacing.sm}px ${theme.spacing.md}px`;
      case 'md': return `${theme.spacing.md}px ${theme.spacing.lg}px`;
      case 'lg': return `${theme.spacing.lg}px ${theme.spacing.xl}px`;
      default: return `${theme.spacing.md}px ${theme.spacing.lg}px`;
    }
  }};
  
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

const SButtonText = styled.Text<SButtonProps>`
  color: ${({ theme, variant = 'primary' }) => {
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return theme.colors.textPrimary;
      case 'ghost': return theme.colors.primary;
      default: return '#FFFFFF';
    }
  }};
  
  font-size: ${({ theme, size = 'md' }) => {
    switch (size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'md': return theme.typography.fontSize.md;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.md;
    }
  }}px;
  
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-align: center;
`;
```

---

## 🎴 コンポーネント別スタイルガイド

### カード

```typescript
const SHobbyCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  
  /* シャドウ（iOS） */
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;
  
  /* シャドウ（Android） */
  elevation: 3;
`;
```

### ボタン

```typescript
// プライマリボタン
const SPrimaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.md}px ${theme.spacing.xl}px`};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
`;

// セカンダリボタン
const SSecondaryButton = styled.TouchableOpacity`
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.md}px ${theme.spacing.xl}px`};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
`;

// 評価ボタン
const SRatingButton = styled.TouchableOpacity<{ selected?: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ theme, selected }) => 
    selected ? theme.colors.primaryLight : theme.colors.backgroundAlt};
  border: 2px solid ${({ theme, selected }) => 
    selected ? theme.colors.primary : 'transparent'};
  align-items: center;
  justify-content: center;
`;
```

### タグ / バッジ

```typescript
const STag = styled.View`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  align-self: flex-start;
`;

const STagText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// ハードル表示タグ
const SHardleTag = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;
```

### 入力系

```typescript
const SInput = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SInputFocused = styled(SInput)`
  border-color: ${({ theme }) => theme.colors.primary};
`;
```

---

## 🖼️ レイアウトパターン

### 画面コンテナ

```typescript
const SScreenContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SContentContainer = styled.ScrollView`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const SCenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;
```

### ヘッダー

```typescript
const SHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SHeaderSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;
```

### カードグリッド

```typescript
const SCardGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -${({ theme }) => theme.spacing.sm}px;
`;

const SCardGridItem = styled.View`
  width: 50%;
  padding: ${({ theme }) => theme.spacing.sm}px;
`;
```

---

## 🌈 テーマ設定

### theme.ts

```typescript
export const theme = {
  colors: {
    primary: '#FF9F7A',
    primaryLight: '#FFD4C4',
    primaryDark: '#E8845A',
    
    background: '#FFF8F3',
    backgroundAlt: '#FFF0E6',
    surface: '#FFFFFF',
    
    textPrimary: '#4A3728',
    textSecondary: '#8B7355',
    textMuted: '#B8A089',
    
    success: '#7BC47F',
    warning: '#FFB84D',
    error: '#FF8A80',
    info: '#81D4FA',
    
    border: '#E8DED4',
    shadow: 'rgba(74, 55, 40, 0.08)',
    
    rating: {
      meh: '#D4C5B5',
      ok: '#FFD4A3',
      good: '#FF9F7A',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  typography: {
    fontFamily: {
      primary: '"Noto Sans JP", "Hiragino Sans", sans-serif',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
      display: 48,
    },
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  shadows: {
    sm: '0 2px 4px rgba(74, 55, 40, 0.06)',
    md: '0 4px 12px rgba(74, 55, 40, 0.08)',
    lg: '0 8px 24px rgba(74, 55, 40, 0.12)',
  },
};

export type Theme = typeof theme;
```

### ThemeProvider 設定

```typescript
// App.tsx
import { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* アプリのコンテンツ */}
    </ThemeProvider>
  );
}
```

### 型定義

```typescript
// styled.d.ts
import 'styled-components/native';
import { Theme } from './theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}
```

---

## ⚠️ 注意事項

### インラインスタイル禁止

```typescript
// ❌ 禁止
<View style={{ padding: 16, backgroundColor: '#FFF8F3' }}>
  <Text style={{ fontSize: 18, color: '#4A3728' }}>テキスト</Text>
</View>

// ✅ 正しい
<SContainer>
  <SText>テキスト</SText>
</SContainer>
```

### スタイルの一貫性

- 必ず `theme` から値を参照する
- マジックナンバーを避ける
- 色はすべてテーマで定義したものを使用

### アクセシビリティ

- タッチターゲットは最低 44x44px
- テキストのコントラスト比を確保
- フォーカス状態を明示的に

---

## 📱 画面別スタイルメモ

### スタート画面
- 中央揃えレイアウト
- 大きな絵文字（🌱）がメインビジュアル
- やさしいメッセージング

### 診断画面
- プログレスバー表示
- 大きめのタップ領域
- 選択状態を明確に

### 結果画面
- カードグリッド（2列）
- 各カードにハードル表示
- スワイプで詳細へ

### ログ画面
- リスト形式
- 評価ボタンが目立つ
- 空状態のデザインも考慮

---

*最終更新: 2026年2月*
