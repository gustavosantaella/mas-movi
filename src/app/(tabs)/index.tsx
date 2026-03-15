import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { GradientScreen, SectionTitle } from '@/components/ui';
import { BalanceCard } from '@/features/home/components/BalanceCard';
import { QuickActions } from '@/features/home/components/QuickActions';
import { homeStyles as styles } from '@/features/home/styles';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <GradientScreen scrollable>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, Juan 👋</Text>
          <Text style={styles.subtitle}>¿A dónde viajamos hoy?</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <FontAwesome name="user" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Balance */}
      <BalanceCard />

      {/* Actions */}
      <SectionTitle title="Acciones Rápidas" />
      <QuickActions />
    </GradientScreen>
  );
}
