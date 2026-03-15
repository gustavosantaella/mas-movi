import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors, Gradients } from '@/theme';
import { GlassCard } from '@/components/ui';
import { AvatarSection } from '@/features/profile/components/AvatarSection';
import { SettingsList } from '@/features/profile/components/SettingsList';
import { profileStyles as styles } from '@/features/profile/styles';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={Gradients.dark as unknown as [string, string, ...string[]]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <AvatarSection />

        {/* User ID Card */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <MaterialIcons name="fingerprint" size={22} color={Colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue}>USR-8A7B-49C2</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="copy-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        <SettingsList />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color={Colors.textDanger} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
