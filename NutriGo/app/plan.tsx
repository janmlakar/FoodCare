import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Modal, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useFonts from '../hooks/useFonts';
import { useUser } from '../context/UserContext';
import { Link } from 'expo-router';
import { userActivityLevelToText, userGoalToText, calculateDailyWaterIntakeAdvanced, calculateBMI } from '@/models/functions';
import { calculateCalorieIntake, calculateMacrosIntake, calculateMicrosIntake } from '@/models/functions';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Plan: React.FC = () => {
  const { user } = useUser();
  const fontsLoaded = useFonts();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWaterIntake, setCurrentWaterIntake] = useState('');
  const [totalWaterIntake, setTotalWaterIntake] = useState(0);
  const [waterPercentage, setWaterPercentage] = useState(0);
  const [accumulatedWaterIntake, setAccumulatedWaterIntake] = useState(0);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [gifVisible, setGifVisible] = useState(false);

  useEffect(() => {
    if (user) {
      const totalIntake = calculateDailyWaterIntakeAdvanced(user.weight, user.age, user.gender || 'other', user.activityLevel);
      setTotalWaterIntake(totalIntake);
      loadWaterIntake(); // Load water intake from storage
    }
  }, [user]);

  useEffect(() => {
    const percent = (accumulatedWaterIntake / totalWaterIntake) * 100;
    setWaterPercentage(percent);
    saveWaterIntake(); // Save water intake to storage
  }, [accumulatedWaterIntake, totalWaterIntake]);

  const loadWaterIntake = async () => {
    try {
      const savedIntake = await AsyncStorage.getItem('waterIntake');
      const lastReset = await AsyncStorage.getItem('lastReset');
      const currentTime = new Date().getTime();

      if (lastReset) {
        const timeDifference = currentTime - parseInt(lastReset);
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference >= 24) {
          setAccumulatedWaterIntake(0);
          await AsyncStorage.setItem('lastReset', currentTime.toString());
        } else if (savedIntake !== null) {
          setAccumulatedWaterIntake(parseInt(savedIntake));
        }
      } else {
        await AsyncStorage.setItem('lastReset', currentTime.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveWaterIntake = async () => {
    try {
      await AsyncStorage.setItem('waterIntake', accumulatedWaterIntake.toString());
      const currentDate = new Date().toISOString().split('T')[0];
      const history = await AsyncStorage.getItem('waterIntakeHistory');
      const waterIntakeHistory = history ? JSON.parse(history) : [];

      const todayEntry = waterIntakeHistory.find((entry: { date: string; }) => entry.date === currentDate);
      if (todayEntry) {
        todayEntry.amount = accumulatedWaterIntake;
      } else {
        waterIntakeHistory.push({ date: currentDate, amount: accumulatedWaterIntake });
      }

      await AsyncStorage.setItem('waterIntakeHistory', JSON.stringify(waterIntakeHistory));
    } catch (error) {
      console.log(error);
    }
  };

  const handleWaterIntakeChange = (intake: string) => {
    setCurrentWaterIntake(intake);
  };

  const handleAddWater = () => {
    const intakeValue = parseInt(currentWaterIntake);
    if (!isNaN(intakeValue)) {
      setAccumulatedWaterIntake(accumulatedWaterIntake + intakeValue);
      setCurrentWaterIntake(''); // Clear input after adding

      // Trigger shake animation
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      // Show GIF for 3 seconds
      setGifVisible(true);
      setTimeout(() => setGifVisible(false), 3000);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const dailyCalorieIntake = user ? calculateCalorieIntake(
    user.height,
    user.weight,
    user.age,
    user.gender || 'other',  // Default to 'other' if gender is undefined
    user.activityLevel,
    user.goal
  ) : 'Not set';

  const macros = user ? calculateMacrosIntake(
    user.height,
    user.weight,
    user.age,
    user.gender || 'other',
    user.activityLevel,
    user.goal
  ) : undefined;

  const micros = user ? calculateMicrosIntake(
    user.height,
    user.weight,
    user.age,
    user.gender || 'other',
    user.activityLevel,
    user.goal
  ) : undefined;

  const bmi = user ? calculateBMI(user.height, user.weight) : 'Not set';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={['#92A3FD', '#9DCEFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.greetingContainer}
        >
          {user ? (
            <Text style={styles.greeting}>Hey, {user.name}!</Text>
          ) : (
            <Text style={styles.greeting}>Hey, you need to be logged in to see your plans!</Text>
          )}
        </LinearGradient>
        <LinearGradient
          colors={['#EEA4CE', '#C58BF2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planGradientContainer}
        >
          <View style={styles.planContainer}>
            <Text style={styles.planTitle}>Your current plan:</Text>
            <Text style={styles.plan}>Activity Level: {userActivityLevelToText(user?.activityLevel)}</Text>
            <Text style={styles.plan}>Goal: {userGoalToText(user?.goal)}</Text>
            <Link href="/login" style={styles.link}>
              <Text>Change plan here</Text> {/* Wrap string in Text component */}
            </Link>
          </View>
        </LinearGradient>
        <View style={styles.row}>
          <LinearGradient
            colors={['#92A3FD', '#9DCEFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.dailyCalorieContainer}>
              <Text style={styles.calorieTitle}>Daily Calorie Intake:</Text>
              <Text style={styles.calorieValue}>{dailyCalorieIntake} kcal</Text>
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['#92A3FD', '#9DCEFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.bmiContainer}>
              <Text style={styles.calorieTitle}>Your BMI:</Text>
              <Text style={styles.calorieValue}>{bmi}</Text>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.row}>
          {macros && (
            <View style={styles.whiteContainer}>
              <Text style={styles.calorieTitle}>Daily Macros</Text>
              <Text style={styles.macro}>Protein: {macros.dailyProteinIntake} g</Text>
              <Text style={styles.macro}>Carbs: {macros.dailyCarbsIntake} g</Text>
              <Text style={styles.macro}>Fats: {macros.dailyFatsIntake} g</Text>
            </View>
          )}
          <View style={styles.whiteContainer}>
            <Text style={styles.calorieTitle}>Daily Micros</Text>
            {micros && (
              <>
                <Text style={styles.macro}>Vitamin A: {micros.vitamins.vitaminA} mcg</Text>
              </>
            )}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.link}>Click for more</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.waterIntakeContainer}>
          <Text style={styles.calorieTitle}>Daily Water Intake:</Text>
          <TextInput
            placeholder="Vnesi količino vode v ml"
            keyboardType="numeric"
            value={currentWaterIntake}
            onChangeText={handleWaterIntakeChange}
            style={styles.input}
          />
          <CircularProgress
            value={waterPercentage}
            radius={70} // Increased the radius to make it larger
            duration={2000}
            maxValue={100}
            title={'%'}
            titleColor={'#333'}
            titleStyle={{ fontWeight: 'bold' }}
            activeStrokeColor={'#87CEFA'} // Change progress circle color to light blue
          />
          <Text style={styles.totalWaterIntake}>{accumulatedWaterIntake}/{totalWaterIntake} ml</Text>
          <Text style={styles.addWaterText}>Click the bottle to add water</Text>
          <View style={styles.waterButtonContainer}>
            <TouchableOpacity onPress={handleAddWater}>
              <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
                <Image source={require('../assets/images/water1.png')} style={styles.waterButtonImage} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
       
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Micronutrients</Text>
              {micros && (
                <>
                  <Text style={styles.macroTitle}>Vitamins</Text>
                  {Object.entries(micros.vitamins).map(([key, value]) => (
                    <Text style={styles.modalMacro} key={key}>{key}: {value}</Text>
                  ))}
                  <Text style={styles.macroTitle}>Minerals</Text>
                  {Object.entries(micros.minerals).map(([key, value]) => (
                    <Text style={styles.modalMacro} key={key}>{key}: {value}</Text>
                  ))}
                </>
              )}
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.link}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  greetingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 50,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'SpaceMono-Regular',
  },
  planGradientContainer: {
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 10,
  },
  planContainer: {
    marginHorizontal: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
  },
  plan: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginTop: 5,
  },
  link: {
    fontSize: 14,
    color: '#0000FF', // Change link color to blue
    fontFamily: 'SpaceMono-Regular',
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  gradientContainer: {
    borderRadius: 10,
    marginTop: 20,
    width: '48%',
  },
  dailyCalorieContainer: {
    padding: 20,
    flexDirection: 'column', // Change this to column to align items vertically
    justifyContent: 'space-between',
    alignItems: 'center', // Center align horizontally
  },
  bmiContainer: {
    padding: 20,
    flexDirection: 'column', // Change this to column to align items vertically
    justifyContent: 'center', // Center align vertically
    alignItems: 'center', // Center align horizontally
  },
  dailyMicrosContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: '48%',
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: '48%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  calorieTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginBottom: 10,
  },
  calorieValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'right',
    marginTop: 'auto', // Push the value to the bottom
  },
  macrosContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: '48%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  macroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginBottom: 10,
  },
  macro: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginTop: 5,
  },
  waterIntakeContainer: {
    padding: 20,
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  totalWaterIntake: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginTop: 10,
  },
  addWaterText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginTop: 10,
  },
  waterButtonContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  waterButtonImage: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenBubbles: {
    width: '100%',
    height: '100%',
  },
  modalMacro: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'SpaceMono-Regular',
  },
});

export default Plan;
