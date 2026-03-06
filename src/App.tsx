import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAuthStore} from '@/store/authStore';
import {RootStackParamList, MainTabParamList} from '@/types';
import {colors} from '@/theme';

// Screens
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/HomeScreen';
import DiscoverScreen from '@/screens/DiscoverScreen';
import ProgressScreen from '@/screens/ProgressScreen';
import LeaderboardScreen from '@/screens/LeaderboardScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SongDetailScreen from '@/screens/SongDetailScreen';
import LessonScreen from '@/screens/LessonScreen';
import PracticeScreen from '@/screens/PracticeScreen';
import ScoreResultScreen from '@/screens/ScoreResultScreen';
import SplashScreen from '@/screens/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        paddingBottom: 8,
        paddingTop: 8,
        height: 65,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {fontSize: 11, fontWeight: '600'},
    }}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{tabBarLabel: 'Home'}}
    />
    <Tab.Screen
      name="Discover"
      component={DiscoverScreen}
      options={{tabBarLabel: 'Discover'}}
    />
    <Tab.Screen
      name="Progress"
      component={ProgressScreen}
      options={{tabBarLabel: 'Progress'}}
    />
    <Tab.Screen
      name="Leaderboard"
      component={LeaderboardScreen}
      options={{tabBarLabel: 'Ranks'}}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{tabBarLabel: 'Profile'}}
    />
  </Tab.Navigator>
);

const App = () => {
  const {isAuthenticated, isLoading, loadUser} = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: colors.background},
          animation: 'slide_from_right',
        }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="SongDetail" component={SongDetailScreen} />
            <Stack.Screen
              name="Lesson"
              component={LessonScreen}
              options={{animation: 'slide_from_bottom'}}
            />
            <Stack.Screen
              name="Practice"
              component={PracticeScreen}
              options={{animation: 'fade'}}
            />
            <Stack.Screen
              name="ScoreResult"
              component={ScoreResultScreen}
              options={{animation: 'slide_from_bottom'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
