import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SectionList, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Gradients } from '@/theme';

type Trip = {
  id: string;
  passenger: string;
  origin: string;
  destination: string;
  time: string;
  duration: string;
  passengers: number;
  amount: string;
  date: string;
  status: 'completed' | 'cancelled';
};

const ALL_TRIPS: Trip[] = [
  { id: '1', passenger: 'María G.', origin: 'Plaza Venezuela', destination: 'Chacaíto', time: '08:30 AM', duration: '25 min', passengers: 3, amount: 'Bs. 12.50', date: '2026-03-20', status: 'completed' },
  { id: '2', passenger: 'Carlos R.', origin: 'Altamira', destination: 'Los Palos Grandes', time: '09:15 AM', duration: '15 min', passengers: 2, amount: 'Bs. 8.00', date: '2026-03-20', status: 'completed' },
  { id: '3', passenger: 'Ana M.', origin: 'Sabana Grande', destination: 'El Silencio', time: '10:00 AM', duration: '30 min', passengers: 5, amount: 'Bs. 15.00', date: '2026-03-20', status: 'completed' },
  { id: '4', passenger: 'José L.', origin: 'Parque Central', destination: 'La Candelaria', time: '11:20 AM', duration: '20 min', passengers: 4, amount: 'Bs. 10.00', date: '2026-03-20', status: 'completed' },
  { id: '5', passenger: 'Laura P.', origin: 'Las Mercedes', destination: 'Chuao', time: '12:45 PM', duration: '18 min', passengers: 1, amount: 'Bs. 18.00', date: '2026-03-20', status: 'cancelled' },
  { id: '6', passenger: 'Pedro S.', origin: 'Chacao', destination: 'Baruta', time: '07:00 AM', duration: '35 min', passengers: 6, amount: 'Bs. 22.00', date: '2026-03-19', status: 'completed' },
  { id: '7', passenger: 'Sofía V.', origin: 'Petare', destination: 'Plaza Venezuela', time: '08:15 AM', duration: '45 min', passengers: 8, amount: 'Bs. 28.00', date: '2026-03-19', status: 'completed' },
  { id: '8', passenger: 'Luis C.', origin: 'El Hatillo', destination: 'Los Dos Caminos', time: '10:30 AM', duration: '40 min', passengers: 3, amount: 'Bs. 16.00', date: '2026-03-19', status: 'completed' },
  { id: '9', passenger: 'Carmen R.', origin: 'Capitolio', destination: 'Sabana Grande', time: '01:00 PM', duration: '22 min', passengers: 4, amount: 'Bs. 11.50', date: '2026-03-18', status: 'completed' },
  { id: '10', passenger: 'Diego M.', origin: 'La Paz', destination: 'Chacaíto', time: '03:30 PM', duration: '28 min', passengers: 2, amount: 'Bs. 9.00', date: '2026-03-18', status: 'cancelled' },
];

function getDateLabel(dateStr: string): string {
  const today = new Date();
  const date = new Date(dateStr + 'T00:00:00');
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  const label = date.toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const FILTERS = [
  { label: 'Todos', value: 'all' },
  { label: 'Hoy', value: 'today' },
  { label: 'Semana', value: 'week' },
  { label: 'Completados', value: 'completed' },
  { label: 'Cancelados', value: 'cancelled' },
];

export default function DriverTripsDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const sections = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let filtered: Trip[];
    switch (activeFilter) {
      case 'today':
        filtered = ALL_TRIPS.filter(t => t.date === todayStr);
        break;
      case 'week':
        filtered = ALL_TRIPS.filter(t => new Date(t.date + 'T00:00:00') >= weekAgo);
        break;
      case 'completed':
        filtered = ALL_TRIPS.filter(t => t.status === 'completed');
        break;
      case 'cancelled':
        filtered = ALL_TRIPS.filter(t => t.status === 'cancelled');
        break;
      default:
        filtered = ALL_TRIPS;
    }

    const groups: Record<string, Trip[]> = {};
    filtered.forEach(trip => {
      if (!groups[trip.date]) groups[trip.date] = [];
      groups[trip.date].push(trip);
    });

    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({ title: getDateLabel(date), data: groups[date] }));
  }, [activeFilter]);

  const totalTrips = sections.reduce((sum, s) => sum + s.data.length, 0);
  const totalEarned = sections.reduce((sum, s) =>
    sum + s.data.filter(t => t.status === 'completed').reduce((a, t) => a + parseFloat(t.amount.replace('Bs. ', '')), 0)
  , 0);

  return (
    <LinearGradient
      colors={Gradients.main as unknown as [string, string, ...string[]]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Viajes</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="road-variant" size={22} color={Colors.tealLight} />
          <Text style={styles.summaryValue}>{totalTrips}</Text>
          <Text style={styles.summaryLabel}>Viajes</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="cash" size={22} color={Colors.tealLight} />
          <Text style={styles.summaryValue}>Bs. {totalEarned.toFixed(0)}</Text>
          <Text style={styles.summaryLabel}>Ganado</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="account-group" size={22} color={Colors.tealLight} />
          <Text style={styles.summaryValue}>{ALL_TRIPS.reduce((s, t) => s + t.passengers, 0)}</Text>
          <Text style={styles.summaryLabel}>Pasajeros</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, activeFilter === f.value && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trip List */}
      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <View style={styles.tripCardLeft}>
              <View style={[styles.statusDot, { backgroundColor: item.status === 'completed' ? Colors.tealLight : Colors.accent }]} />
              <View style={styles.tripCardInfo}>
                <Text style={styles.tripRoute}>{item.origin} → {item.destination}</Text>
                <View style={styles.tripMeta}>
                  <FontAwesome name="user" size={10} color={Colors.textSecondary} />
                  <Text style={styles.tripMetaText}>{item.passengers} pas.</Text>
                  <MaterialCommunityIcons name="clock-outline" size={12} color={Colors.textSecondary} />
                  <Text style={styles.tripMetaText}>{item.duration}</Text>
                  <Text style={styles.tripTime}>{item.time}</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.tripAmount, item.status === 'cancelled' && styles.tripAmountCancelled]}>
              {item.status === 'cancelled' ? 'Cancelado' : item.amount}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bus-clock" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No hay viajes registrados</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  filterChipActive: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  filterText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  sectionHeader: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  tripCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  tripCardInfo: { flex: 1 },
  tripRoute: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  tripMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tripMetaText: { color: Colors.textSecondary, fontSize: 12 },
  tripTime: { color: Colors.textSecondary, fontSize: 12, marginLeft: 'auto' },
  tripAmount: { color: Colors.tealLight, fontSize: 15, fontWeight: '700', marginLeft: 10 },
  tripAmountCancelled: { color: Colors.accent, fontSize: 12 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: Colors.textSecondary, fontSize: 15 },
});
