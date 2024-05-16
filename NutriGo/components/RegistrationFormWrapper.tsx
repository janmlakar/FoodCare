import React from 'react';
import { View } from 'react-native';
import { User } from '../models/User';
import RegistrationForm from './RegistrationForm';

const RegistrationFormWrapper: React.FC = () => {
  const handleUserSubmit = (user: User) => {
    console.log('User submitted:', user);
    // Handle user submission, navigate if needed
  };

  return (
    <View style={{ flex: 1 }}>
      <RegistrationForm onSubmit={handleUserSubmit} />
    </View>
  );
};

export default RegistrationFormWrapper;