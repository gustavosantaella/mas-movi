import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { Colors, Gradients, BorderRadius, Spacing } from '@/theme';
import { GradientButton } from '@/components/ui';
import { URL_TERMS_AND_CONDITIONS, URL_PRIVACY_POLICY } from '@/constants';
import { InputLabel } from './InputLabel';

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
}: StepCredentialsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Correo electrónico</Text>
        <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
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
            onChangeText={onEmailChange}
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
        <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
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
            onChangeText={onPasswordChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword((v) => !v)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.grayNeutral}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.helpText}>Mínimo 8 caracteres, 1 mayúscula y 1 símbolo</Text>
      </View>

      {/* ─── Confirm Password ──────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Confirmar contraseña</Text>
        <View style={[styles.inputWrapper, focusedField === 'confirm' && styles.inputWrapperFocused]}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={focusedField === 'confirm' ? Colors.salmon : Colors.grayNeutral}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.grayNeutral}
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={onConfirmPasswordChange}
            onFocus={() => setFocusedField('confirm')}
            onBlur={() => setFocusedField(null)}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirm((v) => !v)}>
            <Ionicons
              name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.grayNeutral}
            />
          </TouchableOpacity>
        </View>
      </View>

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
  inputGroup: {
    marginBottom: Spacing.base,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayNeutral,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    paddingHorizontal: Spacing.base,
    height: 54,
  },
  inputWrapperFocused: {
    borderColor: Colors.salmon,
    backgroundColor: Colors.bgWhite,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.charcoal,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  helpText: {
    fontSize: 12,
    color: Colors.grayNeutral,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
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
