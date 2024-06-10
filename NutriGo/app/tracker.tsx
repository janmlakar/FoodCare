import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Button } from 'react-native';
import { Link } from "expo-router";
import { useFood } from '@/components/FoodList';
import FoodItem from '../components/FoodItem';
import { useUser } from '@/hooks/useUser';
import { calculateCalorieIntake } from '@/models/functions';
import { Ionicons } from '@expo/vector-icons';

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

export default function Tracker() {
    const { user } = useUser();
    const { foodItems, addFoodItem } = useFood(); // Destructure addFoodItem here

    const dailyCalorieIntake = user && calculateCalorieIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',  // Default to 'other' if gender is undefined
        user.activityLevel,
        user.goal
    );

    const totalCaloriesConsumed = foodItems.reduce((sum, item) => sum + item.nutrients.ENERC_KCAL, 0);
    const remainingCalories = typeof dailyCalorieIntake === 'number' ? dailyCalorieIntake - totalCaloriesConsumed : 0;

    return (
         <SafeAreaView style={styles.container}>
            {user ? (
                <View style={styles.container}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>Calories</Text>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>{dailyCalorieIntake} cal - {totalCaloriesConsumed} cal = {remainingCalories} cal</Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Today's Logged Food</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Link href="/search" asChild>
                            <View>
                                <Button title="ADD FOOD" />
                            </View>
                        </Link>
                        <Ionicons name='barcode-outline' size={24}></Ionicons>
                    </View>
                    <FlatList
                        data={foodItems}
                        renderItem={({ item }) => (
                            <FoodItem
                                item={item}
                                onAddFood={() => addFoodItem(item)}
                            />
                        )}
                        contentContainerStyle={{ gap: 5 }}
                    />
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: '#000',textAlign: 'center' }}>Login to see Food Log</Text>
                </View>
            )}
            </SafeAreaView>
    );
}
