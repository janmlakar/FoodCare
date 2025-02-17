import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useFonts from '../hooks/useFonts';
import { useUser } from '../context/UserContext';
import { Link } from 'expo-router';
import {
  userActivityLevelToText,
  userGoalToText,
  calculateDailyWaterIntakeAdvanced,
  calculateBMI,
} from '@/models/functions';
import { calculateCalorieIntake, calculateMacrosIntake, calculateMicrosIntake } from '@/models/functions';
import CircularProgress from 'react-native-circular-progress-indicator';
import useWaterIntake from '../hooks/useWaterIntake';
import BMIGauge from '../components/BMIGauge';
import WaterReminders from './waterReminders';

const Plan: React.FC = () => {
  const { user } = useUser();
  const fontsLoaded = useFonts();
  const [modalVisible, setModalVisible] = useState(false);
  const [microsModalVisible, setMicrosModalVisible] = useState(false);
  const [waterModalVisible, setWaterModalVisible] = useState(false);
  const [currentWaterIntake, setCurrentWaterIntake] = useState('');
  const [totalWaterIntake, setTotalWaterIntake] = useState(0);
  const [waterPercentage, setWaterPercentage] = useState(0);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [gifVisible, setGifVisible] = useState(false);
  const { waterIntakeHistory, accumulatedWaterIntake, saveWaterIntake, loadWaterIntakeHistory } = useWaterIntake();

  useEffect(() => {
    if (user) {
      const totalIntake = calculateDailyWaterIntakeAdvanced(user.weight, user.age, user.gender || 'other', user.activityLevel);
      setTotalWaterIntake(totalIntake);
      loadWaterIntakeHistory();
    }
  }, [user]);

  useEffect(() => {
    const percent = (accumulatedWaterIntake / totalWaterIntake) * 100;
    setWaterPercentage(percent);
  }, [accumulatedWaterIntake, totalWaterIntake]);

  const handleWaterIntakeChange = (intake: string) => {
    setCurrentWaterIntake(intake);
  };

  const handleAddWater = () => {
    const intakeValue = parseInt(currentWaterIntake);
    if (!isNaN(intakeValue) && intakeValue > 0) {
      const newAccumulatedWaterIntake = accumulatedWaterIntake + intakeValue;
      saveWaterIntake(newAccumulatedWaterIntake);
      setCurrentWaterIntake('');

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

      setGifVisible(true);
      setTimeout(() => setGifVisible(false), 3000);
    } else {
      console.warn('Please enter a valid water intake amount.');
    }
  };

  if (!user) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>Log in to see plans</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const dailyCalorieIntake = user
    ? calculateCalorieIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',
        user.activityLevel,
        user.goal
      )
    : 'Not set';

  const macros = user
    ? calculateMacrosIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',
        user.activityLevel,
        user.goal
      )
    : undefined;

  const micros = user
    ? calculateMicrosIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',
        user.activityLevel,
        user.goal
      )
    : undefined;

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
          <Text style={styles.greeting}>Hey, {user.name}!</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.infoIconContainer}>
            <Ionicons name="information-circle-outline" size={25} color="#999" />
          </TouchableOpacity>
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
              <Text>Change plan here</Text>
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

        <BMIGauge bmi={typeof bmi === 'number' ? bmi : 0} />

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
            <TouchableOpacity onPress={() => setMicrosModalVisible(true)}>
              <Text style={styles.link}>Click for more</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.container}>
      
      {/* Tukaj prikazujemo komponento WaterReminders */}
      <WaterReminders />
      
    </View>

        <View style={styles.waterIntakeSection}>
          <TouchableOpacity onPress={() => setWaterModalVisible(true)} style={styles.waterIntakeButton}>
            <Image source={require('../assets/images/water1.png')} style={styles.waterBottleImage} />
            <Text style={styles.waterIntakeText}>Manage water intake</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={waterModalVisible}
          onRequestClose={() => setWaterModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Manage Water Intake</Text>
              <Text style={styles.waterIntakeStatus}>
                Current: {accumulatedWaterIntake} ml / {totalWaterIntake} ml
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${waterPercentage}%` }]} />
                </View>
                <Text style={styles.progressBarText}>{Math.round(waterPercentage)}%</Text>
              </View>
              <TextInput
                placeholder="Enter water intake in ml"
                keyboardType="numeric"
                value={currentWaterIntake}
                onChangeText={handleWaterIntakeChange}
                style={styles.input}
              />
              <TouchableOpacity onPress={handleAddWater} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Water</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setWaterModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Info about data calculation</Text>
              <Text style={styles.modalText}>
                To calculate BMR (Basal Metabolic Rate), we used the Harris-Benedict Equation. All values used were based
                on the individual's biometric data, including height, weight, age, and gender. The Harris-Benedict
                Equation is one of the most recognized methods for calculating BMR and provides accurate estimates based
                on the specific characteristics of the individual.
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={microsModalVisible}
          onRequestClose={() => setMicrosModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Micronutrient Details</Text>
              {micros && (
                <>
                  <Text style={styles.modalText}>Vitamin D: {micros.vitamins.vitaminD} mcg</Text>
                  <Text style={styles.modalText}>Vitamin E: {micros.vitamins.vitaminE} mg</Text>
                  <Text style={styles.modalText}>Vitamin K: {micros.vitamins.vitaminK} mcg</Text>
                  <Text style={styles.modalText}>Thiamin (B1): {micros.vitamins.vitaminB1} mg</Text>
                  <Text style={styles.modalText}>Riboflavin (B2): {micros.vitamins.vitaminB2} mg</Text>
                  <Text style={styles.modalText}>Niacin (B3): {micros.vitamins.vitaminB3} mg</Text>
                  <Text style={styles.modalText}>Vitamin B6: {micros.vitamins.vitaminB6} mg</Text>
                  <Text style={styles.modalText}>Folate (B9): {micros.vitamins.folate} mcg</Text>
                  <Text style={styles.modalText}>Vitamin B12: {micros.vitamins.vitaminB12} mcg</Text>
                  <Text style={styles.modalText}>Calcium: {micros.minerals.calcium} mg</Text>
                  <Text style={styles.modalText}>Iron: {micros.minerals.iron} mg</Text>
                  <Text style={styles.modalText}>Magnesium: {micros.minerals.magnesium} mg</Text>
                  <Text style={styles.modalText}>Phosphorus: {micros.minerals.phosphorus} mg</Text>
                  <Text style={styles.modalText}>Potassium: {micros.minerals.potassium} mg</Text>
                  <Text style={styles.modalText}>Sodium: {micros.minerals.sodium} mg</Text>
                  <Text style={styles.modalText}>Zinc: {micros.minerals.zinc} mg</Text>
                </>
              )}
              <TouchableOpacity onPress={() => setMicrosModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
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
    paddingBottom: 20,
  },
  greetingContainer: {
    padding: 20,
    borderRadius: 20,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  infoIconContainer: {
    padding: 5,
  },
  planGradientContainer: {
    borderRadius: 20,
    margin: 10,
  },
  planContainer: {
    padding: 20,
  },
  planTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  plan: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  link: {
    color: '#92A3FD', 
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Regular',
    marginTop: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  gradientContainer: {
    borderRadius: 20,
    flex: 1,
    margin: 5,
  },
  dailyCalorieContainer: {
    padding: 20,
  },
  calorieTitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  calorieValue: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  bmiContainer: {
    padding: 20,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Poppins-Bold',
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  macro: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  waterIntakeSection: {
    margin: 10,
  },
  waterIntakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#92A3FD',
    padding: 15,
    borderRadius: 20,
  },
  waterBottleImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  waterIntakeText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#92A3FD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
  },
    waterIntakeStatus: {
      fontSize: 16,
      color: '#000',
      fontFamily: 'Poppins-Regular',
      marginBottom: 10,
    },
    progressBarContainer: {
      width: '100%',
      marginBottom: 10,
    },
    progressBarBackground: {
      height: 10,
      backgroundColor: '#ccc',
      borderRadius: 5,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#ADD8E6',
      borderRadius: 5,
    },
    progressBarText: {
      fontSize: 14,
      color: '#000',
      fontFamily: 'Poppins-Regular',
      textAlign: 'center',
      marginTop: 5,
    },
    closeButtonText: {
      fontSize: 16,
      color: '#fff',
      fontFamily: 'Poppins-Bold',
    },
    
    header: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
    },
  });
export default Plan;