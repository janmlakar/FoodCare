import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../context/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import { User } from '../models/User';
import LoginForm from '../app/login';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import StatusBarBackground from '../components/StatusBarBackground';

const Profile: React.FC = () => {
  const { user, setUser } = useUser();
  const [localUser, setLocalUser] = useState<User | null>(user);
  const shimmerAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (localUser) {
        const updatedUser = { ...localUser, image: uri };
        setLocalUser(updatedUser);
        if (auth.currentUser) {
          await setDoc(doc(firestore, 'users', auth.currentUser.uid), { image: uri }, { merge: true });
          setUser(updatedUser);
        }
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleInputChange = (field: keyof User, value: string | number) => {
    if (localUser) {
      const updatedUser = { ...localUser, [field]: value };
      setLocalUser(updatedUser);
      if (auth.currentUser) {
        setDoc(doc(firestore, 'users', auth.currentUser.uid), { [field]: value }, { merge: true });
      }
    }
  };

  const handleButtonSelect = async (field: keyof User, value: string) => {
    if (localUser) {
      const updatedUser = { ...localUser, [field]: value };
      setLocalUser(updatedUser);
      if (auth.currentUser) {
        await setDoc(doc(firestore, 'users', auth.currentUser.uid), { [field]: value }, { merge: true });
        setUser(updatedUser);
      }
    }
  };

  if (!user) {
    return <LoginForm />;
  }

  const defaultImage = localUser?.gender === 'female'
    ? require('../assets/images/female-icon.png')
    : require('../assets/images/male-icon.png');

  return (
    <ScreenTemplate>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.imageContainer}>
          <Image source={localUser?.image ? { uri: localUser.image } : defaultImage} style={styles.profileImage} />
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.email}>{localUser?.email}</Text>
        <Text style={styles.label}>Goal</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.selectButton, localUser?.goal === 'weight_loss' && styles.selectedButton]}
            onPress={() => handleButtonSelect('goal', 'weight_loss')}
          >
            <Text style={styles.buttonText}>Lose Weight</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectButton, localUser?.goal === 'muscle_gain' && styles.selectedButton]}
            onPress={() => handleButtonSelect('goal', 'muscle_gain')}
          >
            <Text style={styles.buttonText}>Gain Muscle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectButton, localUser?.goal === 'maintenance' && styles.selectedButton]}
            onPress={() => handleButtonSelect('goal', 'maintenance')}
          >
            <Text style={styles.buttonText}>Maintenance</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Activity Level</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.selectButton, localUser?.activityLevel === 'low' && styles.selectedButton]}
            onPress={() => handleButtonSelect('activityLevel', 'low')}
          >
            <Text style={styles.buttonText}>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectButton, localUser?.activityLevel === 'medium' && styles.selectedButton]}
            onPress={() => handleButtonSelect('activityLevel', 'medium')}
          >
            <Text style={styles.buttonText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectButton, localUser?.activityLevel === 'high' && styles.selectedButton]}
            onPress={() => handleButtonSelect('activityLevel', 'high')}
          >
            <Text style={styles.buttonText}>High</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Height (cm)</Text>
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                value={localUser?.height?.toString() || ''}
                onChangeText={(value) => handleInputChange('height', parseInt(value))}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </LinearGradient>
        </View>
        <Text style={styles.label}>Weight (kg)</Text>
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={localUser?.weight?.toString() || ''}
                onChangeText={(value) => handleInputChange('weight', parseInt(value))}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </LinearGradient>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  email: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    width: '100%',
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 25,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    color: '#000',
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#92a3fd',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '60%', // Adjust button width to make it less wide
    height: 50, // Increase the height to make the button larger
    marginVertical: 16, // Add margin to space out buttons
    borderRadius: 25, // Adjust border radius for buttons
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
