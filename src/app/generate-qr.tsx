import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import { Colors } from '@/theme';
import { NfcListener } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { getCachedProfile } from '@/services/userService';
import { useNfcSupport } from '@/hooks/useNfcSupport';
import { startNfcEmit, cancelNfc } from '@/services/nfcService';

const FARE_AMOUNT = 100;

type ScreenMode = 'qr' | 'nfc-listening';

export default function GenerateQRScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { isSupported: nfcSupported } = useNfcSupport();
  const [userId, setUserId] = useState<number | null>(null);
  const [mode, setMode] = useState<ScreenMode>('qr');
  const nfcCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    getCachedProfile().then((p) => { if (p) setUserId(p.id); });
  }, []);

  const qrData = JSON.stringify({
    driverId: userId,
    fare: FARE_AMOUNT,
    ts: Date.now(),
  });

  const handleStartNfc = async () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'No disponible',
        'iOS no permite emisión NFC (HCE). Los pasajeros pueden escanear tu código QR.',
      );
      return;
    }
    if (!userId) return;
    setMode('nfc-listening');
    try {
      const cleanup = await startNfcEmit({ driverId: userId, fare: FARE_AMOUNT, ts: Date.now() });
      nfcCleanup.current = cleanup;
    } catch (err: any) {
      Alert.alert('Error NFC', err.message || 'No se pudo activar NFC');
      setMode('qr');
    }
  };

  const handleBack = () => {
    if (mode === 'nfc-listening') {
      cancelNfc();
      nfcCleanup.current?.();
      nfcCleanup.current = null;
      setMode('qr');
    } else {
      router.back();
    }
  };

  if (mode === 'nfc-listening') {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Esperando pago NFC</Text>
          <View style={{ width: 22 }} />
        </View>
        <NfcListener label="Esperando pago del pasajero…" />
      </SafeAreaView>
    );
  }

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

      {/* NFC button */}
      {nfcSupported && (
        <TouchableOpacity style={s.nfcButton} activeOpacity={0.8} onPress={handleStartNfc}>
          <Ionicons name="radio-outline" size={20} color={Colors.bgWhite} />
          <Text style={s.nfcButtonText}>Activar NFC para cobrar</Text>
        </TouchableOpacity>
      )}

      {!nfcSupported && (
        <View style={s.nfcWarning}>
          <Ionicons name="warning" size={16} color="#92400E" />
          <Text style={s.nfcWarningText}>NFC no disponible en este dispositivo</Text>
        </View>
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
  nfcButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.salmon,
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  nfcButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.bgWhite,
  },
  nfcWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  nfcWarningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
});
