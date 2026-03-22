import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Gradients } from '@/theme';
import { GradientButton, AppInput } from '@/components/ui';
import { authStyles as styles } from '@/features/auth/styles';
import { login as loginApi } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Biometric
  const [biometricAvailable, setBiometricAvailable] = useState(false);

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

    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    try {
      const LocalAuth = require('expo-local-authentication');
      const compatible = await LocalAuth.hasHardwareAsync();
      const enrolled = await LocalAuth.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch {
      // Not available
    }
  };

  const handleBiometric = async () => {
    try {
      const LocalAuth = require('expo-local-authentication');
      const result = await LocalAuth.authenticateAsync({
        promptMessage: 'Autentícate para acceder a Guayaba',
        fallbackLabel: 'Usar contraseña',
      });
      if (result.success) {
        router.replace('/(tabs)');
      }
    } catch {
      // Not available
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword =
    password.length >= 8 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
  const canSubmit = isValidEmail && isValidPassword;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginApi({ email, password });
      if (result.data?.token) {
        await signIn(result.data.token);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.replace('/(auth)/register');
  };

  return (
    <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Logo (animated) ─────────────────────── */}
          <View style={styles.logoContainer}>
            <Animated.Image
              source={require('../../../assets/images/guayaba-logo.png')}
              style={[
                styles.logo,
                { transform: [{ scale: logoScale }], opacity: logoOpacity },
              ]}
            />
          </View>

          {/* ─── Title ─────────────────────────────────── */}
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>
            Ingresa tus credenciales para continuar
          </Text>

          {/* ─── Email ─────────────────────────────────── */}
          <AppInput
            type="email"
            label="Correo electrónico"
            icon="mail-outline"
            placeholder="tu@correo.com"
            value={email}
            onChangeText={setEmail}
          />

          {/* ─── Password ──────────────────────────────── */}
          <AppInput
            type="password"
            label="Contraseña"
            icon="lock-closed-outline"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            helpDescription="La contraseña debe contener mínimo 8 caracteres, al menos 1 letra mayúscula y 1 símbolo especial (por ejemplo: @, #, $)."
            showPasswordValidator
          />

          {/* ─── Forgot password ─────────────────────────── */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={{ alignSelf: 'flex-end', marginBottom: 8 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.salmon }}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* ─── Button ────────────────────────────────── */}
          <View style={styles.buttonContainer}>
            <GradientButton
              label="Iniciar Sesión"
              onPress={handleLogin}
              disabled={!canSubmit}
              loading={loading}
              colors={Gradients.salmonButton as unknown as [string, string, ...string[]]}
            />
          </View>

          {/* ─── Biometric ─────────────────────────────── */}
          {biometricAvailable && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometric}
              activeOpacity={0.7}
            >
              <Ionicons name="finger-print" size={28} color={Colors.salmon} />
              <Text style={styles.biometricText}>Acceder con biometría</Text>
            </TouchableOpacity>
          )}

          {/* ─── Footer ────────────────────────────────── */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.footerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </View>
  );
}
