import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme';

const { width } = Dimensions.get('window');

interface PaymentToastProps {
  fare: number;
  onDismiss: () => void;
  /** Auto-dismiss after ms. Default 3000. */
  autoDismissMs?: number;
}

export function PaymentToast({
  fare,
  onDismiss,
  autoDismissMs = 3000,
}: PaymentToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar countdown
    Animated.timing(progress, {
      toValue: 0,
      duration: autoDismissMs,
      useNativeDriver: false, // width needs layout
    }).start();

    // Auto-dismiss
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss());
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        s.container,
        {
          top: insets.top + 10,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={s.toast}>
        <View style={s.iconCircle}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </View>

        <View style={s.textContainer}>
          <Text style={s.title}>¡Pago recibido!</Text>
          <Text style={s.subtitle}>Bs. {fare}</Text>
        </View>

        <View style={s.amountBadge}>
          <Text style={s.amountText}>+Bs.{fare}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={s.progressTrack}>
        <Animated.View style={[s.progressBar, { width: progressWidth }]} />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: `${Colors.successGreen}20`,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.successGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grayNeutral,
    marginTop: 1,
  },
  amountBadge: {
    backgroundColor: `${Colors.successGreen}15`,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.successGreen,
  },
  progressTrack: {
    height: 3,
    backgroundColor: `${Colors.successGreen}15`,
    borderRadius: 2,
    marginTop: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.successGreen,
    borderRadius: 2,
  },
});
