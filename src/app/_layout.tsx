import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

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
      <Stack
        screenOptions={{
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          contentStyle: { backgroundColor: '#0F2027' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ 
          presentation: 'modal', 
          title: 'Perfil de Usuario',
          gestureEnabled: true,
        }} />
        <Stack.Screen name="trip-history" options={{ 
          headerShown: false,
          gestureEnabled: true,
        }} />
      </Stack>
    </ThemeProvider>
  );
}
