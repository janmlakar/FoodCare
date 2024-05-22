import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import RegistrationFormWrapper from '@/components/RegistrationFormWrapper';

const Register = () => {
  return (
    <ScrollView 
      contentContainerStyle={styles.scrollViewContent}
      horizontal={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <RegistrationFormWrapper />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    
  },
});

export default Register;
