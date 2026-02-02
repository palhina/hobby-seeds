import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

type ScalePressProps = {
  children: React.ReactNode;
  onPress?: () => void;
  scaleValue?: number;
  enableHaptics?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
};

export function ScalePress({
  children,
  onPress,
  scaleValue = 0.95,
  enableHaptics = true,
  style,
  disabled = false,
}: ScalePressProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;

    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={style}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
