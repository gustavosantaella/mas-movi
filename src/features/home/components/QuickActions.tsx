import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { homeStyles as styles } from '../styles';

export function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.quickActionsRow}>
      {/* Análisis con IA */}
      <TouchableOpacity
        style={styles.quickActionCard}
        activeOpacity={0.8}
        onPress={() => router.push('/ai-route')}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: '#EDE9FE' }]}>
          <MaterialCommunityIcons name="auto-fix" size={26} color="#8B5CF6" />
        </View>
        <Text style={styles.quickActionLabel}>Análisis con IA</Text>
      </TouchableOpacity>

      {/* Estadísticas */}
      <TouchableOpacity
        style={styles.quickActionCard}
        activeOpacity={0.8}
        onPress={() => router.push('/trip-history')}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5' }]}>
          <MaterialCommunityIcons name="trending-up" size={26} color="#10B981" />
        </View>
        <Text style={styles.quickActionLabel}>Estadísticas</Text>
      </TouchableOpacity>
    </View>
  );
}
