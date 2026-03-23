import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { ScreenLayout } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { getCachedProfile, UserProfile } from '@/services/userService';

export default function DriverHomeScreen() {
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getCachedProfile().then((p) => { if (p) setUser(p); });
  }, []);

  return (
    <ScreenLayout>
      {/* Balance Card */}
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>Saldo disponible</Text>
        <Text style={s.balanceAmount}>Bs. 0,00</Text>
        <View style={s.balanceRow}>
          <View style={s.balanceStat}>
            <Ionicons name="trending-up" size={16} color={Colors.successGreen} />
            <Text style={[s.balanceStatText, { color: Colors.successGreen }]}>Hoy: Bs. 0</Text>
          </View>
          <View style={s.balanceStat}>
            <Ionicons name="people-outline" size={16} color={Colors.grayNeutral} />
            <Text style={s.balanceStatText}>0 pasajeros</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <Text style={s.sectionTitle}>Resumen del día</Text>
      <View style={s.statsGrid}>
        <View style={s.statCard}>
          <View style={[s.statIcon, { backgroundColor: `${Colors.salmon}15` }]}>
            <MaterialCommunityIcons name="bus" size={22} color={Colors.salmon} />
          </View>
          <Text style={s.statValue}>0</Text>
          <Text style={s.statLabel}>Viajes</Text>
        </View>
        <View style={s.statCard}>
          <View style={[s.statIcon, { backgroundColor: `${Colors.successGreen}15` }]}>
            <Ionicons name="cash-outline" size={22} color={Colors.successGreen} />
          </View>
          <Text style={s.statValue}>Bs. 0</Text>
          <Text style={s.statLabel}>Ingresos</Text>
        </View>
        <View style={s.statCard}>
          <View style={[s.statIcon, { backgroundColor: `${Colors.salmonLight}15` }]}>
            <Ionicons name="star-outline" size={22} color={Colors.salmonLight} />
          </View>
          <Text style={s.statValue}>—</Text>
          <Text style={s.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <Text style={s.sectionTitle}>Actividad reciente</Text>
      <View style={s.emptyActivity}>
        <Ionicons name="receipt-outline" size={40} color={Colors.grayNeutral} />
        <Text style={s.emptyText}>No hay actividad aún</Text>
        <Text style={s.emptySubtext}>Genera un QR para empezar a cobrar pasajes</Text>
      </View>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  balanceCard: {
    backgroundColor: Colors.charcoal,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 20,
  },
  balanceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceStatText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgLightGray,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.bgLightGray,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grayNeutral,
    marginTop: 4,
  },
});
