import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { driverStyles as styles } from '../styles';

export function TripCard() {
  return (
    <View style={styles.activeTripCard}>
      <View style={styles.activeTripBadge}>
        <Text style={styles.activeTripBadgeText}>● EN CURSO</Text>
      </View>

      <View style={styles.activeTripRoute}>
        <Text style={styles.activeTripLabel}>ORIGEN</Text>
        <Text style={styles.activeTripValue}>Plaza Venezuela, Caracas</Text>
        <View style={styles.activeTripDivider} />
        <Text style={styles.activeTripLabel}>DESTINO</Text>
        <Text style={styles.activeTripValue}>Chacaíto, Caracas</Text>
      </View>

      <View style={styles.activeTripStatsRow}>
        <View style={styles.activeTripStat}>
          <Text style={styles.activeTripStatValue}>3</Text>
          <Text style={styles.activeTripStatLabel}>Pasajeros</Text>
        </View>
        <View style={styles.activeTripStat}>
          <Text style={styles.activeTripStatValue}>15 min</Text>
          <Text style={styles.activeTripStatLabel}>ETA</Text>
        </View>
        <View style={styles.activeTripStat}>
          <Text style={styles.activeTripStatValue}>Bs. 12.50</Text>
          <Text style={styles.activeTripStatLabel}>Tarifa</Text>
        </View>
      </View>
    </View>
  );
}
