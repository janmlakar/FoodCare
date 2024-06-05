import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';

const Layout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#1a001a'); // Match with the navbar background color
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot /> {/* Ensure the Slot component is rendering here */}
        </View>
        <View style={[styles.navbar, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Ionicons name="home" size={24} color="white" />
            <Text style={styles.iconText}>Home</Text> {/* Add Text component if needed */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/statistics')}>
            <Ionicons name="stats-chart" size={24} color="white" />
            <Text style={styles.iconText}>Statistics</Text> {/* Add Text component if needed */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/calorie-tracker')}>
            <Ionicons name="nutrition" size={24} color="white" />
            <Text style={styles.iconText}>Tracker</Text> {/* Add Text component if needed */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={24} color="white" />
            <Text style={styles.iconText}>Profile</Text> {/* Add Text component if needed */}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30,5,50,1)', // Uniform background color
  },
  navbar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(30,5,50,1)', // Match with the background color
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10,
    shadowColor: 'rgba(0, 0, 0, 0.07)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  content: {
    flex: 1,
  },
  iconText: {
    color: 'white',
    fontSize: 12,
  }
});

export default Layout;
