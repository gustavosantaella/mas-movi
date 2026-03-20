import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { driverStyles as styles } from '../styles';

export function VehicleInfo() {
  return (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleIconCircle}>
          <MaterialCommunityIcons name="bus-side" size={26} color={Colors.teal} />
        </View>
        <View>
          <Text style={styles.vehicleName}>Yutong ZK6128H</Text>
          <Text style={styles.vehiclePlate}>AB-123-CD</Text>
        </View>
      </View>

      <View style={styles.vehicleStatsRow}>
        <View style={styles.vehicleStatBox}>
          <Text style={styles.vehicleStatValue}>40</Text>
          <Text style={styles.vehicleStatLabel}>Capacidad</Text>
        </View>
        <View style={styles.vehicleStatBox}>
          <Text style={styles.vehicleStatValue}>2024</Text>
          <Text style={styles.vehicleStatLabel}>Año</Text>
        </View>
        <View style={styles.vehicleStatBox}>
          <Text style={styles.vehicleStatValue}>Activo</Text>
          <Text style={styles.vehicleStatLabel}>Estado</Text>
        </View>
      </View>
    </View>
  );
}
