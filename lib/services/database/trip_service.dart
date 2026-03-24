import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

/// SQLite service for trip history persistence.
class TripService {
  static Database? _db;

  static Future<Database> get database async {
    if (_db != null) return _db!;
    final dbPath = await getDatabasesPath();
    _db = await openDatabase(
      join(dbPath, 'guayaba_trips.db'),
      version: 2,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE trip_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            boarding_lat REAL,
            boarding_long REAL,
            landing_lat REAL,
            landing_long REAL,
            driver_id INTEGER,
            passenger_id INTEGER,
            amount REAL,
            description TEXT,
            direction_from TEXT,
            direction_to TEXT,
            status TEXT,
            boarded_at TEXT,
            landed_at TEXT,
            created_at TEXT DEFAULT (datetime('now','localtime')),
            updated_at TEXT DEFAULT (datetime('now','localtime'))
          )
        ''');
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          await db.execute('ALTER TABLE trip_history ADD COLUMN passenger_id INTEGER');
          await db.execute('ALTER TABLE trip_history ADD COLUMN boarded_at TEXT');
          await db.execute('ALTER TABLE trip_history ADD COLUMN landed_at TEXT');
        }
      },
    );
    return _db!;
  }

  /// Create a trip on boarding (scan). Returns the trip ID.
  static Future<int> createTrip({
    double? boardingLat,
    double? boardingLong,
    int? driverId,
    int? passengerId,
    String? directionFrom,
  }) async {
    final db = await database;
    return db.insert('trip_history', {
      'boarding_lat': boardingLat,
      'boarding_long': boardingLong,
      'driver_id': driverId,
      'passenger_id': passengerId,
      'direction_from': directionFrom,
      'status': 'active',
      'boarded_at': DateTime.now().toIso8601String(),
    });
  }

  /// Update a trip on landing (payment).
  static Future<void> completeTrip({
    required int tripId,
    double? landingLat,
    double? landingLong,
    double? amount,
    String? description,
    String? directionTo,
  }) async {
    final db = await database;
    await db.update(
      'trip_history',
      {
        'landing_lat': landingLat,
        'landing_long': landingLong,
        'amount': amount,
        'description': description,
        'direction_to': directionTo,
        'status': 'completed',
        'landed_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [tripId],
    );
  }

  /// Get all trips ordered by newest first.
  static Future<List<Map<String, dynamic>>> getTrips({int limit = 20}) async {
    final db = await database;
    return db.query('trip_history', orderBy: 'created_at DESC', limit: limit);
  }

  /// Get active (in-progress) trip for UI state.
  static Future<Map<String, dynamic>?> getActiveTrip() async {
    final db = await database;
    final result = await db.query(
      'trip_history',
      where: 'status = ?',
      whereArgs: ['active'],
      orderBy: 'created_at DESC',
      limit: 1,
    );
    return result.isEmpty ? null : result.first;
  }
}
