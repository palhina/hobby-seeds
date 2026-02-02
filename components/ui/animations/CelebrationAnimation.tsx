import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

type CelebrationAnimationProps = {
  visible: boolean;
  duration?: number;
  onComplete?: () => void;
};

const SCelebrationContainer = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

const SCelebrationEmoji = styled(Animated.Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.display * 1.5}px;
`;

export function CelebrationAnimation({
  visible,
  duration = 1000,
  onComplete,
}: CelebrationAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: duration * 0.8,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: duration * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: duration * 0.3,
            delay: duration * 0.5,
            useNativeDriver: true,
          }),
        ]),
      ]).start(({ finished }) => {
        if (finished && onComplete) {
          onComplete();
        }
      });
    }
  }, [visible, duration, scaleAnim, rotateAnim, opacityAnim, onComplete]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) {
    return null;
  }

  return (
    <SCelebrationContainer style={{ opacity: opacityAnim }} pointerEvents="none">
      <SCelebrationEmoji
        style={{
          transform: [{ scale: scaleAnim }, { rotate }],
        }}
      >
        🎉
      </SCelebrationEmoji>
    </SCelebrationContainer>
  );
}
