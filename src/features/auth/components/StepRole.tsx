import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, BorderRadius, Spacing } from '@/theme';

type StepRoleProps = {
  selectedRole: 'conductor' | 'pasajero' | null;
  onSelectRole: (role: 'conductor' | 'pasajero') => void;
  onNext: () => void;
};

const ROLES = [
  {
    id: 'conductor' as const,
    label: 'Soy Conductor',
    description: 'Ofrece viajes y gana dinero',
    icon: 'car-sport-outline' as const,
    iconColor: Colors.salmon,
    iconBg: Colors.peach,
  },
  {
    id: 'pasajero' as const,
    label: 'Soy Pasajero',
    description: 'Solicita viajes de forma fácil',
    icon: 'person-outline' as const,
    iconColor: '#8B5CF6',
    iconBg: '#EDE9FE',
  },
];

export function StepRole({ selectedRole, onSelectRole, onNext }: StepRoleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo usarás Guayaba?</Text>
      <Text style={styles.subtitle}>Selecciona tu tipo de cuenta</Text>

      <View style={styles.cardsContainer}>
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <TouchableOpacity
              key={role.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.8}
              onPress={() => onSelectRole(role.id)}
            >
              <View style={[styles.cardIcon, { backgroundColor: role.iconBg }]}>
                <Ionicons name={role.icon} size={28} color={role.iconColor} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>{role.label}</Text>
                <Text style={styles.cardDescription}>{role.description}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !selectedRole && { opacity: 0.5 }]}
        activeOpacity={0.85}
        onPress={onNext}
        disabled={!selectedRole}
      >
        <Text style={styles.nextButtonText}>Continuar</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
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
    marginBottom: Spacing.xxl,
  },
  cardsContainer: {
    gap: 14,
    marginBottom: Spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.borderLightGray,
  },
  cardSelected: {
    borderColor: Colors.salmon,
    backgroundColor: '#FFF5F3',
  },
  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.grayNeutral,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  radioSelected: {
    borderColor: Colors.salmon,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.salmon,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.salmon,
    borderRadius: BorderRadius.pill,
    paddingVertical: 16,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
