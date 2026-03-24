import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Wrapper around flutter_secure_storage for token and profile caching.
class SecureStorage {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'auth_token';
  static const _profileKey = 'user_profile';

  // ─── Token ──────────────────────
  static Future<String?> getToken() => _storage.read(key: _tokenKey);
  static Future<void> setToken(String token) =>
      _storage.write(key: _tokenKey, value: token);
  static Future<void> deleteToken() => _storage.delete(key: _tokenKey);

  // ─── Profile cache ──────────────
  static Future<Map<String, dynamic>?> getCachedProfile() async {
    final raw = await _storage.read(key: _profileKey);
    if (raw == null) return null;
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  static Future<void> setCachedProfile(Map<String, dynamic> profile) =>
      _storage.write(key: _profileKey, value: jsonEncode(profile));

  static Future<void> clearCachedProfile() =>
      _storage.delete(key: _profileKey);

  // ─── Clear all ──────────────────
  static Future<void> clearAll() => _storage.deleteAll();
}
