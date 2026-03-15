import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { paymentStyles as styles } from '../styles';

export function PaymentTags() {
  return (
    <View style={styles.tagsContainer}>
      <View style={styles.tag}>
        <MaterialCommunityIcons name="wallet" size={16} color={Colors.success} />
        <Text style={styles.tagText}>Saldo Monedero</Text>
      </View>
      <View style={styles.tag}>
        <FontAwesome5 name="ticket-alt" size={16} color={Colors.info} />
        <Text style={styles.tagText}>Pases Mensuales</Text>
      </View>
      <View style={styles.tag}>
        <MaterialCommunityIcons name="tag" size={16} color={Colors.warning} />
        <Text style={styles.tagText}>Descuento Estudiante</Text>
      </View>
    </View>
  );
}
