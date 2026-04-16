import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

/// SQLite-backed key/value settings store.
class SettingsService {
  static Database? _db;

  /// Get or create the database.
  static Future<Database> get database async {
    if (_db != null) return _db!;
    final dbPath = await getDatabasesPath();
    _db = await openDatabase(
      join(dbPath, 'guayaba_settings.db'),
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
          )
        ''');
        // Default settings
        await db.insert('settings', {'key': 'qr_downloaded', 'value': 'false'});
      },
    );
    return _db!;
  }

  /// Get a setting value by key.
  static Future<String?> get(String key) async {
    final db = await database;
    final result = await db.query('settings', where: 'key = ?', whereArgs: [key]);
    if (result.isEmpty) return null;
    return result.first['value'] as String;
  }

  /// Set a setting value.
  static Future<void> set(String key, String value) async {
    final db = await database;
    await db.insert(
      'settings',
      {'key': key, 'value': value},
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Convenience: check if QR has been downloaded.
  static Future<bool> isQrDownloaded() async {
    final val = await get('qr_downloaded');
    return val == 'true';
  }

  /// Mark QR as downloaded.
  static Future<void> setQrDownloaded(bool downloaded) async {
    await set('qr_downloaded', downloaded.toString());
  }
}
