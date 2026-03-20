import { Tabs } from 'expo-router';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { TabBarVisibilityProvider, useTabBarVisibility } from '@/hooks/useTabBarVisibility';

function TabsContent() {
    const { translateY } = useTabBarVisibility();

    const defaultTabStyle = {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLightGray,
        elevation: 8,
        backgroundColor: '#FFFFFF',
        paddingBottom: 16,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        transform: [{ translateY }],
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.salmon,
                tabBarInactiveTintColor: Colors.grayNeutral,
                tabBarStyle: defaultTabStyle,
                tabBarShowLabel: true,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const },
                tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
                headerShown: false,
                sceneStyle: { backgroundColor: Colors.bgWhite },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="payment"
                options={{
                    title: 'Pagos',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'wallet' : 'wallet-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="qr-scanner"
                options={{
                    title: 'IA',
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ color }) => (
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: Colors.salmon,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 24,
                            shadowColor: Colors.salmon,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                        }}>
                            <Ionicons name="qr-code" size={26} color="#fff" />
                        </View>
                    ),
                    tabBarLabel: () => null,
                }}
            />
            <Tabs.Screen
                name="ai-route"
                options={{
                    title: 'IA',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'robot' : 'robot'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="recompensas"
                options={{
                    title: 'Recompensas',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'chart-line' : 'chart-line'} size={24} color={color} />
                    ),
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

