import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#101522', '#1A1A24', '#0F2027']}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>

                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <LinearGradient colors={['#4776E6', '#8E54E9']} style={styles.avatarRing}>
                        <View style={styles.avatarInner}>
                            <FontAwesome5 name="user" size={40} color="#fff" />
                        </View>
                    </LinearGradient>
                    <Text style={styles.userName}>Juan Pérez</Text>
                    <Text style={styles.userPhone}>+52 55 1234 5678</Text>
                </View>

                {/* Info Cards */}
                <BlurView intensity={20} tint="light" style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <MaterialIcons name="fingerprint" size={22} color="#4776E6" />
                        </View>
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>User ID</Text>
                            <Text style={styles.infoValue}>USR-8A7B-49C2</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="copy-outline" size={20} color="#8892B0" />
                        </TouchableOpacity>
                    </View>
                </BlurView>

                <Text style={styles.sectionTitle}>Ajustes de la Cuenta</Text>

                <View style={styles.settingsList}>
                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="person-outline" size={22} color="#fff" />
                        <Text style={styles.settingText}>Información Personal</Text>
                        <Ionicons name="chevron-forward" size={20} color="#8892B0" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
                        <Text style={styles.settingText}>Seguridad</Text>
                        <Ionicons name="chevron-forward" size={20} color="#8892B0" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                        <Ionicons name="help-buoy-outline" size={22} color="#fff" />
                        <Text style={styles.settingText}>Soporte Técnico</Text>
                        <Ionicons name="chevron-forward" size={20} color="#8892B0" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={22} color="#FF416C" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    closeButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    avatarRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarInner: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A1A24',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1A1A24',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
    },
    userPhone: {
        fontSize: 15,
        color: '#8892B0',
        fontWeight: '500',
    },
    infoCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 35,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(71, 118, 230, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoText: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: '#8892B0',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 15,
    },
    settingsList: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    settingText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 65, 108, 0.1)',
        paddingVertical: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 65, 108, 0.3)',
    },
    logoutText: {
        color: '#FF416C',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    }
});
