import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';

import { paymentStyles as styles } from '../styles';

type PaymentOptionProps = {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  selected?: boolean;
  onPress?: () => void;
};

export function PaymentOption({ icon, label, sublabel, selected = false, onPress }: PaymentOptionProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <BlurView
        intensity={20}
        tint="light"
        style={[styles.optionCard, selected && styles.optionCardSelected]}
      >
        <View style={styles.optionIconContainer}>
          {icon}
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionLabel}>{label}</Text>
          <Text style={styles.optionSubLabel}>{sublabel}</Text>
        </View>
        <View style={styles.radioContainer}>
          {selected && <View style={styles.radioInner} />}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}
