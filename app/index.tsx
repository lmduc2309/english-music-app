import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useStore } from '../src/store';
import { COLORS } from '../src/utils/theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useStore();
  if (isLoading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}
