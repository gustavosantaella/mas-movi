import React from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Gradients } from '@/theme';
import { aiRouteStyles as styles } from '../styles';

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

export function ChatInput({ value, onChangeText, onSend }: ChatInputProps) {
  const handleSend = () => {
    Keyboard.dismiss();
    onSend();
  };

  return (
    <View style={styles.inputOuterContainer}>
      <View style={styles.inputInnerContainer}>
        <TextInput
          style={styles.input}
          placeholder="E.g. Quiero ir al centro..."
          placeholderTextColor="#667"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <LinearGradient
            colors={Gradients.primary as unknown as [string, string, ...string[]]}
            style={styles.sendButtonGradient}
          >
            <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
