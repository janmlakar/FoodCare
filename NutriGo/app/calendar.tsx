import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext'; 

interface MarkedDate {
  selected: boolean;
  selectedColor: string;
  weight: string;
  notes: string;
}

interface MarkedDates {
  [date: string]: MarkedDate;
}

const CalendarComponent = () => {
  const { user, loading } = useUser(); // Access user and loading state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [yearModalVisible, setYearModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (!loading && user) {
      const loadMarkedDates = async () => {
        const savedMarkedDates = await AsyncStorage.getItem(`markedDates_${user.id}`);
        if (savedMarkedDates) {
          setMarkedDates(JSON.parse(savedMarkedDates));
        }
      };
      loadMarkedDates();
    }
  }, [loading, user]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    if (markedDates[day.dateString]) {
      setWeight(markedDates[day.dateString].weight);
      setNotes(markedDates[day.dateString].notes);
      setIsEditing(false);
    } else {
      setWeight('');
      setNotes('');
      setIsEditing(true);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    const newMarkedDates: MarkedDates = {
      ...markedDates,
      [selectedDate]: {
        selected: true,
        selectedColor: 'pink',
        weight,
        notes
      }
    };
    setMarkedDates(newMarkedDates);
    if (user) {
      await AsyncStorage.setItem(`markedDates_${user.id}`, JSON.stringify(newMarkedDates));
    }
    setModalVisible(false);
  };

  const handleRemove = async () => {
    const newMarkedDates = { ...markedDates };
    delete newMarkedDates[selectedDate];
    setMarkedDates(newMarkedDates);
    if (user) {
      await AsyncStorage.setItem(`markedDates_${user.id}`, JSON.stringify(newMarkedDates));
    }
    setModalVisible(false);
  };

  const handleMonthPress = () => {
    setYearModalVisible(true);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setYearModalVisible(false);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        style={styles.calendar}
        theme={{
          calendarBackground: 'white',
          textSectionTitleColor: 'black',
          selectedDayBackgroundColor: 'pink',
          selectedDayTextColor: 'white',
          todayTextColor: 'red',
          dayTextColor: 'black',
          arrowColor: 'black',
          monthTextColor: 'black',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
        current={`${selectedYear}-01-01`}
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        onPressArrowRight={(addMonth) => addMonth()}
        onPressListItem={(month: any) => setYearModalVisible(true)}
      />
    
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text>Date: {selectedDate}</Text>
          {isEditing ? (
            <>
              <TextInput
                placeholder="Enter weight"
                value={weight}
                onChangeText={setWeight}
                style={styles.input}
              />
              <TextInput
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, styles.notesInput]}
                multiline
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.pinkButton]} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.pinkButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text>Weight: {weight}</Text>
              <Text>Notes: {notes}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.pinkButton]} onPress={() => setIsEditing(true)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.pinkButton]} onPress={handleRemove}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.pinkButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
      <Modal isVisible={yearModalVisible}>
        <View style={styles.yearModalContent}>
          <ScrollView>
            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <TouchableOpacity key={year} onPress={() => handleYearSelect(year)} style={styles.yearButton}>
                <Text style={styles.yearButtonText}>{year}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.pinkButton} onPress={() => setYearModalVisible(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  calendar: {
    width: Dimensions.get('window').width,
  },
  monthButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  monthButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  yearModalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10
  },
  notesInput: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  pinkButton: {
    backgroundColor: 'pink',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  yearButton: {
    padding: 10,
    alignItems: 'center',
  },
  yearButtonText: {
    fontSize: 16,
  }
});

export default CalendarComponent;
