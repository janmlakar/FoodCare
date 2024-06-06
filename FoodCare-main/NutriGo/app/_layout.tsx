// app/_layout.tsx
import React, { useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { UserProvider, useUser } from '../context/UserContext'; // Ensure correct import
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

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
                <Ionicons name="home" size={24} color={pathname === '/' ? "pink" : "grey"} />
                {pathname === '/' && <PinkDot />}
              </NavButton>
              <NavButton onPress={() => router.push('/statistics')}>
                <Ionicons name="stats-chart" size={24} color={pathname === '/statistics' ? "pink" : "grey"} />
                {pathname === '/statistics' && <PinkDot />}
              </NavButton>
              <FloatingButtonContainer>
                <TouchableOpacity onPress={() => router.push('/')}>
                  <LinearGradient
                    colors={['#92A3FD', '#9DCEFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.floatingButton}
                  >
                    <Ionicons name="search" size={20} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </FloatingButtonContainer>
              <NavButton onPress={() => router.push('/calorie-tracker')}>
                <Ionicons name="camera" size={24} color={pathname === '/calorie-tracker' ? "pink" : "grey"} />
                {pathname === '/calorie-tracker' && <PinkDot />}
              </NavButton>
              <NavButton onPress={() => router.push('/login')}>
                <Ionicons name="person" size={24} color={pathname === '/profile' ? "pink" : "grey"} />
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
  padding-horizontal: 10px;
`;

const NavButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  padding: 10px;
`;

const FloatingButtonContainer = styled.View`
  position: absolute;
  top: -30px; /* Adjust as needed to center the button vertically */
  width: 100%;
  align-items: center;
  justify-content: center; /* Ensures the container is centered */
  padding-left: 20px; /* Adjust to move slightly to the right */
  z-index: 1;
`;

const styles = StyleSheet.create({
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
});

const PinkDot = styled.View`
  width: 8px; /* Adjust size as needed */
  height: 8px; /* Adjust size as needed */
  border-radius: 4px; /* Half of width and height to make it a circle */
  background-color: pink;
  position: absolute;
  bottom: -4px; /* Adjust as needed to position the dot correctly */
`;

export default Layout;
