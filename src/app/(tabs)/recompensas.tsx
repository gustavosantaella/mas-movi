import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';

export default function RecompensasScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <MaterialCommunityIcons name="gift-outline" size={64} color={Colors.salmon} />
      <Text style={styles.title}>Recompensas</Text>
      <Text style={styles.subtitle}>Próximamente podrás canjear tus puntos por increíbles recompensas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.charcoal,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.grayNeutral,
    textAlign: 'center',
    lineHeight: 22,
  },
});
