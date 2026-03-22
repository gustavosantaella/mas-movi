import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { homeStyles as styles } from '../styles';

type Activity = {
  id: string;
  type: 'trip' | 'recharge';
  title: string;
  description: string;
  date: string;
  amount: string;
  positive: boolean;
};

const RECENT_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'trip',
    title: 'Viaje',
    description: 'Metro Línea 1: Plaza Venezu…',
    date: 'Hoy, 08:45',
    amount: '-Bs. 2.50',
    positive: false,
  },
  {
    id: '2',
    type: 'recharge',
    title: 'Recarga',
    description: 'Pago Móvil Mercantil •••• 4532',
    date: 'Ayer, 18:30',
    amount: '+Bs. 50',
    positive: true,
  },
  {
    id: '3',
    type: 'trip',
    title: 'Viaje',
    description: 'Metrobús: Altamira → Los Pa…',
    date: '14 Mar, 14:20',
    amount: '-Bs. 1.80',
    positive: false,
  },
];

const iconConfig = {
  trip: {
    bg: Colors.peach,
    icon: 'bus' as const,
    color: Colors.salmon,
  },
  recharge: {
    bg: '#D1FAE5',
    icon: 'wallet-plus' as const,
    color: Colors.successGreen,
  },
};

export function RecentActivity() {
  const router = useRouter();

  return (
    <View>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        <TouchableOpacity
          onPress={() => router.push('/(shared)/trip-history' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLink}>Ver todo {'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Activity list */}
      <View style={styles.activityList}>
        {RECENT_ACTIVITIES.map((activity) => {
          const cfg = iconConfig[activity.type];
          return (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              activeOpacity={0.75}
            >
              <View style={[styles.activityIconCircle, { backgroundColor: cfg.bg }]}>
                <MaterialCommunityIcons name={cfg.icon} size={22} color={cfg.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDesc} numberOfLines={1}>
                  {activity.description}
                </Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Text
                style={[
                  styles.activityAmount,
                  activity.positive ? styles.amountPositive : styles.amountNegative,
                ]}
              >
                {activity.amount}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
