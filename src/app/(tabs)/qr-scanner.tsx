import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScannerFrame } from '@/features/qr-scanner/components/ScannerFrame';
import { ScannerControls } from '@/features/qr-scanner/components/ScannerControls';
import { qrScannerStyles as styles } from '@/features/qr-scanner/styles';

export default function QRScannerScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera" size={64} color="#8892B0" />
        <Text style={styles.permissionText}>
          Necesitamos tu permiso para abrir la cámara y escanear el código QR.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Otorgar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        {/* Top Overlay */}
        <BlurView intensity={40} tint="dark" style={[styles.topOverlay, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.headerTitle}>Pagar Pasaje</Text>
          <Text style={styles.headerSubtitle}>Apunta al código QR del autobús</Text>
        </BlurView>

        <ScannerFrame />
        <ScannerControls />
      </CameraView>
    </View>
  );
}
