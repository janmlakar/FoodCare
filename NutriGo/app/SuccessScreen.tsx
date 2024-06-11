import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const SuccessScreen: React.FC = () => {
  const { name } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image
source={require('../assets/images/artt2.jpg')}
style={styles.image}
      />
      <Text style={styles.welcomeText}>Welcome, {name}</Text>
      <Text style={styles.descriptionText}>You are all set now, let's reach your goals together</Text>

      <TouchableOpacity onPress={() => router.push('/plan')}>
        <LinearGradient
          colors={['#92a3fd', '#9dceff']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>Discover your plans</Text>
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
  image: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono-Regular',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    width: 315,
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

export default SuccessScreen;
