import React, { type PropsWithChildren } from 'react';
import { StyleSheet, ScrollView, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gradients } from '@/theme';

type GradientScreenProps = PropsWithChildren<{
  /** Gradient colors override — defaults to Gradients.main */
  colors?: readonly [string, string, ...string[]];
  /** If true, wraps children in a ScrollView */
  scrollable?: boolean;
  /** Additional style for the container */
  style?: ViewStyle;
  /** Additional style for scroll content */
  contentContainerStyle?: ViewStyle;
}>;

export function GradientScreen({
  children,
  colors,
  scrollable = false,
  style,
  contentContainerStyle,
}: GradientScreenProps) {
  const insets = useSafeAreaInsets();

  const content = scrollable ? (
    <ScrollView contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <LinearGradient
      colors={colors ?? (Gradients.main as unknown as [string, string, ...string[]])}
      style={[styles.container, { paddingTop: insets.top }, style]}
    >
      {content}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});
