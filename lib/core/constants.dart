import 'dart:io';
import 'package:flutter/foundation.dart';

/// ─── Network ────────────────────────────────────────
const _prodUrl = 'https://movimas.com';
const _lanIp = '172.16.20.159';
const _proxyPort = 4500;
const _emulatorHost = '10.0.2.2'; // Android emulator → host loopback
const _proxyPath = '/proxy';

bool get _isAndroidEmulator =>
    Platform.isAndroid &&
    (Platform.resolvedExecutable.contains('emulator') ||
        Platform.operatingSystemVersion.contains('sdk_gphone'));

String get apiBaseUrl {
  if (!kDebugMode) return _prodUrl;

  final host = _isAndroidEmulator ? _emulatorHost : _lanIp;
  return 'http://$host:$_proxyPort$_proxyPath';
}

const urlTermsAndConditions = 'https://movimas.com/terminos-y-condiciones';
const urlPrivacyPolicy = 'https://movimas.com/politica-de-privacidad';
