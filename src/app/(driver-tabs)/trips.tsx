import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { ScreenLayout } from '@/components/ui';
import { TripCard } from '@/features/driver/components/TripCard';
import { driverStyles as styles } from '@/features/driver/styles';

type Filter = 'todos' | 'hoy' | 'semana';

const TRIP_HISTORY = [
  { id: '1', passenger: 'María G.', time: '08:30', amount: '+Bs. 12.50', route: 'Plaza Venezuela → Chacaíto' },
  { id: '2', passenger: 'Carlos R.', time: '09:15', amount: '+Bs. 8.00', route: 'Altamira → Los Palos Grandes' },
  { id: '3', passenger: 'Ana M.', time: '10:00', amount: '+Bs. 15.00', route: 'Sabana Grande → El Silencio' },
  { id: '4', passenger: 'José L.', time: '11:20', amount: '+Bs. 10.00', route: 'Parque Central → La Candelaria' },
  { id: '5', passenger: 'Laura P.', time: '12:45', amount: '+Bs. 18.00', route: 'Las Mercedes → Chuao' },
];

export default function TripsScreen() {
  const [filter, setFilter] = useState<Filter>('hoy');

  return (
    <ScreenLayout>
      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Viajes</Text>
      </View>

      {/* Active Trip */}
      <TripCard />

      {/* Filters */}
      <View style={styles.filterRow}>
        {(['todos', 'hoy', 'semana'] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
              {f === 'todos' ? 'Todos' : f === 'hoy' ? 'Hoy' : 'Semana'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trips List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Historial</Text>
        <Text style={styles.sectionLink}>{TRIP_HISTORY.length} viajes</Text>
      </View>

      {TRIP_HISTORY.map((trip) => (
        <TouchableOpacity key={trip.id} style={styles.tripCard} activeOpacity={0.75}>
          <View style={styles.tripCardHeader}>
            <View style={styles.tripCardPassenger}>
              <View style={styles.tripCardAvatar}>
                <FontAwesome name="user" size={14} color={Colors.teal} />
              </View>
              <View>
                <Text style={styles.tripCardName}>{trip.passenger}</Text>
                <Text style={styles.tripCardTime}>{trip.time}</Text>
              </View>
            </View>
            <Text style={styles.tripCardAmount}>{trip.amount}</Text>
          </View>
          <View style={styles.tripCardRoute}>
            <View style={[styles.tripCardRouteDot, { backgroundColor: Colors.teal }]} />
            <Text style={styles.tripCardRouteText}>{trip.route}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScreenLayout>
  );
}
