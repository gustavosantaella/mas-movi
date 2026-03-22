import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { NfcListener } from '@/components/ui';
import { useNfcSupport } from '@/hooks/useNfcSupport';
import { readNfcPayment, cancelNfc } from '@/services/nfcService';
import { ScannerFrame } from '@/features/qr-scanner/components/ScannerFrame';
import { ScannerControls } from '@/features/qr-scanner/components/ScannerControls';
import { qrScannerStyles } from '@/features/qr-scanner/styles';

type PaymentMode = 'select' | 'qr' | 'nfc' | 'confirm';

interface ScannedPayment {
  driverId: number;
  fare: number;
  ts: number;
}

export default function PayFareScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<PaymentMode>('select');
  const { isSupported: nfcSupported } = useNfcSupport();
  const [scannedData, setScannedData] = useState<ScannedPayment | null>(null);
  const [paying, setPaying] = useState(false);
  const hasScanned = useRef(false); // prevents multiple scans

  const handleBack = () => {
    if (mode === 'confirm') {
      hasScanned.current = false;
      setScannedData(null);
      setMode('qr');
    } else if (mode === 'qr' || mode === 'nfc') {
      hasScanned.current = false;
      cancelNfc();
      setMode('select');
    } else {
      router.back();
    }
  };

  const handleNfc = async () => {
    setMode('nfc');
    try {
      const data = await readNfcPayment();
      if (data) {
        setScannedData(data);
        setMode('confirm');
      } else {
        Alert.alert('No se detectó', 'No se encontró información de pago válida en la señal NFC.');
        setMode('select');
      }
    } catch {
      setMode('select');
    }
  };

  const handleQr = () => {
    if (!permission?.granted) {
      requestPermission().then((result) => {
        if (result.granted) setMode('qr');
      });
    } else {
      setMode('qr');
    }
  };

  const handleBarcodeScan = (result: BarcodeScanningResult) => {
    if (hasScanned.current) return;

    try {
      const data = JSON.parse(result.data) as ScannedPayment;
      if (data.driverId && data.fare) {
        hasScanned.current = true;
        setScannedData(data);
        setMode('confirm');
      }
    } catch {
      // Not a valid payment QR — ignore
    }
  };

  const handleConfirmPayment = async () => {
    if (!scannedData) return;
    setPaying(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));

    setPaying(false);
    Alert.alert(
      '✅ Pago exitoso',
      `Pagaste Bs. ${scannedData.fare} al conductor #${scannedData.driverId}`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  /* ─── Payment confirmation ───────────────── */
  if (mode === 'confirm' && scannedData) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Confirmar pago</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={s.confirmSection}>
          <View style={s.confirmCircle}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.successGreen} />
          </View>
          <Text style={s.confirmTitle}>QR escaneado</Text>

          <View style={s.confirmCard}>
            <View style={s.confirmRow}>
              <Text style={s.confirmLabel}>Conductor</Text>
              <Text style={s.confirmValue}>#{scannedData.driverId}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.confirmRow}>
              <Text style={s.confirmLabel}>Monto</Text>
              <Text style={s.confirmAmount}>Bs. {scannedData.fare}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={s.payButton}
            activeOpacity={0.85}
            onPress={handleConfirmPayment}
            disabled={paying}
          >
            {paying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="wallet-outline" size={20} color="#fff" />
                <Text style={s.payButtonText}>Pagar Bs. {scannedData.fare}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={s.cancelButton} onPress={handleBack} disabled={paying}>
            <Text style={s.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ─── QR Scanner mode ────────────────────── */
  if (mode === 'qr') {
    if (!permission?.granted) {
      return (
        <View style={qrScannerStyles.permissionContainer}>
          <Ionicons name="camera" size={64} color={Colors.grayNeutral} />
          <Text style={qrScannerStyles.permissionText}>
            Necesitamos tu permiso para abrir la cámara y escanear el código QR.
          </Text>
          <TouchableOpacity style={qrScannerStyles.permissionButton} onPress={requestPermission}>
            <Text style={qrScannerStyles.permissionButtonText}>Otorgar Permiso</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={qrScannerStyles.container}>
        <CameraView
          style={qrScannerStyles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScan}
        >
          {/* Back button */}
          <View style={{ position: 'absolute', top: insets.top + 10, left: 16, zIndex: 10 }}>
            <TouchableOpacity onPress={handleBack} activeOpacity={0.8}>
              <BlurView intensity={80} tint="dark" style={s.blurBack}>
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </BlurView>
            </TouchableOpacity>
          </View>

          <BlurView intensity={40} tint="dark" style={[qrScannerStyles.topOverlay, { paddingTop: insets.top + 20 }]}>
            <Text style={qrScannerStyles.headerTitle}>Pagar Pasaje</Text>
            <Text style={qrScannerStyles.headerSubtitle}>Apunta al código QR del autobús</Text>
          </BlurView>

          <ScannerFrame />
          <ScannerControls />
        </CameraView>
      </View>
    );
  }

  /* ─── NFC listener mode ──────────────────── */
  if (mode === 'nfc') {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Pago NFC</Text>
          <View style={{ width: 22 }} />
        </View>
        <NfcListener />
      </SafeAreaView>
    );
  }

  /* ─── Selection mode ─────────────────────── */
  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Pagar pasaje</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={s.illustration}>
        <View style={s.illustrationCircle}>
          <MaterialCommunityIcons name="contactless-payment" size={56} color={Colors.salmon} />
        </View>
        <Text style={s.subtitle}>¿Cómo deseas pagar?</Text>
        <Text style={s.description}>Escoge el método de pago para tu viaje</Text>
      </View>

      <View style={s.optionsContainer}>
        <TouchableOpacity style={s.optionCard} activeOpacity={0.8} onPress={handleQr}>
          <View style={[s.optionIcon, { backgroundColor: `${Colors.salmon}15` }]}>
            <Ionicons name="qr-code" size={28} color={Colors.salmon} />
          </View>
          <View style={s.optionText}>
            <Text style={s.optionTitle}>Leer código QR</Text>
            <Text style={s.optionDesc}>Escanea el QR del autobús</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.grayNeutral} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.optionCard, !nfcSupported && { opacity: 0.5 }]}
          activeOpacity={nfcSupported ? 0.8 : 1}
          onPress={() => { if (nfcSupported) handleNfc(); }}
        >
          <View style={[s.optionIcon, { backgroundColor: `${Colors.successGreen}15` }]}>
            <MaterialCommunityIcons name="nfc" size={28} color={Colors.successGreen} />
          </View>
          <View style={s.optionText}>
            <Text style={s.optionTitle}>NFC</Text>
            {nfcSupported ? (
              <Text style={s.optionDesc}>Más rápido</Text>
            ) : (
              <Text style={[s.optionDesc, { color: '#92400E' }]}>No disponible en tu dispositivo</Text>
            )}
          </View>
          {nfcSupported ? (
            <View style={s.badge}>
              <Text style={s.badgeText}>⚡ Rápido</Text>
            </View>
          ) : (
            <Ionicons name="warning" size={18} color="#92400E" />
          )}
        </TouchableOpacity>
      </View>
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
  illustration: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.salmon}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.grayNeutral,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgLightGray,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grayNeutral,
  },
  badge: {
    backgroundColor: `${Colors.successGreen}18`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.successGreen,
  },
  blurBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  /* ─── Confirmation styles ────── */
  confirmSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  confirmCircle: {
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 24,
  },
  confirmCard: {
    width: '100%',
    backgroundColor: Colors.bgLightGray,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    marginBottom: 30,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  confirmLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
  confirmValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  confirmAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.salmon,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLightGray,
    marginVertical: 4,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.salmon,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    marginBottom: 12,
  },
  payButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
});
