import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import useWaterIntake from '../hooks/useWaterIntake'; // Import the custom hook
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import CalendarComponent from './calendar';
import { useUser } from '../context/UserContext'; // Import the user context

interface HistoryEntry {
  date: string;
  amount?: number;
  note?: string;
  weight?: number;
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
  const { user, loading } = useUser(); // Access user and loading state

  useEffect(() => {
    if (user) {
      loadWaterIntakeHistory(); // Load history without arguments
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const newEntry: HistoryEntry = { date: selectedDate, note, weight: parseFloat(weight) || 0 };
      const existingEntryIndex = waterIntakeHistory.findIndex(entry => entry.date === selectedDate);
      let updatedHistory;
      if (existingEntryIndex >= 0) {
        updatedHistory = [...waterIntakeHistory];
        updatedHistory[existingEntryIndex] = newEntry;
      } else {
        updatedHistory = [...waterIntakeHistory, newEntry];
      }

      setWaterIntakeHistory(updatedHistory);
      setModalVisible(false);
      setNote('');
      setWeight('');
      await AsyncStorage.setItem(`waterIntakeHistory_${user.id}`, JSON.stringify(updatedHistory)); // Save the updated history
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleRemove = async () => {
    if (user) {
      const updatedHistory = waterIntakeHistory.filter(entry => entry.date !== selectedDate);
      setWaterIntakeHistory(updatedHistory);
      setModalVisible(false);
      setNote('');
      setWeight('');
      await AsyncStorage.setItem(`waterIntakeHistory_${user.id}`, JSON.stringify(updatedHistory)); // Save the updated history
    }
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setYearModalVisible(false);
  };

  // Prepare data for the chart
  const dates = waterIntakeHistory.filter(entry => entry.amount !== undefined).map(entry => entry.date);
  const amounts = waterIntakeHistory.filter(entry => entry.amount !== undefined).map(entry => entry.amount!);

  if (loading) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>; // Show a loading state while checking authentication
  }

  if (!user) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>Login to see Statistics</Text>
      </View>
    ); // Show a message if user is not logged in
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Water Intake History</Text>
        {amounts.length > 0 ? (
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {editMode ? (
                <>
                  <Text style={styles.modalText}>Add Note or Weight for {selectedDate}</Text>
                  <TextInput
                    style={[styles.input, styles.noteInput]}
                    placeholder="Note"
                    value={note}
                    onChangeText={setNote}
                    multiline={true}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Weight (kg)"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={handleSave}>
                    <Text style={styles.textStyle}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.modalText}>Details for {selectedDate}</Text>
                  <Text style={styles.noteText}>{note}</Text>
                  <Text style={styles.weightText}>Weight: {weight} kg</Text>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonEdit]}
                    onPress={handleEdit}>
                    <Text style={styles.textStyle}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonRemove]}
                    onPress={handleRemove}>
                    <Text style={styles.textStyle}>Remove</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={yearModalVisible}
          onRequestClose={() => {
            setYearModalVisible(!yearModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Year</Text>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue: string) => handleYearSelect(itemValue)}
                style={styles.picker}
              >
                {Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString()).map(year => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setYearModalVisible(false)}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
});

export default Statistics;
function setAccumulatedWaterIntake(arg0: number) {
  throw new Error('Function not implemented.');
}

