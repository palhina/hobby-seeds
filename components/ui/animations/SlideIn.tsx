import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type Direction = 'up' | 'down' | 'left' | 'right';

type SlideInProps = {
  children: React.ReactNode;
  direction?: Direction;
  duration?: number;
  delay?: number;
  distance?: number;
  style?: ViewStyle;
};

export function SlideIn({
  children,
  direction = 'up',
  duration = 300,
  delay = 0,
  distance = 50,
  style,
}: SlideInProps) {
  const slideAnim = useRef(new Animated.Value(distance)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim, duration, delay]);

  const getTransform = (): { translateX: Animated.Value | Animated.AnimatedInterpolation<number> } | { translateY: Animated.Value | Animated.AnimatedInterpolation<number> } => {
    switch (direction) {
      case 'up':
        return { translateY: slideAnim };
      case 'down':
        return {
          translateY: slideAnim.interpolate({
            inputRange: [0, distance],
            outputRange: [0, -distance],
          }),
        };
      case 'left':
        return { translateX: slideAnim };
      case 'right':
        return {
          translateX: slideAnim.interpolate({
            inputRange: [0, distance],
            outputRange: [0, -distance],
          }),
        };
    }
  };

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [getTransform()],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
