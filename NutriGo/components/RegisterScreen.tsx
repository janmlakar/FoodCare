import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegistrationForm from './RegistrationForm';
import { User } from '../models/User';

const RegisterScreen: React.FC = () => {
  const handleRegisterSubmit = (user: User) => {
    console.log('Registered user:', user);
  };

  return (
    <View style={styles.container}>
      <RegistrationForm onSubmit={handleRegisterSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default RegisterScreen;
