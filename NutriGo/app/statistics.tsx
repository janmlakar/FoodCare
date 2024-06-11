import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarComponent from './calendar';
import { useUser } from '../context/UserContext';
import useWaterIntake from '../hooks/useWaterIntake';
import { calculateCalorieIntake } from '@/models/functions';

interface HistoryEntry {
  date: string;
  amount?: number;
  note?: string;
  weight?: number;
  calories?: number;
}

const Statistics: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [yearModalVisible, setYearModalVisible] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const { waterIntakeHistory, loadWaterIntakeHistory, setWaterIntakeHistory } = useWaterIntake();
  const { user, loading } = useUser();
  const [dailyCalories, setDailyCalories] = useState<HistoryEntry[]>([]);
  const [dailyCalorieIntake, setDailyCalorieIntake] = useState(0);
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState<number>(0);
  const [lastUpdateDate, setLastUpdateDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      loadWaterIntakeHistory();
      fetchDailyCalories();
      const intake = calculateCalorieIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',
        user.activityLevel,
        user.goal
      );
      setDailyCalorieIntake(intake || 0);
    }
  }, [user]);

  const fetchDailyCalories = async () => {
    try {
      if (user) {
        const storedCalories = await AsyncStorage.getItem(`dailyCalories_${user.uid}`);
        if (storedCalories) {
          const parsedCalories = JSON.parse(storedCalories);
          setDailyCalories(parsedCalories);
          const todayCalories = parsedCalories.find((entry: { date: string }) => entry.date === new Date().toISOString().split('T')[0])?.calories || 0;
          setTotalCaloriesConsumed(todayCalories);
        }
      }
    } catch (error) {
      console.error('Error fetching daily calories:', error);
    }
  };

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (today !== lastUpdateDate) {
      resetCalories();
      setLastUpdateDate(today);
    }

    // Set interval for every minute for testing purposes
    const intervalId = setInterval(() => {
      resetCalories();
      setLastUpdateDate(new Date().toISOString().split('T')[0]);
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(intervalId);
  }, [lastUpdateDate]);

  const resetCalories = async () => {
    if (!user) return;
    const newDate = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(`dailyCalories_${user.uid}`, JSON.stringify([{ date: newDate, calories: 0 }]));
    setDailyCalories([{ date: newDate, calories: 0 }]);
    setTotalCaloriesConsumed(0);
  };

  // Prepare data for the water intake chart
  const waterDates = waterIntakeHistory.filter(entry => entry.amount !== undefined).map(entry => entry.date);
  const waterAmounts = waterIntakeHistory.filter(entry => entry.amount !== undefined).map(entry => entry.amount!);

  // Prepare data for the calorie intake chart
  const calorieDates = dailyCalories.map(entry => entry.date);
  const calorieAmounts = dailyCalories.map(entry => entry.calories || 0);

  if (loading) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  if (!user) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>Login to see Statistics</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Water Intake History</Text>
        {waterAmounts.length > 0 ? (
          <LineChart
            data={{
              labels: waterDates,
              datasets: [
                {
                  data: waterAmounts,
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={Dimensions.get('window').width - 40}
            height={280}
            yAxisLabel=""
            yAxisSuffix="ml"
            chartConfig={{
              backgroundColor: '#f5f5f5',
              backgroundGradientFrom: '#f5f5f5',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 139, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#ddd',
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#00008B',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#ddd',
              marginHorizontal: 10,
            }}
          />
        ) : (
          <Text style={styles.noDataText}>No water intake data available.</Text>
        )}
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Calorie Intake History</Text>
        {calorieAmounts.length > 0 ? (
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: calorieDates,
                datasets: [
                  {
                    data: calorieAmounts,
                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 40}
              height={280}
              yAxisLabel=""
              yAxisSuffix="kcal"
              chartConfig={{
                backgroundColor: '#f5f5f5',
                backgroundGradientFrom: '#f5f5f5',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#ddd',
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ff6347',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#ddd',
                marginHorizontal: 10,
              }}
            />
          </View>
        ) : (
          <Text style={styles.noDataText}>No calorie intake data available.</Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <CalendarComponent />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    alignItems: 'center',
  },
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 20,
    width: Dimensions.get('window').width - 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'SpaceMono-Regular',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonEdit: {
    backgroundColor: '#F39C12',
  },
  buttonRemove: {
    backgroundColor: '#E74C3C',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: 200,
  },
  noteInput: {
    height: 80,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 10,
  },
  weightText: {
    fontSize: 16,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  calorieInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  calorieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'SpaceMono-Regular',
    marginBottom: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  chartContainer: {
    marginVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default Statistics;
