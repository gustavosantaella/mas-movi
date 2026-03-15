import { Tabs } from 'expo-router';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { TabBarVisibilityProvider, useTabBarVisibility } from '@/hooks/useTabBarVisibility';

function TabsContent() {
    const { translateY } = useTabBarVisibility();

    const defaultTabStyle = {
        position: 'absolute' as const,
        bottom: 28,
        left: 50,
        right: 50,
        height: 54,
        borderRadius: 27,
        borderTopWidth: 0,
        elevation: 10,
        backgroundColor: 'rgba(18, 18, 24, 0.92)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        paddingBottom: 0,
        paddingTop: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        transform: [{ translateY }],
    };

    const homeTabStyle = {
        ...defaultTabStyle,
        backgroundColor: 'rgba(32, 58, 67, 0.92)',
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textSecondary,
                tabBarStyle: defaultTabStyle,
                tabBarShowLabel: false,
                tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
                headerShown: false,
                sceneStyle: { backgroundColor: Colors.bgDark },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={30} color={color} />,
                    tabBarStyle: homeTabStyle,
                }}
            />
            <Tabs.Screen
                name="payment"
                options={{
                    title: 'Pago',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="wallet" size={30} color={color} />,
                }}
            />
            <Tabs.Screen
                name="ai-route"
                options={{
                    title: 'IA',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="robot" size={32} color={color} />,
                    tabBarStyle: { display: 'none' },
                }}
            />
            <Tabs.Screen
                name="qr-scanner"
                options={{
                    title: 'Pasaje',
                    tabBarIcon: ({ color }) => <Ionicons name="qr-code-outline" size={30} color={color} />,
                    tabBarStyle: { display: 'none' },
                }}
            />
        </Tabs>
    );
}

export default function TabLayout() {
    return (
        <TabBarVisibilityProvider>
            <TabsContent />
        </TabBarVisibilityProvider>
    );
}
