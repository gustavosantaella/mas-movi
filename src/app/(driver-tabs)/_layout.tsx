import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/theme';
import { TabBarVisibilityProvider, useTabBarVisibility } from '@/hooks/useTabBarVisibility';

function DriverTabsContent() {
    const { translateY } = useTabBarVisibility();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const bottomPadding = Math.max(insets.bottom, 16);

    const defaultTabStyle = {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        height: 60 + bottomPadding,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLightGray,
        elevation: 8,
        backgroundColor: '#FFFFFF',
        paddingBottom: bottomPadding,
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
                name="activity"
                options={{
                    title: 'Actividad',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="qr-placeholder"
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push('/(driver)/generate-qr' as any);
                    },
                }}
                options={{
                    title: '',
                    tabBarIcon: () => (
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
                name="payments"
                options={{
                    title: 'Pagos',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'wallet' : 'wallet-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Más',
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
