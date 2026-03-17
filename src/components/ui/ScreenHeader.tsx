import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';

/**
 * Default app header — salmon avatar + "Guayaba" + "Ver presentación".
 * Can be replaced by passing a custom `header` to ScreenLayout.
 */
export function ScreenHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.profileAvatar}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <FontAwesome name="user" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerName}>Guayaba</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 20,
    backgroundColor: Colors.salmon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  headerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.salmon,
  },
});
