import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { UserProvider } from '../context/UserContext'; // Preverite pot

  const Layout = () => {
    const router = useRouter();
  
    return (
      <UserProvider>
        <View style={styles.container}>
          <View style={styles.content}>
            <Slot />
          </View>
          <View style={styles.navbar}>
            <Button title="Home" onPress={() => router.push('/')} />
            <Button title="Register" onPress={() => router.push('/register')} />
            <Button title="Login" onPress={() => router.push('/login')} />
            <Button title="CalorieTracker" onPress={() => router.push('/calorieTracker')} />
            <Button title="Hrana" onPress={() => router.push('/')} />
          </View>
        </View>
      </UserProvider>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  navbar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Layout;
