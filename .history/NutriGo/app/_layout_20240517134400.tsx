import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import CalorieTracker from '../components/CalorieTracker';
import RegisterScreen from '../components/RegisterScreen';
import LoginForm from '../components/LoginForm';
import StatisticsScreen from '../components/StatisticsScreen';
import ProfileScreen from '../components/ProfileScreen';

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen 
          name="register" 
          options={{ title: 'Register' }}
          component={RegisterScreen}
        />
        <Stack.Screen 
          name="login" 
          options={{ title: 'Login' }}
          component={LoginScreen}
        />
        <Stack.Screen 
          name="calorieTracker" 
          options={{ title: 'Calorie Tracker' }}
          component={CalorieTracker}
        />
        <Stack.Screen 
          name="statistics" 
          options={{ title: 'Statistics' }}
          component={StatisticsScreen}
        />
        <Stack.Screen 
          name="profile" 
          options={{ title: 'Profile' }}
          component={ProfileScreen}
        />
      </Stack>
    </UserProvider>
  );
}
