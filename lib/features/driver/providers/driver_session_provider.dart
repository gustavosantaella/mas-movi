import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../../services/socket/payment_socket_service.dart';

/// Global state for the driver's active session.
class DriverSessionState {
  final bool isActive;
  final String? sessionId;
  final int passengerCount;

  const DriverSessionState({
    this.isActive = false,
    this.sessionId,
    this.passengerCount = 0,
  });

  DriverSessionState copyWith({bool? isActive, String? sessionId, int? passengerCount}) =>
      DriverSessionState(
        isActive: isActive ?? this.isActive,
        sessionId: sessionId ?? this.sessionId,
        passengerCount: passengerCount ?? this.passengerCount,
      );
}

/// Manages the driver's WebSocket session globally.
///
/// The session persists across screens — the QR screen just reads from this.
class DriverSessionNotifier extends ChangeNotifier {
  DriverSessionState _state = const DriverSessionState();
  PaymentSocketService? _socketService;
  StreamSubscription? _scannedSub;
  StreamSubscription? _paidSub;

  // Payment stream that screens can listen to (e.g., QR screen for toasts)
  final _paymentController = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get onPaymentReceived => _paymentController.stream;

  DriverSessionState get state => _state;

  /// Start a new session: connect WebSocket + join room.
  void startSession({required int driverId}) {
    if (_state.isActive) return;

    final sessionId = const Uuid().v4();
    _socketService = PaymentSocketService();
    _socketService!.connect();

    // Join the session room after connection is established
    Future.delayed(const Duration(milliseconds: 500), () {
      _socketService!.driverJoin(sessionId: sessionId, driverId: driverId);
    });

    // Listen for passenger scans → +1 counter
    _scannedSub = _socketService!.onPassengerScanned.listen((_) {
      _state = _state.copyWith(passengerCount: _state.passengerCount + 1);
      notifyListeners();
    });

    // Listen for passenger payments → forward to screens
    _paidSub = _socketService!.onPassengerPaid.listen((data) {
      _paymentController.add(data);
    });

    _state = DriverSessionState(isActive: true, sessionId: sessionId, passengerCount: 0);
    notifyListeners();
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
