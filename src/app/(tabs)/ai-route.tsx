import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Keyboard, Platform, StyleSheet, Animated as RNAnimated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Gradients } from '@/theme';
import { RouteMap } from '@/features/ai-route/components/RouteMap';
import { ChatMessages } from '@/features/ai-route/components/ChatMessages';
import { ChatInput } from '@/features/ai-route/components/ChatInput';
import { RouteSearchBar } from '@/features/ai-route/components/RouteSearchBar';
import { RouteSuggestions, RouteSuggestion } from '@/features/ai-route/components/RouteSuggestions';
import { aiRouteStyles as styles } from '@/features/ai-route/styles';

type Message = { id: string; text: string; sender: 'ai' | 'user' };

export default function AIRouteScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { fromHistory, origin: paramOrigin, destination: paramDestination } = useLocalSearchParams<{
    fromHistory?: string;
    origin?: string;
    destination?: string;
  }>();
  const isHistoryView = fromHistory === '1';

  const [origin, setOrigin] = useState(paramOrigin || '');
  const [destination, setDestination] = useState(paramDestination || '');
  const [showSuggestions, setShowSuggestions] = useState(!!paramOrigin);
  const [showChat, setShowChat] = useState(false);

  const keyboardOffset = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      RNAnimated.timing(keyboardOffset, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? 250 : 100,
        useNativeDriver: false,
      }).start();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      RNAnimated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? 250 : 100,
        useNativeDriver: false,
      }).start();
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '¡Hola! Soy tu asistente de movilidad inteligente. ¿Hacia dónde te diriges hoy?', sender: 'ai' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSearch = () => {
    if (!origin.trim() || !destination.trim()) return;
    setShowSuggestions(true);
    setShowChat(false);
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSelectRoute = (route: RouteSuggestion) => {
    setShowChat(true);
    setShowSuggestions(false);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `He seleccionado ${route.routes.join(' → ')}. Duración estimada: ${route.duration}, costo: ${route.cost}. ${route.transfers === 0 ? 'Es un viaje directo.' : `Incluye ${route.transfers} transbordo${route.transfers > 1 ? 's' : ''}.`} ¿Necesitas más información sobre esta ruta?`,
        sender: 'ai' as const,
      },
    ]);
  };

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

  if (isHistoryView) {
    return (
      <View style={styles.container}>
        <RouteMap fullScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RouteMap fullScreen hideOverlays />

      {/* Search bar floating at the top */}
      <View style={[localStyles.searchOverlay, { top: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={localStyles.backBtn} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <RouteSearchBar
            origin={origin}
            destination={destination}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onSearch={handleSearch}
            onSwap={handleSwap}
          />
        </View>
      </View>

      {/* Bottom panel: moves up with keyboard */}
      <RNAnimated.View style={[localStyles.bottomPanel, { bottom: keyboardOffset }]}>
        <LinearGradient
          colors={[Gradients.dark[0], Gradients.dark[1]] as [string, string]}
          style={localStyles.bottomGradient}
        >
          {showSuggestions && !showChat ? (
            <RouteSuggestions visible={true} onSelectRoute={handleSelectRoute} />
          ) : (
            <>
              <ChatMessages messages={messages} />
              <ChatInput value={inputText} onChangeText={setInputText} onSend={handleSend} />
            </>
          )}
        </LinearGradient>
      </RNAnimated.View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  searchOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 6,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 18, 30, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    marginLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '55%',
  },
  bottomGradient: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingTop: 8,
  },
});
