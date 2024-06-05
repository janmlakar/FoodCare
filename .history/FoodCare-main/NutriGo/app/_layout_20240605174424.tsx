import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
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
          {/* Your main content goes here */}
        </View>
        <View style={[styles.navbar, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/statistics')}>
            <Ionicons name="stats-chart" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/calorie-tracker')}>
            <Ionicons name="nutrition" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={24} color="white" />
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
    boxShadow: '0px 10px 40px 0px rgba(29, 22, 23, 0.07)',
  },
  content: {
    flex: 1,
  },
});

export default Layout;
