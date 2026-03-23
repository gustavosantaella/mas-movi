import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid } from 'react-native';

/* ─── Safe native module access ──────────────── */
const BLEPeripheral = NativeModules.BLEPeripheral;

let bleEmitter: NativeEventEmitter | null = null;
function getEmitter(): NativeEventEmitter {
  if (!bleEmitter) {
    if (!BLEPeripheral) {
      throw new Error(
        'El módulo BLEPeripheral no está disponible. Necesitas un dev build nativo (no Expo Go).',
      );
    }
    bleEmitter = new NativeEventEmitter(BLEPeripheral);
  }
  return bleEmitter;
}

/* ─── UUID Generator ─────────────────────────── */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ─── Android Permissions ────────────────────── */
async function requestAndroidBlePermissions(): Promise<void> {
  if (Platform.OS !== 'android') return;

  if (Number(Platform.Version) >= 31) {
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    const allGranted = Object.values(results).every(
      (r) => r === PermissionsAndroid.RESULTS.GRANTED,
    );

    if (!allGranted) {
      throw new Error('No se otorgaron los permisos de Bluetooth necesarios.');
    }
  } else {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('No se otorgó el permiso de ubicación para Bluetooth.');
    }
  }
}

/* ─── Constants ──────────────────────────────── */
const PAYMENT_CHAR_UUID = '00000001-0000-1000-8000-00805f9b34fb';

export interface BlePaymentData {
  driverId: number;
  fare: number;
  ts: number;
}

type PaymentListener = (payment: BlePaymentData) => void;

/**
 * Generate a fresh session UUID for the BLE service.
 */
export function createSessionUUID(): string {
  return generateUUID();
}

/**
 * CONDUCTOR: Start BLE peripheral advertising with a dynamic service UUID.
 * Creates a GATT service with a writable characteristic.
 */
export async function startPeripheral(
  serviceUuid: string,
  _data: BlePaymentData,
): Promise<string> {
  if (!BLEPeripheral) {
    throw new Error(
      'El módulo BLEPeripheral no está disponible. Necesitas un dev build nativo.',
    );
  }

  // Request Android runtime permissions first
  await requestAndroidBlePermissions();

  try {
    BLEPeripheral.addService(serviceUuid, true);

    // iOS expects 5 args (including data string), Android expects 4
    if (Platform.OS === 'ios') {
      BLEPeripheral.addCharacteristicToService(
        serviceUuid,
        PAYMENT_CHAR_UUID,
        8 | 16, // Write | WriteNoResponse permissions
        8,      // Writable property
        '',     // Initial data (empty)
      );
    } else {
      BLEPeripheral.addCharacteristicToService(
        serviceUuid,
        PAYMENT_CHAR_UUID,
        8 | 16,
        8,
      );
    }

    await BLEPeripheral.start();

    return serviceUuid;
  } catch (err: any) {
    throw new Error(`No se pudo iniciar Bluetooth: ${err.message}`);
  }
}

/**
 * CONDUCTOR: Register a listener for incoming payments.
 * Returns unsubscribe function.
 */
export function onPaymentReceived(listener: PaymentListener): () => void {
  const emitter = getEmitter();
  const subscription = emitter.addListener(
    'BLEPeripheralWriteRequest',
    (event: { value?: string; data?: number[] }) => {
      try {
        let jsonStr: string | undefined;

        if (event.value) {
          try {
            jsonStr = atob(event.value);
          } catch {
            jsonStr = event.value;
          }
        } else if (event.data) {
          jsonStr = String.fromCharCode(...event.data);
        }

        if (!jsonStr) return;

        const payment = JSON.parse(jsonStr) as BlePaymentData;
        if (payment.fare) {
          listener(payment);
        }
      } catch {
        // Invalid data — ignore
      }
    },
  );

  return () => {
    subscription.remove();
  };
}

/**
 * CONDUCTOR: Stop BLE peripheral and advertising.
 */
export async function stopPeripheral(): Promise<void> {
  if (!BLEPeripheral) return;
  try {
    BLEPeripheral.stop();
  } catch {
    // Already stopped
  }
}
