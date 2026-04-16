import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

/// Builds the app's ThemeData.
class AppTheme {
  AppTheme._();

  static ThemeData get light => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: AppColors.bgWhite,
        colorScheme: ColorScheme.light(
          primary: AppColors.salmon,
          secondary: AppColors.salmonLight,
          surface: AppColors.bgWhite,
          error: AppColors.accent,
        ),
        textTheme: GoogleFonts.interTextTheme(),
        appBarTheme: const AppBarTheme(
          backgroundColor: AppColors.bgWhite,
          elevation: 0,
          scrolledUnderElevation: 0,
          foregroundColor: AppColors.charcoal,
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: AppColors.bgWhite,
          selectedItemColor: AppColors.salmon,
          unselectedItemColor: AppColors.grayNeutral,
        ),
      );
}
