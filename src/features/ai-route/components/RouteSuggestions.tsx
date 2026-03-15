import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, BorderRadius } from '@/theme';

export type RouteSuggestion = {
  id: string;
  routes: string[];
  duration: string;
  cost: string;
  transfers: number;
  walkMinutes: number;
  tag?: 'fastest' | 'cheapest' | 'fewer_transfers';
};

const MOCK_ROUTES: RouteSuggestion[] = [
  {
    id: '1',
    routes: ['Ruta 23'],
    duration: '35 min',
    cost: '$0.50',
    transfers: 0,
    walkMinutes: 5,
    tag: 'fastest',
  },
  {
    id: '2',
    routes: ['Ruta 7', 'Ruta 12'],
    duration: '45 min',
    cost: '$0.35',
    transfers: 1,
    walkMinutes: 3,
    tag: 'cheapest',
  },
  {
    id: '3',
    routes: ['Ruta 5'],
    duration: '50 min',
    cost: '$0.40',
    transfers: 0,
    walkMinutes: 8,
    tag: 'fewer_transfers',
  },
];

const TAG_CONFIG = {
  fastest: { label: 'Más rápida', color: Colors.primary, icon: 'flash' as const },
  cheapest: { label: 'Más barata', color: Colors.success, icon: 'cash' as const },
  fewer_transfers: { label: 'Sin transbordos', color: Colors.accent, icon: 'swap-horizontal' as const },
};

type Props = {
  visible: boolean;
  onSelectRoute: (route: RouteSuggestion) => void;
};

export function RouteSuggestions({ visible, onSelectRoute }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutas disponibles</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {MOCK_ROUTES.map(route => {
          const tagConfig = route.tag ? TAG_CONFIG[route.tag] : null;

          return (
            <TouchableOpacity
              key={route.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => onSelectRoute(route)}
            >
              {/* Tag */}
              {tagConfig && (
                <View style={[styles.tag, { backgroundColor: tagConfig.color + '20' }]}>
                  <Ionicons name={tagConfig.icon} size={12} color={tagConfig.color} />
                  <Text style={[styles.tagText, { color: tagConfig.color }]}>{tagConfig.label}</Text>
                </View>
              )}

              {/* Route info */}
              <View style={styles.routeRow}>
                <View style={styles.routeNames}>
                  {route.routes.map((r, i) => (
                    <View key={r} style={styles.routeChip}>
                      <MaterialCommunityIcons name="bus" size={14} color={Colors.primary} />
                      <Text style={styles.routeChipText}>{r}</Text>
                      {i < route.routes.length - 1 && (
                        <Ionicons name="arrow-forward" size={12} color={Colors.textSecondary} style={{ marginLeft: 6 }} />
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.statText}>{route.duration}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="cash-outline" size={16} color={Colors.success} />
                  <Text style={[styles.statText, { color: Colors.success }]}>{route.cost}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="swap-horizontal-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.statText}>
                    {route.transfers === 0 ? 'Directo' : `${route.transfers} transbordo${route.transfers > 1 ? 's' : ''}`}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="walk-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.statText}>{route.walkMinutes} min</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  routeRow: {
    marginBottom: 10,
  },
  routeNames: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  routeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgSurfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  routeChipText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
