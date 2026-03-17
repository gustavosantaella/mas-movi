import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/theme';
import { BalanceCard } from '@/features/home/components/BalanceCard';
import { QuickActions } from '@/features/home/components/QuickActions';
import { RecentActivity } from '@/features/home/components/RecentActivity';
import { homeStyles as styles } from '@/features/home/styles';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { onScroll } = useTabBarVisibility();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={(e) => onScroll(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.profileAvatar}
              onPress={() => router.push('/profile')}
              activeOpacity={0.8}
            >
              <FontAwesome name="user" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerName}>Guayaba</Text>
          </View>

        </View>

        {/* Balance */}
        <BalanceCard />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity />
      </ScrollView>
    </View>
  );
}
