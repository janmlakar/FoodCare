import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, FlatList, ListRenderItem, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from "expo-router";
import { useUser } from '@/hooks/useUser';
import { useFood } from '@/components/FoodList';
import FoodItem from '../components/FoodItem';

interface FoodItem {
  name: string;
  foodId: string;
  label: string;
  nutrients: {
    ENERC_KCAL: number;
  };
  brand?: string;
  id?: string;
  userId: string;
}

const SimpleStill: React.FC<{ totalCalories: number }> = ({ totalCalories }) => (
    <View style={styles.simpleStillContainer}>
        <Text style={styles.simpleStillText}>Total Calories: {totalCalories}</Text>
    </View>
);

export default function Tracker() {
    const { user, loading } = useUser();
    const { foodItems, addFoodItem, removeFoodItem, setFoodItems } = useFood();
    const [inputCalories, setInputCalories] = useState('');
    const [manualItems, setManualItems] = useState<FoodItem[]>([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            const loadStoredData = async () => {
                const storedDate = await AsyncStorage.getItem(`lastCheckedDate_${user.id}`);
                const currentDate = new Date().toISOString().split('T')[0];

                if (storedDate !== currentDate) {
                    await AsyncStorage.setItem(`lastCheckedDate_${user.id}`, currentDate);
                    setManualItems([]);
                    setFoodItems([]);
                    setTotalCalories(0);
                } else {
                    const storedCalories = await AsyncStorage.getItem(`dailyCalories_${user.id}`);
                    if (storedCalories) {
                        const dailyCalories = JSON.parse(storedCalories);
                        const todayCalories = dailyCalories.find((entry: { date: string }) => entry.date === currentDate);
                        if (todayCalories) {
                            setManualItems(todayCalories.manualItems || []);
                            setFoodItems(todayCalories.foodItems || []);
                            setTotalCalories(todayCalories.totalCalories || 0);
                        }
                    }
                }
            };
            loadStoredData();
        }
    }, [loading, user]);

    useEffect(() => {
        if (!loading && user) {
            const calculateTotalCalories = () => {
                const foodCalories = foodItems.reduce((total, item) => total + item.nutrients.ENERC_KCAL, 0);
                const manualCalories = manualItems.reduce((total, item) => total + item.nutrients.ENERC_KCAL, 0);
                setTotalCalories(manualCalories + foodCalories);
            };
            calculateTotalCalories();
        }
    }, [foodItems, manualItems, loading, user]);

    const handleAddCalories = async () => {
        if (!user || isAdding) return;

        setIsAdding(true);

        const calories = parseInt(inputCalories, 10);
        if (calories > 0 && calories <= 5000) {
            const newManualItem: FoodItem = {
                name: "Manual Entry",
                foodId: `manual_${Date.now()}`,
                label: "Manually Added",
                nutrients: { ENERC_KCAL: calories },
                userId: user.id,
            };

            setManualItems(prevManualItems => {
                const newManualItems = [...prevManualItems, newManualItem];
                saveDailyCalories(newManualItems, foodItems);
                return newManualItems;
            });
            setInputCalories('');
        } else {
            Alert.alert('Invalid input', 'Please enter a valid number of calories between 1 and 5000.');
        }
        setIsAdding(false);
    };

    const saveDailyCalories = async (manualItems: FoodItem[], foodItems: FoodItem[]) => {
        if (!user) {
            console.error('User not found or UID is undefined.');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const storedCalories = await AsyncStorage.getItem(`dailyCalories_${user.id}`);
        const dailyCalories = storedCalories ? JSON.parse(storedCalories) : [];
        const existingEntryIndex = dailyCalories.findIndex((entry: { date: string }) => entry.date === today);
        const manualCalories = manualItems.reduce((total, item) => total + item.nutrients.ENERC_KCAL, 0);
        const foodCalories = foodItems.reduce((total, item) => total + item.nutrients.ENERC_KCAL, 0);
        const totalCalories = manualCalories + foodCalories;
        if (existingEntryIndex !== -1) {
            dailyCalories[existingEntryIndex].manualItems = manualItems;
            dailyCalories[existingEntryIndex].foodItems = foodItems;
            dailyCalories[existingEntryIndex].totalCalories = totalCalories;
        } else {
            dailyCalories.push({ date: today, manualItems, foodItems, totalCalories });
        }
        await AsyncStorage.setItem(`dailyCalories_${user.id}`, JSON.stringify(dailyCalories));
    };

    const handleRemoveFood = async (id: string | undefined) => {
        if (!user || !id) return;

        const foodItem = foodItems.find(item => item.id === id || item.foodId === id);
        if (foodItem) {
            try {
                await removeFoodItem(id);
                const updatedFoodItems = foodItems.filter(item => item.id !== id && item.foodId !== id);
                setFoodItems(updatedFoodItems);
                saveDailyCalories(manualItems, updatedFoodItems);
            } catch (error) {
                console.error('Error removing food item:', error);
            }
        } else {
            const manualItemIndex = manualItems.findIndex(item => item.foodId === id);
            if (manualItemIndex !== -1) {
                const newManualItems = [...manualItems];
                newManualItems.splice(manualItemIndex, 1);
                setManualItems(newManualItems);
                saveDailyCalories(newManualItems, foodItems);
            }
        }
    };

    const renderFoodItem: ListRenderItem<FoodItem> = useCallback(({ item }) => (
        <View style={styles.foodItemContainer}>
            <FoodItem
                item={item}
                isAdded={true}
                onRemoveFood={() => handleRemoveFood(item.foodId)}
            />
        </View>
    ), [foodItems, manualItems]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Daily Food Log</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter calories"
                    keyboardType="numeric"
                    value={inputCalories}
                    onChangeText={text => setInputCalories(text)}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddCalories}>
                    <Text style={styles.addButtonText}>ADD CALORIES</Text>
                </TouchableOpacity>
                <Link href="/search" asChild>
                    <TouchableOpacity style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>SEARCH FOOD</Text>
                    </TouchableOpacity>
                </Link>
            </View>
            <SimpleStill totalCalories={totalCalories} />
            <FlatList
                data={[...manualItems, ...foodItems]}
                renderItem={renderFoodItem}
                keyExtractor={(item) => item.id ?? item.foodId}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No food items found</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchButton: {
        backgroundColor: '#7195eb',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    simpleStillContainer: {
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 4,
        marginBottom: 16,
        alignItems: 'center',
    },
    simpleStillText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    foodItemContainer: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});
