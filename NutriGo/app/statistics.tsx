import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Statistics: React.FC = () => {
  const [history, setHistory] = useState<{ date: string; amount: number; }[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('waterIntakeHistory');
        if (history) {
          setHistory(JSON.parse(history));
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadHistory();
  }, []);

  // Prepare data for the chart
  const dates = history.map(entry => entry.date);
  const amounts = history.map(entry => entry.amount);

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Water Intake History</Text>
        {history.length > 0 ? (
          <LineChart
            data={{
              labels: dates,
              datasets: [
                {
                  data: amounts,
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Custom color for the dataset
                  strokeWidth: 2, // Customize the line thickness
                },
              ],
            }}
            width={Dimensions.get('window').width - 40} // Adjust width to fit within the container
            height={280}
            yAxisLabel=""
            yAxisSuffix="ml"
            chartConfig={{
              backgroundColor: '#f5f5f5',
              backgroundGradientFrom: '#f5f5f5',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 139, ${opacity})`, // Dark blue color
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#ddd', // Thin gray border
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#00008B', // Dark blue color for dots
              },
              propsForBackgroundLines: {
                strokeDasharray: '', // Solid background lines
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#ddd', // Light gray border
              marginHorizontal: 10, // Adjust horizontal margin to center the chart
            }}
          />
        ) : (
          <Text style={styles.noDataText}>No water intake data available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff', // Ensure entire background is white
  },
  scrollContent: {
    alignItems: 'center', // Center content horizontally
  },
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 20,
    width: Dimensions.get('window').width + 10, // Ensure container fits within the screen width
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Statistics;
