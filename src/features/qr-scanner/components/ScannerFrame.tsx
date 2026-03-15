import React from 'react';
import { View } from 'react-native';

import { qrScannerStyles as styles } from '../styles';

export function ScannerFrame() {
  return (
    <View style={styles.centerContainer}>
      <View style={styles.scannerFrame}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
    </View>
  );
}
