import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/main/HomeScreen';
import SongListScreen from '../screens/main/SongListScreen';
import SongDetailScreen from '../screens/main/SongDetailScreen';
import PracticeScreen from '../screens/main/PracticeScreen';
import ProgressScreen from '../screens/main/ProgressScreen';
import LeaderboardScreen from '../screens/main/LeaderboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SongList" component={SongListScreen} />
      <Stack.Screen name="SongDetail" component={SongDetailScreen} />
      <Stack.Screen name="Practice" component={PracticeScreen} />
    </Stack.Navigator>
  );
}

const TAB_ICONS: Record<string, string> = {
  Home: 'musical-notes',
  Progress: 'stats-chart',
  Leaderboard: 'trophy',
  Profile: 'person',
};

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Icon name={TAB_ICONS[route.name] || 'ellipse'} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
