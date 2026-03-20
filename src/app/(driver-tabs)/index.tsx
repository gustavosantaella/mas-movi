import React from 'react';

import { ScreenLayout } from '@/components/ui';
import { EarningsCard } from '@/features/driver/components/EarningsCard';
import { StatusToggle } from '@/features/driver/components/StatusToggle';
import { DriverQuickActions } from '@/features/driver/components/DriverQuickActions';
import { RecentTrips } from '@/features/driver/components/RecentTrips';

export default function DriverHomeScreen() {
  return (
    <ScreenLayout>
      {/* Earnings Overview */}
      <EarningsCard />

      {/* Driver Status */}
      <StatusToggle />

      {/* Quick Actions */}
      <DriverQuickActions />

      {/* Recent Trips */}
      <RecentTrips />
    </ScreenLayout>
  );
}
