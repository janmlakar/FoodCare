import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenTemplate from './ScreenTemplate';
import * as NavigationBar from 'expo-navigation-bar';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://melokovka.eu-central-a.ibm.stepzen.net/api/impressive-turkey/__graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "apikey melokovka::local.net+1000::01d832eddc639a2eac959379430577a5d718de95f6d12c95f6b67b0114a815d6"
  }
});

const Layout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#1a001a'); // Match with the navbar background color
  }, []);

  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <SafeAreaProvider>
          <ScreenTemplate>
            <View style={styles.container}>
              <View style={styles.content}>
                <Slot />
              </View>
              <View style={[styles.navbar, { paddingBottom: insets.bottom }]}>
                <TouchableOpacity onPress={() => router.push('/')}>
                  <Ionicons name="book" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/calorie-tracker')}>
                  <Ionicons name="nutrition" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/statistics')}>
                  <Ionicons name="stats-chart" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                  <Ionicons name="person" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ScreenTemplate>
        </SafeAreaProvider>
      </UserProvider>
    </ApolloProvider>
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
  },
  content: {
    flex: 1,
  },
});

export default Layout;
