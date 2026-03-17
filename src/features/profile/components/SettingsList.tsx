import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { profileStyles as styles } from '../styles';

type SettingItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  iconBg: string;
  iconColor: string;
};

const SETTINGS: SettingItem[] = [
  {
    icon: 'person-outline',
    label: 'Información Personal',
    route: '/profile/personal',
    iconBg: Colors.peach,
    iconColor: Colors.salmon,
  },
  {
    icon: 'shield-checkmark-outline',
    label: 'Seguridad',
    route: '/profile/security',
    iconBg: '#DBEAFE',
    iconColor: '#3B82F6',
  },
  {
    icon: 'headset-outline',
    label: 'Soporte Técnico',
    route: '/profile/support',
    iconBg: '#D1FAE5',
    iconColor: Colors.successGreen,
  },
];

export function SettingsList() {
  const router = useRouter();

  return (
    <View style={styles.settingsList}>
      {SETTINGS.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.settingItem}
          activeOpacity={0.75}
          onPress={() => {
            // Routes to be implemented later
            // router.push(item.route);
          }}
        >
          <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={20} color={item.iconColor} />
          </View>
          <Text style={styles.settingText}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.grayNeutral} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
