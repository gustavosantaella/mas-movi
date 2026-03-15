import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import { Colors } from '@/theme';
import { aiRouteStyles as styles } from '../styles';

const DEFAULT_REGION = {
  latitude: 10.4806,
  longitude: -66.9036,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export function RouteMap({ fullScreen = false, hideOverlays = false }: { fullScreen?: boolean; hideOverlays?: boolean }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [region, setRegion] = useState(DEFAULT_REGION);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleBack = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.8, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start(() => router.back());
  };

  return (
    <View style={[styles.mapContainer, fullScreen && { flex: 1 }]}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        userInterfaceStyle="dark"
      />

      {!hideOverlays && (
        <>
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
            <Text style={styles.badgeText}>Mi ubicación</Text>
          </BlurView>
        </>
      )}
    </View>
  );
}
