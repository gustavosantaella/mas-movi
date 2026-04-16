import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

/// Typography presets for the Guayaba/MaaS app.
class AppTypography {
  AppTypography._();

  static TextStyle get pageTitle => GoogleFonts.inter(
        fontSize: 32,
        fontWeight: FontWeight.w800,
        color: AppColors.charcoal,
        letterSpacing: -0.5,
      );

  static TextStyle get hero => GoogleFonts.inter(
        fontSize: 32,
        fontWeight: FontWeight.w800,
        color: AppColors.textPrimary,
        letterSpacing: -0.5,
      );

  static TextStyle get sectionTitle => GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: AppColors.charcoal,
        letterSpacing: -0.5,
      );

  static TextStyle get headerTitle => GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: AppColors.charcoal,
      );

  static TextStyle get cardLabel => GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        color: AppColors.charcoal,
      );

  static TextStyle get body => GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: AppColors.charcoal,
      );

  static TextStyle get bodySmall => GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: AppColors.charcoal,
      );

  static TextStyle get caption => GoogleFonts.inter(
        fontSize: 13,
        color: AppColors.grayNeutral,
      );

  static TextStyle get numericLarge => GoogleFonts.inter(
        fontSize: 36,
        fontWeight: FontWeight.w900,
        color: AppColors.charcoal,
        letterSpacing: -1,
      );

  static TextStyle get button => GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: Colors.white,
        letterSpacing: 0.5,
      );
}
