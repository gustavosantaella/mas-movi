import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Gradients } from '@/theme';
import { GradientButton } from '@/components/ui';
import { authStyles as styles } from '@/features/auth/styles';
import { InputLabel } from '@/features/auth/components/InputLabel';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword =
    password.length >= 8 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
  const canSubmit = isValidEmail && isValidPassword;

  const handleLogin = () => {
    // TODO: integrate with auth service
    console.log('Login', { email, password });
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
          {/* ─── Logo ──────────────────────────────────── */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/guayaba-logo.png')}
              style={styles.logo}
            />
          </View>

          {/* ─── Title ─────────────────────────────────── */}
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>
            Ingresa tus credenciales para continuar
          </Text>

          {/* ─── Email ─────────────────────────────────── */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'email' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={focusedField === 'email' ? Colors.salmon : Colors.grayNeutral}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="tu@correo.com"
                placeholderTextColor={Colors.grayNeutral}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* ─── Password ──────────────────────────────── */}
          <View style={styles.inputGroup}>
            <InputLabel
              label="Contraseña"
              helpDescription="La contraseña debe contener mínimo 8 caracteres, al menos 1 letra mayúscula y 1 símbolo especial (por ejemplo: @, #, $)."
            />
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focusedField === 'password' ? Colors.salmon : Colors.grayNeutral}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.grayNeutral}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.grayNeutral}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.helpText}>Mínimo 8 caracteres, 1 mayúscula y 1 símbolo</Text>
          </View>

          {/* ─── Button ────────────────────────────────── */}
          <View style={styles.buttonContainer}>
            <GradientButton
              label="Iniciar Sesión"
              onPress={handleLogin}
              disabled={!canSubmit}
              colors={Gradients.salmonButton as unknown as [string, string, ...string[]]}
            />
          </View>

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
