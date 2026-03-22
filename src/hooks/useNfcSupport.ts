import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

/**
 * Detects NFC hardware support using react-native-nfc-manager.
 */
export function useNfcSupport() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supported = await NfcManager.isSupported();
        setIsSupported(supported);
        if (supported) {
          await NfcManager.start();
        }
      } catch {
        setIsSupported(false);
      } finally {
        setIsChecking(false);
      }
    })();

    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  return { isSupported: isSupported ?? false, isChecking };
}
