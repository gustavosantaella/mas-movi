/**
 * Centralized color palette for the MaaS app.
 * All colors used across the app should be referenced from here.
 */

export const Colors = {
  // ─── Brand (legacy dark theme) ────────────────────────
  primary: '#4776E6',
  primaryLight: '#8E54E9',
  accent: '#FF416C',
  accentWarm: '#FF4B2B',
  success: '#00E676',
  info: '#40C4FF',
  warning: '#FFD54F',

  // ─── Salmon Palette ───────────────────────────────────
  salmon: '#FF7B5F',
  salmonLight: '#FF9B85',
  salmonSoft: '#FFB5A3',
  coralIntense: '#FF6B4A',
  peach: '#FFC9BD',
  charcoal: '#2D3339',
  grayNeutral: '#6B7280',
  successGreen: '#10B981',

  // ─── Backgrounds ─────────────────────────────────────
  bgDark: '#0F2027',
  bgDarkMid: '#203A43',
  bgDarkDeep: '#101522',
  bgCard: '#1A1A24',
  bgBlack: '#000000',
  bgWhite: '#FFFFFF',
  bgLightGray: '#F7F7F9',
  bgSurface: 'rgba(255,255,255,0.05)',
  bgSurfaceLight: 'rgba(255,255,255,0.1)',
  bgSurfaceHover: 'rgba(255,255,255,0.15)',
  bgSurfaceMedium: 'rgba(255,255,255,0.2)',
  bgSurfaceBright: 'rgba(255,255,255,0.3)',
  bgPrimarySubtle: 'rgba(71, 118, 230, 0.1)',
  bgDangerSubtle: 'rgba(255, 65, 108, 0.1)',

  // ─── Borders ──────────────────────────────────────────
  borderSubtle: 'rgba(255,255,255,0.05)',
  borderLight: 'rgba(255,255,255,0.1)',
  borderMedium: 'rgba(255,255,255,0.15)',
  borderBright: 'rgba(255,255,255,0.3)',
  borderDanger: 'rgba(255, 65, 108, 0.3)',
  borderLightGray: '#E5E7EB',

  // ─── Text ─────────────────────────────────────────────
  textPrimary: '#fff',
  textSecondary: '#8892B0',
  textMuted: '#B0BEC5',
  textOnSurface: '#E0E6ED',
  textDanger: '#FF416C',
  textDimmed: 'rgba(255,255,255,0.6)',
  textLabel: 'rgba(255,255,255,0.7)',

  // ─── Light / Dark theme (for ThemedText/ThemedView) ──
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ─── Gradient presets ─────────────────────────────────────
export const Gradients = {
  main: ['#0F2027', '#203A43', '#2C5364'] as const,
  dark: ['#101522', '#1A1A24', '#0F2027'] as const,
  darkFlat: ['#000000', '#1A1A24'] as const,
  primary: ['#4776E6', '#8E54E9'] as const,
  accent: ['#FF416C', '#FF4B2B'] as const,
  info: ['#00B4DB', '#0083B0'] as const,
  surface: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] as const,
  salmonCard: ['#FF7B5F', '#FF9B85', '#FFB5A3'] as const,
  salmonButton: ['#FF7B5F', '#FF6B4A'] as const,
} as const;
