import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActionSheetIOS, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Colors, BorderRadius, Spacing } from '@/theme';

type StepIdentityProps = {
  documentUri: string | null;
  selfieUri: string | null;
  onDocumentPicked: (uri: string) => void;
  onSelfiePicked: (uri: string) => void;
  onNext: () => void;
  onSkip?: () => void;
  loading?: boolean;
  error?: string | null;
};

async function pickFromCamera(onPick: (uri: string) => void, frontOnly: boolean) {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara.');
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: true,
    aspect: frontOnly ? [1, 1] : [4, 3],
    cameraType: frontOnly ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
  });
  if (!result.canceled) onPick(result.assets[0].uri);
}

async function pickFromGallery(onPick: (uri: string) => void) {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería.');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
  });
  if (!result.canceled) onPick(result.assets[0].uri);
}

function showImageSourcePicker(onPick: (uri: string) => void, frontOnly = false) {
  if (frontOnly) {
    pickFromCamera(onPick, true);
    return;
  }

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ['Tomar foto', 'Elegir de galería', 'Cancelar'], cancelButtonIndex: 2 },
      (index) => {
        if (index === 0) pickFromCamera(onPick, false);
        else if (index === 1) pickFromGallery(onPick);
      },
    );
  } else {
    Alert.alert('Seleccionar imagen', '¿De dónde quieres tomar la foto?', [
      { text: 'Cámara', onPress: () => pickFromCamera(onPick, false) },
      { text: 'Galería', onPress: () => pickFromGallery(onPick) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }
}

export function StepIdentity({
  documentUri,
  selfieUri,
  onDocumentPicked,
  onSelfiePicked,
  onNext,
  onSkip,
  loading = false,
  error = null,
}: StepIdentityProps) {
  const canContinue = !!documentUri && !!selfieUri && !loading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tu identidad</Text>
      <Text style={styles.subtitle}>Sube una foto de tu documento y tómate una selfie</Text>

      {/* ─── Document ──────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Documento de identidad</Text>
      <TouchableOpacity
        style={styles.photoPlaceholder}
        activeOpacity={0.75}
        onPress={() => showImageSourcePicker(onDocumentPicked)}
      >
        {documentUri ? (
          <Image source={{ uri: documentUri }} style={styles.photoThumbnail} />
        ) : (
          <View style={styles.placeholderContent}>
            <Ionicons name="id-card-outline" size={40} color={Colors.grayNeutral} />
            <Text style={styles.placeholderText}>Toca para subir o tomar foto</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ─── Selfie ────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Selfie</Text>
      <TouchableOpacity
        style={styles.selfiePlaceholder}
        activeOpacity={0.75}
        onPress={() => showImageSourcePicker(onSelfiePicked, true)}
      >
        {selfieUri ? (
          <Image source={{ uri: selfieUri }} style={styles.selfieThumbnail} />
        ) : (
          <View style={styles.placeholderContent}>
            <Ionicons name="camera-outline" size={36} color={Colors.grayNeutral} />
            <Text style={styles.placeholderText}>Toca para tomar selfie</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.selfieHint}>* Evite usar accesorios para que el reconocimiento sea más efectivo</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={18} color={Colors.salmon} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.nextButton, !canContinue && { opacity: 0.5 }]}
        activeOpacity={0.85}
        onPress={onNext}
        disabled={!canContinue}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Text style={styles.nextButtonText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      {onSkip && (
        <TouchableOpacity
          style={styles.skipButton}
          activeOpacity={0.7}
          onPress={onSkip}
        >
          <Text style={styles.skipText}>Saltar este paso</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  photoPlaceholder: {
    height: 180,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderLightGray,
    borderStyle: 'dashed',
    backgroundColor: Colors.bgLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selfiePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: Colors.borderLightGray,
    borderStyle: 'dashed',
    backgroundColor: Colors.bgLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: Spacing.xxl,
  },
  selfieThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 13,
    color: Colors.grayNeutral,
    fontWeight: '500',
  },
  selfieHint: {
    fontSize: 12,
    color: Colors.grayNeutral,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.salmon,
    borderRadius: BorderRadius.pill,
    paddingVertical: 16,
    marginTop: 'auto' as any,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${Colors.salmon}15`,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.salmon,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
});
