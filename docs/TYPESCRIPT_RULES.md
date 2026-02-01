# TypeScript コーディング規約

## 📁 型定義の管理

### ディレクトリ構成

```
src/types/
├── index.ts          # 全型のre-export
├── hobby.ts          # 趣味関連の型
├── diagnosis.ts      # 診断関連の型
├── log.ts            # ログ関連の型
└── common.ts         # 共通ユーティリティ型
```

### 型定義の原則

#### 1. 新規型作成前に必ず既存型を確認

```typescript
// ❌ いきなり新しい型を作らない
type NewHobbyType = {
  id: number;
  name: string;
  // ...
};

// ✅ まず src/types/ を確認し、既存型を活用
import { YuruHobby } from '@/types';
type HobbyWithRating = YuruHobby & { rating: Rating };
```

#### 2. Omit / Pick / Partial を積極活用

```typescript
// ベース型
type HobbyBase = {
  id: number;
  name: string;
  emoji: string;
  tags: Tag[];
};

// ✅ 派生型は Omit/Pick/Partial で作成
type YuruHobby = HobbyBase & {
  category: Category;
  time: number;
  cost: number;
  location: Location;
  energy: EnergyLevel;
  indoor: boolean;
  tryStep: string;
};

type StepUpHobby = HobbyBase & {
  matchTags: Tag[];
  description: string;
  startCost: string;
  startGuide: string;
  timeCommit: string;
  nextSteps: string[];
};

// ✅ 部分的に必要な場合
type HobbyCardProps = Pick<YuruHobby, 'name' | 'emoji' | 'time' | 'cost'>;

// ✅ オプショナルにしたい場合
type HobbyFilter = Partial<Pick<YuruHobby, 'category' | 'energy' | 'indoor'>>;
```

#### 3. リテラル型とユニオン型の活用

```typescript
// ✅ 文字列リテラルで型安全に
type EnergyLevel = 'low' | 'medium' | 'high';
type Location = '家' | '外' | 'どこでも';
type Category = '眺める' | '作る' | '動く' | '聴く' | '学ぶ' | '整える' | '遊ぶ';
type Rating = 'meh' | 'good' | 'great';  // 😐 🙂 😊

// ✅ 定数から型を生成
const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;
type EnergyLevel = typeof ENERGY_LEVELS[number];
```

---

## 📝 命名規則

### 型・インターフェース

| 種類 | 規則 | 例 |
|------|------|-----|
| 型エイリアス | PascalCase | `YuruHobby`, `DiagnosisAnswer` |
| ユニオン型 | PascalCase | `EnergyLevel`, `Rating` |
| Props型 | `{Component}Props` | `HobbyCardProps`, `RatingButtonProps` |
| State型 | `{Feature}State` | `DiagnosisState`, `LogState` |
| 配列型 | 複数形 or `{Type}List` | `YuruHobby[]`, `HobbyLogList` |

### 変数・関数

| 種類 | 規則 | 例 |
|------|------|-----|
| 変数 | camelCase | `selectedHobby`, `userAnswers` |
| 関数 | camelCase + 動詞始まり | `filterHobbies`, `calculateTags` |
| 定数 | SCREAMING_SNAKE_CASE | `STORAGE_KEYS`, `MAX_SUGGESTIONS` |
| Boolean | is/has/can 接頭辞 | `isLoading`, `hasLiked`, `canProceed` |
| ハンドラ | handle 接頭辞 | `handlePress`, `handleSubmit` |
| カスタムフック | use 接頭辞 | `useHobbyLog`, `useDiagnosis` |

### ファイル名

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `HobbyCard.tsx`, `RatingButton.tsx` |
| フック | camelCase | `useHobbyLog.ts`, `useAsyncStorage.ts` |
| 型定義 | camelCase | `hobby.ts`, `diagnosis.ts` |
| ユーティリティ | camelCase | `analyzeTag.ts`, `filterHobby.ts` |
| 定数 | camelCase | `storageKeys.ts`, `hobbyData.ts` |

---

## 🚫 禁止パターン

### any の使用禁止

```typescript
// ❌ 禁止
const data: any = await fetchData();
function process(input: any): any { }

// ✅ unknown を使用し、型ガードで絞り込む
const data: unknown = await fetchData();
if (isHobbyLog(data)) {
  // data は HobbyLog 型として扱える
}

// ✅ ジェネリクスを使用
function process<T>(input: T): T { }
```

### 型アサーションの乱用禁止

```typescript
// ❌ 根拠のない型アサーション
const hobby = data as YuruHobby;

// ✅ 型ガード関数を作成
function isYuruHobby(data: unknown): data is YuruHobby {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'category' in data &&
    'tryStep' in data
  );
}

if (isYuruHobby(data)) {
  // data は YuruHobby 型
}
```

### Non-null assertion (!) の乱用禁止

```typescript
// ❌ 危険
const name = user!.name;

// ✅ オプショナルチェーンとデフォルト値
const name = user?.name ?? 'ゲスト';

// ✅ 早期リターン
if (!user) return null;
const name = user.name;
```

### interface より type を優先

```typescript
// ❌ このプロジェクトでは interface は使わない
interface HobbyProps {
  hobby: YuruHobby;
}

// ✅ type を使用（Omit/Pick との相性が良い）
type HobbyProps = {
  hobby: YuruHobby;
};
```

---

## 📦 型のエクスポート

### index.ts での一括エクスポート

```typescript
// src/types/index.ts
export type { HobbyBase, YuruHobby, StepUpHobby } from './hobby';
export type { DiagnosisAnswer, DiagnosisResult } from './diagnosis';
export type { HobbyLog, HobbyLogEntry } from './log';
export type { EnergyLevel, Location, Category, Rating, Tag } from './common';
```

### インポート時は @/types から

```typescript
// ✅ エイリアスパスから一括インポート
import type { YuruHobby, Rating, HobbyLog } from '@/types';

// ❌ 個別ファイルから直接インポートしない
import type { YuruHobby } from '@/types/hobby';
```

---

## 🔧 ジェネリクスの活用

### AsyncStorage のラッパー

```typescript
// 型安全な AsyncStorage 操作
async function getStorageItem<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value) as T;
}

async function setStorageItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// 使用例
const logs = await getStorageItem<HobbyLog[]>(STORAGE_KEYS.HOBBY_LOG);
```

### コンポーネントのジェネリクス

```typescript
// 汎用的なリストコンポーネント
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
};

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <>
      {items.map((item) => (
        <View key={keyExtractor(item)}>{renderItem(item)}</View>
      ))}
    </>
  );
}
```

---

## ✅ 型定義の完全な例

```typescript
// src/types/common.ts
export const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;
export type EnergyLevel = typeof ENERGY_LEVELS[number];

export const LOCATIONS = ['家', '外', 'どこでも'] as const;
export type Location = typeof LOCATIONS[number];

export const CATEGORIES = ['眺める', '作る', '動く', '聴く', '学ぶ', '整える', '遊ぶ'] as const;
export type Category = typeof CATEGORIES[number];

export const RATINGS = ['meh', 'good', 'great'] as const;
export type Rating = typeof RATINGS[number];

export type Tag = string;  // タグは動的なので string

// src/types/hobby.ts
import type { EnergyLevel, Location, Category, Tag } from './common';

export type HobbyBase = {
  id: number;
  name: string;
  emoji: string;
  tags: Tag[];
};

export type YuruHobby = HobbyBase & {
  category: Category;
  time: number;
  cost: number;
  location: Location;
  energy: EnergyLevel;
  indoor: boolean;
  tryStep: string;
};

export type StepUpHobby = HobbyBase & {
  matchTags: Tag[];
  description: string;
  startCost: string;
  startGuide: string;
  timeCommit: string;
  nextSteps: string[];
};

// src/types/log.ts
import type { Rating, Tag } from './common';

export type HobbyLogEntry = {
  hobbyId: number;
  rating: Rating;
  loggedAt: string;  // ISO 8601 形式
};

export type HobbyLog = {
  entries: HobbyLogEntry[];
  greatCount: number;  // 😊 の数（ステップアップ解放判定用）
  topTags: Tag[];      // 傾向分析結果
};

// src/types/diagnosis.ts
import type { EnergyLevel } from './common';

export type DiagnosisAnswer = {
  energy: EnergyLevel;
  goOut: boolean;
  activityType: 'passive' | 'active';  // 眺める・聴く / 作る・動く
};

export type DiagnosisResult = {
  answers: DiagnosisAnswer;
  suggestedHobbies: number[];  // hobbyId の配列
  createdAt: string;
};
```
