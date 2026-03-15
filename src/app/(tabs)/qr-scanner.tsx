import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ScannerFrame } from '@/features/qr-scanner/components/ScannerFrame';
import { ScannerControls } from '@/features/qr-scanner/components/ScannerControls';
import { qrScannerStyles as styles } from '@/features/qr-scanner/styles';

export default function QRScannerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleBack = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.8, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start(() => router.back());
  };

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
        {/* Back Button */}
        <Animated.View style={{
          position: 'absolute',
          top: insets.top + 10,
          left: 16,
          zIndex: 10,
          transform: [{ scale: scaleAnim }],
        }}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.8}>
            <BlurView intensity={80} tint="dark" style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

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
