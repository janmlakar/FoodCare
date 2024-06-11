import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Link } from "expo-router";
import CircularProgress from 'react-native-circular-progress-indicator';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/hooks/useUser';
import { useFood } from '@/components/FoodList';
import FoodItem from '../components/FoodItem';
import { calculateCalorieIntake, ActivityLevel, Goal } from '@/models/functions';

interface FoodItemType {
    id: string;
    foodId: string;
    userId: string;
    name: string;
    label: string;
    nutrients: {
        ENERC_KCAL: number;
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    subtext: {
        fontSize: 18,
        color: '#000',
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
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    button: {
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    gradientContainer: {
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#fff', // White background
        borderColor: '#ccc', // Thin gray border
        borderWidth: 1,
    },
    calorieInfoContainer: {
        padding: 20,
        alignItems: 'center',
    },
    calorieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000', // Black color
        fontFamily: 'SpaceMono-Regular',
        marginBottom: 5,
    },
    calorieValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000', // Black color
        fontFamily: 'SpaceMono-Regular',
        textAlign: 'center',
    },
    legendText: {
        fontSize: 14,
        color: '#000', // Black color
        fontFamily: 'SpaceMono-Regular',
        textAlign: 'center',
        marginTop: 5,
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    foodItemContainer: {
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        overflow: 'hidden',
    },
    foodItemGradient: {
        borderRadius: 10,
        padding: 10,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyListText: {
        fontSize: 16,
        color: '#000',
    },
});

export default function Tracker() {
    const { user } = useUser();
    const { foodItems, addFoodItem, removeFoodItem } = useFood();
    const [caloriesInput, setCaloriesInput] = useState<string>('');
    const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState<number>(0);
    const [caloriesPercentage, setCaloriesPercentage] = useState<number>(0);
    const [lastUpdateDate, setLastUpdateDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (user) {
            loadCalories();
        }
    }, [user]);

    const dailyCalorieIntake = useMemo(() => calculateCalorieIntake(
        user?.height || 0,
        user?.weight || 0,
        user?.age || 0,
        user?.gender || 'other',
        user?.activityLevel as ActivityLevel || ActivityLevel.SEDENTARY,
        user?.goal as Goal || Goal.MAINTAIN
    ), [user]) || 0;

    useEffect(() => {
        if (totalCaloriesConsumed > 0 && dailyCalorieIntake > 0) {
            setCaloriesPercentage((totalCaloriesConsumed / dailyCalorieIntake) * 100);
        } else {
            setCaloriesPercentage(0);
        }
    }, [totalCaloriesConsumed, dailyCalorieIntake]);

    useEffect(() => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        if (today !== lastUpdateDate) {
            resetCalories();
            setLastUpdateDate(today);
        }

        const millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime() - now.getTime();
        const timeoutId = setTimeout(() => {
            resetCalories();
            setLastUpdateDate(new Date().toISOString().split('T')[0]);
        }, millisTillMidnight);

        return () => clearTimeout(timeoutId);
    }, [lastUpdateDate]);

    const loadCalories = async () => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];
        const storedCalories = await AsyncStorage.getItem(`dailyCalories_${user.uid}`);
        if (storedCalories) {
            const dailyCalories = JSON.parse(storedCalories);
            const todayCalories = dailyCalories.find((entry: { date: string }) => entry.date === today)?.calories || 0;
            setTotalCaloriesConsumed(todayCalories);
        }
    };

    const resetCalories = async () => {
        setTotalCaloriesConsumed(0);
        if (!user) return;
        await AsyncStorage.setItem(`dailyCalories_${user.uid}`, JSON.stringify([{ date: new Date().toISOString().split('T')[0], calories: 0 }]));
    };

    const handleAddCalories = () => {
        const calories = parseInt(caloriesInput, 10);
        if (!isNaN(calories)) {
            const manualFoodItem: FoodItemType = {
                id: `manual-${user?.uid}-${Date.now()}`,
                foodId: `manual-${user?.uid}-${Date.now()}`,
                userId: user?.uid || '',
                name: 'Manual Calories',
                label: 'Manual Calories',
                nutrients: {
                    ENERC_KCAL: calories
                }
            };
            addFoodItem(manualFoodItem);
            setCaloriesInput('');
            const newTotalCalories = totalCaloriesConsumed + calories;
            setTotalCaloriesConsumed(newTotalCalories);
            saveDailyCalories(newTotalCalories); // Save updated calories
        } else {
            Alert.alert('Invalid input', 'Please enter a valid number of calories.');
        }
    };

    const saveDailyCalories = async (calories: number) => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];
        const storedCalories = await AsyncStorage.getItem(`dailyCalories_${user.uid}`);
        const dailyCalories = storedCalories ? JSON.parse(storedCalories) : [];
        const existingEntryIndex = dailyCalories.findIndex((entry: { date: string }) => entry.date === today);
        if (existingEntryIndex !== -1) {
            dailyCalories[existingEntryIndex].calories = calories;
        } else {
            dailyCalories.push({ date: today, calories });
        }
        await AsyncStorage.setItem(`dailyCalories_${user.uid}`, JSON.stringify(dailyCalories));
    };

    const handleRemoveFood = (id: string) => {
        const foodItem = foodItems.find(item => item.id === id);
        if (foodItem) {
            removeFoodItem(id);
            const newTotalCalories = totalCaloriesConsumed - Math.round(foodItem.nutrients.ENERC_KCAL);
            setTotalCaloriesConsumed(newTotalCalories);
            saveDailyCalories(newTotalCalories);
        }
    };

    const renderHeader = () => (
        <>
            <Text style={styles.title}>Daily Food Log</Text>
            <View style={styles.gradientContainer}>
                <View style={styles.calorieInfoContainer}>
                    <Text style={styles.calorieTitle}>Daily Intake: {dailyCalorieIntake} kcal</Text>
                    <CircularProgress
                        value={caloriesPercentage}
                        radius={70}
                        duration={2000}
                        maxValue={100}
                        title={('%')}
                        titleColor={'#FF69B4'}  // Pink color
                        titleStyle={{ fontWeight: 'bold', fontSize: 33 }}
                        activeStrokeColor={'#FF69B4'}  // Pink color
                        inActiveStrokeColor={'#A9A9A9'}  // Dark gray color
                        inActiveStrokeOpacity={0.2}
                        inActiveStrokeWidth={10}
                        activeStrokeWidth={10}
                    />
                </View>
                <View style={styles.legendContainer}>
                    <Text style={styles.legendText}>{totalCaloriesConsumed} / {dailyCalorieIntake} kcal</Text>
                </View>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 20 }}>Food log for today:</Text>
            <View style={{ ...styles.inputContainer, marginBottom: 10 }}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Enter calories...'
                    value={caloriesInput}
                    onChangeText={setCaloriesInput}
                    keyboardType='numeric'
                />
                <LinearGradient
                    colors={['#92A3FD', '#9DCEFF']}
                    style={styles.button}
                >
                    <TouchableOpacity onPress={handleAddCalories}>
                        <Text style={styles.buttonText}>ADD CALORIES</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
                <Link href="/search" asChild>
                    <TouchableOpacity>
                        <LinearGradient
                            colors={['#92A3FD', '#9DCEFF']}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>ADD FOOD</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Link>
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={foodItems}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <View style={styles.foodItemContainer}>
                        <LinearGradient
                            colors={['#92A3FD', '#9DCEFF']}
                            style={styles.foodItemGradient}
                        >
                            <FoodItem
                                item={item}
                                isAdded={true}
                                onRemoveFood={() => handleRemoveFood(item.id!)}
                            />
                        </LinearGradient>
                    </View>
                )}
                keyExtractor={(item) => item.id!}
                contentContainerStyle={{ gap: 5 }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>Search for food</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
