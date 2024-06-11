import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import { ActivityLevel, Goal, User } from '../models/User';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { userActivityLevelToText, userGoalToText } from '@/models/functions';
import { Picker } from '@react-native-picker/picker';

const Profile: React.FC = () => {
  const { user, setUser } = useUser();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const shimmerAnimation = useState(new Animated.Value(0))[0];
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setLocalUser(user);
      if (user.image) {
        loadImageBase64(user.image);
      }
    } else {
      setLocalUser(null);
    }
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

  const loadImageBase64 = async (uri: string) => {
    try {
      console.log('Loading image from URI:', uri);
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImageBase64(`data:image/jpeg;base64,${base64}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('java.io.FileNotFoundException')) {
        console.warn('File not found, but proceeding as the image displays correctly:', error.message);
      } else {
        console.error('Error loading image base64:', error);
      }
    }
  };

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

      if (FileSystem.documentDirectory) {
        const newPath = FileSystem.documentDirectory + fileName;

        try {
          await FileSystem.copyAsync({
            from: uri,
            to: newPath,
          });

          if (localUser) {
            const updatedUser = { ...localUser, image: newPath };
            setLocalUser(updatedUser);
            setImageBase64(uri); // Set the URI directly for immediate display
            if (auth.currentUser) {
              await setDoc(doc(firestore, 'users', auth.currentUser.uid), { image: newPath }, { merge: true });
              setUser(updatedUser);
            }
          }
        } catch (error) {
          console.error('Error copying file:', error);
        }
      } else {
        console.error('FileSystem.documentDirectory is null');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push('/login');
  };

  const handleInputChange = (field: keyof User, value: string | number) => {
    if (localUser) {
      // Preverite, ali je polje "name" in posodobite vrednost brez preverjanja na številko
      const updatedUser = { ...localUser, [field]: field === 'name' ? value : value !== '' && !isNaN(Number(value)) ? Number(value) : '' };
      setLocalUser(updatedUser);
      if (auth.currentUser) {
        setDoc(doc(firestore, 'users', auth.currentUser.uid), { [field]: updatedUser[field] }, { merge: true });
        setUser(updatedUser);
      }
    }
  };

  const handlePickerChange = async (field: keyof User, value: string | number) => {
    if (localUser) {
      const updatedUser = { ...localUser, [field]: value };
      setLocalUser(updatedUser);
      if (auth.currentUser) {
        await setDoc(doc(firestore, 'users', auth.currentUser.uid), { [field]: value }, { merge: true });
        setUser(updatedUser);
      }
    }
  };

  const defaultImage = localUser?.gender === 'female'
    ? require('../assets/images/female-icon.png')
    : require('../assets/images/male-icon.png');

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.imageContainer}>
        <Image source={imageBase64 ? { uri: imageBase64 } : defaultImage} style={styles.profileImage} />
        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
     
      <Text style={styles.email}>{localUser?.email}</Text>
      <Text style={styles.label1}>Edit your data:</Text>
      <Text style={styles.label}>Name</Text>
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
              placeholder="Name"
              value={localUser?.name || ''}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholderTextColor="#999"
            />
          </View>
        </LinearGradient>
      </View>
      <Text style={styles.label}>Goal</Text>
      <View style={styles.inputContainer}>
        <LinearGradient
          colors={['#92a3fd', '#9dceff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={localUser?.goal}
              onValueChange={(itemValue) => handlePickerChange('goal', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Goal" value={undefined} />
              <Picker.Item label={userGoalToText(Goal.WEIGHT_LOSS)} value={Goal.WEIGHT_LOSS} />
              <Picker.Item label={userGoalToText(Goal.MILD_WEIGHT_LOSS)} value={Goal.MILD_WEIGHT_LOSS} />
              <Picker.Item label={userGoalToText(Goal.EXTREME_WEIGHT_LOSS)} value={Goal.EXTREME_WEIGHT_LOSS} />
              <Picker.Item label={userGoalToText(Goal.MUSCLE_GAIN)} value={Goal.MUSCLE_GAIN} />
              <Picker.Item label={userGoalToText(Goal.MAINTENANCE)} value={Goal.MAINTENANCE} />
            </Picker>
          </View>
        </LinearGradient>
      </View>
      <Text style={styles.label}>Activity Level</Text>
      <View style={styles.inputContainer}>
        <LinearGradient
          colors={['#92a3fd', '#9dceff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={localUser?.activityLevel}
              onValueChange={(itemValue) => handlePickerChange('activityLevel', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Activity Level" value={undefined} />
              <Picker.Item label={userActivityLevelToText(ActivityLevel.BMR)} value={ActivityLevel.BMR} />
              <Picker.Item label={userActivityLevelToText(ActivityLevel.SEDENTARY)} value={ActivityLevel.SEDENTARY} />
              <Picker.Item label={userActivityLevelToText(ActivityLevel.LIGHT)} value={ActivityLevel.LIGHT} />
              <Picker.Item label={userActivityLevelToText(ActivityLevel.MODERATE)} value={ActivityLevel.MODERATE} />
              <Picker.Item label={userActivityLevelToText(ActivityLevel.ACTIVE)} value={ActivityLevel.ACTIVE} />
              <Picker.Item label={userActivityLevelToText(ActivityLevel.VERY_ACTIVE)} value={ActivityLevel.VERY_ACTIVE} />
              <Picker.Item label={userActivityLevelToText(ActivityLevel.EXTRA_ACTIVE)} value={ActivityLevel.EXTRA_ACTIVE} />
            </Picker>
          </View>
        </LinearGradient>
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
              onChangeText={(value) => handleInputChange('height', value)}
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
              onChangeText={(value) => handleInputChange('weight', value)}
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
      <Text style={styles.label2}>Go to first page to see plans</Text>
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
    fontFamily: 'SpaceMono-Regular',

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
  label1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginBottom: 10,
  },
  label2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginBottom: 10,
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
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
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
