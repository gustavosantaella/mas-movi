import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { StepIdentity } from '@/features/auth/components/StepIdentity';
import { verifyIdentity } from '@/services/authService';
import { confirmEntity } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEntityScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!documentUri || !selfieUri) return;
    setLoading(true);
    setError(null);

    try {
      const result = await verifyIdentity(selfieUri, documentUri);
      if (result.data?.facesMatch) {
        // Save OCR-extracted data and set entityConfirmed = true
        if (token) {
          const doc = result.data.documentData;
          await confirmEntity(token, {
            dni: doc?.documentNumber,
            firstName: doc?.firstName,
            lastName: doc?.lastName,
            dateOfBirth: doc?.dateOfBirth,
            sex: doc?.sex,
          });
        }

        Alert.alert(
          'Verificación exitosa',
          'Tu identidad ha sido verificada correctamente.',
          [{ text: 'OK', onPress: () => router.back() }],
        );
      } else {
        setError(
          'No se pudo verificar tu identidad. Asegúrate de que la foto del documento y la selfie sean claras.',
        );
      }
    } catch (err: any) {
      setError(err.message || 'Error durante la verificación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Verificar identidad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepIdentity
          documentUri={documentUri}
          selfieUri={selfieUri}
          onDocumentPicked={setDocumentUri}
          onSelfiePicked={setSelfieUri}
          onNext={handleVerify}
          loading={loading}
          error={error}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
