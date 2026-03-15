import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, BorderRadius } from '@/theme';

type Props = {
  origin: string;
  destination: string;
  onOriginChange: (text: string) => void;
  onDestinationChange: (text: string) => void;
  onSearch: () => void;
  onSwap: () => void;
};

export function RouteSearchBar({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onSearch,
  onSwap,
}: Props) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  const handleSwap = () => {
    Animated.sequence([
      Animated.timing(spinAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      spinAnim.setValue(0);
      onSwap();
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputsWrapper}>
        {/* Origin */}
        <View style={styles.inputRow}>
          <View style={[styles.dot, styles.dotOrigin]} />
          <TextInput
            style={styles.input}
            placeholder="¿Dónde estás?"
            placeholderTextColor={Colors.textSecondary}
            value={origin}
            onChangeText={onOriginChange}
          />
        </View>

        {/* Connector */}
        <View style={styles.connectorRow}>
          <View style={styles.connectorLine} />
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <TouchableOpacity onPress={handleSwap} style={styles.swapButton}>
              <Ionicons name="swap-vertical" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Destination */}
        <View style={styles.inputRow}>
          <View style={[styles.dot, styles.dotDestination]} />
          <TextInput
            style={styles.input}
            placeholder="¿A dónde vas?"
            placeholderTextColor={Colors.textSecondary}
            value={destination}
            onChangeText={onDestinationChange}
          />
        </View>
      </View>

      {/* Search button */}
      <TouchableOpacity style={styles.searchButton} onPress={onSearch} activeOpacity={0.8}>
        <Ionicons name="search" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  inputsWrapper: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 30, 0.92)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOrigin: {
    backgroundColor: Colors.primary,
  },
  dotDestination: {
    backgroundColor: Colors.accent,
  },
  input: {
    flex: 1,
    height: 36,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    gap: 8,
  },
  connectorLine: {
    width: 2,
    height: 16,
    backgroundColor: Colors.bgSurfaceLight,
  },
  swapButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
