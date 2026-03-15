import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Gradients } from '@/theme';
import { homeStyles as styles } from '../styles';

export function BalanceCard() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={Gradients.surface as unknown as [string, string, ...string[]]}
      style={styles.balanceCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View>
        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
        <Text style={styles.balanceValue}>$450.00 MXN</Text>
      </View>
      <TouchableOpacity
        style={styles.topUpButton}
        onPress={() => router.push('/payment')}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.topUpText}>Recarga</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
