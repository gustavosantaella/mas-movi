import 'package:flutter/material.dart';

/// Centralized color palette for the Guayaba/MaaS app.
class AppColors {
  AppColors._();

  // ─── Brand (legacy dark theme) ─────────────────
  static const primary = Color(0xFF4776E6);
  static const primaryLight = Color(0xFF8E54E9);
  static const accent = Color(0xFFFF416C);
  static const accentWarm = Color(0xFFFF4B2B);
  static const success = Color(0xFF00E676);
  static const info = Color(0xFF40C4FF);
  static const warning = Color(0xFFFFD54F);

  // ─── Salmon Palette ────────────────────────────
  static const salmon = Color(0xFFFF7B5F);
  static const salmonLight = Color(0xFFFF9B85);
  static const salmonSoft = Color(0xFFFFB5A3);
  static const coralIntense = Color(0xFFFF6B4A);
  static const peach = Color(0xFFFFC9BD);
  static const charcoal = Color(0xFF2D3339);
  static const grayNeutral = Color(0xFF6B7280);
  static const successGreen = Color(0xFF10B981);

  // ─── Backgrounds ───────────────────────────────
  static const bgDark = Color(0xFF0F2027);
  static const bgDarkMid = Color(0xFF203A43);
  static const bgDarkDeep = Color(0xFF101522);
  static const bgCard = Color(0xFF1A1A24);
  static const bgBlack = Color(0xFF000000);
  static const bgWhite = Color(0xFFFFFFFF);
  static const bgLightGray = Color(0xFFF7F7F9);
  static const bgSurface = Color(0x0DFFFFFF);
  static const bgSurfaceLight = Color(0x1AFFFFFF);

  // ─── Borders ───────────────────────────────────
  static const borderSubtle = Color(0x0DFFFFFF);
  static const borderLight = Color(0x1AFFFFFF);
  static const borderLightGray = Color(0xFFE5E7EB);

  // ─── Text ──────────────────────────────────────
  static const textPrimary = Color(0xFFFFFFFF);
  static const textSecondary = Color(0xFF8892B0);
  static const textMuted = Color(0xFFB0BEC5);
  static const textDanger = Color(0xFFFF416C);
}

/// Gradient presets
class AppGradients {
  AppGradients._();

  static const main = [Color(0xFF0F2027), Color(0xFF203A43), Color(0xFF2C5364)];
  static const dark = [Color(0xFF101522), Color(0xFF1A1A24), Color(0xFF0F2027)];
  static const darkFlat = [Color(0xFF000000), Color(0xFF1A1A24)];
  static const primary = [Color(0xFF4776E6), Color(0xFF8E54E9)];
  static const accentGrad = [Color(0xFFFF416C), Color(0xFFFF4B2B)];
  static const salmonCard = [Color(0xFFFF7B5F), Color(0xFFFF9B85), Color(0xFFFFB5A3)];
  static const salmonButton = [Color(0xFFFF7B5F), Color(0xFFFF6B4A)];
}
