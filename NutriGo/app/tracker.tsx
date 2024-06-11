// tracker.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
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
        paddingTop: 15,
    },
    subtext: {
        fontSize: 18
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000',
        fontFamily: 'SpaceMono-Regular'
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    textInput: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        minWidth: 100,
        flexShrink: 1,
    },
    button: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default function Tracker() {
    const { user } = useUser();
    const { foodItems, addFoodItem, removeFoodItem } = useFood();
    const [caloriesInput, setCaloriesInput] = useState('');

    const dailyCalorieIntake = user && calculateCalorieIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',
        user.activityLevel,
        user.goal
    );

    const totalCaloriesConsumed = foodItems.reduce((sum, item) => sum + Math.round(item.nutrients.ENERC_KCAL), 0);
    const remainingCalories = typeof dailyCalorieIntake === 'number' ? dailyCalorieIntake - totalCaloriesConsumed : 0;

    const handleAddCalories = () => {
        const calories = parseInt(caloriesInput, 10);
        if (!isNaN(calories)) {
            const manualFoodItem = {
                id: `manual-${Date.now()}`, // Unique ID for the manual entry
                foodId: `manual-${Date.now()}`, // Unique foodId for the manual entry
                name: 'Manual Calories',
                label: 'Manual Calories',
                nutrients: {
                    ENERC_KCAL: calories
                }
            };
            addFoodItem(manualFoodItem);
            setCaloriesInput('');
        } else {
            Alert.alert('Invalid input', 'Please enter a valid number of calories.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {user ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Daily Food Log</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>Calories</Text>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>{dailyCalorieIntake} cal - {totalCaloriesConsumed} cal = {remainingCalories} cal</Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Today's Logged Food</Text>
                    <View style={styles.inputContainer}>
                        <Link href="/search" asChild>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>ADD FOOD</Text>
                            </TouchableOpacity>
                        </Link>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Enter calories...'
                            value={caloriesInput}
                            onChangeText={setCaloriesInput}
                            keyboardType='numeric'
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleAddCalories}
                        >
                            <Text style={styles.buttonText}>ADD CALORIES</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={foodItems}
                        renderItem={({ item }) => (
                            <FoodItem
                                item={item}
                                isAdded={true} // Indicate that the item is already added
                                onRemoveFood={() => removeFoodItem(item.id!)} // Pass the remove function
                            />
                        )}
                        contentContainerStyle={{ gap: 5 }}
                    />
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: '#000', textAlign: 'center' }}>Login to see Food Log</Text>
                </View>
            )}
        </SafeAreaView>
    );
}