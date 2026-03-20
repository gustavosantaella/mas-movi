import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { ScreenLayout } from '@/components/ui';
import { BalanceCard } from '@/features/home/components/BalanceCard';
import { QuickActions } from '@/features/home/components/QuickActions';
import { RecentActivity } from '@/features/home/components/RecentActivity';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenLayout>
      {/* Temp: Switch to driver mode */}
      <TouchableOpacity
        style={localStyles.driverSwitch}
        onPress={() => router.push('/(driver-tabs)' as any)}
        activeOpacity={0.85}
      >
        <Text style={localStyles.driverSwitchText}>🚌  Modo Conductor</Text>
      </TouchableOpacity>

      {/* Balance */}
      <BalanceCard />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </ScreenLayout>
  );
}

const localStyles = StyleSheet.create({
  driverSwitch: {
    backgroundColor: Colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  driverSwitchText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
