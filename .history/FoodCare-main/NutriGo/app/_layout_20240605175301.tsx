import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import styled from 'styled-components/native';

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
    NavigationBar.setBackgroundColorAsync('#1a001a');
  }, []);

  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <SafeAreaProvider>
          <Container>
            <Content>
              <Slot />
            </Content>
            <Navbar paddingBottom={insets.bottom}>
              <NavButton onPress={() => router.push('/')}>
                <Ionicons name="book" size={24} color="white" />
              </NavButton>
              <NavButton onPress={() => router.push('/calorie-tracker')}>
                <Ionicons name="nutrition" size={24} color="white" />
              </NavButton>
              <NavButton onPress={() => router.push('/statistics')}>
                <Ionicons name="stats-chart" size={24} color="white" />
              </NavButton>
              <NavButton onPress={() => router.push('/profile')}>
                <Ionicons name="person" size={24} color="white" />
              </NavButton>
            </Navbar>
          </Container>
        </SafeAreaProvider>
      </UserProvider>
    </ApolloProvider>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  background-color: rgba(30, 5, 50, 1);
`;

const Content = styled.View`
  flex: 1;
`;

const Navbar = styled.View`
  height: 60px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(30, 5, 50, 1);
  padding-bottom: ${(props: { paddingBottom: any; }) => props.paddingBottom}px;
`;

const NavButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
`;

export default Layout;
