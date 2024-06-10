import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Modal, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useFonts from '../hooks/useFonts';
import { useUser } from '../context/UserContext';
import { Link } from 'expo-router';
import { userActivityLevelToText, userGoalToText, calculateDailyWaterIntakeAdvanced, calculateBMI } from '@/models/functions';
import { calculateCalorieIntake, calculateMacrosIntake, calculateMicrosIntake } from '@/models/functions';
import CircularProgress from 'react-native-circular-progress-indicator';
import useWaterIntake from '../hooks/useWaterIntake';
import BMIGauge from '../components/BMIGauge';

const Plan: React.FC = () => {
  const { user } = useUser();
  const fontsLoaded = useFonts();
  const [modalVisible, setModalVisible] = useState(false);
  const [microsModalVisible, setMicrosModalVisible] = useState(false);
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

  if (!user) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>Log in to see plans</Text>
      </View>
    ); // Show a message if user is not logged in
  }

  useEffect(() => {
    const percent = (accumulatedWaterIntake / totalWaterIntake) * 100;
    setWaterPercentage(percent);
  }, [accumulatedWaterIntake, totalWaterIntake]);

  const handleWaterIntakeChange = (intake: string) => {
    setCurrentWaterIntake(intake);
  };

  const handleAddWater = () => {
    const intakeValue = parseInt(currentWaterIntake);
    if (!isNaN(intakeValue)) {
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
    user.gender || 'other',
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
        {/* Integrate BMIGauge component */}
        <BMIGauge bmi={bmi as number} />
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
        <View style={styles.waterIntakeContainer}>
          <Text style={styles.calorieTitle}>Daily Water Intake:</Text>
          <TextInput
            placeholder="Water intake in ml"
            keyboardType="numeric"
            value={currentWaterIntake}
            onChangeText={handleWaterIntakeChange}
            style={styles.input}
          />
          <CircularProgress
            value={waterPercentage}
            radius={70}
            duration={2000}
            maxValue={100}
            title={'%'}
            titleColor={'#333'}
            titleStyle={{ fontWeight: 'bold' }}
            activeStrokeColor={'#87CEFA'}
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
              <Text style={styles.modalTitle}>Info about data calculation</Text>
              <Text style={styles.modalText}>
                To calculate BMR (Basal Metabolic Rate), we used the Harris-Benedict Equation. All values used were based on the individual's biometric data, including height, weight, age, and gender. The Harris-Benedict Equation is one of the most recognized methods for calculating BMR and provides accurate estimates based on the specific characteristics of the individual.
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
                  <Text style={styles.modalMacro}>Vitamin A: {micros.vitamins.vitaminA} mcg</Text>
                  <Text style={styles.modalMacro}>Vitamin C: {micros.vitamins.vitaminC} mg</Text>
                  <Text style={styles.modalMacro}>Vitamin D: {micros.vitamins.vitaminD} mcg</Text>
                  <Text style={styles.modalMacro}>Vitamin E: {micros.vitamins.vitaminE} mg</Text>
                  <Text style={styles.modalMacro}>Vitamin K: {micros.vitamins.vitaminK} mcg</Text>
                  <Text style={styles.modalMacro}>Thiamin (B1): {micros.vitamins.vitaminB1} mg</Text>
                  <Text style={styles.modalMacro}>Riboflavin (B2): {micros.vitamins.vitaminB2} mg</Text>
                  <Text style={styles.modalMacro}>Niacin (B3): {micros.vitamins.vitaminB3} mg</Text>
                  <Text style={styles.modalMacro}>Vitamin B6: {micros.vitamins.vitaminB6} mg</Text>
                  <Text style={styles.modalMacro}>Folate (B9): {micros.vitamins.folate} mcg</Text>
                  <Text style={styles.modalMacro}>Vitamin B12: {micros.vitamins.vitaminB12} mcg</Text>
                  <Text style={styles.modalMacro}>Calcium: {micros.minerals.calcium} mg</Text>
                  <Text style={styles.modalMacro}>Iron: {micros.minerals.iron} mg</Text>
                  <Text style={styles.modalMacro}>Magnesium: {micros.minerals.magnesium} mg</Text>
                  <Text style={styles.modalMacro}>Phosphorus: {micros.minerals.phosphorus} mg</Text>
                  <Text style={styles.modalMacro}>Potassium: {micros.minerals.potassium} mg</Text>
                  <Text style={styles.modalMacro}>Sodium: {micros.minerals.sodium} mg</Text>
                  <Text style={styles.modalMacro}>Zinc: {micros.minerals.zinc} mg</Text>
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
    position: 'relative',
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
    fontSize: 15,
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginTop: 5,
  },
  link: {
    fontSize: 14,
    color: '#0000FF',
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
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  dailyCalorieContainer: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bmiContainer: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 'auto',
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
    fontSize: 14,
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
  modalText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'SpaceMono-Regular',
    marginTop: 5,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#0000FF',
    fontFamily: 'SpaceMono-Regular',
  },
  infoIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default Plan;
