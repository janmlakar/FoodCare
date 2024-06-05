import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import RegistrationForm from '../components/RegistrationForm';
import { User } from '../models/User';
import StatusBarBackground from '../components/StatusBarBackground';


const { width } = Dimensions.get('window');

const Register = () => {
  const handleUserSubmit = (user: User) => {
    console.log('User registered:', user);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <RegistrationForm onSubmit={handleUserSubmit} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', // Background color to match the gradient
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%', // Make it take full width
  },
});

export default Register;
