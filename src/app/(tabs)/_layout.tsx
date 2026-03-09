import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#4776E6',
                tabBarInactiveTintColor: '#8892B0',
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                ),
                headerStyle: {
                    backgroundColor: '#0F2027', // Dark solid header to match gradients
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
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
                    headerShown: false, // The home screen has its own gradient header area
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
        backgroundColor: '#4776E6',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
