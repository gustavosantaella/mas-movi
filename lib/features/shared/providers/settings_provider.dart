import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../services/database/settings_service.dart';

/// Manages local settings backed by SQLite.
class SettingsNotifier extends ChangeNotifier {
  bool _qrDownloaded = false;
  bool _loaded = false;

  bool get qrDownloaded => _qrDownloaded;
  bool get isLoaded => _loaded;

  /// Load settings from SQLite.
  Future<void> load() async {
    _qrDownloaded = await SettingsService.isQrDownloaded();
    _loaded = true;
    notifyListeners();
  }

  /// Mark QR as downloaded → persists to SQLite.
  Future<void> markQrDownloaded() async {
    await SettingsService.setQrDownloaded(true);
    _qrDownloaded = true;
    notifyListeners();
  }
}

final settingsProvider =
    ChangeNotifierProvider<SettingsNotifier>((ref) {
  final notifier = SettingsNotifier();
  notifier.load(); // auto-load on creation
  return notifier;
});
