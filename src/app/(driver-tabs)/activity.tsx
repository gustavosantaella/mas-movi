import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { ScreenLayout } from '@/components/ui';

export default function DriverActivityScreen() {
  return (
    <ScreenLayout>
      <Text style={s.title}>Actividad</Text>
      <View style={s.empty}>
        <Ionicons name="time-outline" size={48} color={Colors.grayNeutral} />
        <Text style={s.emptyTitle}>Sin actividad reciente</Text>
        <Text style={s.emptySub}>Tus cobros aparecerán aquí</Text>
      </View>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: Colors.charcoal, marginBottom: 20 },
  empty: {
    alignItems: 'center', paddingVertical: 60, backgroundColor: Colors.bgLightGray,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.borderLightGray,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.charcoal, marginTop: 14 },
  emptySub: { fontSize: 13, fontWeight: '500', color: Colors.grayNeutral, marginTop: 4 },
});
