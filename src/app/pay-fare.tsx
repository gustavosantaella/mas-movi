import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { NfcListener } from '@/components/ui';
import { ScannerFrame } from '@/features/qr-scanner/components/ScannerFrame';
import { ScannerControls } from '@/features/qr-scanner/components/ScannerControls';
import { qrScannerStyles } from '@/features/qr-scanner/styles';

type PaymentMode = 'select' | 'qr' | 'nfc';

export default function QRScannerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<PaymentMode>('select');

  const handleBack = () => {
    if (mode === 'qr' || mode === 'nfc') {
      setMode('select');
    } else {
      router.back();
    }
  };

  const handleNfc = () => {
    setMode('nfc');
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
        <CameraView style={qrScannerStyles.camera} facing="back">
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
      <View style={s.container}>
        <View style={[s.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Pago NFC</Text>
          <View style={{ width: 22 }} />
        </View>
        <NfcListener />
      </View>
    );
  }

  /* ─── Selection mode ─────────────────────── */
  return (
    <View style={s.container}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Pagar pasaje</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Illustration */}
      <View style={s.illustration}>
        <View style={s.illustrationCircle}>
          <MaterialCommunityIcons name="contactless-payment" size={56} color={Colors.salmon} />
        </View>
        <Text style={s.subtitle}>¿Cómo deseas pagar?</Text>
        <Text style={s.description}>Escoge el método de pago para tu viaje</Text>
      </View>

      {/* Options */}
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

        <TouchableOpacity style={s.optionCard} activeOpacity={0.8} onPress={handleNfc}>
          <View style={[s.optionIcon, { backgroundColor: `${Colors.successGreen}15` }]}>
            <MaterialCommunityIcons name="nfc" size={28} color={Colors.successGreen} />
          </View>
          <View style={s.optionText}>
            <Text style={s.optionTitle}>NFC</Text>
            <Text style={s.optionDesc}>Más rápido</Text>
          </View>
          <View style={s.badge}>
            <Text style={s.badgeText}>⚡ Rápido</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
});
