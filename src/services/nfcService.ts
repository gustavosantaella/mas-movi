import NfcManager, { NfcTech, Ndef, NfcEvents } from 'react-native-nfc-manager';
import { Platform } from 'react-native';

export interface NfcPaymentData {
  driverId: number;
  fare: number;
  ts: number;
}

/**
 * CONDUCTOR: Write payment data as an NDEF message so a nearby phone can read it.
 * - Android: Uses NfcTech.Ndef to write an NDEF tag simulation.
 * - iOS: Apple doesn't allow HCE/tag emulation from an iPhone.
 *
 * Returns a cleanup function to stop emitting.
 */
export async function startNfcEmit(data: NfcPaymentData): Promise<() => void> {
  if (Platform.OS === 'ios') {
    throw new Error('iOS no soporta emisión NFC (HCE). Usa QR en su lugar.');
  }

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const jsonString = JSON.stringify(data);
    const bytes = Ndef.encodeMessage([Ndef.textRecord(jsonString)]);

    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
    }

    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  } catch (err) {
    NfcManager.cancelTechnologyRequest().catch(() => {});
    throw err;
  }
}

/**
 * PASSENGER: Scan for an NDEF tag/HCE device and read payment data.
 * Works on both iOS and Android.
 *
 * Returns the parsed payment data or null.
 */
export async function readNfcPayment(): Promise<NfcPaymentData | null> {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const tag = await NfcManager.getTag();

    if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
      const record = tag.ndefMessage[0];
      // NDEF text record: first byte is language code length
      const payload = record.payload;
      if (payload && payload.length > 0) {
        const langCodeLen = payload[0];
        const textBytes = payload.slice(1 + langCodeLen);
        const text = String.fromCharCode(...textBytes);

        try {
          const data = JSON.parse(text) as NfcPaymentData;
          if (data.driverId && data.fare) {
            return data;
          }
        } catch {
          // Not valid JSON
        }
      }
    }

    return null;
  } catch {
    return null;
  } finally {
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }
}

/**
 * Cancel any pending NFC operation.
 */
export function cancelNfc() {
  NfcManager.cancelTechnologyRequest().catch(() => {});
}
