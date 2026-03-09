import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function QRScannerScreen() {
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera" size={64} color="#8892B0" />
                <Text style={styles.permissionText}>Necesitamos tu permiso para abrir la cámara y escanear el código QR.</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Otorgar Permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing="back">

                {/* Top Overlay */}
                <BlurView intensity={40} tint="dark" style={[styles.topOverlay, { paddingTop: insets.top + 20 }]}>
                    <Text style={styles.headerTitle}>Pagar Pasaje</Text>
                    <Text style={styles.headerSubtitle}>Apunta al código QR del autobús</Text>
                </BlurView>

                {/* Center Scanner Frame */}
                <View style={styles.centerContainer}>
                    <View style={styles.scannerFrame}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </View>

                {/* Bottom Bar Options */}
                <View style={styles.bottomOverlay}>
                    <View style={styles.controlsRow}>
                        <TouchableOpacity style={styles.iconButton}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="images" size={24} color="#fff" />
                            </View>
                            <Text style={styles.iconLabel}>Galería</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.flashButton}>
                            <Ionicons name="flash" size={32} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="help-circle" size={24} color="#fff" />
                            </View>
                            <Text style={styles.iconLabel}>Ayuda</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#1A1A24',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    permissionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        lineHeight: 24,
    },
    permissionButton: {
        backgroundColor: '#4776E6',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 24,
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    camera: {
        flex: 1,
    },
    topOverlay: {
        width: '100%',
        paddingBottom: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        color: '#E0E6ED',
        fontSize: 14,
        marginTop: 6,
        fontWeight: '500',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerFrame: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#00E676',
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderTopLeftRadius: 20,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderTopRightRadius: 20,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomLeftRadius: 20,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomRightRadius: 20,
    },
    bottomOverlay: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 30,
        paddingBottom: 50,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    flashButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    }
});
