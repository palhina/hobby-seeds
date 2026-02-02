# テスト用モックデータ

このディレクトリには、テスト用のモックデータが含まれています。

## ファイル構成

### 1. `hobbies.ts`

**YuruHobby**のモックデータ（10件）

#### カバレッジ

- **エネルギーレベル**: low, medium, high をすべてカバー
- **indoor/outdoor**: true/false 両方をカバー
- **場所**: 家、外、どこでも をカバー
- **カテゴリ**: 眺める、作る、動く、聴く、学ぶ、整える をカバー

#### 使用例

```typescript
import { mockHobbies, mockHobbyById, mockHobbiesByEnergy } from "@/__mocks__/hobbies";

// すべてのモック趣味を取得
const hobbies = mockHobbies;

// IDで検索
const hobby = mockHobbyById(1); // 雲観察

// エネルギーレベルでフィルタ
const lowEnergyHobbies = mockHobbiesByEnergy("low");

// 屋内/屋外でフィルタ
const indoorHobbies = mockHobbiesByIndoor(true);
```

---

### 2. `stepup-hobbies.ts`

**StepUpHobby**のモックデータ（5件）

#### カバレッジ

- 様々なタグパターンをカバー
- matchTagsの組み合わせをテスト可能

#### 使用例

```typescript
import {
  mockStepUpHobbies,
  mockStepUpHobbyById,
  mockStepUpHobbiesByTag,
} from "@/__mocks__/stepup-hobbies";

// すべてのモックステップアップ趣味を取得
const stepUpHobbies = mockStepUpHobbies;

// IDで検索
const hobby = mockStepUpHobbyById(102); // ヨガ

// タグで検索
const healthHobbies = mockStepUpHobbiesByTag("健康");

// 複数タグで検索
const relaxHobbies = mockStepUpHobbiesByTags(["リラックス", "健康"]);
```

---

### 3. `expo-router.ts`

**expo-router**のモック実装

#### モック関数

- `useRouter`: ルーターフック
- `useLocalSearchParams`: 検索パラメータフック
- `usePathname`: パス名フック
- `useSegments`: セグメントフック
- `router`: ルーターオブジェクト

#### 使用例

```typescript
import {
  useRouter,
  useLocalSearchParams,
  mockRouter,
  resetMockRouter,
  setMockSearchParams,
} from "@/__mocks__/expo-router";

describe("MyComponent", () => {
  beforeEach(() => {
    // テストごとにモックをリセット
    resetMockRouter();
  });

  it("should navigate on button press", () => {
    const { getByText } = render(<MyComponent />);

    fireEvent.press(getByText("Next"));

    expect(mockRouter.push).toHaveBeenCalledWith("/next-screen");
  });

  it("should read search params", () => {
    // パラメータを設定
    setMockSearchParams({ id: "123" });

    const { getByText } = render(<MyComponent />);

    expect(getByText("ID: 123")).toBeTruthy();
  });
});
```

---

## テストでの利用パターン

### パターン1: データのフィルタリングロジックをテスト

```typescript
import { mockHobbies } from "@/__mocks__/hobbies";
import { filterHobbiesByEnergy } from "@/utils/filterHobby";

describe("filterHobbiesByEnergy", () => {
  it("should filter hobbies by low energy", () => {
    const result = filterHobbiesByEnergy(mockHobbies, "low");

    expect(result.every((h) => h.energy === "low")).toBe(true);
  });
});
```

### パターン2: コンポーネントのレンダリングをテスト

```typescript
import { mockHobbies } from "@/__mocks__/hobbies";
import { HobbyCard } from "@/components/HobbyCard";

describe("HobbyCard", () => {
  it("should render hobby information", () => {
    const hobby = mockHobbies[0];
    const { getByText } = render(<HobbyCard hobby={hobby} />);

    expect(getByText(hobby.name)).toBeTruthy();
    expect(getByText(hobby.emoji)).toBeTruthy();
  });
});
```

### パターン3: ルーティングロジックをテスト

```typescript
import { mockRouter, resetMockRouter } from "@/__mocks__/expo-router";
import { DiagnosisScreen } from "@/app/diagnosis";

describe("DiagnosisScreen", () => {
  beforeEach(() => {
    resetMockRouter();
  });

  it("should navigate to results after completion", () => {
    const { getByText } = render(<DiagnosisScreen />);

    fireEvent.press(getByText("完了"));

    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/results",
      })
    );
  });
});
```

---

## 注意事項

1. **型安全性**: すべてのモックデータは実際の型定義（`@/types`）に準拠しています
2. **データの一貫性**: 実際のデータ（`data/hobbies.json`）から抽出したデータを使用
3. **カバレッジ**: 各エネルギーレベル・場所・カテゴリを最低1件ずつカバー
4. **拡張性**: 必要に応じてモックデータを追加可能

---

## モックデータの追加方法

新しいテストケースで特定のパターンが必要な場合、以下のように追加できます：

```typescript
// hobbies.ts に追加
export const mockHighCostHobby: YuruHobby = {
  id: 999,
  name: "テスト用高額趣味",
  // ...
  cost: 10000,
};
```

---

_最終更新: 2026年2月2日_
