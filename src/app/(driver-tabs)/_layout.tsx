import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/theme';
import { TabBarVisibilityProvider, useTabBarVisibility } from '@/hooks/useTabBarVisibility';

function DriverTabsContent() {
    const { translateY } = useTabBarVisibility();

    const tabStyle = {
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
                tabBarActiveTintColor: Colors.teal,
                tabBarInactiveTintColor: Colors.grayNeutral,
                tabBarStyle: tabStyle,
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
                name="trips"
                options={{
                    title: 'Viajes',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'road-variant' : 'road-variant'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="qr-generate"
                options={{
                    title: 'QR',
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ color }) => (
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: Colors.teal,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 24,
                            shadowColor: Colors.teal,
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
                name="earnings"
                options={{
                    title: 'Ganancias',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'cash-multiple' : 'cash-multiple'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

export default function DriverTabLayout() {
    return (
        <TabBarVisibilityProvider>
            <DriverTabsContent />
        </TabBarVisibilityProvider>
    );
}
