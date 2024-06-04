import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC = () => {
  return (
    <View >
      <Image source={require('../assets/images/girl.gif')}  />
    </View>
  );
};

export default LoadingScreen;
