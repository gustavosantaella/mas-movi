import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { Colors } from '@/theme';

export default function TabLayout() {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textSecondary,
                tabBarStyle: styles.tabBar,
                animation: 'shift',
                tabBarBackground: () => (
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                ),
                headerStyle: {
                    backgroundColor: Colors.bgDark,
                },
                headerShadowVisible: false,
                headerTintColor: Colors.textPrimary,
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => router.push('/profile')}
                        style={styles.headerLeft}
                        activeOpacity={0.8}
                    >
                        <View style={styles.profileIconContainer}>
                            <FontAwesome name="user" size={18} color="#fff" />
                        </View>
                    </TouchableOpacity>
                ),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="payment"
                options={{
                    headerShown: false,
                    title: 'Pago',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="wallet" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="ai-route"
                options={{
                    headerShown: false,
                    title: 'IA',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="robot" size={26} color={color} />,
                    tabBarStyle: { display: 'none' },
                }}
            />
            <Tabs.Screen
                name="qr-scanner"
                options={{
                    headerShown: false,
                    title: 'Pasaje',
                    tabBarIcon: ({ color }) => <Ionicons name="qr-code-outline" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        borderTopWidth: 0,
        elevation: 0,
        height: 65,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    headerLeft: {
        marginLeft: 20,
        marginBottom: 5,
    },
    profileIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
