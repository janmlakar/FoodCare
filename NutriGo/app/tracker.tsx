import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Button } from 'react-native';
import { Link } from "expo-router";
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import ScreenTemplate from "./ScreenTemplate";
import FoodItem from '../components/FoodItem';

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
    const [userData, setUserData] = useState<UserData | null>(null);
    const [dailyCalories, setDailyCalories] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data() as UserData;
                    setUserData(data);
                    calculateDailyCalories(data);
                }
            }
        };

        fetchUserData();
    }, []);

    const calculateDailyCalories = (data: UserData) => {
        let BMR: number;
        if (data.gender === 'male') {
            BMR = 88.362 + (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age);
        } else {
            BMR = 447.593 + (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age);
        }

        let activityMultiplier: number;
        switch (data.activityLevel) {
            case 'low':
                activityMultiplier = 1.2;
                break;
            case 'medium':
                activityMultiplier = 1.55;
                break;
            case 'high':
                activityMultiplier = 1.725;
                break;
            default:
                activityMultiplier = 1.2;
        }

        const dailyCalories = BMR * activityMultiplier;
        setDailyCalories(dailyCalories);
    };

    return (
        <ScreenTemplate>
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
        </ScreenTemplate>
    )
}