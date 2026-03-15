import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { profileStyles as styles } from '../styles';

type SettingItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const SETTINGS: SettingItem[] = [
  { icon: 'person-outline', label: 'Información Personal' },
  { icon: 'shield-checkmark-outline', label: 'Seguridad' },
  { icon: 'help-buoy-outline', label: 'Soporte Técnico' },
];

export function SettingsList() {
  return (
    <>
      <Text style={styles.sectionTitle}>Ajustes de la Cuenta</Text>
      <View style={styles.settingsList}>
        {SETTINGS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.settingItem,
              index === SETTINGS.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Ionicons name={item.icon} size={22} color={Colors.textPrimary} />
            <Text style={styles.settingText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
