import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Pressable,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Gradients } from '@/theme';
import { AvatarSection } from '@/features/profile/components/AvatarSection';
import { SettingsList } from '@/features/profile/components/SettingsList';
import { profileStyles as styles } from '@/features/profile/styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DISMISS_THRESHOLD = 120;

export default function ProfileScreen() {
  const router = useRouter();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // Animate backdrop fade-in and sheet slide-up on mount
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(sheetTranslateY, {
        toValue: 0,
        damping: 25,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const dismissSheet = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
      else router.back();
    });
  };

  const handleClose = () => {
    dismissSheet();
  };

  const handleLogout = () => {
    dismissSheet(() => {
      // Navigate to login after the sheet animates out
      router.replace('/(auth)/login');
    });
  };

  /* ─── Pan responder for swipe-to-dismiss ───────────── */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only activate on vertical downward swipes
        return gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          sheetTranslateY.setValue(gestureState.dy);
          // Fade backdrop proportionally
          const progress = 1 - gestureState.dy / SCREEN_HEIGHT;
          backdropOpacity.setValue(Math.max(0, progress));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DISMISS_THRESHOLD || gestureState.vy > 0.5) {
          // Dismiss the sheet
          dismissSheet();
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(sheetTranslateY, {
              toValue: 0,
              damping: 25,
              stiffness: 200,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.overlay}>
      {/* Animated backdrop — fades in independently */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity },
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={handleClose} />
      </Animated.View>

      {/* Animated sheet — slides up on mount, draggable to dismiss */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: sheetTranslateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle bar */}
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Avatar + Name + ID */}
            <AvatarSection />

            {/* Info cards */}
            <View style={styles.infoCardsSection}>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>maria.rodriguez@email.com</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Miembro desde</Text>
                <Text style={styles.infoValue}>Enero 2026</Text>
              </View>
            </View>

            {/* Settings navigation */}
            <SettingsList />

            {/* Logout button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={Gradients.accent as unknown as [string, string, ...string[]]}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 30,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.closeButtonText}>Cerrar sesión</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
