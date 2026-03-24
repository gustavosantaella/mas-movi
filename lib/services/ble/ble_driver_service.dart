import 'dart:async';
import 'dart:convert';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'ble_constants.dart';

/// BLE service for the **driver** side.
///
/// Scans for nearby BLE peripherals that advertise the payment service UUID.
/// When a matching advertisement is found, it extracts the payment data
/// (passenger name, session ID) from the manufacturer data and emits it.
class BleDriverService {
  StreamSubscription<List<ScanResult>>? _scanSub;
  final _paymentController = StreamController<Map<String, dynamic>>.broadcast();
  final String _sessionId;
  bool _running = false;

  BleDriverService({required String sessionId}) : _sessionId = sessionId;

  /// Stream of payment events received from passengers.
  Stream<Map<String, dynamic>> get onPaymentReceived => _paymentController.stream;

  /// Start scanning for payment advertisements.
  Future<void> start() async {
    if (_running) return;
    _running = true;

    // Ensure Bluetooth is on
    final state = await FlutterBluePlus.adapterState.first;
    if (state != BluetoothAdapterState.on) {
      await FlutterBluePlus.turnOn();
    }

    // Start scan — filter by service UUID
    await FlutterBluePlus.startScan(
      withServices: [Guid(BleConstants.serviceUuid)],
      androidScanMode: AndroidScanMode.lowLatency,
      continuousUpdates: true,
    );

    _scanSub = FlutterBluePlus.onScanResults.listen((results) {
      for (final r in results) {
        _handleScanResult(r);
      }
    });
  }

  void _handleScanResult(ScanResult result) {
    // Check the local name for our payment prefix
    final name = result.advertisementData.advName;
    if (!name.startsWith('PAY_')) return;

    // Format: PAY_<sessionId>_<passengerName>
    final parts = name.split('_');
    if (parts.length < 3) return;

    final sessionId = parts[1];
    if (sessionId != _sessionId) return; // Not for this driver

    // Extract passenger info from manufacturer data
    String passengerName = 'Pasajero';
    final mfgData = result.advertisementData.manufacturerData;
    if (mfgData.isNotEmpty) {
      try {
        final bytes = mfgData.values.first;
        passengerName = utf8.decode(bytes);
      } catch (_) {}
    }

    _paymentController.add({
      'passengerName': passengerName,
      'deviceId': result.device.remoteId.str,
    });
  }

  /// Stop scanning.
  Future<void> stop() async {
    _running = false;
    await FlutterBluePlus.stopScan();
    await _scanSub?.cancel();
    _scanSub = null;
  }

  /// Dispose resources.
  void dispose() {
    stop();
    _paymentController.close();
  }
}
