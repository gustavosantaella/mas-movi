import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function RootNavigator() {
  const { isAuthenticated, isLoading, isDriver } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inDriverTabs = segments[0] === '(driver-tabs)';
    const inPassengerTabs = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      if (isDriver) {
        router.replace('/(driver-tabs)' as any);
      } else {
        router.replace('/(tabs)');
      }
    } else if (isAuthenticated && isDriver && inPassengerTabs) {
      router.replace('/(driver-tabs)' as any);
    } else if (isAuthenticated && !isDriver && inDriverTabs) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, isDriver, segments]);

  if (isLoading) return null;

  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {/* ─── Auth ─────────────────── */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      {/* ─── Tab navigators ────────── */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(driver-tabs)" options={{ headerShown: false }} />

      {/* ─── Passenger screens ─────── */}
      <Stack.Screen name="(passenger)/pay-fare" options={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_bottom',
      }} />

      {/* ─── Driver screens ──────── */}
      <Stack.Screen name="(driver)/generate-qr" options={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_bottom',
      }} />

      {/* ─── Shared screens ──────── */}
      <Stack.Screen name="(shared)/profile" options={{
        presentation: 'transparentModal',
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_bottom',
      }} />
      <Stack.Screen name="(shared)/personal-info" options={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_bottom',
      }} />
      <Stack.Screen name="(shared)/security" options={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_bottom',
      }} />
      <Stack.Screen name="(shared)/verify-entity" options={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_bottom',
      }} />
      <Stack.Screen name="(shared)/trip-history" options={{
        headerShown: false,
        gestureEnabled: true,
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
