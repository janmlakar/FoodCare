import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
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
      const fileName = uri.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;

      try {
        await FileSystem.copyAsync({
          from: uri,
          to: newPath,
        });

        if (localUser) {
          const updatedUser = { ...localUser, image: newPath };
          setLocalUser(updatedUser);
          if (auth.currentUser) {
            await setDoc(doc(firestore, 'users', auth.currentUser.uid), { image: newPath }, { merge: true });
            setUser(updatedUser);
          }
        }
      } catch (error) {
        console.error('Error copying file:', error);
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
          style={styles.selectButton}
          onPress={() => handleButtonSelect('goal', 'weight_loss')}
        >
          <LinearGradient
            colors={localUser?.goal === 'weight_loss' ? ['#92a3fd', '#9dceff'] : ['#ccc', '#ccc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={localUser?.goal === 'weight_loss' ? styles.selectedButtonText : styles.buttonText}>Lose Weight</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleButtonSelect('goal', 'muscle_gain')}
        >
          <LinearGradient
            colors={localUser?.goal === 'muscle_gain' ? ['#92a3fd', '#9dceff'] : ['#ccc', '#ccc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={localUser?.goal === 'muscle_gain' ? styles.selectedButtonText : styles.buttonText}>Gain Muscle</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleButtonSelect('goal', 'maintenance')}
        >
          <LinearGradient
            colors={localUser?.goal === 'maintenance' ? ['#92a3fd', '#9dceff'] : ['#ccc', '#ccc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={localUser?.goal === 'maintenance' ? styles.selectedButtonText : styles.buttonText}>Maintenance</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Activity Level</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleButtonSelect('activityLevel', 'low')}
        >
          <LinearGradient
            colors={localUser?.activityLevel === 'low' ? ['#92a3fd', '#9dceff'] : ['#ccc', '#ccc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={localUser?.activityLevel === 'low' ? styles.selectedButtonText : styles.buttonText}>Low</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleButtonSelect('activityLevel', 'medium')}
        >
          <LinearGradient
            colors={localUser?.activityLevel === 'medium' ? ['#92a3fd', '#9dceff'] : ['#ccc', '#ccc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={localUser?.activityLevel === 'medium' ? styles.selectedButtonText : styles.buttonText}>Medium</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleButtonSelect('activityLevel', 'high')}
        >
          <LinearGradient
            colors={localUser?.activityLevel === 'high' ? ['#92a3fd', '#9dceff'] : ['#ccc', '#ccc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={localUser?.activityLevel === 'high' ? styles.selectedButtonText : styles.buttonText}>High</Text>
          </LinearGradient>
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
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  container: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
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
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    width: '100%',
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#000',
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
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  selectedButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '60%',
    height: 50,
    marginVertical: 16,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
  },
});

export default Profile;
