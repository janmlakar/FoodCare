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

export default function Tracker() {
    const { user } = useUser();

    const dailyCalorieIntake = user ? calculateCalorieIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',  // Default to 'other' if gender is undefined
        user.activityLevel,
        user.goal
      ) : 'Not set';

    return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{ fontSize: 18, fontWeight: 600}}>Calories</Text>
                    <Text style={{ fontSize: 18, fontWeight: 600}}>{dailyCalorieIntake} kcal</Text>
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