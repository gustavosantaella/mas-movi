import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { profileStyles as styles } from '@/features/profile/styles';
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
        setError('No se pudo verificar tu identidad. Asegúrate de que la foto del documento y la selfie sean claras.');
      }
    } catch (err: any) {
      setError(err.message || 'Error durante la verificación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgWhite }}>
      <View style={styles.handle} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ marginRight: 14 }}>
              <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.charcoal }}>
              Verificar identidad
            </Text>
          </View>

          <StepIdentity
            documentUri={documentUri}
            selfieUri={selfieUri}
            onDocumentPicked={setDocumentUri}
            onSelfiePicked={setSelfieUri}
            onNext={handleVerify}
            loading={loading}
            error={error}
          />
        </View>
      </ScrollView>
    </View>
  );
}
