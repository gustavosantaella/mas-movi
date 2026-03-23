import { BleManager, Device, State } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { Buffer } from 'buffer';

/* ─── Constants ──────────────────────────────── */
const PAYMENT_CHAR_UUID = '00000001-0000-1000-8000-00805f9b34fb';
const SCAN_TIMEOUT_MS = 15000;

let manager: BleManager | null = null;

function getManager(): BleManager {
  if (!manager) {
    manager = new BleManager();
  }
  return manager;
}

/* ─── Permissions ────────────────────────────── */

/**
 * Waits for BLE to be powered on (handles iOS authorization prompt automatically).
 * On Android, explicitly requests runtime permissions.
 */
async function ensureBleReady(ble: BleManager): Promise<void> {
  // Android: request runtime permissions first
  if (Platform.OS === 'android') {
    const granted = await requestAndroidPermissions();
    if (!granted) {
      throw new Error('No se otorgaron permisos de Bluetooth.');
    }
  }

  // Wait for BLE to be powered on (iOS shows permission dialog automatically)
  const currentState = await ble.state();

  if (currentState === State.PoweredOn) return;

  // On iOS, if state is Unknown or Resetting, wait for it to resolve
  if (
    currentState === State.Unknown ||
    currentState === State.Resetting ||
    currentState === State.PoweredOff
  ) {
    await waitForPoweredOn(ble);
    return;
  }

  // State is Unauthorized or Unsupported
  if (currentState === State.Unauthorized) {
    throw new Error(
      'Bluetooth no está autorizado. Ve a Ajustes > Privacidad > Bluetooth y activa el permiso para MaaS.',
    );
  }

  throw new Error('Bluetooth no está disponible en este dispositivo.');
}

function waitForPoweredOn(ble: BleManager): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      subscription.remove();
      reject(new Error('Bluetooth no se activó a tiempo. Verifica que esté encendido.'));
    }, 10000);

    const subscription = ble.onStateChange((newState) => {
      if (newState === State.PoweredOn) {
        clearTimeout(timeout);
        subscription.remove();
        resolve();
      } else if (newState === State.Unauthorized) {
        clearTimeout(timeout);
        subscription.remove();
        reject(
          new Error(
            'Bluetooth no está autorizado. Ve a Ajustes y activa el permiso para MaaS.',
          ),
        );
      }
    }, true);
  });
}

async function requestAndroidPermissions(): Promise<boolean> {
  if (Number(Platform.Version) >= 31) {
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return Object.values(results).every(
      (r) => r === PermissionsAndroid.RESULTS.GRANTED,
    );
  }

  // Android < 31
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

/* ─── Main: Send payment via BLE ─────────────── */

export interface BlePaymentPayload {
  passengerId: number;
  fare: number;
  ts: number;
}

/**
 * PASAJERO (Central): Scans for the driver's BLE service UUID,
 * connects, and writes payment data to the writable characteristic.
 *
 * @param serviceUuid - The dynamic UUID from the QR code
 * @param payload     - Payment data to send to the driver
 */
export async function sendPaymentViaBle(
  serviceUuid: string,
  payload: BlePaymentPayload,
): Promise<void> {
  const ble = getManager();

  // Handle permissions for both iOS and Android
  await ensureBleReady(ble);

  // Scan for the driver's peripheral using the service UUID from the QR
  const device = await scanForPeripheral(ble, serviceUuid);

  // Connect
  const connected = await device.connect({ timeout: 10000 });
  await connected.discoverAllServicesAndCharacteristics();

  // Encode the payment payload
  const jsonStr = JSON.stringify(payload);
  const base64 = Buffer.from(jsonStr, 'utf-8').toString('base64');

  // Write to the driver's writable characteristic
  try {
    await connected.writeCharacteristicWithResponseForService(
      serviceUuid,
      PAYMENT_CHAR_UUID,
      base64,
    );
  } finally {
    // Always disconnect after writing
    try {
      await connected.cancelConnection();
    } catch {
      // Already disconnected
    }
  }
}

/* ─── Helpers ────────────────────────────────── */

function scanForPeripheral(
  ble: BleManager,
  serviceUuid: string,
): Promise<Device> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      ble.stopDeviceScan();
      reject(new Error('No se encontró la unidad de transporte. Intenta de nuevo.'));
    }, SCAN_TIMEOUT_MS);

    ble.startDeviceScan(
      [serviceUuid],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          clearTimeout(timeout);
          ble.stopDeviceScan();
          reject(new Error(`Error al escanear Bluetooth: ${error.message}`));
          return;
        }

        if (device) {
          clearTimeout(timeout);
          ble.stopDeviceScan();
          resolve(device);
        }
      },
    );
  });
}

/**
 * Cleanup BLE manager. Call on logout or app unmount.
 */
export function destroyBleManager(): void {
  if (manager) {
    manager.destroy();
    manager = null;
  }
}
