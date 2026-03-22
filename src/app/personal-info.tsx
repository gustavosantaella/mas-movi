import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Pressable,
  PanResponder,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Gradients } from '@/theme';
import { GradientButton, AppInput } from '@/components/ui';
import { profileStyles as styles } from '@/features/profile/styles';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile, UserProfile } from '@/services/userService';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DISMISS_THRESHOLD = 120;

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(300)).current;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(sheetTranslateY, { toValue: 0, damping: 25, stiffness: 200, useNativeDriver: true }),
    ]).start();

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

  const dismissSheet = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(sheetTranslateY, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
    ]).start(() => router.back());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          sheetTranslateY.setValue(g.dy);
          backdropOpacity.setValue(Math.max(0, 1 - g.dy / SCREEN_HEIGHT));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          dismissSheet();
        } else {
          Animated.parallel([
            Animated.spring(sheetTranslateY, { toValue: 0, damping: 25, stiffness: 200, useNativeDriver: true }),
            Animated.timing(backdropOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
          ]).start();
        }
      },
    }),
  ).current;

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
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={dismissSheet} />
      </Animated.View>

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        {loading ? (
          <View style={{ padding: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.salmon} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Header row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
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
      </Animated.View>
    </View>
  );
}
