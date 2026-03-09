import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentScreen() {
    const insets = useSafeAreaInsets();

    const PaymentOption = ({ icon, label, sublabel, selected = false }: { icon: any, label: string, sublabel: string, selected?: boolean }) => (
        <TouchableOpacity activeOpacity={0.8}>
            <BlurView intensity={20} tint="light" style={[styles.optionCard, selected && styles.optionCardSelected]}>
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

    return (
        <LinearGradient
            colors={['#000000', '#1A1A24']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Métodos de Pago</Text>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recargar Monedero</Text>
                    <Text style={styles.sectionSubtitle}>Selecciona tu fuente de fondos</Text>
                </View>

                <PaymentOption
                    icon={<FontAwesome5 name="apple-pay" size={26} color="#fff" />}
                    label="Apple Pay"
                    sublabel="Recarga instantánea"
                    selected={true}
                />
                <PaymentOption
                    icon={<MaterialCommunityIcons name="credit-card" size={26} color="#fff" />}
                    label="Nueva Tarjeta"
                    sublabel="Débito o Crédito"
                    selected={false}
                />
                <PaymentOption
                    icon={<Ionicons name="cash-outline" size={26} color="#fff" />}
                    label="Efectivo"
                    sublabel="Oxxo, 7-Eleven o ventanilla"
                    selected={false}
                />

                <View style={styles.divider} />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pagos en el Autobús</Text>
                    <Text style={styles.sectionSubtitle}>Tipos de pago admitidos con QR</Text>
                </View>

                <View style={styles.tagsContainer}>
                    <View style={styles.tag}>
                        <MaterialCommunityIcons name="wallet" size={16} color="#00E676" />
                        <Text style={styles.tagText}>Saldo Monedero</Text>
                    </View>
                    <View style={styles.tag}>
                        <FontAwesome5 name="ticket-alt" size={16} color="#40C4FF" />
                        <Text style={styles.tagText}>Pases Mensuales</Text>
                    </View>
                    <View style={styles.tag}>
                        <MaterialCommunityIcons name="tag" size={16} color="#FFD54F" />
                        <Text style={styles.tagText}>Descuento Estudiante</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['#4776E6', '#8E54E9']}
                        style={styles.actionButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.actionButtonText}>Confirmar Recarga</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 30,
        marginTop: 10,
        letterSpacing: -0.5,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#8892B0',
        marginTop: 4,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    optionCardSelected: {
        borderColor: '#4776E6',
        backgroundColor: 'rgba(71, 118, 230, 0.1)',
    },
    optionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    optionSubLabel: {
        fontSize: 13,
        color: '#8892B0',
        fontWeight: '500',
    },
    radioContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4776E6',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 30,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 40,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tagText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    actionButton: {
        shadowColor: '#4776E6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    actionButtonGradient: {
        borderRadius: 24,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});
