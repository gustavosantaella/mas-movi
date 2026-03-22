import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Gradients } from '@/theme';
import { GradientButton, AppInput } from '@/components/ui';
import { profileStyles as styles } from '@/features/profile/styles';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile, UserProfile } from '@/services/userService';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            setFirstName(res.data.firstName || '');
            setLastName(res.data.lastName || '');
            setDateOfBirth(res.data.dateOfBirth || '');
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  const hasChanges =
    firstName !== (user?.firstName || '') ||
    lastName !== (user?.lastName || '') ||
    dateOfBirth !== (user?.dateOfBirth || '');

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await updateProfile(token, { firstName, lastName, dateOfBirth });
      if (res.data) {
        setUser(res.data);
        setEditing(false);
        Alert.alert('Éxito', 'Datos actualizados correctamente.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo actualizar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgWhite }}>
      {/* Handle bar */}
      <View style={styles.handle} />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.salmon} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.charcoal }}>
                Información Personal
              </Text>
              <TouchableOpacity onPress={() => setEditing(!editing)} activeOpacity={0.7}>
                <Ionicons
                  name={editing ? 'close' : 'create-outline'}
                  size={22}
                  color={editing ? Colors.coralIntense : Colors.salmon}
                />
              </TouchableOpacity>
            </View>

            {/* Fields */}
            <View style={styles.infoCardsSection}>
              <View style={[styles.infoCard, editing && { borderWidth: 1.5, borderColor: Colors.salmonSoft, backgroundColor: Colors.bgWhite }]}>
                <Text style={styles.infoLabel}>Nombre</Text>
                {editing ? (
                  <AppInput type="text" placeholder="Tu nombre" value={firstName} onChangeText={setFirstName} />
                ) : (
                  <Text style={styles.infoValue}>{firstName || '—'}</Text>
                )}
              </View>

              <View style={[styles.infoCard, editing && { borderWidth: 1.5, borderColor: Colors.salmonSoft, backgroundColor: Colors.bgWhite }]}>
                <Text style={styles.infoLabel}>Apellido</Text>
                {editing ? (
                  <AppInput type="text" placeholder="Tu apellido" value={lastName} onChangeText={setLastName} />
                ) : (
                  <Text style={styles.infoValue}>{lastName || '—'}</Text>
                )}
              </View>

              <View style={[styles.infoCard, editing && { borderWidth: 1.5, borderColor: Colors.salmonSoft, backgroundColor: Colors.bgWhite }]}>
                <Text style={styles.infoLabel}>Fecha de nacimiento</Text>
                {editing ? (
                  <AppInput type="text" placeholder="DD/MM/AAAA" value={dateOfBirth} onChangeText={setDateOfBirth} />
                ) : (
                  <Text style={styles.infoValue}>{dateOfBirth || '—'}</Text>
                )}
              </View>

              {/* Read-only */}
              <View style={styles.infoCard}>
                <Text style={[styles.infoLabel, { color: Colors.grayNeutral }]}>Correo electrónico</Text>
                <Text style={[styles.infoValue, { color: Colors.grayNeutral }]}>{user?.email || '—'}</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={[styles.infoLabel, { color: Colors.grayNeutral }]}>DNI / Cédula</Text>
                <Text style={[styles.infoValue, { color: Colors.grayNeutral }]}>{user?.dni || '—'}</Text>
              </View>
            </View>

            {editing && hasChanges && (
              <GradientButton
                label="Guardar cambios"
                onPress={handleSave}
                loading={saving}
                colors={Gradients.salmonButton as unknown as [string, string, ...string[]]}
              />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
