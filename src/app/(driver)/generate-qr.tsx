import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import { Colors } from '@/theme';
import { PaymentToast } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { getCachedProfile } from '@/services/userService';
import {
  registerDriver,
  unregisterDriver,
  onPaymentReceived,
  type PaymentNotification,
} from '@/services/paymentSocket';

const FARE_AMOUNT = 100;

export default function GenerateQRScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [wsActive, setWsActive] = useState(false);
  const [toastQueue, setToastQueue] = useState<PaymentNotification[]>([]);

  useEffect(() => {
    getCachedProfile().then((p) => { if (p) setUserId(p.id); });
  }, []);

  /* ─── Register for payment notifications via WebSocket ───── */
  useEffect(() => {
    if (!userId) return;

    registerDriver(userId);
    setWsActive(true);

    const unsub = onPaymentReceived((payment) => {
      setToastQueue((prev) => [...prev, payment]);
    });

    return () => {
      unsub();
      unregisterDriver();
      setWsActive(false);
    };
  }, [userId]);

  const handleDismissToast = useCallback(() => {
    setToastQueue((prev) => prev.slice(1));
  }, []);

  const qrData = JSON.stringify({
    driverId: userId,
    fare: FARE_AMOUNT,
    ts: Date.now(),
  });

  const handleBack = () => {
    unregisterDriver();
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

      {/* Connection status */}
      <View style={s.statusRow}>
        <View style={[s.statusDot, wsActive && s.statusDotActive]} />
        <Text style={s.statusText}>
          {wsActive ? 'Conectado — esperando pagos' : 'Desconectado'}
        </Text>
      </View>

      {/* QR Section */}
      <View style={s.qrSection}>
        <Text style={s.fareLabel}>Monto del pasaje</Text>
        <Text style={s.fareAmount}>Bs. {FARE_AMOUNT}</Text>

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

      {/* Payment toast overlay */}
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
    marginBottom: 30,
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
