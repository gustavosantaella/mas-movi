import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { driverStyles as styles } from '@/features/driver/styles';

export default function QRGenerateScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.qrContainer, { paddingTop: insets.top + 20 }]}>
      <View style={styles.qrCard}>
        {/* QR Placeholder (large dark box simulating QR) */}
        <View style={styles.qrPlaceholder}>
          <Ionicons name="qr-code" size={120} color={Colors.tealLight} />
        </View>

        <Text style={styles.qrTitle}>Tu Código QR</Text>
        <Text style={styles.qrSubtitle}>
          Los pasajeros pueden escanear este código para pagar su pasaje.
        </Text>

        {/* Vehicle info chip */}
        <View style={styles.qrVehicleInfo}>
          <MaterialCommunityIcons name="bus-side" size={20} color={Colors.teal} />
          <Text style={styles.qrVehicleText}>Yutong ZK6128H • AB-123-CD</Text>
        </View>
      </View>
    </View>
  );
}
