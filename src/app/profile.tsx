import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Colors, Gradients } from '@/theme';
import { AvatarSection } from '@/features/profile/components/AvatarSection';
import { SettingsList } from '@/features/profile/components/SettingsList';
import { profileStyles as styles } from '@/features/profile/styles';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        {/* Handle bar */}
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Avatar + Name + ID */}
            <AvatarSection />

            {/* Info cards */}
            <View style={styles.infoCardsSection}>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>maria.rodriguez@email.com</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Miembro desde</Text>
                <Text style={styles.infoValue}>Enero 2026</Text>
              </View>
            </View>

            {/* Settings navigation */}
            <SettingsList />

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={Gradients.salmonCard as unknown as [string, string, ...string[]]}
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
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
