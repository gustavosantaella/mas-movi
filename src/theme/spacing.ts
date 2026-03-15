/**
 * Spacing scale for consistent layout throughout the app.
 */

import { Platform } from 'react-native';

export const Spacing = {
  /** 2px */
  xxs: 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  base: 16,
  /** 20px */
  lg: 20,
  /** 24px */
  xl: 24,
  /** 30px */
  xxl: 30,
  /** 32px */
  xxxl: 32,
  /** 40px */
  huge: 40,
  /** 64px */
  massive: 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 24,
  pill: 30,
  circle: 50,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
