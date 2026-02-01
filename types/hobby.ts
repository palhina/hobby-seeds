/**
 * 趣味関連の型定義
 *
 * このファイルには趣味データに関する型を定義します。
 */

import type { EnergyLevel, Location, Category, Tag } from './common';

// ==========================================
// ベース型
// ==========================================

/**
 * 趣味の基本プロパティ
 * YuruHobby と StepUpHobby の共通部分
 */
export type HobbyBase = {
  id: number;
  name: string;
  emoji: string;
  tags: Tag[];
};

// ==========================================
// ゆる趣味
// ==========================================

/**
 * ゆる趣味（超低ハードルの趣味）
 * 気軽に試せる、小さな趣味のアイデア
 */
export type YuruHobby = HobbyBase & {
  category: Category;
  time: number;
  cost: number;
  location: Location;
  energy: EnergyLevel;
  indoor: boolean;
  tryStep: string;
};

// ==========================================
// ステップアップ趣味
// ==========================================

/**
 * ステップアップ趣味（本格的な趣味）
 * ゆる趣味を続けた人向けの、より深い趣味の提案
 */
export type StepUpHobby = HobbyBase & {
  matchTags: Tag[];
  description: string;
  startCost: string;
  startGuide: string;
  timeCommit: string;
  nextSteps: string[];
};
