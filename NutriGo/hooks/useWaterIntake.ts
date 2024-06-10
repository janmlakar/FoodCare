import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WaterIntakeEntry {
  date: string;
  amount?: number;
  note?: string;
  weight?: number;
}

const useWaterIntake = () => {
  const [waterIntakeHistory, setWaterIntakeHistory] = useState<WaterIntakeEntry[]>([]);
  const [accumulatedWaterIntake, setAccumulatedWaterIntake] = useState<number>(0);

  useEffect(() => {
    loadWaterIntakeHistory();
  }, []);

  const loadWaterIntakeHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('waterIntakeHistory');
      const parsedHistory: WaterIntakeEntry[] = history ? JSON.parse(history) : [];
      setWaterIntakeHistory(parsedHistory);

      const currentDate = new Date().toISOString().split('T')[0];
      const todayEntry = parsedHistory.find((entry) => entry.date === currentDate);
      if (todayEntry && todayEntry.amount !== undefined) {
        setAccumulatedWaterIntake(todayEntry.amount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveWaterIntake = async (amount: number) => {
    try {
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
      await AsyncStorage.setItem('waterIntakeHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error(error);
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
