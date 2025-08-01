import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, gradients } from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  animated?: boolean;
}

export function ProgressBar({ progress, height = 8, animated = true }: ProgressBarProps) {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animatedWidth.value = withTiming(progress, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      animatedWidth.value = progress;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }));

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View style={[styles.progressContainer, animatedStyle]}>
        <LinearGradient
          colors={gradients.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressContainer: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
});