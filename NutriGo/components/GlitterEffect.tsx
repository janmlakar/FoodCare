import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

const GlitterEffect: React.FC = () => {
  return (
    <View style={styles.glitterContainer}>
      <ImageBackground
        source={require('../assets/images/stars.png')} // Path to your star image
        style={styles.imageBackground}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  glitterContainer: {
    position: 'absolute',
    width: '100%',
    height: 300, // Adjust height as needed
    top: 0,
    left: 0,
    zIndex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default GlitterEffect;
