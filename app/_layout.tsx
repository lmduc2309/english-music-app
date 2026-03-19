import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useStore } from '../src/store';
import { COLORS } from '../src/utils/theme';

export default function RootLayout() {
  const loadUser = useStore((s) => s.loadUser);
  useEffect(() => { loadUser(); }, []);
  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background }, animation: 'slide_from_right' }}>
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="song/[id]" />
        <Stack.Screen name="song/list" />
        <Stack.Screen name="practice/[sessionId]" options={{ gestureEnabled: false }} />
        <Stack.Screen name="practice/complete" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
