import BLEPeripheral from 'react-native-ble-peripheral';

/* ─── UUID Generator ─────────────────────────── */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ─── Constants ──────────────────────────────── */
const PAYMENT_CHAR_UUID = '00000001-0000-1000-8000-00805f9b34fb';

export interface BlePaymentData {
  driverId: number;
  fare: number;
  ts: number;
}

type PaymentListener = (payment: BlePaymentData) => void;
let listeners: PaymentListener[] = [];

/**
 * Generate a fresh session UUID for the BLE service.
 */
export function createSessionUUID(): string {
  return generateUUID();
}

/**
 * CONDUCTOR: Start BLE peripheral advertising with a dynamic service UUID.
 * Creates a GATT service with a writable characteristic.
 * When a passenger writes payment data, the listener fires.
 */
export async function startPeripheral(
  serviceUuid: string,
  data: BlePaymentData,
): Promise<string> {
  try {
    // Add service with a writable characteristic
    await BLEPeripheral.addService(serviceUuid, true);

    await BLEPeripheral.addCharacteristicToService(
      serviceUuid,
      PAYMENT_CHAR_UUID,
      8 | 16, // Write | WriteNoResponse permissions
      8,      // Writable property
    );

    // Listen for writes from passenger (Central)
    BLEPeripheral.onWriteRequest((event: any) => {
      try {
        const value = event?.value || event?.data;
        if (!value) return;

        // Decode base64 or raw string
        let jsonStr: string;
        try {
          jsonStr = atob(value);
        } catch {
          jsonStr = value;
        }

        const payment = JSON.parse(jsonStr) as BlePaymentData;
        if (payment.driverId && payment.fare) {
          listeners.forEach((fn) => fn(payment));
        }
      } catch {
        // Invalid data — ignore
      }
    });

    // Start advertising
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
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((fn) => fn !== listener);
  };
}

/**
 * CONDUCTOR: Stop BLE peripheral and advertising.
 */
export async function stopPeripheral(): Promise<void> {
  listeners = [];
  try {
    await BLEPeripheral.stop();
  } catch {
    // Already stopped
  }
}
