import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { driverStyles as styles } from '../styles';

const VEHICLES = [
  { id: 'v1', name: 'Yutong ZK6128H', plate: 'AB-123-CD', status: 'Activo', statusColor: Colors.teal },
  { id: 'v2', name: 'Higer KLQ6109', plate: 'XY-789-ZW', status: 'Activo', statusColor: Colors.teal },
  { id: 'v3', name: 'Zhongtong LCK6108', plate: 'MN-456-OP', status: 'En Taller', statusColor: Colors.warning },
];

export function VehicleInfo() {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 16 }}>
      {VEHICLES.map((v) => (
        <TouchableOpacity
          key={v.id}
          style={styles.vehicleCard}
          activeOpacity={0.75}
          onPress={() => router.push('/driver-vehicle' as any)}
        >
          <View style={styles.vehicleHeader}>
            <View style={styles.vehicleIconCircle}>
              <MaterialCommunityIcons name="bus-side" size={22} color={Colors.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleName}>{v.name}</Text>
              <Text style={styles.vehiclePlate}>{v.plate}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: v.statusColor }} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: v.statusColor }}>{v.status}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
