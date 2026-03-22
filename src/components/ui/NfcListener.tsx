import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';

const WAVE_COUNT = 3;

interface NfcListenerProps {
  /** Text shown below the animation */
  label?: string;
}

export function NfcListener({ label = 'Buscando dispositivo NFC…' }: NfcListenerProps) {
  const waves = useRef(
    Array.from({ length: WAVE_COUNT }, () => new Animated.Value(0)),
  ).current;

  const iconPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered wave animations
    const waveAnimations = waves.map((wave, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 500),
          Animated.timing(wave, {
            toValue: 1,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(wave, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    // Subtle icon pulse
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconPulse, {
          toValue: 1.08,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconPulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    waveAnimations.forEach((a) => a.start());
    pulseAnimation.start();

    return () => {
      waveAnimations.forEach((a) => a.stop());
      pulseAnimation.stop();
    };
  }, []);

  return (
    <View style={s.container}>
      {/* Waves */}
      <View style={s.wavesContainer}>
        {waves.map((wave, i) => {
          const scale = wave.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2.5 + i * 0.3],
          });
          const opacity = wave.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [0.5, 0.3, 0],
          });

          return (
            <Animated.View
              key={i}
              style={[
                s.wave,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}

        {/* Center icon */}
        <Animated.View style={[s.iconCircle, { transform: [{ scale: iconPulse }] }]}>
          <MaterialCommunityIcons name="nfc" size={40} color={Colors.bgWhite} />
        </Animated.View>
      </View>

      {/* Label */}
      <Text style={s.label}>{label}</Text>
      <Text style={s.hint}>Acerca tu teléfono al lector del autobús</Text>

      {/* Signal dots */}
      <View style={s.dotsRow}>
        {[0, 1, 2].map((i) => (
          <DotPulse key={i} delay={i * 300} />
        ))}
      </View>
    </View>
  );
}

/** Animated dot */
function DotPulse({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return <Animated.View style={[s.dot, { opacity }]} />;
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  wavesContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  wave: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.salmon,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.salmon,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.salmon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 6,
  },
  hint: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.grayNeutral,
    marginBottom: 30,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.salmon,
  },
});
