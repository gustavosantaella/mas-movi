import 'package:flutter_ble_peripheral/flutter_ble_peripheral.dart';

import 'ble_constants.dart';

/// BLE service for the **passenger** side.
///
/// After the passenger confirms payment, this service briefly advertises
/// a BLE signal that the driver's app can detect. The advertisement
/// contains the driver's session ID so only the target driver picks it up.
class BlePassengerService {
  final _peripheral = FlutterBlePeripheral();

  /// Advertise a payment signal for the given [sessionId].
  ///
  /// Broadcasts for [duration] seconds, then stops automatically.
  /// The driver's BLE scanner picks this up and shows the notification.
  Future<bool> sendPaymentSignal({
    required String sessionId,
    String passengerName = 'Pasajero',
    int durationSeconds = 5,
  }) async {
    try {
      // Request permissions if needed
      final permState = await _peripheral.hasPermission();
      if (permState != BluetoothPeripheralState.granted) {
        final result = await _peripheral.requestPermission();
        if (result != BluetoothPeripheralState.granted) {
          return false;
        }
      }

      // Truncate session ID to first 8 chars to fit BLE name limit
      final shortSession = sessionId.length > 8
          ? sessionId.substring(0, 8)
          : sessionId;

      final advertiseData = AdvertiseData(
        serviceUuid: BleConstants.serviceUuid,
        localName: 'PAY_${shortSession}_$passengerName',
      );

      final advertiseSettings = AdvertiseSettings(
        advertiseMode: AdvertiseMode.advertiseModeBalanced,
        txPowerLevel: AdvertiseTxPower.advertiseTxPowerHigh,
        connectable: false,
        timeout: durationSeconds * 1000,
      );

      await _peripheral.start(
        advertiseData: advertiseData,
        advertiseSettings: advertiseSettings,
      );

      // Wait for the advertisement duration
      await Future.delayed(Duration(seconds: durationSeconds));

      // Stop advertising
      try {
        await _peripheral.stop();
      } catch (_) {
        // May already have stopped via timeout
      }

      return true;
    } catch (e) {
      try {
        await _peripheral.stop();
      } catch (_) {}
      return false;
    }
  }
}
