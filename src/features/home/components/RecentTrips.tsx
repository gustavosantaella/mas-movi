import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors, Spacing, BorderRadius } from '@/theme';

type Trip = {
  id: string;
  origin: string;
  originTime: string;
  destination: string;
  destinationTime: string;
  route: string;
  date: string;
};

const RECENT_TRIPS: Trip[] = [
  {
    id: '1',
    origin: 'Av. Libertador',
    originTime: '12:00 PM',
    destination: 'Av. Solano',
    destinationTime: '1:00 PM',
    route: 'Ruta 23',
    date: 'Hoy',
  },
  {
    id: '2',
    origin: 'Plaza Venezuela',
    originTime: '8:30 AM',
    destination: 'Chacao',
    destinationTime: '9:15 AM',
    route: 'Ruta 12',
    date: 'Ayer',
  },
  {
    id: '3',
    origin: 'Las Mercedes',
    originTime: '6:00 PM',
    destination: 'Altamira',
    destinationTime: '6:25 PM',
    route: 'Ruta 7',
    date: 'Mar 12',
  },
];

export function RecentTrips() {
  const router = useRouter();

  const handleTripPress = (trip: Trip) => {
    router.push({
      pathname: '/ai-route',
      params: { fromHistory: '1', origin: trip.origin, destination: trip.destination },
    });
  };

  return (
    <View style={styles.container}>
      {RECENT_TRIPS.map((trip) => (
        <TouchableOpacity
          key={trip.id}
          style={styles.tripCard}
          onPress={() => handleTripPress(trip)}
          activeOpacity={0.75}
        >
          {/* Date badge */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{trip.date}</Text>
            <Text style={styles.routeText}>{trip.route}</Text>
          </View>

          {/* Route visualization */}
          <View style={styles.routeContainer}>
            {/* Origin */}
            <View style={styles.stopRow}>
              <View style={styles.dotOrigin} />
              <View style={styles.stopInfo}>
                <Text style={styles.stopName}>{trip.origin}</Text>
                <Text style={styles.stopTime}>{trip.originTime}</Text>
              </View>
            </View>

            {/* Connector line */}
            <View style={styles.connectorLine} />

            {/* Destination */}
            <View style={styles.stopRow}>
              <View style={styles.dotDestination} />
              <View style={styles.stopInfo}>
                <Text style={styles.stopName}>{trip.destination}</Text>
                <Text style={styles.stopTime}>{trip.destinationTime}</Text>
              </View>
            </View>
          </View>

          {/* Arrow icon */}
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} style={styles.arrow} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    alignItems: 'center',
    marginRight: 14,
    minWidth: 50,
  },
  dateText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  routeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  routeContainer: {
    flex: 1,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dotOrigin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  dotDestination: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  connectorLine: {
    width: 2,
    height: 16,
    backgroundColor: Colors.bgSurfaceLight,
    marginLeft: 4,
    marginVertical: 2,
  },
  stopInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  stopName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  stopTime: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  arrow: {
    marginLeft: 8,
  },
});
