import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { profileStyles as styles } from '@/features/profile/styles';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, UserProfile } from '@/services/userService';

type SecurityItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  statusKey?: keyof UserProfile;
};

const ITEMS: SecurityItem[] = [
  { icon: 'mail-outline', label: 'Correo verificado', statusKey: 'emailConfirmed' },
  { icon: 'finger-print-outline', label: 'Verificar identidad', route: '/(shared)/verify-entity', statusKey: 'entityConfirmed' },
  { icon: 'lock-closed-outline', label: 'Cambiar contraseña', route: '/(auth)/forgot-password' },
];

export default function SecurityScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((res) => { if (res.data) setUser(res.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgWhite }}>
      <View style={styles.handle} />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.salmon} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ marginRight: 14 }}>
                <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.charcoal }}>
                Seguridad
              </Text>
            </View>

            <View style={styles.settingsList}>
              {ITEMS.map((item) => {
                const confirmed = item.statusKey ? !!(user as any)?.[item.statusKey] : undefined;

                return (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.settingItem}
                    activeOpacity={0.75}
                    onPress={() => {
                      if (item.route) {
                        if (item.statusKey && confirmed) return;
                        router.replace(item.route as any);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.settingIcon,
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
                    <Text style={styles.settingText}>{item.label}</Text>
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
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
