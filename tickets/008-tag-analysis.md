# チケット 008: タグ分析ロジック

## 概要

ユーザーのログから傾向を分析し、よく評価されているタグを抽出するユーティリティを実装する。
分析結果はステップアップ提案や、より適切な趣味提案に活用。

## ステータス: 🟢 完了

## 依存関係

- **依存するチケット**: 007（ログ機能）
- **このチケットに依存**: 009

## 作成ファイル

```
utils/
└── analyze-tags.ts       # タグ分析ユーティリティ
```

---

## TODO

### utils/analyze-tags.ts
- [x] analyzeUserTags 関数
  - [x] ログエントリーからタグを集計
  - [x] 評価ごとの重み付け（great: 3, good: 2, meh: 1）
  - [x] 上位N個のタグを抽出
- [x] getTagFrequency 関数
  - [x] タグの出現頻度をカウント
- [x] calculateTagScore 関数
  - [x] 重み付けスコアの計算

### hooks/use-hobby-log.ts の更新
- [x] ログ更新時に topTags を再計算
- [x] analyzeUserTags との連携

---

## 参考資料

- `types/log.ts` - HobbyLog, HobbyLogEntry
- `data/hobbies.json` - 趣味データ（タグ情報）

---

## 実装例

### utils/analyze-tags.ts

```typescript
import type { HobbyLogEntry, Rating, Tag } from '@/types';
import type { YuruHobby } from '@/types';

// 評価ごとの重み
const RATING_WEIGHTS: Record<Rating, number> = {
  great: 3,
  good: 2,
  meh: 1,
};

type TagScore = {
  tag: Tag;
  score: number;
  count: number;
};

/**
 * ログエントリーからタグの出現頻度と重み付けスコアを計算
 */
export function analyzeUserTags(
  entries: HobbyLogEntry[],
  hobbies: YuruHobby[],
  topN: number = 5
): Tag[] {
  // hobbyId -> hobby のマップを作成
  const hobbyMap = new Map(hobbies.map((h) => [h.id, h]));

  // タグごとのスコアを集計
  const tagScores: Map<Tag, TagScore> = new Map();

  for (const entry of entries) {
    const hobby = hobbyMap.get(entry.hobbyId);
    if (!hobby) continue;

    const weight = RATING_WEIGHTS[entry.rating];

    for (const tag of hobby.tags) {
      const existing = tagScores.get(tag) ?? { tag, score: 0, count: 0 };
      tagScores.set(tag, {
        tag,
        score: existing.score + weight,
        count: existing.count + 1,
      });
    }
  }

  // スコア順にソートして上位N個を返す
  const sorted = Array.from(tagScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return sorted.map((t) => t.tag);
}

/**
 * タグの出現頻度をカウント（重み付けなし）
 */
export function getTagFrequency(
  entries: HobbyLogEntry[],
  hobbies: YuruHobby[]
): Map<Tag, number> {
  const hobbyMap = new Map(hobbies.map((h) => [h.id, h]));
  const frequency: Map<Tag, number> = new Map();

  for (const entry of entries) {
    const hobby = hobbyMap.get(entry.hobbyId);
    if (!hobby) continue;

    for (const tag of hobby.tags) {
      frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
    }
  }

  return frequency;
}

/**
 * 特定のタグの重み付けスコアを計算
 */
export function calculateTagScore(
  tag: Tag,
  entries: HobbyLogEntry[],
  hobbies: YuruHobby[]
): number {
  const hobbyMap = new Map(hobbies.map((h) => [h.id, h]));
  let score = 0;

  for (const entry of entries) {
    const hobby = hobbyMap.get(entry.hobbyId);
    if (!hobby) continue;

    if (hobby.tags.includes(tag)) {
      score += RATING_WEIGHTS[entry.rating];
    }
  }

  return score;
}
```

---

## 使用例

```typescript
import { analyzeUserTags } from '@/utils/analyze-tags';
import hobbies from '@/data/hobbies.json';

// useHobbyLog内での使用
const updateTopTags = useCallback(async () => {
  const topTags = analyzeUserTags(log.entries, hobbies as YuruHobby[]);

  const updatedLog: HobbyLog = {
    ...log,
    topTags,
  };

  await setItem(updatedLog);
  setLog(updatedLog);
}, [log, setItem]);
```

---

## テストケース（将来実装時の参考）

```typescript
describe('analyzeUserTags', () => {
  const mockHobbies: YuruHobby[] = [
    { id: 1, tags: ['リラックス', '静か'], /* ... */ },
    { id: 2, tags: ['リラックス', '音楽'], /* ... */ },
    { id: 3, tags: ['運動', 'アクティブ'], /* ... */ },
  ];

  it('重み付けスコアでタグをソートする', () => {
    const entries: HobbyLogEntry[] = [
      { hobbyId: 1, rating: 'great', loggedAt: '...' }, // リラックス+3, 静か+3
      { hobbyId: 2, rating: 'good', loggedAt: '...' },  // リラックス+2, 音楽+2
      { hobbyId: 3, rating: 'meh', loggedAt: '...' },   // 運動+1, アクティブ+1
    ];

    const result = analyzeUserTags(entries, mockHobbies, 3);

    expect(result[0]).toBe('リラックス'); // スコア5
    expect(result[1]).toBe('静か');       // スコア3
    expect(result[2]).toBe('音楽');       // スコア2
  });
});
```

---

## 完了条件

- [x] analyzeUserTags 関数が正しく動作する
- [x] 重み付けスコアが正しく計算される
- [x] useHobbyLog と連携している
- [x] `npx tsc --noEmit` でエラーがないこと

---

*最終更新: 2026年2月1日*
