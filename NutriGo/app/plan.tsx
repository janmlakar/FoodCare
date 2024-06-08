import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useFonts from '../hooks/useFonts'; // Adjust the path according to your project structure
import { useUser } from '../context/UserContext'; // Adjust the path according to your project structure
import { Link } from 'expo-router'; // Import Link from expo-router

const Plan: React.FC = () => {
  const { user } = useUser();
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={['#92A3FD', '#9DCEFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.greetingContainer}
        >
          {user ? (
            <Text style={styles.greeting}>Hey, {user.name}!</Text>
          ) : (
            <Text style={styles.greeting}>Hey, User</Text>
          )}
        </LinearGradient>
        <View style={styles.planContainer}>
          <Text style={styles.planTitle}>Your current plan:</Text>
          <Text style={styles.plan}>Activity Level: {user?.activityLevel || 'Not set'}</Text>
          <Text style={styles.plan}>Goal: {user?.goal || 'Not set'}</Text>
          <Link href="/profile" style={styles.link}>
            <Text>Change plan here</Text> {/* Wrap string in Text component */}
          </Link>
        </View>
        {/* Other scrollable content goes here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  greetingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 50,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'SpaceMono-Regular',
  },
  planContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
  },
  plan: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginTop: 5,
  },
  link: {
    fontSize: 14,
    color: '#0000FF', // Change link color to blue
    fontFamily: 'SpaceMono-Regular',
    marginTop: 5,
  },
});

export default Plan;
