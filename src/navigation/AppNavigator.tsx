import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../utils/theme';
import { useStore } from '../store';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SongListScreen from '../screens/SongListScreen';
import SongDetailScreen from '../screens/SongDetailScreen';
import PracticeScreen from '../screens/PracticeScreen';
import SessionCompleteScreen from '../screens/SessionCompleteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VocabularyScreen from '../screens/VocabularyScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const icons: Record<string, [string, string]> = { HomeTab: ['\ud83c\udfe0','\ud83c\udfe0'], VocabularyTab: ['\ud83d\udcda','\ud83d\udcd6'], LeaderboardTab: ['\ud83c\udfc6','\ud83c\udfc5'], ProfileTab: ['\ud83d\udc64','\ud83d\udc64'] };

const MainTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, borderTopWidth: 1, height: 60, paddingBottom: 8 },
    tabBarActiveTintColor: COLORS.primary, tabBarInactiveTintColor: COLORS.textMuted,
    tabBarIcon: ({ focused }) => <Text style={{ fontSize: 22 }}>{focused ? icons[route.name]?.[0] : icons[route.name]?.[1]}</Text>,
  })}>
    <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="VocabularyTab" component={VocabularyScreen} options={{ title: 'Vocab' }} />
    <Tab.Screen name="LeaderboardTab" component={LeaderboardScreen} options={{ title: 'Ranks' }} />
    <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useStore();
  if (isLoading) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background }, animation: 'slide_from_right' }}>
        {!isAuthenticated ? <Stack.Screen name="Login" component={LoginScreen} /> : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="SongList" component={SongListScreen} />
            <Stack.Screen name="SongDetail" component={SongDetailScreen} />
            <Stack.Screen name="Practice" component={PracticeScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="SessionComplete" component={SessionCompleteScreen} options={{ gestureEnabled: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
