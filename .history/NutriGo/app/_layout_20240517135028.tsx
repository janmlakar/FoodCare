import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import HomeScreen from '../components/HomeScreen';
import RegisterScreen from '../components/RegisterScreen';
import LoginForm from '../components/LoginForm';
import CalorieTracker from '../components/CalorieTracker';
import Statistics from '../components/Statistics';
import Profile from '../components/Profile';

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'Home' }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="register"
          options={{ title: 'Register' }}
          component={RegisterScreen}
        />
        <Stack.Screen
          name="login"
          options={{ title: 'Login' }}
          component={LoginForm}
        />
        <Stack.Screen
          name="calorieTracker"
          options={{ title: 'Calorie Tracker' }}
          component={CalorieTracker}
        />
        <Stack.Screen
          name="statistics"
          options={{ title: 'Statistics' }}
          component={Statistics}
        />
        <Stack.Screen
          name="profile"
          options={{ title: 'Profile' }}
          component={Profile}
        />
      </Stack>
    </UserProvider>
  );
}
