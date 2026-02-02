# チケット 010: アニメーション

## 概要

アプリ全体のUXを向上させるアニメーションを実装する。
React Native の Animated API または Reanimated を使用。

## ステータス: 🟢 完了

## 依存関係

- **依存するチケット**: 005（気分診断画面）, 006（趣味提案画面）
- **このチケットに依存**: なし

## 作成・更新ファイル

```
components/
└── ui/
    └── animations/
        ├── FadeIn.tsx            # フェードインアニメーション
        ├── SlideIn.tsx           # スライドインアニメーション
        ├── ScalePress.tsx        # プレス時のスケールアニメーション
        ├── ProgressAnimation.tsx # プログレスバーアニメーション
        └── CelebrationAnimation.tsx # 祝福アニメーション（😊3回達成時）
```

---

## TODO

### 基本アニメーション
- [x] FadeIn コンポーネント
  - [x] 画面表示時のフェードイン
  - [x] duration, delay プロパティ
- [x] SlideIn コンポーネント
  - [x] 下からスライドイン
  - [x] direction プロパティ（上/下/左/右）
- [x] ScalePress コンポーネント
  - [x] タップ時の縮小アニメーション
  - [x] ハプティックフィードバック連携

### 画面別アニメーション
- [x] 診断画面
  - [x] 質問の切り替えアニメーション
  - [x] プログレスバーのアニメーション
  - [x] 選択肢のフィードバック
- [x] 結果画面
  - [x] カードの順次表示（staggered animation）
  - [x] カードのタップフィードバック
- [x] ログ画面
  - [x] リストアイテムのフェードイン
- [x] ステップアップ画面
  - [x] 解放時の祝福アニメーション

### 祝福アニメーション（CelebrationAnimation）
- [x] 紙吹雪エフェクト（オプション）
- [x] 🎉 絵文字のバウンス
- [x] 背景のキラキラ（オプション）

---

## 参考資料

- React Native Animated API
- React Native Reanimated（オプション）
- CLAUDE.md - UIガイドライン

---

## 実装例

### FadeIn.tsx

```typescript
import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

type FadeInProps = ViewProps & {
  duration?: number;
  delay?: number;
  children: React.ReactNode;
};

export function FadeIn({
  duration = 300,
  delay = 0,
  children,
  style,
  ...props
}: FadeInProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, duration, delay]);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, style]} {...props}>
      {children}
    </Animated.View>
  );
}
```

### ScalePress.tsx

```typescript
import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

type ScalePressProps = PressableProps & {
  scaleValue?: number;
  children: React.ReactNode;
};

export function ScalePress({
  scaleValue = 0.95,
  children,
  onPress,
  style,
  ...props
}: ScalePressProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (event: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(event);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
```

### ProgressAnimation.tsx

```typescript
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

type ProgressAnimationProps = {
  progress: number; // 0-1
  duration?: number;
};

const SProgressContainer = styled.View`
  height: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  overflow: hidden;
`;

const SProgressBar = styled(Animated.View)`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

export function ProgressAnimation({
  progress,
  duration = 300,
}: ProgressAnimationProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration,
      useNativeDriver: false, // width変更はnativeDriverで非対応
    }).start();
  }, [progress, duration, widthAnim]);

  return (
    <SProgressContainer>
      <SProgressBar
        style={{
          width: widthAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </SProgressContainer>
  );
}
```

### Staggered Animation（結果画面用）

```typescript
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type StaggeredListProps = {
  children: React.ReactNode[];
  staggerDelay?: number;
  duration?: number;
};

export function StaggeredList({
  children,
  staggerDelay = 100,
  duration = 300,
}: StaggeredListProps) {
  const animations = useRef(
    children.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const staggeredAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration,
        delay: index * staggerDelay,
        useNativeDriver: true,
      })
    );

    Animated.parallel(staggeredAnimations).start();
  }, [animations, duration, staggerDelay]);

  return (
    <>
      {React.Children.map(children, (child, index) => (
        <Animated.View
          style={{
            opacity: animations[index],
            transform: [
              {
                translateY: animations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          {child}
        </Animated.View>
      ))}
    </>
  );
}
```

---

## 使用例

```typescript
// 診断画面での使用
import { FadeIn } from '@/components/ui/animations/FadeIn';
import { ScalePress } from '@/components/ui/animations/ScalePress';

function DiagnosisQuestion() {
  return (
    <FadeIn>
      <SQuestionText>今のエネルギーレベルは？</SQuestionText>

      {options.map((option, index) => (
        <FadeIn key={option.value} delay={index * 100}>
          <ScalePress onPress={() => handleSelect(option.value)}>
            <SDiagnosisCard>
              <SEmoji>{option.emoji}</SEmoji>
              <SLabel>{option.label}</SLabel>
            </SDiagnosisCard>
          </ScalePress>
        </FadeIn>
      ))}
    </FadeIn>
  );
}
```

---

## 完了条件

- [x] FadeIn, SlideIn, ScalePress が実装されている
- [x] ProgressAnimation が診断画面で動作する
- [x] カードのタップアニメーションが動作する
- [x] ハプティックフィードバックが連携している
- [x] パフォーマンスに問題がない（useNativeDriver使用）
- [x] `npx tsc --noEmit` でエラーがないこと

---

*最終更新: 2026年2月1日*
