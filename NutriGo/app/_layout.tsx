import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { UserProvider } from '../context/UserContext'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const Layout = () => {
  const router = useRouter();

  return (
    <UserProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Ionicons name="book" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/calorie-tracker')}>
            <Ionicons name="nutrition" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/statistics')}>
            <Ionicons name="stats-chart" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  navbar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Layout;
