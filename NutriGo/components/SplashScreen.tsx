import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/plan');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        NutriGo
        <Text style={styles.highlight}>X</Text>
      </Text>
      <Text style={styles.subtitle}>Be bold, be FIT</Text>
      <TouchableOpacity onPress={handleGetStarted}>
        <LinearGradient
          colors={['#92a3fd', '#9dceff']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    fontFamily: 'Poppins-regular',
    color: 'black',
    textAlign: 'center',
  },
  highlight: {
    fontSize: 70,
    color: '#d296d9',
  },
  subtitle: {
    fontSize: 16,
    color: '#ADA4A5',
    marginTop: 10,
    marginBottom: 50,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    width: 300,
    height: 60,
    shadowColor: 'rgba(149, 173, 254, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 22,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-regular',
  },
});

export default SplashScreen;
