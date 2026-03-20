import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Gradients } from '@/theme';
import { driverStyles as styles } from '../styles';

export function EarningsCard() {
  return (
    <LinearGradient
      colors={Gradients.tealCard as unknown as [string, string, ...string[]]}
      style={styles.earningsCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.earningsTop}>
        <View>
          <Text style={styles.earningsLabel}>Ganancias Hoy</Text>
          <Text style={styles.earningsValue}>Bs. 128.50</Text>
        </View>
        <View style={styles.earningsIconCircle}>
          <MaterialCommunityIcons name="steering" size={24} color="#fff" />
        </View>
      </View>

      <View style={styles.earningsStatsRow}>
        <View style={styles.earningsStatBox}>
          <Text style={styles.earningsStatValue}>12</Text>
          <Text style={styles.earningsStatLabel}>Viajes</Text>
        </View>
        <View style={styles.earningsStatBox}>
          <Text style={styles.earningsStatValue}>4.8</Text>
          <Text style={styles.earningsStatLabel}>Rating</Text>
        </View>
        <View style={styles.earningsStatBox}>
          <Text style={styles.earningsStatValue}>6h</Text>
          <Text style={styles.earningsStatLabel}>En línea</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
