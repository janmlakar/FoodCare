import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const SplashScreen = ({ onTimeout }: { onTimeout: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 1200); // Show the splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, [onTimeout]);

  return (
    <View style={styles.container}>
      <Image
         source={require('../assets/images/fruit.gif')} 
        style={styles.gif}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Ensure this matches the background color of the GIF
  },
  gif: {
    width: '96%', // Slightly reduce the width
    height: '99%', // Slightly reduce the height
  },
});

export default SplashScreen;
