import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import HomeScreen from '../components/HomeScreen';
import RegisterScreen from '../components/RegisterScreen';
import LoginForm from '../components/LoginForm';
import CalorieTracker from '../components/CalorieTracker';
import StatisticsScreen from '../components/StatisticsScreen';
import ProfileScreen from '../components/ProfileScreen';

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'Home' }}
          component={HomeScreen as React.ComponentType<any>}
Type '{ name: string; options: { title: string; }; component: ComponentType<any>; }' is not assignable to type 'IntrinsicAttributes & ScreenProps<NativeStackNavigationOptions, StackNavigationState<ParamListBase>, NativeStackNavigationEventMap>'.
        />
        <Stack.Screen
          name="register"
          options={{ title: 'Register' }}
          component={RegisterScreen as React.ComponentType<any>}
        />
        <Stack.Screen
          name="login"
          options={{ title: 'Login' }}
          component={LoginForm as React.ComponentType<any>}
        />
        <Stack.Screen
          name="calorieTracker"
          options={{ title: 'Calorie Tracker' }}
          component={CalorieTracker as React.ComponentType<any>}
        />
        <Stack.Screen
          name="statistics"
          options={{ title: 'Statistics' }}
          component={StatisticsScreen as React.ComponentType<any>}
        />
        <Stack.Screen
          name="profile"
          options={{ title: 'Profile' }}
          component={ProfileScreen as React.ComponentType<any>}
        />
      </Stack>
    </UserProvider>
  );
}
