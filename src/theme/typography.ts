/**
 * Typography presets for the MaaS app.
 */

import { Platform, TextStyle } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui' as const,
    serif: 'ui-serif' as const,
    rounded: 'ui-rounded' as const,
    mono: 'ui-monospace' as const,
  },
  default: {
    sans: 'normal' as const,
    serif: 'serif' as const,
    rounded: 'normal' as const,
    mono: 'monospace' as const,
  },
  web: {
    sans: 'var(--font-display)' as const,
    serif: 'var(--font-serif)' as const,
    rounded: 'var(--font-rounded)' as const,
    mono: 'var(--font-mono)' as const,
  },
});

export const Typography: Record<string, TextStyle> = {
  /** Main page titles — 32px bold */
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  /** Large hero text — used in greetings */
  hero: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  /** Section title — 18-20px */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  /** Header title — 20-22px */
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  /** Card labels — 16px */
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  /** Body text — 16px */
  body: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  /** Small body — 14px */
  bodySmall: {
    fontSize: 14,
    fontWeight: '500',
  },
  /** Caption — 12-13px */
  caption: {
    fontSize: 13,
    color: '#8892B0',
  },
  /** Large numeric display — balance, etc. */
  numericLarge: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  /** Button text — 18px bold */
  button: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
} as const;
