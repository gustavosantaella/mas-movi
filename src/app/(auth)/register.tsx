import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing } from '@/theme';
import { RegisterStepper } from '@/features/auth/components/RegisterStepper';
import { StepRole } from '@/features/auth/components/StepRole';
import { StepIdentity } from '@/features/auth/components/StepIdentity';
import { StepCredentials } from '@/features/auth/components/StepCredentials';
import { SuccessOverlay } from '@/features/auth/components/SuccessOverlay';

const TOTAL_STEPS = 3;
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

  // Step 0 — Role
  const [role, setRole] = useState<'conductor' | 'pasajero' | null>(null);

  // Step 1 — Identity
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);

  // Step 2 — Credentials
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

  const goBack = () => {
    if (currentStep === 0) {
      router.replace('/(auth)/login');
    } else {
      animateTransition('back', currentStep - 1);
    }
  };

  const handleRegister = () => {
    setRegisterLoading(true);
    // TODO: integrate with auth service
    console.log('Register', { role, documentUri, selfieUri, email, password, acceptedTerms });
    setTimeout(() => {
      setRegisterLoading(false);
      setShowSuccess(true);
    }, 1500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepRole selectedRole={role} onSelectRole={setRole} onNext={goNext} />;
      case 1:
        return (
          <StepIdentity
            documentUri={documentUri}
            selfieUri={selfieUri}
            onDocumentPicked={setDocumentUri}
            onSelfiePicked={setSelfieUri}
            onNext={goNext}
          />
        );
      case 2:
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
    <View style={styles.container}>
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
    </View>
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
