import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:device_info_plus/device_info_plus.dart';

/// ─── Network ────────────────────────────────────────
const _apiUrl = String.fromEnvironment(
  'API_URL',
  defaultValue: 'https://movimas.com/api/mobility',
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

/// ─── Payment Information ────────────────────────────
class PaymentInfo {
  PaymentInfo._();

  // Bank Account Info (Transfer/Deposit)
  static const holderName = 'Guayaba Mobility C.A.';
  static const accountNumber = '0102-0345-67-8901234567';
  static const rif = 'J-40567890-1';
  static const accountType = 'Corriente';
  static const bankName = 'Banco de Venezuela';

  // Pago Móvil Info
  static const phone = '0414-1234567';
  
  // Default amount for recharge UI examples
  static const defaultRechargeAmount = 50.0;
}
