import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Gradients } from '@/theme';

const WEEK_DATA = [
  { day: 'Lun', amount: 95 },
  { day: 'Mar', amount: 128 },
  { day: 'Mié', amount: 74 },
  { day: 'Jue', amount: 156 },
  { day: 'Vie', amount: 142 },
  { day: 'Sáb', amount: 198 },
  { day: 'Dom', amount: 65 },
];
const MAX = Math.max(...WEEK_DATA.map(d => d.amount));
const TOTAL_WEEK = WEEK_DATA.reduce((s, d) => s + d.amount, 0);

type Period = 'semana' | 'mes' | 'año';

const TRANSACTION_HISTORY = [
  { id: '1', type: 'earning', label: '12 viajes completados', date: 'Hoy', amount: '+Bs. 128.50' },
  { id: '2', type: 'earning', label: '15 viajes completados', date: 'Ayer', amount: '+Bs. 156.00' },
  { id: '3', type: 'withdrawal', label: 'Retiro a Pago Móvil', date: '17 Mar', amount: '-Bs. 300.00' },
  { id: '4', type: 'earning', label: '10 viajes completados', date: '16 Mar', amount: '+Bs. 95.00' },
  { id: '5', type: 'earning', label: '8 viajes completados', date: '15 Mar', amount: '+Bs. 74.00' },
  { id: '6', type: 'bonus', label: 'Bono por alto rendimiento', date: '14 Mar', amount: '+Bs. 25.00' },
  { id: '7', type: 'withdrawal', label: 'Retiro a cuenta bancaria', date: '13 Mar', amount: '-Bs. 400.00' },
  { id: '8', type: 'earning', label: '14 viajes completados', date: '12 Mar', amount: '+Bs. 142.00' },
];

const iconMap: Record<string, { icon: string; color: string }> = {
  earning: { icon: 'cash-plus', color: Colors.tealLight },
  withdrawal: { icon: 'bank-transfer-out', color: Colors.accent },
  bonus: { icon: 'star-circle', color: Colors.warning },
};

export default function DriverEarningsDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('semana');

  return (
    <LinearGradient
      colors={Gradients.main as unknown as [string, string, ...string[]]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ganancias</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <LinearGradient
          colors={['#0D9488', '#2DD4BF'] as [string, string]}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.balanceLabel}>Disponible para Retiro</Text>
          <Text style={styles.balanceValue}>Bs. 858.00</Text>
          <View style={styles.balanceStatsRow}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatValue}>Bs. {TOTAL_WEEK}</Text>
              <Text style={styles.balanceStatLabel}>Esta semana</Text>
            </View>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatValue}>45</Text>
              <Text style={styles.balanceStatLabel}>Viajes</Text>
            </View>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatValue}>Bs. 19</Text>
              <Text style={styles.balanceStatLabel}>Promedio</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.withdrawButton} activeOpacity={0.85}>
            <MaterialCommunityIcons name="bank-transfer-out" size={18} color={Colors.teal} />
            <Text style={styles.withdrawButtonText}>Solicitar Retiro</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Period Selector */}
        <View style={styles.periodRow}>
          {(['semana', 'mes', 'año'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodChip, period === p && styles.periodChipActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.75}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Resumen Semanal</Text>
          {WEEK_DATA.map(item => (
            <View key={item.day} style={styles.chartRow}>
              <Text style={styles.chartLabel}>{item.day}</Text>
              <View style={styles.chartBarBg}>
                <LinearGradient
                  colors={['#0D9488', '#2DD4BF'] as [string, string]}
                  style={[styles.chartBar, { width: `${(item.amount / MAX) * 100}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <Text style={styles.chartValue}>Bs. {item.amount}</Text>
            </View>
          ))}
        </View>

        {/* Transaction History */}
        <Text style={styles.sectionTitle}>Historial de Movimientos</Text>

        {TRANSACTION_HISTORY.map(tx => {
          const cfg = iconMap[tx.type] || iconMap.earning;
          const isPositive = tx.amount.startsWith('+');
          return (
            <View key={tx.id} style={styles.txCard}>
              <View style={[styles.txIcon, { backgroundColor: `${cfg.color}20` }]}>
                <MaterialCommunityIcons name={cfg.icon as any} size={20} color={cfg.color} />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txLabel}>{tx.label}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: isPositive ? Colors.tealLight : Colors.accent }]}>
                {tx.amount}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // Balance Card
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  balanceValue: { color: '#fff', fontSize: 42, fontWeight: '900', letterSpacing: -1, marginVertical: 8 },
  balanceStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  balanceStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  balanceStatValue: { color: '#fff', fontSize: 16, fontWeight: '800' },
  balanceStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  withdrawButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  withdrawButtonText: { color: Colors.teal, fontSize: 16, fontWeight: '700' },

  // Period Selector
  periodRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSurface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  periodChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  periodChipActive: {
    backgroundColor: Colors.teal,
  },
  periodText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  periodTextActive: { color: '#fff' },

  // Chart
  chartCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  chartTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  chartRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  chartLabel: { width: 32, color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chartBarBg: {
    flex: 1,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  chartBar: { height: 22, borderRadius: 11 },
  chartValue: { width: 60, color: '#fff', fontSize: 13, fontWeight: '600', textAlign: 'right' },

  // Section
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 14 },

  // Transactions
  txCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txInfo: { flex: 1 },
  txLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  txDate: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '700', marginLeft: 8 },
});
