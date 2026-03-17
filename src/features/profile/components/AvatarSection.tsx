import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { profileStyles as styles } from '../styles';

export function AvatarSection() {
  return (
    <View style={styles.avatarSection}>
      {/* Avatar with edit badge */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <FontAwesome name="user" size={40} color="#fff" />
        </View>
        <TouchableOpacity style={styles.avatarEditBadge} activeOpacity={0.8}>
          <Ionicons name="camera" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>María Rodríguez</Text>
      <Text style={styles.userPhone}>+58 412 1234567</Text>

      <View style={styles.userIdBadge}>
        <Text style={styles.userIdText}>#GUA-8829</Text>
      </View>
    </View>
  );
}
