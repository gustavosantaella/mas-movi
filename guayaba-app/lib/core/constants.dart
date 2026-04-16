import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:device_info_plus/device_info_plus.dart';

/// ─── Network ────────────────────────────────────────
const _apiUrl = String.fromEnvironment(
  'API_URL',
  defaultValue: 'https://movimas.com',
);

bool isAndroidEmulator = false;

Future<void> initEnvironmentVariables() async {
  if (kDebugMode && Platform.isAndroid) {
    try {
      final deviceInfo = DeviceInfoPlugin();
      final androidInfo = await deviceInfo.androidInfo;
      isAndroidEmulator = !androidInfo.isPhysicalDevice;
    } catch (_) {
      isAndroidEmulator = false;
    }
  }
}

String get apiBaseUrl {
  return _apiUrl;
}

const urlTermsAndConditions = 'https://movimas.com/terminos-y-condiciones';
const urlPrivacyPolicy = 'https://movimas.com/politica-de-privacidad';
