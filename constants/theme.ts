/**
 * テーマ設定
 *
 * このファイルはアプリ全体のデザイントークンを定義します。
 * カラーパレット、スペーシング、タイポグラフィ、ボーダー半径、シャドウなど。
 *
 * 全てのstyled-componentsは必ずこのthemeから値を参照してください。
 */

import { Platform } from 'react-native';

// React Navigation用のレガシーカラー定義（後方互換性のため）
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const theme = {
  // カラーパレット
  colors: {
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

    // 評価カラー
    rating: {
      meh: '#D4C5B5',      // 😐 グレーベージュ
      ok: '#FFD4A3',       // 🙂 やさしいオレンジ
      good: '#FF9F7A',     // 😊 コーラルオレンジ
    },
  },

  // スペーシング
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // タイポグラフィ
  typography: {
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

  // ボーダー半径
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // シャドウ
  shadows: {
    sm: '0 2px 4px rgba(74, 55, 40, 0.06)',
    md: '0 4px 12px rgba(74, 55, 40, 0.08)',
    lg: '0 8px 24px rgba(74, 55, 40, 0.12)',
  },
} as const;

// Theme型をエクスポート（styled-componentsの型定義で使用）
export type Theme = typeof theme;
