import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, gradients } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getGradient = () => {
    switch (variant) {
      case 'primary': return gradients.pirate;
      case 'secondary': return gradients.gold;
      case 'success': return gradients.victory;
      case 'danger': return gradients.danger;
      default: return gradients.pirate;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.container, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled ? ['#9ca3af', '#6b7280'] as any : getGradient() as any}
          style={[
            styles.gradient,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles.fontSize },
              textStyle,
              disabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradient: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.text.inverse,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledText: {
    opacity: 0.7,
  },
});