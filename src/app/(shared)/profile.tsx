import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Gradients } from '@/theme';
import { BottomSheet } from '@/components/ui';
import { AvatarSection } from '@/features/profile/components/AvatarSection';
import { SettingsList } from '@/features/profile/components/SettingsList';
import { profileStyles as styles } from '@/features/profile/styles';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, getCachedProfile, isOnline, UserProfile } from '@/services/userService';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    (async () => {
      // Show cached data instantly
      const cached = await getCachedProfile();
      if (cached) setUser(cached);

      // Then try to fetch fresh data
      const online = await isOnline();
      setOffline(!online);

      if (online && token) {
        try {
          const res = await getProfile(token);
          if (res.data) setUser(res.data);
        } catch {}
      }
    })();
  }, []);

  const handleDismiss = () => {
    router.back();
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <BottomSheet onDismiss={handleDismiss}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Avatar + Name + ID */}
          <AvatarSection user={user} />

          {/* Info cards */}
          <View style={styles.infoCardsSection}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
            </View>
            {user?.firstName ? (
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>
                  {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                </Text>
              </View>
            ) : null}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Miembro desde</Text>
              <Text style={styles.infoValue}>
                {user?.createdAt
                  ? (() => {
                      const d = new Date(user.createdAt).toLocaleDateString('es-VE', {
                        month: 'long',
                        year: 'numeric',
                      });
                      return d.charAt(0).toUpperCase() + d.slice(1);
                    })()
                  : '—'}
              </Text>
            </View>
          </View>

          {/* Settings navigation */}
          <SettingsList user={user} offline={offline} />

          {/* Logout button — hidden offline */}
          {!offline && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={Gradients.accent as unknown as [string, string, ...string[]]}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 30,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.closeButtonText}>Cerrar sesión</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
