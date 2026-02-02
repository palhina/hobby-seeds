import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type StaggeredListProps = {
  children: React.ReactNode;
  staggerDelay?: number;
  duration?: number;
  distance?: number;
  style?: ViewStyle;
};

export function StaggeredList({
  children,
  staggerDelay = 50,
  duration = 300,
  distance = 20,
  style,
}: StaggeredListProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <Animated.View style={style}>
      {childrenArray.map((child, index) => (
        <StaggeredListItem
          key={index}
          index={index}
          staggerDelay={staggerDelay}
          duration={duration}
          distance={distance}
        >
          {child}
        </StaggeredListItem>
      ))}
    </Animated.View>
  );
}

type StaggeredListItemProps = {
  children: React.ReactNode;
  index: number;
  staggerDelay: number;
  duration: number;
  distance: number;
};

function StaggeredListItem({
  children,
  index,
  staggerDelay,
  duration,
  distance,
}: StaggeredListItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const delay = index * staggerDelay;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, staggerDelay, duration, fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
}
