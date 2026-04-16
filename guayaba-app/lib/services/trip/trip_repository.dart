import 'package:guayaba_app/core/network/api_client.dart';

class TripRepository {
  final _api = ApiClient();

  /// Save trip history to the backend.
  Future<bool> saveTrip({
    double? boardingLat,
    double? boardingLong,
    double? landingLat,
    double? landingLong,
    int? driverId,
    int? passengerId,
    String? sessionId,
    double? amount,
    String? description,
    String? directionFrom,
    String? directionTo,
    String? status,
    DateTime? boardedAt,
    DateTime? landedAt,
  }) async {
    try {
      final response = await _api.dio.post(
        'mobility/payment/trips',
        data: {
          if (boardingLat != null) 'boardingLat': boardingLat,
          if (boardingLong != null) 'boardingLong': boardingLong,
          if (landingLat != null) 'landingLat': landingLat,
          if (landingLong != null) 'landingLong': landingLong,
          if (driverId != null) 'driverId': driverId,
          if (passengerId != null) 'passengerId': passengerId,
          if (sessionId != null) 'sessionId': sessionId,
          if (amount != null) 'amount': amount,
          if (description != null) 'description': description,
          if (directionFrom != null) 'directionFrom': directionFrom,
          if (directionTo != null) 'directionTo': directionTo,
          if (status != null) 'status': status,
          if (boardedAt != null) 'boardedAt': boardedAt.toIso8601String(),
          if (landedAt != null) 'landedAt': landedAt.toIso8601String(),
        },
      );
      final result = ApiClient.parseResponse(response);
      return result['success'] == true;
    } catch (e) {
      print('Error saving trip to backend: $e');
      return false;
    }
  }

  /// Get recent trips from the backend.
  Future<List<Map<String, dynamic>>> getRecentTrips({String? role, int limit = 10}) async {
    try {
      final response = await _api.dio.get(
        'mobility/trips/history',
        queryParameters: {
          if (role != null) 'role': role,
          'limit': limit,
        },
      );
      final result = ApiClient.parseResponse(response);
      if (result['success'] == true && result['data'] is List) {
        final list = List<Map<String, dynamic>>.from(result['data']);
        return list.map(_mapBackendToLocal).toList();
      }
      return [];
    } catch (e) {
      print('Error fetching recent trips: $e');
      return [];
    }
  }

  /// Maps backend camelCase keys to local snake_case keys used by widgets.
  Map<String, dynamic> _mapBackendToLocal(Map<String, dynamic> backendTrip) {
    return {
      'id': backendTrip['id'],
      'boarding_lat': backendTrip['boardingLat'],
      'boarding_long': backendTrip['boardingLong'],
      'landing_lat': backendTrip['landingLat'],
      'landing_long': backendTrip['landingLong'],
      'driver_id': backendTrip['driverId'],
      'passenger_id': backendTrip['passengerId'],
      'session_id': backendTrip['sessionId'],
      'amount': backendTrip['amount'],
      'description': backendTrip['description'],
      'direction_from': backendTrip['directionFrom'],
      'direction_to': backendTrip['directionTo'],
      'status': backendTrip['status'],
      'boarded_at': backendTrip['boardedAt'],
      'landed_at': backendTrip['landedAt'],
      'created_at': backendTrip['createdAt'],
      'updated_at': backendTrip['updatedAt'],
    };
  }
}
