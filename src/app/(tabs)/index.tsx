import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hola, Juan 👋</Text>
                    <Text style={styles.subtitle}>¿A dónde viajamos hoy?</Text>
                </View>

                {/* Balance Card */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.balanceCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View>
                        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
                        <Text style={styles.balanceValue}>$450.00 MXN</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.topUpButton}
                        onPress={() => router.push('/payment')}
                    >
                        <Ionicons name="add" size={20} color="#fff" />
                        <Text style={styles.topUpText}>Recarga</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

                {/* Main Action Grid */}
                <View style={styles.grid}>
                    <Animated.View style={[styles.gridItemAnimated, { transform: [{ scale: scaleAnim }] }]}>
                        <TouchableOpacity
                            style={styles.gridItemInner}
                            activeOpacity={0.8}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={() => router.push('/ai-route')}
                        >
                            <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.iconContainer}>
                                <MaterialCommunityIcons name="map-search" size={32} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.gridLabel}>Análisis de Ruta</Text>
                            <Text style={styles.gridSubLabel}>Planifica con IA</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity
                        style={styles.gridItem}
                        activeOpacity={0.8}
                        onPress={() => router.push('/payment')}
                    >
                        <LinearGradient colors={['#4776E6', '#8E54E9']} style={styles.iconContainer}>
                            <MaterialCommunityIcons name="history" size={32} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.gridLabel}>Historial</Text>
                        <Text style={styles.gridSubLabel}>Viajes y Cobros</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.gridItemSecondary}
                        activeOpacity={0.8}
                        onPress={() => router.push('/payment')}
                    >
                        <LinearGradient colors={['#00B4DB', '#0083B0']} style={styles.iconContainerSm}>
                            <FontAwesome5 name="wallet" size={24} color="#fff" />
                        </LinearGradient>
                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.gridLabelSecondary}>Monedero Virtual</Text>
                            <Text style={styles.gridSubLabelSecondary}>Gestiona tus tarjetas</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
        marginTop: 10,
    },
    greeting: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#B0BEC5',
        marginTop: 5,
        fontWeight: '500',
    },
    balanceCard: {
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
    },
    balanceValue: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
    },
    topUpButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    topUpText: {
        color: '#fff',
        fontWeight: '700',
        marginLeft: 4,
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        letterSpacing: -0.5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItemAnimated: {
        width: '48%',
        marginBottom: 15,
    },
    gridItemInner: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        height: 160,
        justifyContent: 'center',
    },
    gridItem: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        height: 160,
        marginBottom: 15,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    gridLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    gridSubLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
    gridItemSecondary: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    iconContainerSm: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridLabelSecondary: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    gridSubLabelSecondary: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '500',
    },
});
