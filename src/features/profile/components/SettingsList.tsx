import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { profileStyles as styles } from '../styles';
import { UserProfile } from '@/services/userService';

type SettingItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  iconBg: string;
  iconColor: string;
  requiresOnline?: boolean;
};

const SETTINGS: SettingItem[] = [
  {
    icon: 'person-outline',
    label: 'Información Personal',
    route: '/(shared)/personal-info',
    iconBg: Colors.peach,
    iconColor: Colors.salmon,
    requiresOnline: true,
  },
  {
    icon: 'shield-checkmark-outline',
    label: 'Seguridad',
    route: '/(shared)/security',
    iconBg: `${Colors.salmonLight}30`,
    iconColor: Colors.salmonLight,
    requiresOnline: true,
  },
  {
    icon: 'headset-outline',
    label: 'Soporte Técnico',
    route: '/profile/support',
    iconBg: `${Colors.successGreen}20`,
    iconColor: Colors.successGreen,
  },
];

interface SettingsListProps {
  user?: UserProfile | null;
  offline?: boolean;
}

export function SettingsList({ user, offline = false }: SettingsListProps) {
  const router = useRouter();

  return (
    <View style={styles.settingsList}>
      {SETTINGS.map((item) => {
        const disabled = (item.requiresOnline && offline) || item.route.startsWith('/profile/');

        return (
          <TouchableOpacity
            key={item.label}
            style={[styles.settingItem, disabled && { opacity: 0.4 }]}
            activeOpacity={disabled ? 1 : 0.75}
            onPress={() => {
              if (disabled) return;
              router.replace(item.route as any);
            }}
          >
            <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={20} color={item.iconColor} />
            </View>
            <Text style={styles.settingText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.grayNeutral} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
