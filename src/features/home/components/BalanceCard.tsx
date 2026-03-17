import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors, Gradients } from '@/theme';
import { homeStyles as styles } from '../styles';

export function BalanceCard() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={Gradients.salmonCard as unknown as [string, string, ...string[]]}
      style={styles.balanceCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Top row: label + amount  |  wallet icon */}
      <View style={styles.balanceTop}>
        <View>
          <Text style={styles.balanceLabel}>Saldo Disponible</Text>
          <Text style={styles.balanceValue}>Bs. 45.80</Text>
        </View>
        <View style={styles.walletIconCircle}>
          <MaterialCommunityIcons name="wallet" size={24} color="#fff" />
        </View>
      </View>

      {/* Recharge button */}
      <TouchableOpacity
        style={styles.rechargeButton}
        onPress={() => router.push('/payment')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="wallet-plus" size={20} color={Colors.salmon} />
        <Text style={styles.rechargeText}>Recargar Monedero</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
