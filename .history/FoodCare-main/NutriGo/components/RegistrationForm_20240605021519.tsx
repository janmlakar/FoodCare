import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Text, Modal, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase/firebase';
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/User';

const { width } = Dimensions.get('window');

const RegistrationForm: React.FC<{ onSubmit: (user: User) => void }> = ({ onSubmit }) => {
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    password: '',
    age: 0,
    height: 0,
    weight: 0,
    activityLevel: undefined,
    goal: undefined,
    name: '',
    gender: 'male',
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleInputChange = useCallback((field: keyof User, value: string | number | undefined) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  }, []);

  const handleRegister = useCallback(async () => {
    if (user.password.length < 6) {
      setAlertMessage('Password must be at least 6 characters long.');
      setAlertVisible(true);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const firebaseUser = userCredential.user;
      if (firebaseUser) {
        console.log("User added with ID: ", firebaseUser.uid);
        setUser((prevUser) => ({ ...prevUser, id: firebaseUser.uid }));
        await addDoc(collection(firestore, "users"), { ...user, id: firebaseUser.uid });
        onSubmit(user);
        setAlertMessage('Registration Successful!');
        setAlertVisible(true);
      }
    } catch (error: any) {
      console.error("Error adding user: ", error);
      if (error.code === 'auth/email-already-in-use') {
        setAlertMessage('Email already in use.');
      } else {
        setAlertMessage('Registration Failed. Please try again.');
      }
      setAlertVisible(true);
    }
  }, [user, onSubmit]);

  const closeAlert = useCallback(() => {
    setAlertVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7d1b3b80e8d2d53ca65549228903a3261984aa03d64dd5545bca2690cd08a72d?' }}
        style={styles.headerImage}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Registration</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Name"
                value={user.name}
                onChangeText={(value) => handleInputChange('name', value)}
                style={styles.input}
                placeholderTextColor="#aaa"
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Email"
                value={user.email}
                onChangeText={(value) => handleInputChange('email', value)}
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Password"
                value={user.password}
                onChangeText={(value) => handleInputChange('password', value)}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#aaa"
              />
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.smallInputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Age"
                  value={user.age ? user.age.toString() : ''}
                  onChangeText={(value) => handleInputChange('age', parseInt(value) || 0)}
                  style={styles.smallInput}
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
            <View style={styles.smallInputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Height (cm)"
                  value={user.height ? user.height.toString() : ''}
                  onChangeText={(value) => handleInputChange('height', parseInt(value) || 0)}
                  style={styles.smallInput}
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={user.activityLevel}
                onValueChange={(itemValue) => handleInputChange('activityLevel', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Activity Level" value={undefined} />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={user.goal}
                onValueChange={(itemValue) => handleInputChange('goal', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Goal" value={undefined} />
                <Picker.Item label="Lose Weight" value="weight_loss" />
                <Picker.Item label="Gain Muscle" value="muscle_gain" />
                <Picker.Item label="Maintenance" value="maintenance" />
              </Picker>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Register</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={alertVisible}
        animationType="slide"
        onRequestClose={closeAlert}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity onPress={closeAlert} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    aspectRatio: 1.33,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  innerContainer: {
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: '#000',
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8f8',
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 2,
    borderColor: '#f7f8f8',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#000',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Poppins_400Regular',
  },
  smallInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#000',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Poppins_400Regular',
  },
  smallInputContainer: {
    width: '48%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: '#92a3fd',
    shadowColor: '#95adfe',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    maxWidth: 315,
    padding: 18,
    paddingHorizontal: 60,
    marginVertical: 16,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  picker: {
    height: 30,
    color: '#000',
    flex: 1,
  },
  pickerWrapper: {
    height: 30,
    justifyContent: 'center',
    backgroundColor: '#f7f8f8',
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 2,
    borderColor: '#f7f8f8',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  closeButton: {
    backgroundColor: '#92a3fd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 99,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins_700Bold',
  },
});

export default RegistrationForm;
