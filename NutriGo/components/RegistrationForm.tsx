import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase/firebase';
import { addDoc, collection } from "firebase/firestore";
import { User } from '../models/User';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegistrationForm = ({ onSubmit }: { onSubmit: (user: User) => void }) => {
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    password: '',
    age: 0,
    height: 0,
    weight: 0,
    activityLevel: 'low',
    goal: 'weight_loss',
    name: '' // Dodajanje polja za ime
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
      console.log("User added with ID: ", firebaseUser.uid);
      setUser({ ...user, id: firebaseUser.uid });
      onSubmit(user);
      setMessage('Registration Successful!');
    }
  } catch (error) {
    console.error("Error adding user: ", error);
    setMessage('Registration Failed. Please try again.');
  }
};

  return (
    <View style={styles.container}>
      {message && <Text style={[styles.message, { color: message === 'Registration Successful!' ? 'green' : 'red' }]}>{message}</Text>}
      
      <Text style={styles.label}>Name</Text> {/* Dodano polje za ime */}
      <TextInput style={styles.input} placeholder="Name" value={user.name} onChangeText={value => handleInputChange('name', value)} />
      
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Email" value={user.email} onChangeText={value => handleInputChange('email', value)} />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Password" value={user.password} onChangeText={value => handleInputChange('password', value)} secureTextEntry />

      <Text style={styles.label}>Age</Text>
      <TextInput style={styles.input} placeholder="Age" value={user.age.toString()} onChangeText={value => handleInputChange('age', parseInt(value))} keyboardType="numeric" />

      <Text style={styles.label}>Height (cm)</Text>
      <TextInput style={styles.input} placeholder="Height (cm)" value={user.height.toString()} onChangeText={value => handleInputChange('height', parseInt(value))} keyboardType="numeric" />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput style={styles.input} placeholder="Weight (kg)" value={user.weight.toString()} onChangeText={value => handleInputChange('weight', parseInt(value))} keyboardType="numeric" />

      <Text style={styles.label}>Activity Level</Text>
      <Picker
        selectedValue={user.activityLevel}
        onValueChange={(itemValue, itemIndex) => handleInputChange('activityLevel', itemValue)}
        style={styles.picker}>
        <Picker.Item label="Low" value="low" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="High" value="high" />
      </Picker>

      <Text style={styles.label}>Goal</Text>
      <Picker
        selectedValue={user.goal}
        onValueChange={(itemValue, itemIndex) => handleInputChange('goal', itemValue)}
        style={styles.picker}>
        <Picker.Item label="Lose Weight" value="weight_loss" />
        <Picker.Item label="Gain Muscle" value="muscle_gain" />
        <Picker.Item label="Maintenance" value="maintenance" />
      </Picker>

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  message: {
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  picker: {
    height: 50,
    width: '100%'
  }
});

export default RegistrationForm;
