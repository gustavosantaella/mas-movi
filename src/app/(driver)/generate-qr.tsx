import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  AppState,
} from 'react-native';
import { BleManager, State as BleState } from 'react-native-ble-plx';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import { Colors } from '@/theme';
import { PaymentToast } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { getCachedProfile } from '@/services/userService';
import {
  startPeripheral,
  stopPeripheral,
  onPaymentReceived,
  createSessionUUID,
  type BlePaymentData,
} from '@/services/blePeripheralService';

const FARE_AMOUNT = 100;

export default function GenerateQRScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [bleActive, setBleActive] = useState(false);
  const [btAdapterOn, setBtAdapterOn] = useState(true);
  const [toastQueue, setToastQueue] = useState<BlePaymentData[]>([]);
  const [sessionUuid, setSessionUuid] = useState('');
  const isRestarting = useRef(false);
  const bleManagerRef = useRef<BleManager | null>(null);
  const sessionUuidRef = useRef('');

  useEffect(() => {
    getCachedProfile().then((p) => {
      if (p) {
        setUserId(p.id);
        const uuid = createSessionUUID(p.id);
        setSessionUuid(uuid);
        sessionUuidRef.current = uuid;
      }
    });
  }, []);

  /* ─── Real-time Bluetooth adapter monitor ─── */
  useEffect(() => {
    const mgr = new BleManager();
    bleManagerRef.current = mgr;

    // Subscribe to Bluetooth state changes
    const sub = mgr.onStateChange((state) => {
      const isOn = state === BleState.PoweredOn;
      setBtAdapterOn(isOn);

      if (!isOn) {
        setBleActive(false);
      }
    }, true);

    return () => {
      sub.remove();
      mgr.destroy();
      bleManagerRef.current = null;
    };
  }, []);

  /* ─── Auto-restart BLE when adapter turns back on ─── */
  useEffect(() => {
    if (btAdapterOn && userId && sessionUuidRef.current && !bleActive) {
      startBle(sessionUuidRef.current);
    }
  }, [btAdapterOn]);

  /* ─── Start / restart BLE Peripheral ──────── */
  const startBle = useCallback(async (uuid: string) => {
    if (!userId) return;
    try {
      await startPeripheral(uuid, { passengerId: 0, fare: FARE_AMOUNT, ts: Date.now() });
      setBleActive(true);
      sessionUuidRef.current = uuid;
    } catch (err: any) {
      setBleActive(false);
      Alert.alert('Bluetooth', err.message);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    startBle(sessionUuid);

    const unsub = onPaymentReceived(async (payment) => {
      setToastQueue((prev) => [...prev, payment]);

      // Regenerate UUID & restart BLE for the next passenger
      if (isRestarting.current) return;
      isRestarting.current = true;

      try {
        await stopPeripheral();
        setBleActive(false);

        const newUuid = createSessionUUID(userId!);
        setSessionUuid(newUuid);
        await startBle(newUuid);
      } finally {
        isRestarting.current = false;
      }
    });

    return () => {
      unsub();
      stopPeripheral();
      setBleActive(false);
    };
  }, [userId, startBle]);

  const handleDismissToast = useCallback(() => {
    setToastQueue((prev) => prev.slice(1));
  }, []);

  // QR contains the dynamic BLE session UUID so the passenger can find this peripheral
  const qrData = JSON.stringify({
    driverId: userId,
    fare: FARE_AMOUNT,
    serviceUuid: sessionUuid,
    ts: Date.now(),
  });

  const handleBack = () => {
    stopPeripheral();
    router.back();
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Cobrar pasaje</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* BLE status */}
      <View style={s.statusRow}>
        <View style={[s.statusDot, bleActive && btAdapterOn ? s.statusDotActive : s.statusDotOff]} />
        <Text style={[s.statusText, !btAdapterOn && { color: Colors.accent }]}>
          {!btAdapterOn
            ? 'Bluetooth desactivado — actívalo'
            : bleActive
              ? 'Bluetooth activo — esperando pagos'
              : 'Iniciando Bluetooth…'}
        </Text>
      </View>

      {/* QR Section */}
      <View style={s.qrSection}>
        <Text style={s.fareLabel}>Monto del pasaje</Text>
        <Text style={s.fareAmount}>Bs. {FARE_AMOUNT}</Text>

        {/* Session UUID display */}
        <View style={s.uuidBadge}>
          <Ionicons name="bluetooth" size={14} color={Colors.salmon} />
          <Text style={s.uuidText} numberOfLines={1}>
            {sessionUuid}
          </Text>
        </View>

        <View style={s.qrWrapper}>
          {userId ? (
            <QRCode
              value={qrData}
              size={220}
              color={Colors.charcoal}
              backgroundColor={Colors.bgWhite}
            />
          ) : (
            <ActivityIndicator size="large" color={Colors.salmon} />
          )}
        </View>

        <Text style={s.qrHint}>El pasajero debe escanear este código QR</Text>
      </View>

      {/* Payment toast */}
      {toastQueue.length > 0 && (
        <PaymentToast fare={toastQueue[0].fare} onDismiss={handleDismissToast} />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grayNeutral,
  },
  statusDotActive: {
    backgroundColor: Colors.successGreen,
  },
  statusDotOff: {
    backgroundColor: Colors.accent,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
  qrSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  fareLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grayNeutral,
    marginBottom: 4,
  },
  fareAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 20,
  },
  uuidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF5F3',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE0D9',
  },
  uuidText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.salmon,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: Colors.bgWhite,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.borderLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  qrHint: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.grayNeutral,
  },
});
