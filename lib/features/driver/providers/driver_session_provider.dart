import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../../services/socket/payment_socket_service.dart';
import '../../../services/database/trip_service.dart';
import '../../../services/location/location_helper.dart';
import '../../shared/providers/trip_refresh_provider.dart';

/// Global state for the driver's active session.
class DriverSessionState {
  final bool isActive;
  final String? sessionId;
  final int driverId;
  final int passengerCount;

  const DriverSessionState({
    this.isActive = false,
    this.sessionId,
    this.driverId = 0,
    this.passengerCount = 0,
  });

  DriverSessionState copyWith({bool? isActive, String? sessionId, int? driverId, int? passengerCount}) =>
      DriverSessionState(
        isActive: isActive ?? this.isActive,
        sessionId: sessionId ?? this.sessionId,
        driverId: driverId ?? this.driverId,
        passengerCount: passengerCount ?? this.passengerCount,
      );
}

/// Manages the driver's WebSocket session globally.
///
/// The session persists across screens — the QR screen just reads from this.
class DriverSessionNotifier extends ChangeNotifier {
  DriverSessionState _state = const DriverSessionState();
  ProviderContainer? _container;
  PaymentSocketService? _socketService;
  StreamSubscription? _scannedSub;
  StreamSubscription? _paidSub;

  // Payment stream that screens can listen to (e.g., QR screen for toasts)
  final _paymentController = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get onPaymentReceived => _paymentController.stream;

  DriverSessionState get state => _state;

  /// Start a new session: connect WebSocket + join room.
  void startSession({required int driverId, ProviderContainer? container}) {
    if (_state.isActive) return;
    _container = container;

    final sessionId = const Uuid().v4();
    _socketService = PaymentSocketService();
    _socketService!.connect();

    // Join the session room after connection is established
    Future.delayed(const Duration(milliseconds: 500), () {
      _socketService!.driverJoin(sessionId: sessionId, driverId: driverId);
    });

    // Listen for passenger scans (kept for future use, no counter increment)
    _scannedSub = _socketService!.onPassengerScanned.listen((_) {
      // No-op in MVP — counter increments on payment
    });

    // Listen for passenger payments → +1 counter + save trip + forward
    _paidSub = _socketService!.onPassengerPaid.listen((data) {
      _state = _state.copyWith(passengerCount: _state.passengerCount + 1);
      _paymentController.add(data);
      notifyListeners();

      // Save trip record in driver's local DB
      _saveDriverTrip(data);
    });

    _state = DriverSessionState(isActive: true, sessionId: sessionId, driverId: driverId, passengerCount: 0);
    notifyListeners();
  }

  /// Create a completed trip in driver's local SQLite from payment data.
  Future<void> _saveDriverTrip(Map<String, dynamic> data) async {
    try {
      final passengerId = data['passengerId'] as int? ?? 0;
      final amount = (data['amount'] as num?)?.toDouble() ?? 1.50;
      final lat = (data['lat'] as num?)?.toDouble();
      final lng = (data['lng'] as num?)?.toDouble();

      // Reverse-geocode passenger's location for display
      String? address;
      if (lat != null && lng != null && lat != 0.0 && lng != 0.0) {
        address = await LocationHelper.getAddress(lat, lng);
      }

      final tripId = await TripService.createTrip(
        boardingLat: lat,
        boardingLong: lng,
        driverId: _state.driverId,
        passengerId: passengerId,
        sessionId: _state.sessionId,
        directionFrom: address,
      );

      await TripService.completeTrip(
        tripId: tripId,
        landingLat: lat,
        landingLong: lng,
        amount: amount,
        directionTo: address,
      );

      // Trigger trip list refresh in UI
      _container?.read(tripRefreshProvider.notifier).state++;
    } catch (e) {
      // ignore: avoid_print
      print('⚠️ Error saving driver trip: $e');
    }
  }

  /// End the current session: disconnect WebSocket + clean up.
  void endSession() {
    _scannedSub?.cancel();
    _paidSub?.cancel();
    _socketService?.dispose();
    _socketService = null;
    _scannedSub = null;
    _paidSub = null;

    _state = const DriverSessionState();
    notifyListeners();
  }

  @override
  void dispose() {
    endSession();
    _paymentController.close();
    super.dispose();
  }
}

/// Riverpod provider
final driverSessionProvider =
    ChangeNotifierProvider<DriverSessionNotifier>((ref) => DriverSessionNotifier());
