import React, { type PropsWithChildren } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { Colors, BorderRadius } from '@/theme';

type GlassCardProps = PropsWithChildren<{
  /** BlurView intensity — defaults to 20 */
  intensity?: number;
  /** Whether the card is in a "selected" state */
  selected?: boolean;
  /** Additional style */
  style?: ViewStyle;
}>;

export function GlassCard({ children, intensity = 20, selected = false, style }: GlassCardProps) {
  return (
    <BlurView
      intensity={intensity}
      tint="light"
      style={[styles.card, selected && styles.cardSelected, style]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.bgPrimarySubtle,
  },
});
