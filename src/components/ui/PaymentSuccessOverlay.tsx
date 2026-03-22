import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme';

const { width, height } = Dimensions.get('window');

interface PaymentSuccessOverlayProps {
  fare: number;
  driverId: number;
  onDismiss: () => void;
  /** Auto-dismiss after ms. Default 3000. */
  autoDismissMs?: number;
}

export function PaymentSuccessOverlay({
  fare,
  driverId,
  onDismiss,
  autoDismissMs = 3000,
}: PaymentSuccessOverlayProps) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.6)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkRotate = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      // 1. Fade in overlay
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      // 2. Scale + fade card in
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // 3. Bounce the checkmark in
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(checkRotate, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Shimmer loop
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Auto-dismiss
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(cardScale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onDismiss());
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, []);

  const rotate = checkRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  return (
    <Animated.View style={[s.overlay, { opacity: overlayOpacity }]}>
      <Animated.View
        style={[
          s.card,
          {
            transform: [{ scale: cardScale }],
            opacity: cardOpacity,
          },
        ]}
      >
        {/* Green circle with checkmark */}
        <Animated.View
          style={[
            s.checkCircle,
            { transform: [{ scale: checkScale }, { rotate }] },
          ]}
        >
          <Ionicons name="checkmark-sharp" size={52} color="#fff" />
        </Animated.View>

        <Text style={s.title}>¡Pago exitoso!</Text>
        <Text style={s.amount}>Bs. {fare}</Text>

        <View style={s.detailRow}>
          <Ionicons name="bus-outline" size={16} color={Colors.grayNeutral} />
          <Text style={s.detail}>Conductor #{driverId}</Text>
        </View>

        <View style={s.statusPill}>
          <View style={s.statusDot} />
          <Text style={s.statusText}>Transacción completada</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    width: width * 0.82,
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.successGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.successGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.successGreen,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  detail: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.successGreen}12`,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.successGreen,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.successGreen,
  },
});
