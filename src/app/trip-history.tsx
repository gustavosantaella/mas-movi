import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SectionList, Platform, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Colors, Gradients } from '@/theme';

type Trip = {
  id: string;
  origin: string;
  originTime: string;
  destination: string;
  destinationTime: string;
  route: string;
  price: string;
  date: string;
};

const ALL_TRIPS: Trip[] = [
  { id: '1', origin: 'Av. Libertador', originTime: '12:00 PM', destination: 'Av. Solano', destinationTime: '1:00 PM', route: 'Ruta 23', price: '$0.50', date: '2026-03-14' },
  { id: '2', origin: 'Plaza Venezuela', originTime: '8:30 AM', destination: 'Chacao', destinationTime: '9:15 AM', route: 'Ruta 12', price: '$0.35', date: '2026-03-14' },
  { id: '3', origin: 'Las Mercedes', originTime: '6:00 PM', destination: 'Altamira', destinationTime: '6:25 PM', route: 'Ruta 7', price: '$0.25', date: '2026-03-14' },
  { id: '4', origin: 'Sabana Grande', originTime: '10:00 AM', destination: 'El Silencio', destinationTime: '10:40 AM', route: 'Ruta 5', price: '$0.30', date: '2026-03-13' },
  { id: '5', origin: 'Chacaíto', originTime: '7:15 AM', destination: 'La Paz', destinationTime: '7:50 AM', route: 'Ruta 18', price: '$0.40', date: '2026-03-13' },
  { id: '6', origin: 'Petare', originTime: '3:00 PM', destination: 'Plaza Venezuela', destinationTime: '3:45 PM', route: 'Ruta 9', price: '$0.45', date: '2026-03-12' },
  { id: '7', origin: 'Capitolio', originTime: '9:00 AM', destination: 'Los Dos Caminos', destinationTime: '9:35 AM', route: 'Ruta 14', price: '$0.35', date: '2026-03-11' },
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

const DATE_FILTERS = [
  { label: 'Todos', value: 'all' },
  { label: 'Hoy', value: 'today' },
  { label: 'Ayer', value: 'yesterday' },
  { label: 'Semana', value: 'week' },
];

export default function TripHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const sections = useMemo(() => {
    const today = new Date();
    const todayStr = toLocalDateStr(today);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toLocalDateStr(yesterday);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const specificStr = toLocalDateStr(selectedDate);

    let filtered: Trip[];
    switch (activeFilter) {
      case 'today':
        filtered = ALL_TRIPS.filter(t => t.date === todayStr);
        break;
      case 'yesterday':
        filtered = ALL_TRIPS.filter(t => t.date === yesterdayStr);
        break;
      case 'week':
        filtered = ALL_TRIPS.filter(t => new Date(t.date + 'T00:00:00') >= weekAgo);
        break;
      case 'specific':
        filtered = ALL_TRIPS.filter(t => t.date === specificStr);
        break;
      default:
        filtered = ALL_TRIPS;
    }

    // Group by date
    const groups: Record<string, Trip[]> = {};
    filtered.forEach(trip => {
      if (!groups[trip.date]) groups[trip.date] = [];
      groups[trip.date].push(trip);
    });

    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        title: getDateLabel(date),
        data: groups[date],
      }));
  }, [activeFilter, selectedDate]);

  const totalTrips = sections.reduce((sum, s) => sum + s.data.length, 0);

  const handleDateChange = (_event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      setActiveFilter('specific');
    }
  };

  const handleFilterPress = (value: string) => {
    setShowPicker(false);
    setActiveFilter(value);
  };

  const dateChipLabel = activeFilter === 'specific'
    ? selectedDate.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })
    : 'Fecha';

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripCard}
      activeOpacity={0.75}
      onPress={() => router.push({
        pathname: '/ai-route',
        params: { fromHistory: '1', origin: item.origin, destination: item.destination },
      })}
    >
      <View style={styles.routeViz}>
        <View style={styles.dotOrigin} />
        <View style={styles.connectorLine} />
        <View style={styles.dotDestination} />
      </View>

      <View style={styles.tripInfo}>
        <View style={styles.tripRow}>
          <Text style={styles.stopName}>{item.origin}</Text>
          <Text style={styles.stopTime}>{item.originTime}</Text>
        </View>
        <View style={styles.tripRow}>
          <Text style={styles.stopName}>{item.destination}</Text>
          <Text style={styles.stopTime}>{item.destinationTime}</Text>
        </View>
        <View style={styles.tripMeta}>
          <Text style={styles.routeBadge}>{item.route}</Text>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Historial de Viajes</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Date Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {DATE_FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
            onPress={() => handleFilterPress(f.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, activeFilter === f.value && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Date Picker Chip */}
        <TouchableOpacity
          style={[styles.filterChip, styles.dateChip, activeFilter === 'specific' && styles.filterChipActive]}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={16} color={activeFilter === 'specific' ? '#fff' : Colors.textSecondary} />
          <Text style={[styles.filterText, activeFilter === 'specific' && styles.filterTextActive]}>
            {dateChipLabel}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showPicker && (
        <View style={styles.pickerOverlay}>
          <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setShowPicker(false)} />
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Seleccionar fecha</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.pickerDone}>Listo</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              themeVariant="dark"
            />
          </View>
        </View>
      )}

      {/* Trip Count */}
      <Text style={styles.tripCount}>
        {totalTrips} viaje{totalTrips !== 1 ? 's' : ''}
      </Text>

      {/* Trip List grouped by date */}
      <SectionList
        sections={sections}
        renderItem={renderTrip}
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  pickerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerDone: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  tripCount: {
    color: Colors.textSecondary,
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tripCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeViz: {
    alignItems: 'center',
    marginRight: 14,
    width: 12,
  },
  dotOrigin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  connectorLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.bgSurfaceLight,
  },
  dotDestination: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  tripInfo: {
    flex: 1,
    gap: 2,
  },
  tripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  routeBadge: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  priceText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
});
