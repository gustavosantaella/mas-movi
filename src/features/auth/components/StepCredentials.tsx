import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { Colors, Gradients, BorderRadius, Spacing } from '@/theme';
import { GradientButton, AppInput } from '@/components/ui';
import { URL_TERMS_AND_CONDITIONS, URL_PRIVACY_POLICY } from '@/constants';

type StepCredentialsProps = {
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onToggleTerms: () => void;
  onRegister: () => void;
  loading?: boolean;
};

export function StepCredentials({
  email,
  password,
  confirmPassword,
  acceptedTerms,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onToggleTerms,
  onRegister,
  loading = false,
}: StepCredentialsProps) {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword =
    password.length >= 8 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = isValidEmail && isValidPassword && passwordsMatch && acceptedTerms;

  const openTerms = () => WebBrowser.openBrowserAsync(URL_TERMS_AND_CONDITIONS);
  const openPrivacy = () => WebBrowser.openBrowserAsync(URL_PRIVACY_POLICY);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>

      {/* ─── Email ─────────────────────────────────── */}
      <AppInput
        type="email"
        label="Correo electrónico"
        icon="mail-outline"
        placeholder="tu@correo.com"
        value={email}
        onChangeText={onEmailChange}
      />

      {/* ─── Password ──────────────────────────────── */}
      <AppInput
        type="password"
        label="Contraseña"
        icon="lock-closed-outline"
        placeholder="••••••••"
        value={password}
        onChangeText={onPasswordChange}
        helpDescription="La contraseña debe contener mínimo 8 caracteres, al menos 1 letra mayúscula y 1 símbolo especial (por ejemplo: @, #, $)."
        showPasswordValidator
      />

      {/* ─── Confirm Password ──────────────────────── */}
      <AppInput
        type="password"
        label="Confirmar contraseña"
        icon="shield-checkmark-outline"
        placeholder="••••••••"
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        error={
          confirmPassword.length > 0 && !passwordsMatch
            ? 'Las contraseñas no coinciden'
            : undefined
        }
      />

      {/* ─── Terms Checkbox ────────────────────────── */}
      <View style={styles.checkboxRow}>
        <Pressable
          onPress={onToggleTerms}
          style={[styles.checkboxBox, acceptedTerms && styles.checkboxBoxChecked]}
        >
          {acceptedTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
        </Pressable>
        <Text style={styles.checkboxLabel}>
          Acepto los{' '}
          <Text style={styles.checkboxLink} onPress={openTerms}>
            Términos y Condiciones
          </Text>
          {' '}y la{' '}
          <Text style={styles.checkboxLink} onPress={openPrivacy}>
            Política de Privacidad
          </Text>
        </Text>
      </View>

      {/* ─── Button ────────────────────────────────── */}
      <View style={styles.buttonContainer}>
        <GradientButton
          label="Registrarse"
          onPress={onRegister}
          disabled={!canSubmit}
          loading={loading}
          colors={Gradients.salmonButton as unknown as [string, string, ...string[]]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.charcoal,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.grayNeutral,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.borderLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.salmon,
    borderColor: Colors.salmon,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.grayNeutral,
  },
  checkboxLink: {
    color: Colors.salmon,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
