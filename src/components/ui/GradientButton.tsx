import React, { type PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity, Text, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Gradients, BorderRadius, Typography } from '@/theme';

type GradientButtonProps = PropsWithChildren<{
  /** Button label */
  label: string;
  /** onPress callback */
  onPress?: () => void;
  /** Gradient colors override — defaults to Gradients.primary */
  colors?: readonly [string, string, ...string[]];
  /** Additional style for the outer container */
  style?: ViewStyle;
  /** Whether the button is disabled */
  disabled?: boolean;
}>;

export function GradientButton({
  label,
  onPress,
  colors,
  style,
  disabled = false,
}: GradientButtonProps) {
  return (
    <TouchableOpacity style={[styles.shadow, style, disabled && { opacity: 0.5 }]} activeOpacity={0.9} onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={colors ?? (Gradients.primary as unknown as [string, string, ...string[]])}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.text}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    borderRadius: BorderRadius.xl,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...Typography.button,
  },
});
