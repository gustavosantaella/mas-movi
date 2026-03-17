import React from 'react';

import { ScreenLayout } from '@/components/ui';
import { BalanceCard } from '@/features/home/components/BalanceCard';
import { QuickActions } from '@/features/home/components/QuickActions';
import { RecentActivity } from '@/features/home/components/RecentActivity';

export default function HomeScreen() {
  return (
    <ScreenLayout>
      {/* Balance */}
      <BalanceCard />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </ScreenLayout>
  );
}
