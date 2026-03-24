import 'dart:io';
import 'package:flutter/foundation.dart';

String get apiBaseUrl {
  if (!kDebugMode) return 'https://movimas.com';

  // Emulator: Android emulator uses 10.0.2.2 to reach host machine
  if (Platform.isAndroid && !Platform.environment.containsKey('FLUTTER_TEST')) {
    // Physical device → LAN IP | Emulator → loopback alias
    final isEmulator = Platform.resolvedExecutable.contains('emulator') ||
        Platform.operatingSystemVersion.contains('sdk_gphone');
    return isEmulator
        ? 'http://10.0.2.2:4500/proxy'
        : 'http://172.16.20.133:4500/proxy';
  }

  return 'http://172.16.20.133:4500/proxy';
}

const urlTermsAndConditions = 'https://movimas.com/terminos-y-condiciones';
const urlPrivacyPolicy = 'https://movimas.com/politica-de-privacidad';
