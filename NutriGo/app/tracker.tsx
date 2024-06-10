import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Button } from 'react-native';
import { Link } from "expo-router";
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import FoodItem from '../components/FoodItem';
import { ActivityLevel, Goal } from '@/models/User';
import { useUser } from '@/hooks/useUser';
import { calculateCalorieIntake } from '@/models/functions';

//If you are sedentary (little or no exercise) : Calorie-Calculation = BMR x 1.2. 
//If you are lightly active (light exercise/sports 1-3 days​/week) : Calorie-Calculation = BMR x 1.375. 
//If you are moderately active (moderate exercise/sports 3-5 days/week) : Calorie-Calculation = BMR x 1.55.
//Men: BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) – (5.677 x age in years) 
//Women: BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) – (4.330 x age in years)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        gap: 10,
        paddingTop: 50,
    },
    subtext: {
        fontSize: 18
    }
});

const foodItems = [
    { food: { label: 'Jabolko', nutrients: { ENERC_KCAL: 100 }, brand: 'Podgrajšek' } },
    { food: { label: 'Pica', nutrients: { ENERC_KCAL: 200 }, brand: 'Lovska Koča' } },
    { food: { label: 'Pomfri', nutrients: { ENERC_KCAL: 300 }, brand: 'McDonalds' } },
]

// Define a type for user data
interface UserData {
    gender: string;
    activityLevel: string;
    height: number;
    age: number;
    weight: number;
}

export default function Tracker() {
    const { user } = useUser();
    const [dailyCalories, setDailyCalories] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data() as UserData;
                    calculateDailyCalories;
                }
            }
        };

        fetchUserData();
    }, []);

    const dailyCalorieIntake = user ? calculateCalorieIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',  // Default to 'other' if gender is undefined
        user.activityLevel,
        user.goal
      ) : 'Not set';

    const calculateDailyCalories = (
        height: number,
        weight: number,
        age: number,
        gender: 'male' | 'female' | 'other' | undefined,
        activityLevel: ActivityLevel | undefined,
        goal: Goal | undefined
      ): number | undefined => {
        // Ensure gender is not undefined
        if (!gender) return undefined;
      
        // Calculate BMR using the Harris-Benedict Equation
        let BMR;
        if (gender === 'male') {
          BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
        } else if (gender === 'female') {
          BMR = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
        } else {
          // Handle 'other' gender by averaging male and female BMR
          BMR =
            (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age +
              447.593 + 9.247 * weight + 3.098 * height - 4.33 * age) /
            2;
        }
      
        // Adjust BMR based on activity level
        let activityMultiplier = 1.2; // Default to sedentary if undefined
        switch (activityLevel) {
          case ActivityLevel.LOW:
            activityMultiplier = 1.2;
            break;
          case ActivityLevel.MEDIUM:
            activityMultiplier = 1.55;
            break;
          case ActivityLevel.HIGH:
            activityMultiplier = 1.9;
            break;
          default:
            activityMultiplier = 1.2;
        }
      
        const maintenanceCalories = BMR * activityMultiplier;
      
        // Adjust maintenance calories based on goal
        let goalAdjustment = 0; // Default to maintenance if undefined
        switch (goal) {
          case Goal.WEIGHT_LOSS:
            goalAdjustment = -500;
            break;
          case Goal.MUSCLE_GAIN:
            goalAdjustment = 500;
            break;
          case Goal.MAINTENANCE:
            goalAdjustment = 0;
            break;
          default:
            goalAdjustment = 0;
        }
      
        const dailyCalorieIntake = maintenanceCalories + goalAdjustment;
        return Math.round(dailyCalorieIntake);
      };

    return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{ fontSize: 18, fontWeight: 600}}>Calories</Text>
                    <Text style={{ fontSize: 18, fontWeight: 600}}>{dailyCalories ? `${dailyCalories.toFixed(0)} kcal` : 'Loading...'}</Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 600}}>Today's Logged Food</Text>
                    <Link href="/search" asChild>
                        <Button title="ADD FOOD" />
                    </Link>
                    <FlatList
                        data={foodItems}
                        renderItem={({ item }) => <FoodItem item={item} />}
                        contentContainerStyle={{ gap: 5 }}
                    />
                </View>
            </SafeAreaView>
    )
}