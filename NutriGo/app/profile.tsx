import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../context/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import { User } from '../models/User';
import LoginForm from '../app/login'; // Ensure this is the correct path to your LoginForm component
import { MaterialIcons } from '@expo/vector-icons'; // Import icon library

const Profile: React.FC = () => {
  const { user, setUser } = useUser();
  const [localUser, setLocalUser] = useState<User | null>(user);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

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
    <ScrollView contentContainerStyle={styles.container}>
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
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={localUser?.height?.toString() || ''}
        onChangeText={(value) => handleInputChange('height', parseInt(value))}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={localUser?.weight?.toString() || ''}
        onChangeText={(value) => handleInputChange('weight', parseInt(value))}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
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
  label: {
    width: '100%',
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectButton: {
    padding: 10,
    backgroundColor: '#d6ded5',
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#e8c227',
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
    fontSize: 13,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 13,
    backgroundColor: '#f44336',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default Profile;
