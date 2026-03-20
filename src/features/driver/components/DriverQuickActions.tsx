import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { driverStyles as styles } from '../styles';

const ACTIONS = [
  {
    id: 'map',
    label: 'Ver Mapa',
    icon: 'map-marker-radius' as const,
    iconColor: Colors.teal,
    iconBg: Colors.tealBg,
    route: null,
  },
  {
    id: 'trips',
    label: 'Mis Viajes',
    icon: 'road-variant' as const,
    iconColor: '#8B5CF6',
    iconBg: '#EDE9FE',
    route: '/driver-trips',
  },
  {
    id: 'earnings',
    label: 'Ganancias',
    icon: 'cash-multiple' as const,
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    route: '/driver-earnings',
  },
  {
    id: 'vehicle',
    label: 'Vehículo',
    icon: 'bus-side' as const,
    iconColor: Colors.salmon,
    iconBg: Colors.peach,
    route: '/driver-vehicle',
  },
];

export function DriverQuickActions() {
  const router = useRouter();

  return (
    <View style={styles.quickActionsRow}>
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.quickActionCard}
          activeOpacity={0.8}
          onPress={() => action.route && router.push(action.route as any)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: action.iconBg }]}>
            <MaterialCommunityIcons name={action.icon} size={26} color={action.iconColor} />
          </View>
          <Text style={styles.quickActionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
