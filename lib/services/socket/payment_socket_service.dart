import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../../core/constants.dart';

/// WebSocket service for real-time driver ↔ passenger communication.
///
/// Connects to the `/payment` namespace of the mobility API.
class PaymentSocketService {
  io.Socket? _socket;
  final _scannedController = StreamController<Map<String, dynamic>>.broadcast();
  final _paidController = StreamController<Map<String, dynamic>>.broadcast();

  bool get isConnected => _socket?.connected ?? false;

  /// Stream of `passenger:scanned` events (driver listens to this).
  Stream<Map<String, dynamic>> get onPassengerScanned =>
      _scannedController.stream;

  /// Stream of `passenger:paid` events (driver listens to this).
  Stream<Map<String, dynamic>> get onPassengerPaid => _paidController.stream;

  /// Connect to the WebSocket server.
  void connect() {
    if (_socket != null) return;

    // Connect through the proxy
    // Proxy rewrites /proxy/mobility/* → /api/mobility/* → port 3001
    // NOTE: first arg is just the host — anything after port is treated as namespace
    final baseUrl = apiBaseUrl.replaceAll('/proxy', '');

    _socket = io.io(
      baseUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setPath('/proxy/mobility/socket.io')
          .enableAutoConnect()
          .enableReconnection()
          .build(),
    );

    _socket!.onConnect((_) {
      // ignore: avoid_print
      print('🔌 PaymentSocket connected');
    });

    _socket!.onDisconnect((_) {
      // ignore: avoid_print
      print('🔌 PaymentSocket disconnected');
    });

    // Driver events
    _socket!.on('passenger:scanned', (data) {
      _scannedController.add(Map<String, dynamic>.from(data));
    });

    _socket!.on('passenger:paid', (data) {
      _paidController.add(Map<String, dynamic>.from(data));
    });
  }

  // ─── Driver actions ─────────────────────────────────

  /// Driver joins a session room.
  void driverJoin({required String sessionId, required int driverId}) {
    _socket?.emit('driver:join', {
      'sessionId': sessionId,
      'driverId': driverId,
    });
  }

  // ─── Passenger actions ──────────────────────────────

  /// Passenger scanned a driver's QR.
  void passengerScan({required String sessionId, required int passengerId}) {
    _socket?.emit('passenger:scan', {
      'sessionId': sessionId,
      'passengerId': passengerId,
    });
  }

  /// Passenger confirmed payment.
  void passengerPay({
    required String sessionId,
    required int passengerId,
    required double amount,
    required double lat,
    required double lng,
  }) {
    _socket?.emit('passenger:pay', {
      'sessionId': sessionId,
      'passengerId': passengerId,
      'amount': amount,
      'lat': lat,
      'lng': lng,
    });
  }

  /// Disconnect and clean up.
  void dispose() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _scannedController.close();
    _paidController.close();
  }
}
