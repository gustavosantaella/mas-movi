import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

import { Gradients } from '@/theme';
import { profileStyles as styles } from '../styles';

export function AvatarSection() {
  return (
    <View style={styles.avatarSection}>
      <LinearGradient
        colors={Gradients.primary as unknown as [string, string, ...string[]]}
        style={styles.avatarRing}
      >
        <View style={styles.avatarInner}>
          <FontAwesome5 name="user" size={40} color="#fff" />
        </View>
      </LinearGradient>
      <Text style={styles.userName}>Juan Pérez</Text>
      <Text style={styles.userPhone}>+52 55 1234 5678</Text>
    </View>
  );
}
