import React from 'react';
import { View, Text } from 'react-native';

import { driverStyles as styles } from '../styles';

const WEEK_DATA = [
  { day: 'Lun', amount: 95, label: 'Bs. 95' },
  { day: 'Mar', amount: 128, label: 'Bs. 128' },
  { day: 'Mié', amount: 74, label: 'Bs. 74' },
  { day: 'Jue', amount: 156, label: 'Bs. 156' },
  { day: 'Vie', amount: 142, label: 'Bs. 142' },
  { day: 'Sáb', amount: 198, label: 'Bs. 198' },
  { day: 'Dom', amount: 65, label: 'Bs. 65' },
];

const MAX = Math.max(...WEEK_DATA.map((d) => d.amount));

export function EarningsChart() {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Resumen Semanal</Text>
      {WEEK_DATA.map((item) => (
        <View key={item.day} style={styles.chartRow}>
          <Text style={styles.chartLabel}>{item.day}</Text>
          <View style={styles.chartBarBg}>
            <View
              style={[
                styles.chartBar,
                { width: `${(item.amount / MAX) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.chartValue}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
