import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { driverStyles as styles } from '../styles';

const STATUSES = ['Disponible', 'Ocupado', 'Desconectado'] as const;
type Status = typeof STATUSES[number];

export function StatusToggle() {
  const [status, setStatus] = useState<Status>('Disponible');

  return (
    <View style={styles.statusContainer}>
      <Text style={styles.statusLabel}>Estado Actual</Text>
      <View style={styles.statusPillRow}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.statusPill, status === s && styles.statusPillActive]}
            onPress={() => setStatus(s)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.statusPillText,
                status === s && styles.statusPillTextActive,
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
