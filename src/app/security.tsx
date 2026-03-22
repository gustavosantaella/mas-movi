import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, UserProfile } from '@/services/userService';

type SecurityItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  statusKey?: keyof UserProfile;
};

const ITEMS: SecurityItem[] = [
  {
    icon: 'mail-outline',
    label: 'Correo verificado',
    statusKey: 'emailConfirmed',
  },
  {
    icon: 'finger-print-outline',
    label: 'Verificar identidad',
    route: '/verify-entity',
    statusKey: 'entityConfirmed',
  },
  {
    icon: 'lock-closed-outline',
    label: 'Cambiar contraseña',
    route: '/(auth)/forgot-password',
  },
];

export default function SecurityScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getProfile(token)
      .then((res) => { if (res.data) setUser(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.salmon} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Seguridad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ITEMS.map((item) => {
          const confirmed = item.statusKey ? !!(user as any)?.[item.statusKey] : undefined;

          return (
            <TouchableOpacity
              key={item.label}
              style={s.item}
              activeOpacity={0.75}
              onPress={() => {
                if (item.route) {
                  if (item.statusKey && confirmed) return;
                  router.push(item.route as any);
                }
              }}
            >
              <View
                style={[
                  s.iconBox,
                  {
                    backgroundColor:
                      confirmed === true
                        ? `${Colors.successGreen}20`
                        : confirmed === false
                          ? `${Colors.coralIntense}15`
                          : `${Colors.salmon}15`,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={
                    confirmed === true
                      ? Colors.successGreen
                      : confirmed === false
                        ? Colors.coralIntense
                        : Colors.salmon
                  }
                />
              </View>
              <Text style={s.itemText}>{item.label}</Text>
              {confirmed !== undefined ? (
                confirmed ? (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.successGreen} />
                ) : (
                  <Ionicons name="close-circle" size={22} color={Colors.coralIntense} />
                )
              ) : (
                <Ionicons name="chevron-forward" size={20} color={Colors.grayNeutral} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgLightGray,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
