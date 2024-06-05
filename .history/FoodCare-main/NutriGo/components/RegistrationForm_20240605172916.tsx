import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Text, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase/firebase';
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/User';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '../css/commonStyles';

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
    gender: undefined,
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleInputChange = (field: keyof User, value: string | number | undefined) => {
    setUser({ ...user, [field]: value });
  };

  const handleRegister = async () => {
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
        setUser({ ...user, id: firebaseUser.uid });
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
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Registration</Text>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Name"
                value={user.name}
                onChangeText={(value) => handleInputChange('name', value)}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Email"
                value={user.email}
                onChangeText={(value) => handleInputChange('email', value)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Password"
                value={user.password}
                onChangeText={(value) => handleInputChange('password', value)}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>
          </LinearGradient>
          <View style={styles.rowContainer}>
            <LinearGradient
              colors={['#92a3fd', '#9dceff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gradientBorder, styles.smallInputContainer]}
            >
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Age"
                  value={user.age ? user.age.toString() : ''}
                  onChangeText={(value) => handleInputChange('age', parseInt(value) || 0)}
                  style={styles.smallInput}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </LinearGradient>
            <LinearGradient
              colors={['#92a3fd', '#9dceff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gradientBorder, styles.smallInputContainer]}
            >
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Height (cm)"
                  value={user.height ? user.height.toString() : ''}
                  onChangeText={(value) => handleInputChange('height', parseInt(value) || 0)}
                  style={styles.smallInput}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </LinearGradient>
          </View>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
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
          </LinearGradient>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
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
          </LinearGradient>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={user.gender}
                onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Gender" value={undefined} />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Female" value="other" />
              </Picker>
            </View>
          </LinearGradient>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <LinearGradient
              colors={['#92a3fd', '#9dceff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.buttonText}>Register</Text>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50, // Add some padding to ensure elements are not cut off
  },
  innerContainer: {
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000', // Changed to black
    fontFamily: 'SpaceMono-Regular', // Add this line to use the custom font
  },
  gradientBorder: {
    width: '100%',
    padding: 2,
    borderRadius: 25,
    marginVertical: 10,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 0,
    borderRadius: 25,
    color: '#000',
  },
  smallInputContainer: {
    width: '48%',
  },
  smallInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 0,
    borderRadius: 25,
    color: '#000',
    fontSize: 14,
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
    width: '100%',
    padding: 8,
  },
  picker: {
    height: 40,
    color: '#000',
    flex: 1,
  },
  button: {
    width: '60%',
    height: 50,
    marginVertical: 16,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
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
  },
  closeButton: {
    backgroundColor: '#ff007f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RegistrationForm;
