import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Gradients } from '@/theme';

type Vehicle = {
  id: string;
  name: string;
  plate: string;
  year: number;
  rating: number;
  trips: number;
  status: 'active' | 'inactive' | 'maintenance';
  fuel: string;
  engine: string;
  capacity: number;
  km: string;
  insurance: string;
  documents: { id: string; name: string; status: 'valid' | 'expiring'; expiry: string }[];
  maintenance: { id: string; type: string; date: string; km: string; next: string }[];
};

const VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    name: 'Yutong ZK6128H',
    plate: 'AB-123-CD',
    year: 2024,
    rating: 4.8,
    trips: 1240,
    status: 'active',
    fuel: 'Diésel',
    engine: 'YC6L280-50',
    capacity: 40,
    km: '28,450 km',
    insurance: 'Vigente hasta Dic 2026',
    documents: [
      { id: '1', name: 'Póliza de Seguro', status: 'valid', expiry: 'Dic 2026' },
      { id: '2', name: 'Revisión Técnica', status: 'expiring', expiry: 'Abr 2026' },
      { id: '3', name: 'Permiso de Operación', status: 'valid', expiry: 'Ene 2027' },
    ],
    maintenance: [
      { id: '1', type: 'Cambio de aceite', date: '15 Mar 2026', km: '28,000 km', next: '33,000 km' },
      { id: '2', type: 'Rotación de cauchos', date: '02 Feb 2026', km: '25,500 km', next: '35,500 km' },
    ],
  },
  {
    id: 'v2',
    name: 'Higer KLQ6109',
    plate: 'XY-789-ZW',
    year: 2023,
    rating: 4.6,
    trips: 890,
    status: 'active',
    fuel: 'Diésel',
    engine: 'ISB6.7',
    capacity: 35,
    km: '42,800 km',
    insurance: 'Vigente hasta Oct 2026',
    documents: [
      { id: '1', name: 'Póliza de Seguro', status: 'valid', expiry: 'Oct 2026' },
      { id: '2', name: 'Revisión Técnica', status: 'valid', expiry: 'Jul 2026' },
      { id: '3', name: 'Permiso de Operación', status: 'valid', expiry: 'Mar 2027' },
    ],
    maintenance: [
      { id: '1', type: 'Cambio de aceite', date: '28 Feb 2026', km: '42,000 km', next: '47,000 km' },
      { id: '2', type: 'Revisión de frenos', date: '15 Ene 2026', km: '40,000 km', next: '50,000 km' },
    ],
  },
  {
    id: 'v3',
    name: 'Zhongtong LCK6108',
    plate: 'MN-456-OP',
    year: 2022,
    rating: 4.5,
    trips: 2100,
    status: 'maintenance',
    fuel: 'GNV',
    engine: 'WP7NG',
    capacity: 45,
    km: '68,200 km',
    insurance: 'Vigente hasta Ago 2026',
    documents: [
      { id: '1', name: 'Póliza de Seguro', status: 'valid', expiry: 'Ago 2026' },
      { id: '2', name: 'Revisión Técnica', status: 'expiring', expiry: 'May 2026' },
      { id: '3', name: 'Permiso de Operación', status: 'valid', expiry: 'Nov 2026' },
    ],
    maintenance: [
      { id: '1', type: 'Reparación de motor', date: 'En curso', km: '68,200 km', next: '-' },
      { id: '2', type: 'Cambio de aceite', date: '01 Mar 2026', km: '67,500 km', next: '72,500 km' },
    ],
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: 'Activo', color: Colors.tealLight },
  inactive: { label: 'Inactivo', color: Colors.grayNeutral },
  maintenance: { label: 'En Taller', color: Colors.warning },
};

export default function DriverVehicleDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(VEHICLES[0].id);
  const vehicle = VEHICLES.find(v => v.id === selectedId)!;
  const statusCfg = STATUS_CONFIG[vehicle.status];

  const specs = [
    { icon: 'seat-passenger', label: 'Capacidad', value: `${vehicle.capacity} pas.` },
    { icon: 'calendar-range', label: 'Año', value: `${vehicle.year}` },
    { icon: 'gas-station', label: 'Combustible', value: vehicle.fuel },
    { icon: 'engine', label: 'Motor', value: vehicle.engine },
    { icon: 'counter', label: 'Kilometraje', value: vehicle.km },
    { icon: 'shield-check', label: 'Seguro', value: vehicle.insurance },
  ];

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
        <Text style={styles.headerTitle}>Mis Vehículos</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={26} color={Colors.tealLight} />
        </TouchableOpacity>
      </View>

      {/* Vehicle Selector */}
      <FlatList
        data={VEHICLES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorRow}
        keyExtractor={v => v.id}
        renderItem={({ item }) => {
          const isActive = item.id === selectedId;
          const sCfg = STATUS_CONFIG[item.status];
          return (
            <TouchableOpacity
              style={[styles.selectorCard, isActive && styles.selectorCardActive]}
              onPress={() => setSelectedId(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.selectorIcon}>
                <MaterialCommunityIcons
                  name="bus-side"
                  size={22}
                  color={isActive ? '#fff' : Colors.textSecondary}
                />
              </View>
              <Text style={[styles.selectorName, isActive && styles.selectorNameActive]} numberOfLines={1}>
                {item.name.split(' ')[0]}
              </Text>
              <Text style={[styles.selectorPlate, isActive && { color: 'rgba(255,255,255,0.8)' }]}>
                {item.plate}
              </Text>
              <View style={[styles.selectorStatusDot, { backgroundColor: sCfg.color }]} />
            </TouchableOpacity>
          );
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Vehicle Hero Card */}
        <LinearGradient
          colors={['#0D9488', '#2DD4BF'] as [string, string]}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroIconCircle}>
            <MaterialCommunityIcons name="bus-side" size={40} color="#fff" />
          </View>
          <Text style={styles.heroName}>{vehicle.name}</Text>
          <View style={styles.plateContainer}>
            <Text style={styles.plateText}>{vehicle.plate}</Text>
          </View>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{vehicle.rating}</Text>
              <Text style={styles.heroStatLabel}>Rating</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{vehicle.trips.toLocaleString()}</Text>
              <Text style={styles.heroStatLabel}>Viajes</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatValue, { color: statusCfg.color }]}>{statusCfg.label}</Text>
              <Text style={styles.heroStatLabel}>Estado</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Specs */}
        <Text style={styles.sectionTitle}>Especificaciones</Text>
        <View style={styles.specsGrid}>
          {specs.map((spec, idx) => (
            <View key={idx} style={styles.specCard}>
              <MaterialCommunityIcons name={spec.icon as any} size={22} color={Colors.tealLight} />
              <Text style={styles.specValue}>{spec.value}</Text>
              <Text style={styles.specLabel}>{spec.label}</Text>
            </View>
          ))}
        </View>

        {/* Documents */}
        <Text style={styles.sectionTitle}>Documentos</Text>
        {vehicle.documents.map(doc => (
          <TouchableOpacity key={doc.id} style={styles.docCard} activeOpacity={0.75}>
            <View style={styles.docLeft}>
              <View style={[
                styles.docStatusDot,
                { backgroundColor: doc.status === 'valid' ? Colors.tealLight : Colors.warning },
              ]} />
              <View>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docExpiry}>Vence: {doc.expiry}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}

        {/* Maintenance */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Mantenimiento</Text>
        {vehicle.maintenance.map(m => (
          <View key={m.id} style={styles.maintCard}>
            <View style={styles.maintIcon}>
              <MaterialCommunityIcons name="wrench" size={18} color={Colors.tealLight} />
            </View>
            <View style={styles.maintInfo}>
              <Text style={styles.maintType}>{m.type}</Text>
              <Text style={styles.maintDate}>{m.date} • {m.km}</Text>
              <Text style={styles.maintNext}>Próximo: {m.next}</Text>
            </View>
          </View>
        ))}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
            <MaterialCommunityIcons name="file-document-edit" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Editar Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} activeOpacity={0.85}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={Colors.tealLight} />
            <Text style={[styles.actionBtnText, { color: Colors.tealLight }]}>Reportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

  // Vehicle Selector
  selectorRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 16 },
  selectorCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    width: 110,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
  },
  selectorCardActive: {
    backgroundColor: Colors.teal,
    borderColor: Colors.tealLight,
  },
  selectorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectorName: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  selectorNameActive: { color: '#fff' },
  selectorPlate: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600', marginBottom: 6 },
  selectorStatusDot: { width: 6, height: 6, borderRadius: 3 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // Hero Card
  heroCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroName: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  plateContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
  },
  plateText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  heroStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  heroStat: { alignItems: 'center' },
  heroStatValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  heroStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },

  // Section
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 14 },

  // Specs
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  specCard: {
    width: '48%' as any,
    backgroundColor: Colors.bgSurface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  specValue: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 8 },
  specLabel: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },

  // Documents
  docCard: {
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
  docLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  docStatusDot: { width: 8, height: 8, borderRadius: 4 },
  docName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  docExpiry: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },

  // Maintenance
  maintCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  maintIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.tealLight}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maintInfo: { flex: 1 },
  maintType: { color: '#fff', fontSize: 14, fontWeight: '600' },
  maintDate: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  maintNext: { color: Colors.tealLight, fontSize: 12, fontWeight: '600', marginTop: 4 },

  // Actions
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.tealLight,
  },
  actionBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
