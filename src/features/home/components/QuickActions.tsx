import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Gradients } from '@/theme';
import { homeStyles as styles } from '../styles';

export function QuickActions() {
  const router = useRouter();
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.grid}>
      {/* AI Route Analysis */}
      <Animated.View style={[styles.gridItemAnimated, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={styles.gridItemInner}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => router.push('/ai-route')}
        >
          <LinearGradient
            colors={Gradients.accent as unknown as [string, string, ...string[]]}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons name="map-search" size={32} color="#fff" />
          </LinearGradient>
          <Text style={styles.gridLabel}>Análisis de Ruta</Text>
          <Text style={styles.gridSubLabel}>Planifica con IA</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* History */}
      <TouchableOpacity
        style={styles.gridItem}
        activeOpacity={0.8}
        onPress={() => router.push('/payment')}
      >
        <LinearGradient
          colors={Gradients.primary as unknown as [string, string, ...string[]]}
          style={styles.iconContainer}
        >
          <MaterialCommunityIcons name="history" size={32} color="#fff" />
        </LinearGradient>
        <Text style={styles.gridLabel}>Historial</Text>
        <Text style={styles.gridSubLabel}>Viajes y Cobros</Text>
      </TouchableOpacity>

      {/* Virtual Wallet */}
      <TouchableOpacity
        style={styles.gridItemSecondary}
        activeOpacity={0.8}
        onPress={() => router.push('/payment')}
      >
        <LinearGradient
          colors={Gradients.info as unknown as [string, string, ...string[]]}
          style={styles.iconContainerSm}
        >
          <FontAwesome5 name="wallet" size={24} color="#fff" />
        </LinearGradient>
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.gridLabelSecondary}>Monedero Virtual</Text>
          <Text style={styles.gridSubLabelSecondary}>Gestiona tus tarjetas</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
