import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { profileStyles as styles } from '../styles';
import { UserProfile } from '@/services/userService';

interface AvatarSectionProps {
  user?: UserProfile | null;
}

export function AvatarSection({ user }: AvatarSectionProps) {
  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || null
    : null;

  const roleLabel = user?.userType?.includes(3)
    ? 'Conductor'
    : user?.userType?.includes(2)
      ? 'Pasajero'
      : null;

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

      {fullName && <Text style={styles.userName}>{fullName}</Text>}
      {roleLabel && <Text style={styles.userPhone}>{roleLabel}</Text>}

      {user && (
        <View style={styles.userIdBadge}>
          <Text style={styles.userIdText}>#GUA-{user.id.toString().padStart(4, '0')}</Text>
        </View>
      )}
    </View>
  );
}
