import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { Colors, Gradients } from '@/theme';
import { GradientButton } from '@/components/ui';
import { URL_TERMS_AND_CONDITIONS, URL_PRIVACY_POLICY } from '@/constants';
import { authStyles as styles } from '@/features/auth/styles';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const canSubmit = acceptedTerms && name.trim() && email.trim() && password && confirmPassword;

  const handleRegister = () => {
    // TODO: integrate with auth service
    console.log('Register', { name, email, password, confirmPassword, acceptedTerms });
  };

  const goToLogin = () => {
    router.replace('/(auth)/login');
  };

  const openTerms = () => {
    WebBrowser.openBrowserAsync(URL_TERMS_AND_CONDITIONS);
  };

  const openPrivacy = () => {
    WebBrowser.openBrowserAsync(URL_PRIVACY_POLICY);
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
              source={require('../../../assets/images/movimas-logo.png')}
              style={styles.logo}
            />
          </View>

          {/* ─── Title ─────────────────────────────────── */}
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para registrarte
          </Text>

          {/* ─── Name ──────────────────────────────────── */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre completo</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'name' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={focusedField === 'name' ? Colors.salmon : Colors.grayNeutral}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor={Colors.grayNeutral}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

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
            <Text style={styles.inputLabel}>Contraseña</Text>
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
          </View>

          {/* ─── Confirm Password ──────────────────────── */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirmar contraseña</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'confirm' && styles.inputWrapperFocused,
              ]}
            >
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
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirm((v) => !v)}
              >
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
              onPress={() => setAcceptedTerms((v) => !v)}
              style={[
                styles.checkboxBox,
                acceptedTerms && styles.checkboxBoxChecked,
              ]}
            >
              {acceptedTerms && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
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
              onPress={handleRegister}
              disabled={!canSubmit}
              colors={Gradients.salmonButton as unknown as [string, string, ...string[]]}
            />
          </View>

          {/* ─── Footer ────────────────────────────────── */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </View>
  );
}
