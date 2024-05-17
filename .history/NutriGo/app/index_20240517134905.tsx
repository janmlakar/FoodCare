import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Homepage!</Text>
      <View style={styles.navbar}>
        <Button title="Home" onPress={() => router.push('/')} />
        <Button title="Register" onPress={() => router.push('/register')} />
        <Button title="Login" onPress={() => router.push('/login')} />
        <Button title="Calorie Tracker" onPress={() => router.push('/calorieTracker')} />
        <Button title="Statistics" onPress={() => router.push('/statistics')} />
        <Button title="Profile" onPress={() => router.push('/profile')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default HomeScreen;
