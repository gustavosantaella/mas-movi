import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { aiRouteStyles as styles } from '../styles';

export function RouteMap() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleBack = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.8, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start(() => router.back());
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 19.4326,
          longitude: -99.1332,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        userInterfaceStyle="dark"
      >
        <Marker coordinate={{ latitude: 19.4326, longitude: -99.1332 }} title="Origen" />
        <Marker coordinate={{ latitude: 19.4500, longitude: -99.1500 }} title="Destino" pinColor="blue" />
        <Polyline
          coordinates={[
            { latitude: 19.4326, longitude: -99.1332 },
            { latitude: 19.4400, longitude: -99.1400 },
            { latitude: 19.4500, longitude: -99.1500 },
          ]}
          strokeColor={Colors.primary}
          strokeWidth={4}
        />
      </MapView>

      {/* Back Button */}
      <Animated.View style={[styles.backButton, { top: insets.top + 10, transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.8}>
          <BlurView intensity={80} tint="dark" style={styles.backButtonBlur}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      {/* Route Badge */}
      <BlurView intensity={80} tint="dark" style={[styles.floatingBadge, { top: insets.top + 10 }]}>
        <FontAwesome5 name="route" size={16} color="#fff" />
        <Text style={styles.badgeText}>Rutas Activas: 2</Text>
      </BlurView>
    </View>
  );
}
