import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/theme';
import type { OcrResult } from '@/services/authService';

type StepVerifyDataProps = {
  ocrResult: OcrResult;
  role: 'conductor' | 'pasajero' | null;
  onNext: (editedData: OcrResult['documentData']) => void;
  onRetake: () => void;
};

type FieldKey = keyof OcrResult['documentData'];

function EditableRow({
  icon,
  label,
  value,
  editing,
  onToggleEdit,
  onChangeValue,
}: {
  icon: string;
  label: string;
  value: string;
  editing: boolean;
  onToggleEdit: () => void;
  onChangeValue: (v: string) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon as any} size={20} color={Colors.salmon} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {editing ? (
          <TextInput
            style={styles.rowInput}
            value={value}
            onChangeText={onChangeValue}
            autoFocus
            selectTextOnFocus
          />
        ) : (
          <Text style={styles.rowValue}>{value || 'N/A'}</Text>
        )}
      </View>
      <TouchableOpacity onPress={onToggleEdit} style={styles.editButton} activeOpacity={0.6}>
        <Ionicons
          name={editing ? 'checkmark-circle' : 'create-outline'}
          size={20}
          color={editing ? '#16a34a' : Colors.grayNeutral}
        />
      </TouchableOpacity>
    </View>
  );
}

function StaticRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon as any} size={20} color={Colors.salmon} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value || 'N/A'}</Text>
      </View>
    </View>
  );
}

export function StepVerifyData({ ocrResult, role, onNext, onRetake }: StepVerifyDataProps) {
  const { facesMatch, confidence, documentData } = ocrResult;

  const [editedData, setEditedData] = useState({ ...documentData });
  const [editingField, setEditingField] = useState<FieldKey | null>(null);

  const toggleEdit = (field: FieldKey) => {
    setEditingField((prev) => (prev === field ? null : field));
  };

  const updateField = (field: FieldKey, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const fields: { key: FieldKey; icon: string; label: string }[] = [
    { key: 'firstName', icon: 'person-outline', label: 'Nombre' },
    { key: 'lastName', icon: 'person-outline', label: 'Apellido' },
    { key: 'dateOfBirth', icon: 'calendar-outline', label: 'Fecha de nacimiento' },
    { key: 'sex', icon: 'male-female-outline', label: 'Sexo' },
    { key: 'documentNumber', icon: 'document-text-outline', label: 'N° de documento' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tus datos</Text>
      <Text style={styles.subtitle}>
        Estos datos fueron extraídos de tu documento. Toca el ícono de editar si necesitas corregir algo.
      </Text>

      {/* ─── Face match indicator ─────────────── */}
      <View style={[styles.matchBanner, facesMatch ? styles.matchSuccess : styles.matchFail]}>
        <Ionicons
          name={facesMatch ? 'checkmark-circle' : 'close-circle'}
          size={22}
          color={facesMatch ? '#16a34a' : Colors.salmon}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.matchText, facesMatch ? styles.matchTextSuccess : styles.matchTextFail]}>
            {facesMatch ? 'Las fotos coinciden' : 'Las fotos no coinciden'}
          </Text>
          <Text style={styles.matchConfidence}>Confianza: {confidence}%</Text>
        </View>
      </View>

      {/* ─── Editable extracted data ─────────── */}
      <View style={styles.card}>
        {fields.map((f) => (
          <EditableRow
            key={f.key}
            icon={f.icon}
            label={f.label}
            value={editedData[f.key]}
            editing={editingField === f.key}
            onToggleEdit={() => toggleEdit(f.key)}
            onChangeValue={(v) => updateField(f.key, v)}
          />
        ))}
        {role && (
          <StaticRow
            icon="car-outline"
            label="Rol"
            value={role === 'conductor' ? 'Conductor' : 'Pasajero'}
          />
        )}
      </View>

      {/* ─── Actions ─────────────────────────── */}
      <TouchableOpacity
        style={styles.nextButton}
        activeOpacity={0.85}
        onPress={() => onNext(editedData)}
      >
        <Text style={styles.nextButtonText}>Confirmar y continuar</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.retakeButton}
        activeOpacity={0.7}
        onPress={onRetake}
      >
        <Ionicons name="refresh-outline" size={18} color={Colors.salmon} />
        <Text style={styles.retakeText}>Volver a tomar las fotos</Text>
      </TouchableOpacity>
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

  // ── Face match banner ──
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
  },
  matchSuccess: {
    backgroundColor: '#dcfce7',
  },
  matchFail: {
    backgroundColor: `${Colors.salmon}15`,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '700',
  },
  matchTextSuccess: {
    color: '#16a34a',
  },
  matchTextFail: {
    color: Colors.salmon,
  },
  matchConfidence: {
    fontSize: 12,
    color: Colors.grayNeutral,
    marginTop: 2,
  },

  // ── Data card ──
  card: {
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: 2,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.salmon}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: Colors.grayNeutral,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 15,
    color: Colors.charcoal,
    fontWeight: '600',
    marginTop: 1,
  },
  rowInput: {
    fontSize: 15,
    color: Colors.charcoal,
    fontWeight: '600',
    marginTop: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.salmon,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  editButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Buttons ──
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
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  retakeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.salmon,
  },
});
