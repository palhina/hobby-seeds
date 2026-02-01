# テスト規約 - hobby-seeds

## 🎯 テスト方針

### 基本原則

1. **ロジックの正確性を検証する**（表示確認だけに終始しない）
2. **ユーザー視点でテストを書く**（実装詳細に依存しない）
3. **重要なビジネスロジックを優先的にカバー**

### カバレッジ目標

| 対象 | 目標 | 優先度 |
|------|------|--------|
| utils（ロジック） | 80%以上 | 最優先 |
| hooks | 70%以上 | 高 |
| コンポーネント | 70%以上 | 中 |
| 全体 | 70-80% | - |

---

## 🛠️ 技術スタック

```
テストランナー:     Jest
コンポーネント:     @testing-library/react-native
モック:            jest.mock / jest.fn
AsyncStorage:      @react-native-async-storage/async-storage/jest/async-storage-mock
```

### セットアップ

```typescript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nern_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/**/index.ts',
  ],
};

// jest.setup.js
import '@testing-library/jest-native/extend-expect';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
```

---

## 📁 ディレクトリ構成

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
├── components/
│   ├── features/
│   │   ├── HobbyCard.tsx
│   │   └── __tests__/
│   │       └── HobbyCard.test.tsx
```

### 命名規則

| 対象 | ファイル名 |
|------|-----------|
| ユニットテスト | `{対象ファイル名}.test.ts` |
| コンポーネント | `{Component}.test.tsx` |
| 統合テスト | `{Feature}.integration.test.tsx` |

---

## ✅ テストの書き方

### 1. ユニットテスト（utils）

**重要ロジックを優先的にテスト**

```typescript
// src/utils/__tests__/filterHobby.test.ts
import { filterHobbies } from '../filterHobby';
import { mockYuruHobbies } from '@/__mocks__/hobbies';
import type { DiagnosisAnswer } from '@/types';

describe('filterHobbies', () => {
  describe('エネルギーレベルによるフィルタリング', () => {
    it('low の場合、low エネルギーの趣味のみ返す', () => {
      const answers: DiagnosisAnswer = {
        energy: 'low',
        goOut: false,
        activityType: 'passive',
      };

      const result = filterHobbies(mockYuruHobbies, answers);

      // ✅ 全ての結果が条件を満たすことを検証
      expect(result.every(hobby => hobby.energy === 'low')).toBe(true);
    });

    it('high の場合、全エネルギーレベルの趣味を返す', () => {
      const answers: DiagnosisAnswer = {
        energy: 'high',
        goOut: true,
        activityType: 'active',
      };

      const result = filterHobbies(mockYuruHobbies, answers);

      // ✅ high なら制限なし
      const energyLevels = new Set(result.map(h => h.energy));
      expect(energyLevels.size).toBeGreaterThan(1);
    });
  });

  describe('外出意欲によるフィルタリング', () => {
    it('goOut: false の場合、indoor: true の趣味のみ返す', () => {
      const answers: DiagnosisAnswer = {
        energy: 'medium',
        goOut: false,
        activityType: 'passive',
      };

      const result = filterHobbies(mockYuruHobbies, answers);

      expect(result.every(hobby => hobby.indoor === true)).toBe(true);
    });
  });

  describe('結果の件数制限', () => {
    it('最大4件まで返す', () => {
      const answers: DiagnosisAnswer = {
        energy: 'high',
        goOut: true,
        activityType: 'active',
      };

      const result = filterHobbies(mockYuruHobbies, answers);

      expect(result.length).toBeLessThanOrEqual(4);
    });

    it('条件に合う趣味がない場合、空配列を返す', () => {
      const impossibleAnswers: DiagnosisAnswer = {
        energy: 'low',
        goOut: true,
        activityType: 'active',
      };
      const noMatchHobbies = mockYuruHobbies.filter(h => h.energy === 'high');

      const result = filterHobbies(noMatchHobbies, impossibleAnswers);

      expect(result).toEqual([]);
    });
  });
});
```

### 2. タグ分析ロジックのテスト

```typescript
// src/utils/__tests__/analyzeTag.test.ts
import { analyzeTopTags, shouldUnlockStepUp } from '../analyzeTag';
import type { HobbyLogEntry } from '@/types';

describe('analyzeTopTags', () => {
  it('評価された趣味のタグから上位3つを抽出する', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01' }, // tags: ['自然', 'リラックス', '観察']
      { hobbyId: 2, rating: 'great', loggedAt: '2026-02-01' }, // tags: ['クリエイティブ', 'アート', '手作業']
      { hobbyId: 3, rating: 'good', loggedAt: '2026-02-01' },  // tags: ['フィジカル', 'リラックス', '健康']
    ];
    const hobbies = mockYuruHobbies;

    const result = analyzeTopTags(entries, hobbies);

    // ✅ リラックスが2回出現するので上位に
    expect(result).toContain('リラックス');
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('great 評価のタグを優先的にカウントする', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01' },
      { hobbyId: 2, rating: 'meh', loggedAt: '2026-02-01' },
    ];

    const result = analyzeTopTags(entries, mockYuruHobbies);

    // ✅ meh 評価のタグは含まれないか、優先度が低い
    const hobby1Tags = mockYuruHobbies.find(h => h.id === 1)?.tags ?? [];
    expect(result.some(tag => hobby1Tags.includes(tag))).toBe(true);
  });

  it('ログが空の場合、空配列を返す', () => {
    const result = analyzeTopTags([], mockYuruHobbies);

    expect(result).toEqual([]);
  });
});

describe('shouldUnlockStepUp', () => {
  it('great が3つ以上でステップアップを解放する', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01' },
      { hobbyId: 2, rating: 'great', loggedAt: '2026-02-02' },
      { hobbyId: 3, rating: 'great', loggedAt: '2026-02-03' },
    ];

    expect(shouldUnlockStepUp(entries)).toBe(true);
  });

  it('great が2つ以下では解放しない', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01' },
      { hobbyId: 2, rating: 'great', loggedAt: '2026-02-02' },
      { hobbyId: 3, rating: 'good', loggedAt: '2026-02-03' },
    ];

    expect(shouldUnlockStepUp(entries)).toBe(false);
  });

  it('同じ趣味の great は1回としてカウントする', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-01' },
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-02' }, // 同じ趣味
      { hobbyId: 1, rating: 'great', loggedAt: '2026-02-03' }, // 同じ趣味
    ];

    // ✅ 同じ趣味を何度 great にしても1回
    expect(shouldUnlockStepUp(entries)).toBe(false);
  });
});
```

### 3. カスタムフックのテスト

```typescript
// src/hooks/__tests__/useHobbyLog.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHobbyLog } from '../useHobbyLog';
import { STORAGE_KEYS } from '@/constants/storageKeys';

describe('useHobbyLog', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('addEntry', () => {
    it('新しいログエントリを追加できる', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await act(async () => {
        await result.current.addEntry(1, 'great');
      });

      await waitFor(() => {
        expect(result.current.entries).toHaveLength(1);
        expect(result.current.entries[0]).toMatchObject({
          hobbyId: 1,
          rating: 'great',
        });
      });
    });

    it('追加したエントリがAsyncStorageに保存される', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await act(async () => {
        await result.current.addEntry(1, 'good');
      });

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HOBBY_LOG);
      const parsed = JSON.parse(stored!);

      expect(parsed.entries).toHaveLength(1);
    });
  });

  describe('greatCount', () => {
    it('great 評価の数を正しくカウントする', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await act(async () => {
        await result.current.addEntry(1, 'great');
        await result.current.addEntry(2, 'good');
        await result.current.addEntry(3, 'great');
      });

      await waitFor(() => {
        expect(result.current.greatCount).toBe(2);
      });
    });
  });

  describe('初期化', () => {
    it('AsyncStorageから既存データを読み込む', async () => {
      // 事前にデータを保存
      const existingData = {
        entries: [{ hobbyId: 1, rating: 'great', loggedAt: '2026-02-01' }],
        greatCount: 1,
        topTags: ['自然'],
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOBBY_LOG,
        JSON.stringify(existingData)
      );

      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.entries).toHaveLength(1);
        expect(result.current.greatCount).toBe(1);
      });
    });

    it('データがない場合、空の状態で初期化する', async () => {
      const { result } = renderHook(() => useHobbyLog());

      await waitFor(() => {
        expect(result.current.entries).toEqual([]);
        expect(result.current.greatCount).toBe(0);
      });
    });
  });
});
```

### 4. コンポーネントのテスト

**表示だけでなく、インタラクションと状態変化をテスト**

```typescript
// src/components/features/__tests__/RatingButton.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RatingButton } from '../RatingButton';

describe('RatingButton', () => {
  const mockOnRate = jest.fn();

  beforeEach(() => {
    mockOnRate.mockClear();
  });

  it('3つの評価ボタンが表示される', () => {
    const { getByText } = render(
      <RatingButton onRate={mockOnRate} />
    );

    expect(getByText('😐')).toBeTruthy();
    expect(getByText('🙂')).toBeTruthy();
    expect(getByText('😊')).toBeTruthy();
  });

  it('ボタン押下で対応する rating を返す', () => {
    const { getByText } = render(
      <RatingButton onRate={mockOnRate} />
    );

    fireEvent.press(getByText('😊'));

    expect(mockOnRate).toHaveBeenCalledWith('great');
  });

  it('選択済みのボタンは視覚的にハイライトされる', () => {
    const { getByTestId } = render(
      <RatingButton onRate={mockOnRate} selectedRating="good" />
    );

    const goodButton = getByTestId('rating-button-good');

    // ✅ スタイルではなく、アクセシビリティ属性でテスト
    expect(goodButton).toHaveAccessibilityState({ selected: true });
  });
});
```

```typescript
// src/components/features/__tests__/HobbyCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HobbyCard } from '../HobbyCard';
import type { YuruHobby } from '@/types';

describe('HobbyCard', () => {
  const mockHobby: YuruHobby = {
    id: 1,
    name: '雲観察',
    emoji: '☁️',
    category: '眺める',
    time: 5,
    cost: 0,
    location: 'どこでも',
    energy: 'low',
    indoor: false,
    tryStep: '窓の外か空を見上げて、3つ雲を見つけて形を想像するだけ',
    tags: ['自然', 'リラックス', '観察'],
  };

  it('趣味の基本情報が表示される', () => {
    const { getByText } = render(
      <HobbyCard hobby={mockHobby} onPress={jest.fn()} />
    );

    expect(getByText(/雲観察/)).toBeTruthy();
    expect(getByText(/☁️/)).toBeTruthy();
    expect(getByText(/5分/)).toBeTruthy();
    expect(getByText(/0円/)).toBeTruthy();
  });

  it('カード押下でonPressが趣味IDと共に呼ばれる', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <HobbyCard hobby={mockHobby} onPress={mockOnPress} />
    );

    fireEvent.press(getByText(/雲観察/));

    expect(mockOnPress).toHaveBeenCalledWith(1);
  });

  it('tryStepが表示される', () => {
    const { getByText } = render(
      <HobbyCard hobby={mockHobby} onPress={jest.fn()} showTryStep />
    );

    expect(getByText(/窓の外か空を見上げて/)).toBeTruthy();
  });
});
```

### 5. 統合テスト

```typescript
// src/__tests__/diagnosis.integration.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuestionsScreen } from '@/app/questions';
import { ResultsScreen } from '@/app/results';

// 統合テスト用のラッパー
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('診断フロー統合テスト', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('診断回答に基づいて適切な趣味が提案される', async () => {
    // 1. 診断画面で回答
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <QuestionsScreen />
      </TestWrapper>
    );

    // エネルギー: low
    fireEvent.press(getByText('ぐったり'));
    
    // 外出: 家にいたい
    fireEvent.press(getByText('家にいたい'));
    
    // 活動タイプ: 眺める・聴く
    fireEvent.press(getByText('眺めたい・聴きたい'));

    // 2. 結果画面に遷移（モックまたは実際のナビゲーション）
    // 提案された趣味が条件を満たすことを確認
    await waitFor(() => {
      const results = getByTestId('hobby-results');
      // 全ての提案が indoor かつ low energy であることを検証
      // （実装に応じてアサーション調整）
    });
  });
});

describe('ログ記録フロー統合テスト', () => {
  it('趣味を評価するとログに保存され、greatCount が更新される', async () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <ResultsScreen />
      </TestWrapper>
    );

    // 😊 を3回タップ
    fireEvent.press(getByTestId('rating-great-hobby-1'));
    fireEvent.press(getByTestId('rating-great-hobby-2'));
    fireEvent.press(getByTestId('rating-great-hobby-3'));

    // AsyncStorage に保存されていることを確認
    await waitFor(async () => {
      const stored = await AsyncStorage.getItem('@hobby-seeds/hobby-log');
      const parsed = JSON.parse(stored!);
      
      expect(parsed.greatCount).toBe(3);
    });

    // ステップアップが解放されていることを確認
    await waitFor(() => {
      expect(getByText(/ステップアップ/)).toBeTruthy();
    });
  });
});
```

---

## 🎭 モック

### AsyncStorage

```typescript
// 自動的にモック化される（jest.setup.js で設定済み）
import AsyncStorage from '@react-native-async-storage/async-storage';

beforeEach(async () => {
  await AsyncStorage.clear();
});
```

### 趣味データ

```typescript
// src/__mocks__/hobbies.ts
import type { YuruHobby, StepUpHobby } from '@/types';

export const mockYuruHobbies: YuruHobby[] = [
  {
    id: 1,
    name: '雲観察',
    emoji: '☁️',
    category: '眺める',
    time: 5,
    cost: 0,
    location: 'どこでも',
    energy: 'low',
    indoor: false,
    tryStep: '窓の外か空を見上げて、3つ雲を見つけて形を想像するだけ',
    tags: ['自然', 'リラックス', '観察'],
  },
  {
    id: 2,
    name: '落書き',
    emoji: '✏️',
    category: '作る',
    time: 5,
    cost: 0,
    location: '家',
    energy: 'low',
    indoor: true,
    tryStep: '紙とペンで、目の前にあるものを30秒で描いてみる',
    tags: ['クリエイティブ', 'アート', '手作業'],
  },
  // ... 必要に応じて追加
];

export const mockStepUpHobbies: StepUpHobby[] = [
  {
    id: 101,
    name: 'デジタルイラスト',
    emoji: '🎨',
    tags: [],
    matchTags: ['クリエイティブ', 'アート'],
    description: 'タブレットやPCで絵を描く趣味。無料アプリも充実',
    startCost: '0円〜',
    startGuide: 'まずは無料アプリ「ibisPaint」から',
    timeCommit: '週2〜3時間',
    nextSteps: ['ibisPaintをダウンロード', 'YouTubeで検索', '好きな絵師をフォロー'],
  },
];
```

### Expo Router

```typescript
// src/__mocks__/expo-router.ts
export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
});

export const useLocalSearchParams = () => ({});
```

---

## 🚫 アンチパターン

### ❌ 表示確認だけのテスト

```typescript
// ❌ 意味のないテスト
it('renders correctly', () => {
  const { getByText } = render(<HobbyCard hobby={mockHobby} />);
  expect(getByText('雲観察')).toBeTruthy();
});

// ✅ 振る舞いをテスト
it('カード押下でonPressが呼ばれる', () => {
  const mockOnPress = jest.fn();
  const { getByText } = render(
    <HobbyCard hobby={mockHobby} onPress={mockOnPress} />
  );
  
  fireEvent.press(getByText('雲観察'));
  
  expect(mockOnPress).toHaveBeenCalledWith(mockHobby.id);
});
```

### ❌ 実装詳細に依存するテスト

```typescript
// ❌ 内部状態を直接テスト
expect(component.state.isLoading).toBe(false);

// ✅ ユーザーに見える振る舞いをテスト
expect(queryByTestId('loading-spinner')).toBeNull();
expect(getByText('趣味を見つけました')).toBeTruthy();
```

### ❌ スナップショットテストの乱用

```typescript
// ❌ 意図が不明確
it('matches snapshot', () => {
  const tree = render(<HobbyCard hobby={mockHobby} />);
  expect(tree).toMatchSnapshot();
});

// ✅ 重要なUIの構造のみスナップショット（必要な場合のみ）
it('複雑なレイアウトの構造が維持される', () => {
  const tree = render(<ComplexDashboard data={mockData} />);
  expect(tree).toMatchSnapshot();
});
```

---

## ✅ テスト作成チェックリスト

### ユニットテスト（utils）

- [ ] 正常系：期待する入力で期待する出力
- [ ] 境界値：最小値、最大値、空配列
- [ ] 異常系：不正な入力、null/undefined
- [ ] エッジケース：同じIDの重複、条件に合うものがない

### フックテスト

- [ ] 初期状態
- [ ] 状態更新後の値
- [ ] AsyncStorage との連携
- [ ] エラー時の挙動

### コンポーネントテスト

- [ ] 必要な情報が表示される
- [ ] ユーザー操作で適切なコールバックが呼ばれる
- [ ] 条件による表示/非表示
- [ ] アクセシビリティ属性

### 統合テスト

- [ ] 画面をまたぐフローが正しく動作
- [ ] データの永続化と読み込み
- [ ] 状態の伝播

---

## 📊 カバレッジレポート

```bash
# カバレッジ付きでテスト実行
npm test -- --coverage

# 特定ファイルのみ
npm test -- --coverage --collectCoverageFrom='src/utils/**/*.ts'
```

### カバレッジ確認のポイント

| 指標 | 意味 | 目安 |
|------|------|------|
| Statements | 文の実行率 | 70%以上 |
| Branches | 分岐の網羅率 | 70%以上 |
| Functions | 関数の実行率 | 80%以上 |
| Lines | 行の実行率 | 70%以上 |

**Branches が低い場合**: if文やswitch文の全パターンをテストしていない可能性
