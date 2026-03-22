import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { ScreenLayout } from '@/components/ui';

export default function DriverSettingsScreen() {
  const router = useRouter();

  return (
    <ScreenLayout>
      <Text style={s.title}>Configuración</Text>

      <TouchableOpacity
        style={s.item}
        activeOpacity={0.75}
        onPress={() => router.push('/profile' as any)}
      >
        <View style={[s.icon, { backgroundColor: `${Colors.salmon}15` }]}>
          <Ionicons name="person-outline" size={20} color={Colors.salmon} />
        </View>
        <Text style={s.itemText}>Mi perfil</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.grayNeutral} />
      </TouchableOpacity>

      <TouchableOpacity
        style={s.item}
        activeOpacity={0.75}
        onPress={() => router.push('/personal-info' as any)}
      >
        <View style={[s.icon, { backgroundColor: Colors.peach }]}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.salmon} />
        </View>
        <Text style={s.itemText}>Información personal</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.grayNeutral} />
      </TouchableOpacity>

      <TouchableOpacity
        style={s.item}
        activeOpacity={0.75}
        onPress={() => router.push('/security' as any)}
      >
        <View style={[s.icon, { backgroundColor: `${Colors.salmonLight}30` }]}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.salmonLight} />
        </View>
        <Text style={s.itemText}>Seguridad</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.grayNeutral} />
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: Colors.charcoal, marginBottom: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgLightGray,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.charcoal,
  },
});
