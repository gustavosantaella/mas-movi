import 'package:guayaba_app/core/network/api_client.dart';

class TripRepository {
  final _api = ApiClient();

  /// Save trip history to the backend.
  Future<void> saveTrip({
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
        '/mobility/payment/trips',
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
      ApiClient.parseResponse(response);
    } catch (e) {
      // Best-effort for now, so we don't break the payment flow if the server is down
      print('Error saving trip to backend: $e');
    }
  }
}
