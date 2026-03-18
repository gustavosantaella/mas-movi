import React, { type PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View, type ViewStyle } from 'react-native';
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
  /** Whether the button is in a loading state */
  loading?: boolean;
}>;

export function GradientButton({
  label,
  onPress,
  colors,
  style,
  disabled = false,
  loading = false,
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.shadow, style, isDisabled && { opacity: 0.6 }]}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={colors ?? (Gradients.primary as unknown as [string, string, ...string[]])}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.text}>Cargando...</Text>
          </View>
        ) : (
          <Text style={styles.text}>{label}</Text>
        )}
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
