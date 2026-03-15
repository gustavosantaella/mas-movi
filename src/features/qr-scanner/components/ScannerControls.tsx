import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { qrScannerStyles as styles } from '../styles';

export function ScannerControls() {
  return (
    <View style={styles.bottomOverlay}>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.iconCircle}>
            <Ionicons name="flashlight" size={24} color="#fff" />
          </View>
          <Text style={styles.iconLabel}>Linterna</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.flashButton}>
          <Ionicons name="flash" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.iconCircle}>
            <Ionicons name="help-circle" size={24} color="#fff" />
          </View>
          <Text style={styles.iconLabel}>Ayuda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
