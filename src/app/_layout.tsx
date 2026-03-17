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
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{
          presentation: 'transparentModal',
          headerShown: false,
          gestureEnabled: true,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_bottom',
        }} />
        <Stack.Screen name="trip-history" options={{
          headerShown: false,
          gestureEnabled: true,
        }} />
      </Stack>
    </ThemeProvider>
  );
}
