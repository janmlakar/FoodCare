import React, { useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { UserProvider, useUser } from '../context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FoodProvider } from '@/components/FoodList';

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
      <FoodProvider>
        <SafeAreaProvider>
          <Container>
            <Content>
              <Slot />
            </Content>
            <Navbar paddingBottom={insets.bottom}>
              <NavButton onPress={() => router.push('/plan')}>
                <Ionicons name="checkbox-sharp" size={24} color={pathname === '/plan' ? "pink" : "grey"} />
                {pathname === '/plan' && <PinkDot />}
              </NavButton>
              <NavButton onPress={() => router.push('/statistics')}>
                <Ionicons name="stats-chart" size={24} color={pathname === '/statistics' ? "pink" : "grey"} />
                {pathname === '/statistics' && <PinkDot />}
              </NavButton>
              <NavButton onPress={() => router.push('/')}>
                <Ionicons name="search-sharp" size={24} color={pathname === '/' ? "pink" : "grey"} />
                {pathname === '/' && <PinkDot />}
              </NavButton>
              <NavButton onPress={() => router.push('/tracker')}>
                <Ionicons name="nutrition" size={24} color={pathname === '/tracker' ? "pink" : "grey"} />
                {pathname === '/tracker' && <PinkDot />}
              </NavButton>
              <NavButton onPress={() => router.push('/login')}>
                <Ionicons name="person" size={24} color={pathname === '/profile'||pathname === '/login' ? "pink" : "grey"} />
                {pathname === '/profile'&& <PinkDot />||pathname === '/login' && <PinkDot />}
              </NavButton>
            </Navbar>
          </Container>
        </SafeAreaProvider>
        </FoodProvider>
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
  justify-content: space-around; /* Use space-around for equal spacing */
  align-items: center;
  background-color: white;
  padding-bottom: ${(props) => props.paddingBottom}px;
  padding-horizontal: 10px;
`;

const NavButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 10px;
`;

interface FloatingButtonProps {
  paddingBottom: number;
}

const FloatingButtonContainer = styled.View<FloatingButtonProps>`
  position: absolute;
  bottom: ${(props) => props.paddingBottom + 10}px; /* Adjust as needed to position the button */
  right: 190px; /* Adjust to move the button to the right */
  z-index: 1;
`;

const styles = StyleSheet.create({
  floatingButton: {
    width: 30,
    height:30,
    borderRadius: 24,
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
