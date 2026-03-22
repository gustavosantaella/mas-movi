import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing } from '@/theme';
import { RegisterStepper } from '@/features/auth/components/RegisterStepper';
import { StepRole } from '@/features/auth/components/StepRole';
import { StepIdentity } from '@/features/auth/components/StepIdentity';
import { StepVerifyData } from '@/features/auth/components/StepVerifyData';
import { StepCredentials } from '@/features/auth/components/StepCredentials';
import { SuccessOverlay } from '@/features/auth/components/SuccessOverlay';
import { verifyIdentity, register, OcrResult } from '@/services/authService';

const TOTAL_STEPS = 4;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ANIM_DURATION = 280;

export default function RegisterScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showSuccess, setShowSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

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

  // ── Accumulated form data ──
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateFormData = (patch: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  // Step 0 — Role
  const [role, setRole] = useState<'conductor' | 'pasajero' | null>(null);

  // Step 1 — Identity
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);

  // Step 3 — Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const animateTransition = useCallback(
    (direction: 'forward' | 'back', newStep: number) => {
      const exitTo = direction === 'forward' ? -SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.3;
      const enterFrom = direction === 'forward' ? SCREEN_WIDTH * 0.3 : -SCREEN_WIDTH * 0.3;

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: exitTo,
          duration: ANIM_DURATION / 2,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIM_DURATION / 2,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(newStep);
        slideAnim.setValue(enterFrom);

        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: ANIM_DURATION / 2,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: ANIM_DURATION / 2,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [slideAnim, fadeAnim],
  );

  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      animateTransition('forward', currentStep + 1);
    }
  };

  const goToStep = (step: number) => {
    const direction = step > currentStep ? 'forward' : 'back';
    animateTransition(direction, step);
  };

  const goBack = () => {
    if (currentStep === 0) {
      router.replace('/(auth)/login');
    } else if (currentStep === 3 && role === 'pasajero' && !ocrResult) {
      // Passenger skipped OCR → go back to role selection
      animateTransition('back', 0);
    } else {
      animateTransition('back', currentStep - 1);
    }
  };

  const handleSelectRole = (r: 'conductor' | 'pasajero') => {
    setRole(r);
    updateFormData({ role: r });
  };

  const handleVerifyIdentity = async () => {
    if (!selfieUri || !documentUri) return;
    setOcrLoading(true);
    setOcrError(null);
    try {
      const response = await verifyIdentity(selfieUri, documentUri);
      setOcrResult(response.data ?? null);
      updateFormData({
        selfieUri,
        documentUri,
        ocrResult: response.data,
      });
      goNext();
    } catch (err: any) {
      setOcrError(err.message || 'Error al verificar identidad.');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleRetakePhotos = () => {
    setDocumentUri(null);
    setSelfieUri(null);
    setOcrResult(null);
    goToStep(1);
  };

  const handleRegister = async () => {
    setRegisterLoading(true);
    try {
      const userType = role === 'conductor' ? 3 : 2;
      const docData = formData.documentData ?? {};

      await register({
        email,
        password,
        userType,
        dni: docData.documentNumber ?? '',
        firstName: docData.firstName,
        lastName: docData.lastName,
        dateOfBirth: docData.dateOfBirth,
        sex: docData.sex,
      });

      setShowSuccess(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo completar el registro.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepRole selectedRole={role} onSelectRole={handleSelectRole} onNext={goNext} />;
      case 1:
        return (
          <StepIdentity
            documentUri={documentUri}
            selfieUri={selfieUri}
            onDocumentPicked={setDocumentUri}
            onSelfiePicked={setSelfieUri}
            onNext={handleVerifyIdentity}
            onSkip={role === 'pasajero' ? () => goToStep(3) : undefined}
            loading={ocrLoading}
            error={ocrError}
          />
        );
      case 2:
        return ocrResult ? (
          <StepVerifyData
            ocrResult={ocrResult}
            role={role}
            onNext={(editedData) => {
              updateFormData({ documentData: editedData });
              goNext();
            }}
            onRetake={handleRetakePhotos}
          />
        ) : null;
      case 3:
        return (
          <StepCredentials
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            acceptedTerms={acceptedTerms}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onToggleTerms={() => setAcceptedTerms((v) => !v)}
            onRegister={handleRegister}
            loading={registerLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ─── Success overlay ───────────────────────── */}
      <SuccessOverlay
        visible={showSuccess}
        message="¡Cuenta creada con éxito!"
        onFinish={() => router.replace('/(auth)/login')}
      />

      {/* ─── Top bar: back + stepper ──────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.stepperWrapper}>
          <RegisterStepper totalSteps={TOTAL_STEPS} currentStep={currentStep} />
        </View>
        <View style={styles.backButton} />
      </View>

      {/* ─── Logo (animated) ──────────────────────── */}
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../../../assets/images/guayaba-logo.png')}
          style={[
            styles.logo,
            { transform: [{ scale: logoScale }], opacity: logoOpacity },
          ]}
        />
      </View>

      {/* ─── Step content (animated) ──────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          }}
        >
          {renderStep()}
        </Animated.View>
      </ScrollView>

      {/* ─── Footer link ──────────────────────────── */}
      {currentStep === 0 && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.footerText}>
              ¿Ya tienes cuenta? <Text style={styles.footerLink}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.huge,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperWrapper: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  footer: {
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.grayNeutral,
  },
  footerLink: {
    color: Colors.salmon,
    fontWeight: '700',
  },
});
