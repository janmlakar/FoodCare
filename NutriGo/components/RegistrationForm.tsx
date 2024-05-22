import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User } from '../models/User';

const RegistrationForm = ({ onSubmit }: { onSubmit: (user: User) => void }) => {
  const [user, setUser] = useState<Omit<User, 'age' | 'height' | 'weight'> & { age: string; height: string; weight: string }>({
    id: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'low',
    goal: 'weight_loss',
    name: '',
    gender: 'male',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof User, value: string | number) => {
    setUser({ ...user, [field]: value });
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const firebaseUser = userCredential.user;
      if (firebaseUser) {
        const updatedUser = {
          ...user,
          id: firebaseUser.uid,
          age: parseInt(user.age),
          height: parseInt(user.height),
          weight: parseInt(user.weight),
        };

        // Save user data to Firestore
        await setDoc(doc(firestore, 'users', firebaseUser.uid), updatedUser);

        onSubmit(updatedUser);
        setMessage('Registration Successful!');
      }
    } catch (error) {
      let errorMessage = 'Registration Failed. Please try again.';
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/weak-password') {
          errorMessage = 'Password should be at least 6 characters';
        } else if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = 'The email address is already in use';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'The email address is not valid';
        }
      }
      setMessage(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {message && (
        <Text style={[styles.message, { color: message === 'Registration Successful!' ? 'green' : 'red' }]}>
          {message}
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={user.name}
        onChangeText={(value) => handleInputChange('name', value)}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={user.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={user.age}
        onChangeText={(value) => handleInputChange('age', value)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={user.height}
        onChangeText={(value) => handleInputChange('height', value)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={user.weight}
        onChangeText={(value) => handleInputChange('weight', value)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={user.gender}
        onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <Text style={styles.label}>Activity Level</Text>
      <Picker
        selectedValue={user.activityLevel}
        onValueChange={(itemValue) => handleInputChange('activityLevel', itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Low" value="low" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="High" value="high" />
      </Picker>
      <Text style={styles.label}>Goal</Text>
      <Picker
        selectedValue={user.goal}
        onValueChange={(itemValue) => handleInputChange('goal', itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Lose Weight" value="weight_loss" />
        <Picker.Item label="Gain Muscle" value="muscle_gain" />
        <Picker.Item label="Maintenance" value="maintenance" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
  label: {
    width: '100%',
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  message: {
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RegistrationForm;
