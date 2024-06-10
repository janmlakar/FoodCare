import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext'; // Import the user context

interface WaterIntakeEntry {
  date: string;
  amount?: number;
  note?: string;
  weight?: number;
}

const useWaterIntake = () => {
  const [waterIntakeHistory, setWaterIntakeHistory] = useState<WaterIntakeEntry[]>([]);
  const [accumulatedWaterIntake, setAccumulatedWaterIntake] = useState<number>(0);
  const { user } = useUser(); // Access user context

  useEffect(() => {
    if (user) {
      loadWaterIntakeHistory();
    }
  }, [user]);

  const loadWaterIntakeHistory = async () => {
    try {
      if (user) {
        const history = await AsyncStorage.getItem(`waterIntakeHistory_${user.id}`);
        const parsedHistory: WaterIntakeEntry[] = history ? JSON.parse(history) : [];
        setWaterIntakeHistory(parsedHistory);

        const currentDate = new Date().toISOString().split('T')[0];
        const todayEntry = parsedHistory.find((entry) => entry.date === currentDate);
        if (todayEntry && todayEntry.amount !== undefined) {
          setAccumulatedWaterIntake(todayEntry.amount);
        } else {
          setAccumulatedWaterIntake(0); // Initialize with 0 if no entry for today
        }
      }
    } catch (error) {
      console.error('Failed to load water intake history:', error);
    }
  };

  const saveWaterIntake = async (amount: number) => {
    try {
      if (user) {
        const currentDate = new Date().toISOString().split('T')[0];
        const newHistory = [...waterIntakeHistory];
        const todayEntry = newHistory.find((entry) => entry.date === currentDate);

        if (todayEntry) {
          todayEntry.amount = amount;
        } else {
          newHistory.push({ date: currentDate, amount });
        }

        setWaterIntakeHistory(newHistory);
        setAccumulatedWaterIntake(amount);
        await AsyncStorage.setItem(`waterIntakeHistory_${user.id}`, JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Failed to save water intake:', error);
    }
  };

  return {
    waterIntakeHistory,
    accumulatedWaterIntake,
    saveWaterIntake,
    loadWaterIntakeHistory,
    setWaterIntakeHistory,  // Ensure this is exported
  };
};

export default useWaterIntake;
