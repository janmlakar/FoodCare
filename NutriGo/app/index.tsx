import React from 'react';
import { useFonts } from 'expo-font';

import SplashScreen from '../components/SplashScreen';
import { LogBox } from 'react-native';


// Ignore all log notifications
LogBox.ignoreAllLogs();
// Suppress specific font warnings
LogBox.ignoreLogs([
  'fontFamily "Poppins-regular" is not a system font',
  'fontFamily "SpaceMono-Regular" is not a system font'
]);

const Index = () => {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
 

  return <SplashScreen />;
};

export default Index;
