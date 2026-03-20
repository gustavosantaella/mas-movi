import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { ScreenLayout } from '@/components/ui';
import { EarningsChart } from '@/features/driver/components/EarningsChart';
import { driverStyles as styles } from '@/features/driver/styles';

const PAYOUT_HISTORY = [
  { id: '1', date: 'Hoy', trips: 12, amount: 'Bs. 128.50' },
  { id: '2', date: 'Ayer', trips: 15, amount: 'Bs. 156.00' },
  { id: '3', date: '18 Mar', trips: 10, amount: 'Bs. 95.00' },
  { id: '4', date: '17 Mar', trips: 8, amount: 'Bs. 74.00' },
];

export default function EarningsScreen() {
  return (
    <ScreenLayout>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ganancias</Text>
      </View>

      {/* Payout Summary Card */}
      <View style={styles.payoutCard}>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutLabel}>Disponible para retiro</Text>
          <Text style={[styles.payoutValue, { color: Colors.teal, fontSize: 24, fontWeight: '900' }]}>
            Bs. 858.00
          </Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutLabel}>Viajes esta semana</Text>
          <Text style={styles.payoutValue}>45</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutLabel}>Promedio por viaje</Text>
          <Text style={styles.payoutValue}>Bs. 19.07</Text>
        </View>
        <TouchableOpacity style={styles.payoutButton} activeOpacity={0.85}>
          <Text style={styles.payoutButtonText}>Solicitar Retiro</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Chart */}
      <EarningsChart />

      {/* Daily Breakdown */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Desglose Diario</Text>
      </View>

      {PAYOUT_HISTORY.map((day) => (
        <TouchableOpacity key={day.id} style={styles.tripCard} activeOpacity={0.75}>
          <View style={styles.tripCardHeader}>
            <View style={styles.tripCardPassenger}>
              <View style={styles.tripCardAvatar}>
                <MaterialCommunityIcons name="calendar" size={16} color={Colors.teal} />
              </View>
              <View>
                <Text style={styles.tripCardName}>{day.date}</Text>
                <Text style={styles.tripCardTime}>{day.trips} viajes</Text>
              </View>
            </View>
            <Text style={styles.tripCardAmount}>{day.amount}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScreenLayout>
  );
}
