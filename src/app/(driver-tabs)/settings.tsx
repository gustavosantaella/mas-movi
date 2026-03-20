import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { ScreenLayout } from '@/components/ui';
import { VehicleInfo } from '@/features/driver/components/VehicleInfo';
import { driverStyles as styles } from '@/features/driver/styles';

type SettingsItem = {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  iconFamily: 'ionicons' | 'mci';
};

const SETTINGS_GROUPS: { title: string; items: SettingsItem[] }[] = [
  {
    title: 'Conductor',
    items: [
      { id: 'schedule', label: 'Horarios de Trabajo', icon: 'time-outline', iconColor: Colors.teal, iconBg: Colors.tealBg, iconFamily: 'ionicons' },
      { id: 'docs', label: 'Documentos', icon: 'document-text-outline', iconColor: '#8B5CF6', iconBg: '#EDE9FE', iconFamily: 'ionicons' },
      { id: 'routes', label: 'Rutas Asignadas', icon: 'map-marker-path', iconColor: '#F59E0B', iconBg: '#FEF3C7', iconFamily: 'mci' },
    ],
  },
  {
    title: 'Notificaciones',
    items: [
      { id: 'notif-trips', label: 'Nuevos Viajes', icon: 'notifications-outline', iconColor: Colors.salmon, iconBg: Colors.peach, iconFamily: 'ionicons' },
      { id: 'notif-payments', label: 'Pagos Recibidos', icon: 'cash-check', iconColor: Colors.successGreen, iconBg: '#D1FAE5', iconFamily: 'mci' },
    ],
  },
  {
    title: 'Soporte',
    items: [
      { id: 'help', label: 'Centro de Ayuda', icon: 'help-circle-outline', iconColor: Colors.grayNeutral, iconBg: Colors.bgLightGray, iconFamily: 'ionicons' },
      { id: 'report', label: 'Reportar Problema', icon: 'alert-circle-outline', iconColor: '#EF4444', iconBg: '#FEE2E2', iconFamily: 'ionicons' },
    ],
  },
];

export default function SettingsScreen() {
  return (
    <ScreenLayout>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ajustes</Text>
      </View>

      {/* Vehicle Info */}
      <VehicleInfo />

      {/* Settings Groups */}
      {SETTINGS_GROUPS.map((group) => (
        <View key={group.title} style={styles.settingsGroup}>
          <Text style={styles.settingsGroupTitle}>{group.title}</Text>
          {group.items.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.settingsItem,
                idx === 0 && styles.settingsItemFirst,
                idx === group.items.length - 1 && styles.settingsItemLast,
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.settingsItemIcon, { backgroundColor: item.iconBg }]}>
                {item.iconFamily === 'ionicons' ? (
                  <Ionicons name={item.icon as any} size={18} color={item.iconColor} />
                ) : (
                  <MaterialCommunityIcons name={item.icon as any} size={18} color={item.iconColor} />
                )}
              </View>
              <Text style={styles.settingsItemLabel}>{item.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.grayNeutral}
                style={styles.settingsItemArrow}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScreenLayout>
  );
}
