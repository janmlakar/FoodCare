import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated, ScrollView, Dimensions, Text, ImageBackground, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase/firebase';
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/User';
import ScreenTemplate from '../app/ScreenTemplate';  // Adjust the import path as necessary

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
  const shimmerAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

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
    <ScreenTemplate>
      <ImageBackground
        source={require('../assets/images/giphy.gif')} // Adjust the path to your gif file
        style={styles.imageBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Registration</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#8A2BE2', '#4B0082']}
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
                    placeholderTextColor="#fff"
                  />
                </View>
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#8A2BE2', '#4B0082']}
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
                    placeholderTextColor="#fff"
                  />
                </View>
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#8A2BE2', '#4B0082']}
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
                    placeholderTextColor="#fff"
                  />
                </View>
              </LinearGradient>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.smallInputContainer}>
                <LinearGradient
                  colors={['#8A2BE2', '#4B0082']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBorder}
                >
                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder="Age"
                      value={user.age ? user.age.toString() : ''}
                      onChangeText={(value) => handleInputChange('age', parseInt(value) || 0)}
                      style={styles.smallInput}
                      keyboardType="numeric"
                      placeholderTextColor="#fff"
                    />
                  </View>
                </LinearGradient>
              </View>
              <View style={styles.smallInputContainer}>
                <LinearGradient
                  colors={['#8A2BE2', '#4B0082']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBorder}
                >
                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder="Height (cm)"
                      value={user.height ? user.height.toString() : ''}
                      onChangeText={(value) => handleInputChange('height', parseInt(value) || 0)}
                      style={styles.smallInput}
                      keyboardType="numeric"
                      placeholderTextColor="#fff"
                    />
                  </View>
                </LinearGradient>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#8A2BE2', '#4B0082']}
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
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#8A2BE2', '#4B0082']}
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
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <View style={styles.buttonContent}>
                <LinearGradient
                  colors={['#ff007f', '#ff80bf', '#ff007f']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Animated.View
                  style={[
                    styles.shimmerOverlay,
                    { transform: [{ translateX: shimmerTranslate }] },
                  ]}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
                <Text style={styles.buttonText}>Register</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>

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
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50, // Add some padding to ensure elements are not cut off
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24, // Title font size
    color: '#fff', // Title color
    marginBottom: 20, // Space below the title
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 25,
    marginVertical: 8, // Add vertical margin to space out fields
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 25,
    overflow: 'hidden',
    width: '100%', // Ensure the input takes full width
  },
  input: {
    paddingVertical: 8, // Reduce padding for input
    paddingHorizontal: 12, // Reduce padding for input
    color: '#fff',
    fontSize: 14, // Reduce font size
    flex: 1,
  },
  smallInput: {
    paddingVertical: 8, // Reduce padding for small input
    paddingHorizontal: 12, // Reduce padding for small input
    color: '#fff',
    fontSize: 14, // Reduce font size
    flex: 1,
  },
  smallInputContainer: {
    width: '48%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure rowContainer takes full width
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  button: {
    width: '60%', // Adjust button width to make it less wide
    height: 50, // Increase the height to make the button larger
    marginVertical: 16, // Add margin to space out buttons
    borderRadius: 25, // Adjust border radius for buttons
    overflow: 'hidden',
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18, // Increase font size
  },
  picker: {
    height: 30, // Further reduce picker height
    color: '#fff', // Picker text color
    flex: 1,
  },
  pickerWrapper: {
    height: 30, // Further reduce wrapper height
    justifyContent: 'center',
    backgroundColor: '#000', // Ensure the background matches other inputs
    borderRadius: 25, // Keep consistent border radius
    overflow: 'hidden',
    width: '100%', // Ensure the picker takes full width
  },
  inputContainer: {
    width: '100%', // Make it take full width
    marginVertical: 8, // Add vertical margin
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
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
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
