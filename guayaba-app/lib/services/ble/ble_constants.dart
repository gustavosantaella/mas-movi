/// BLE constants for the payment notification service.
///
/// The driver advertises a BLE peripheral with the [serviceUuid].
/// The passenger writes payment data to the [paymentCharacteristicUuid].
class BleConstants {
  BleConstants._();

  /// GATT service UUID — shared between driver (peripheral) and passenger (central).
  static const serviceUuid = '0000ff01-0000-1000-8000-00805f9b34fb';

  /// Characteristic where the passenger writes payment confirmation data.
  static const paymentCharacteristicUuid = '0000ff02-0000-1000-8000-00805f9b34fb';

  /// BLE advertising name prefix. Full name: "GUAYABA_<driverId>"
  static const advertisingPrefix = 'GUAYABA_';
}
