import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { driverStyles as styles } from '../styles';

type Trip = {
  id: string;
  passenger: string;
  time: string;
  amount: string;
  origin: string;
  destination: string;
};

const RECENT: Trip[] = [
  {
    id: '1',
    passenger: 'María G.',
    time: 'Hace 25 min',
    amount: '+Bs. 12.50',
    origin: 'Plaza Venezuela',
    destination: 'Chacaíto',
  },
  {
    id: '2',
    passenger: 'Carlos R.',
    time: 'Hace 1h',
    amount: '+Bs. 8.00',
    origin: 'Altamira',
    destination: 'Los Palos Grandes',
  },
  {
    id: '3',
    passenger: 'Ana M.',
    time: 'Hace 2h',
    amount: '+Bs. 15.00',
    origin: 'Sabana Grande',
    destination: 'El Silencio',
  },
];

export function RecentTrips() {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Viajes Recientes</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.sectionLink}>Ver todo {'>'}</Text>
        </TouchableOpacity>
      </View>

      {RECENT.map((trip) => (
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
            <Text style={styles.tripCardRouteText}>
              {trip.origin} → {trip.destination}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
