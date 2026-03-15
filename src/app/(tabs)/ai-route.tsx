import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';

import { Gradients } from '@/theme';
import { RouteMap } from '@/features/ai-route/components/RouteMap';
import { ChatMessages } from '@/features/ai-route/components/ChatMessages';
import { ChatInput } from '@/features/ai-route/components/ChatInput';
import { aiRouteStyles as styles } from '@/features/ai-route/styles';

type Message = { id: string; text: string; sender: 'ai' | 'user' };

export default function AIRouteScreen() {
  const { fromHistory } = useLocalSearchParams<{ fromHistory?: string }>();
  const isHistoryView = fromHistory === '1';

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '¡Hola! Soy tu asistente de movilidad inteligente. ¿Hacia dónde te diriges hoy?', sender: 'ai' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), text: inputText, sender: 'user' as const }]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: 'Calculando la mejor ruta... He encontrado 2 opciones disponibles usando transporte público.', sender: 'ai' as const },
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <RouteMap fullScreen={isHistoryView} />

      {!isHistoryView && (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <LinearGradient
            colors={[Gradients.dark[0], Gradients.dark[1]] as [string, string]}
            style={styles.chatBackground}
          >
            <ChatMessages messages={messages} />
            <ChatInput value={inputText} onChangeText={setInputText} onSend={handleSend} />
          </LinearGradient>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
