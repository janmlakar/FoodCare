import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
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
  const pathname = usePathname();
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
                <Ionicons name="home" size={24} color="purple" />
                {pathname === '/' && <PinkDot />}
              </NavButton>
              <NavButton onPress={() => router.push('/statistics')}>
                <Ionicons name="stats-chart" size={24} color="grey" />
                {pathname === '/statistics' && <PinkDot />}
              </NavButton>
              <FloatingButton onPress={() => router.push('/')}>
                <Ionicons name="search" size={24} color="#4F6EF6" />
              </FloatingButton>
              <NavButton onPress={() => router.push('/calorie-tracker')}>
                <Ionicons name="camera" size={24} color="grey" />
                {pathname === '/calorie-tracker' && <PinkDot />}
              </NavButton>
              <NavButton onPress={() => router.push('/profile')}>
                <Ionicons name="person" size={24} color="grey" />
                {pathname === '/profile' && <PinkDot />}
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

interface NavbarProps {
  paddingBottom: number;
}

const Navbar = styled.View<NavbarProps>`
  height: 60px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  padding-bottom: ${(props) => props.paddingBottom}px;
  position: relative;
`;

const NavButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative; /* Added to position the dot absolutely within this component */
`;

const FloatingButton = styled(TouchableOpacity)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: white;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -30px;
  z-index: 1;
`;

const PinkDot = styled.View`
  width: 8px; /* Adjust size as needed */
  height: 8px; /* Adjust size as needed */
  border-radius: 4px; /* Half of width and height to make it a circle */
  background-color: pink;
  position: absolute;
  bottom: -4px; /* Adjust as needed to position the dot correctly */
`;

export default Layout;
