import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, BorderRadius } from '@/theme';

type PasswordValidatorProps = {
  password: string;
};

type Rule = {
  label: string;
  test: (pw: string) => boolean;
};

const RULES: Rule[] = [
  { label: 'Mínimo 8 caracteres', test: (pw) => pw.length >= 8 },
  { label: '1 letra mayúscula', test: (pw) => /[A-Z]/.test(pw) },
  { label: '1 símbolo especial', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function getStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: '', color: 'transparent' };
  const passed = RULES.filter((r) => r.test(password)).length;
  if (passed <= 1) return { level: 1, label: 'Débil', color: '#EF4444' };
  if (passed === 2) return { level: 2, label: 'Media', color: '#F59E0B' };
  return { level: 3, label: 'Fuerte', color: Colors.successGreen };
}

export function PasswordValidator({ password }: PasswordValidatorProps) {
  const strength = getStrength(password);

  if (!password) return null;

  return (
    <View style={styles.container}>
      {/* ─── Strength bar ──────────────────────────── */}
      <View style={styles.barContainer}>
        <View style={styles.barTrack}>
          {[1, 2, 3].map((seg) => (
            <View
              key={seg}
              style={[
                styles.barSegment,
                seg <= strength.level && { backgroundColor: strength.color },
              ]}
            />
          ))}
        </View>
        {strength.label ? (
          <Text style={[styles.strengthLabel, { color: strength.color }]}>
            {strength.label}
          </Text>
        ) : null}
      </View>

      {/* ─── Rule checklist ────────────────────────── */}
      <View style={styles.rules}>
        {RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <View key={rule.label} style={styles.ruleRow}>
              <Ionicons
                name={passed ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={passed ? Colors.successGreen : Colors.grayNeutral}
              />
              <Text style={[styles.ruleText, passed && styles.ruleTextPassed]}>
                {rule.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  barTrack: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    height: 4,
  },
  barSegment: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: Colors.borderLightGray,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 44,
  },
  rules: {
    gap: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ruleText: {
    fontSize: 12,
    color: Colors.grayNeutral,
  },
  ruleTextPassed: {
    color: Colors.successGreen,
  },
});
