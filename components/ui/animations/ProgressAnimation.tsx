import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

type ProgressAnimationProps = {
  progress: number;
  height?: number;
  animated?: boolean;
  duration?: number;
  style?: ViewStyle;
};

const SProgressContainer = styled.View<{ height: number }>`
  width: 100%;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  overflow: hidden;
`;

const SProgressBarAnimated = styled(Animated.View)<{ height: number }>`
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

const SProgressBar = styled.View<{ height: number }>`
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

export function ProgressAnimation({
  progress,
  height = 8,
  animated = true,
  duration = 300,
  style,
}: ProgressAnimationProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: clampedProgress,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [clampedProgress, animated, duration, widthAnim]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SProgressContainer height={height} style={style}>
      {animated ? (
        <SProgressBarAnimated
          height={height}
          style={{ width: animatedWidth }}
        />
      ) : (
        <SProgressBar
          height={height}
          style={{ width: `${clampedProgress * 100}%` }}
        />
      )}
    </SProgressContainer>
  );
}
