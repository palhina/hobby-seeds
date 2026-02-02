import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type FadeInProps = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
};

export function FadeIn({
  children,
  duration = 300,
  delay = 0,
  style,
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
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
