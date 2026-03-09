import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function AIRouteScreen() {
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState([
        { id: '1', text: '¡Hola! Soy tu asistente de movilidad inteligente. ¿Hacia dónde te diriges hoy?', sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        setMessages(prev => [...prev, { id: Date.now().toString(), text: inputText, sender: 'user' }]);
        setInputText('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: 'Calculando la mejor ruta... He encontrado 2 opciones disponibles usando transporte público.', sender: 'ai' }]);
        }, 1500);
    };

    return (
        <View style={styles.container}>
            {/* Map Segment */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 19.4326,
                        longitude: -99.1332,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    userInterfaceStyle="dark"
                >
                    <Marker coordinate={{ latitude: 19.4326, longitude: -99.1332 }} title="Origen" />
                    <Marker coordinate={{ latitude: 19.4500, longitude: -99.1500 }} title="Destino" pinColor="blue" />
                    <Polyline
                        coordinates={[
                            { latitude: 19.4326, longitude: -99.1332 },
                            { latitude: 19.4400, longitude: -99.1400 },
                            { latitude: 19.4500, longitude: -99.1500 }
                        ]}
                        strokeColor="#4776E6"
                        strokeWidth={4}
                    />
                </MapView>

                {/* Top Floating Badge */}
                <BlurView intensity={80} tint="dark" style={[styles.floatingBadge, { top: insets.top + 10 }]}>
                    <FontAwesome5 name="route" size={16} color="#fff" />
                    <Text style={styles.badgeText}>Rutas Activas: 2</Text>
                </BlurView>
            </View>

            {/* AI Chat Segment */}
            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <LinearGradient
                    colors={['#101522', '#1A1A24']}
                    style={styles.chatBackground}
                >
                    <ScrollView
                        contentContainerStyle={styles.messagesScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageBubble,
                                    msg.sender === 'user' ? styles.messageUser : styles.messageAI
                                ]}
                            >
                                <Text style={[
                                    styles.messageText,
                                    msg.sender === 'user' ? styles.textUser : styles.textAI
                                ]}>
                                    {msg.text}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.inputOuterContainer}>
                        <View style={styles.inputInnerContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="E.g. Quiero ir al centro..."
                                placeholderTextColor="#667"
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={handleSend}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                <LinearGradient
                                    colors={['#4776E6', '#8E54E9']}
                                    style={styles.sendButtonGradient}
                                >
                                    <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A24',
    },
    mapContainer: {
        flex: 0.45,
        width: '100%',
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    floatingBadge: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    badgeText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 14,
    },
    chatContainer: {
        flex: 0.55,
    },
    chatBackground: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    messagesScroll: {
        padding: 24,
        paddingTop: 30,
    },
    messageBubble: {
        maxWidth: '85%',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    messageAI: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    messageUser: {
        alignSelf: 'flex-end',
        backgroundColor: '#4776E6',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    textAI: {
        color: '#E0E6ED',
    },
    textUser: {
        color: '#fff',
    },
    inputOuterContainer: {
        padding: 20,
        paddingBottom: 30,
        backgroundColor: '#101522',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    inputInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 30,
        paddingLeft: 20,
        paddingRight: 6,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        height: 40,
        color: '#fff',
        fontSize: 15,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
    },
    sendButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
