import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Gradients } from '@/theme';
import { GradientButton, AppInput } from '@/components/ui';
import { authStyles as styles } from '@/features/auth/styles';
import { forgotPassword } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Logo animation
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      startCooldown();
    } catch {
      setSent(true);
      startCooldown();
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setCooldown(30);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    try {
      await forgotPassword(email);
    } catch {
      // silent
    }
    startCooldown();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Back button ──────────────────────────── */}
        <TouchableOpacity
          style={localStyles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>

        {/* ─── Logo ─────────────────────────────────── */}
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require('../../../assets/images/guayaba-logo.png')}
            style={[
              styles.logo,
              { transform: [{ scale: logoScale }], opacity: logoOpacity },
            ]}
          />
        </View>

        {sent ? (
          <>
            {/* ─── Success state ──────────────────────── */}
            <View style={localStyles.successContainer}>
              <View style={localStyles.successIcon}>
                <Ionicons name="mail" size={36} color={Colors.salmon} />
              </View>
              <Text style={styles.title}>Revisa tu correo</Text>
              <Text style={[styles.subtitle, { marginBottom: 8 }]}>
                Si existe una cuenta con{' '}
                <Text style={{ fontWeight: '700', color: Colors.charcoal }}>
                  {email}
                </Text>
                , recibirás un enlace para restablecer tu contraseña.
              </Text>
              <Text style={localStyles.hint}>
                Revisa tu bandeja de spam si no lo ves en unos minutos.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleResend}
              disabled={cooldown > 0}
              activeOpacity={0.7}
              style={{ alignItems: 'center', marginBottom: 24 }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: cooldown > 0 ? Colors.grayNeutral : Colors.salmon,
              }}>
                {cooldown > 0
                  ? `Reenviar correo en ${cooldown}s`
                  : 'Reenviar correo'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <GradientButton
                label="Volver al inicio de sesión"
                onPress={() => router.replace('/(auth)/login')}
                colors={Gradients.salmonButton as unknown as [string, string, ...string[]]}
              />
            </View>
          </>
        ) : (
          <>
            {/* ─── Form state ─────────────────────────── */}
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>
              Ingresa tu correo electrónico y te enviaremos un enlace para crear
              una nueva contraseña.
            </Text>

            <AppInput
              type="email"
              label="Correo electrónico"
              icon="mail-outline"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.buttonContainer}>
              <GradientButton
                label="Enviar enlace"
                onPress={handleSubmit}
                disabled={!isValidEmail}
                loading={loading}
                colors={Gradients.salmonButton as unknown as [string, string, ...string[]]}
              />
            </View>

            {/* ─── Footer ──────────────────────────────── */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>¿Recordaste tu contraseña? </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.footerLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F0F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.salmon}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  hint: {
    fontSize: 13,
    color: Colors.grayNeutral,
    textAlign: 'center',
    marginTop: 12,
  },
});
