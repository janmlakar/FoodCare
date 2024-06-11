import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/hooks/useUser';
import { calculateCalorieIntake, ActivityLevel, Goal } from '@/models/functions';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000',
        fontFamily: 'SpaceMono-Regular',
    },
    calorieInfoContainer: {
        padding: 20,
        alignItems: 'center',
    },
    calorieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'SpaceMono-Regular',
        marginBottom: 5,
    },
    legendText: {
        fontSize: 14,
        color: '#000',
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
    chartContainer: {
        marginVertical: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        backgroundColor: '#fff',
    },
});

interface CalorieEntry {
    date: string;
    calories: number;
}

const FoodLogHistory = () => {
    const { user } = useUser();
    const [dailyCalorieIntake, setDailyCalorieIntake] = useState(0);
    const [dailyCalories, setDailyCalories] = useState<CalorieEntry[]>([]);
    const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState<number>(0);
    const [caloriesPercentage, setCaloriesPercentage] = useState<number>(0);
    const [lastUpdateDate, setLastUpdateDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (user) {
            const intake = calculateCalorieIntake(
                user.height,
                user.weight,
                user.age,
                user.gender || 'other',
                user.activityLevel as ActivityLevel || ActivityLevel.SEDENTARY,
                user.goal as Goal || Goal.MAINTAIN
            );
            setDailyCalorieIntake(intake || 0);
        }
    }, [user]);

    useEffect(() => {
        const fetchDailyCalories = async () => {
            try {
                const storedCalories = await AsyncStorage.getItem(`dailyCalories_${user?.uid}`);
                if (storedCalories) {
                    const parsedCalories = JSON.parse(storedCalories);
                    console.log('Fetched daily calories:', parsedCalories);
                    setDailyCalories(parsedCalories);
                    const todayCalories = parsedCalories.find((entry: { date: string }) => entry.date === new Date().toISOString().split('T')[0])?.calories || 0;
                    setTotalCaloriesConsumed(todayCalories);
                }
            } catch (error) {
                console.error('Error fetching daily calories:', error);
            }
        };

        if (user) {
            fetchDailyCalories();
        }
    }, [user]);

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

    useEffect(() => {
        if (totalCaloriesConsumed > 0 && dailyCalorieIntake > 0) {
            setCaloriesPercentage((totalCaloriesConsumed / dailyCalorieIntake) * 100);
        } else {
            setCaloriesPercentage(0);
        }
    }, [totalCaloriesConsumed, dailyCalorieIntake]);

    const resetCalories = async () => {
        if (!user) return;
        const newDate = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem(`dailyCalories_${user.uid}`, JSON.stringify([{ date: newDate, calories: 0 }]));
        setDailyCalories([{ date: newDate, calories: 0 }]);
        setTotalCaloriesConsumed(0);
        setCaloriesPercentage(0);
    };

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#000', textAlign: 'center' }}>Login to see Food Log</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Daily Food Log History</Text>
            
            {dailyCalories.length > 0 ? (
                <View style={styles.chartContainer}>
                    <LineChart
                        data={{
                            labels: dailyCalories.map(entry => entry.date), // Dates on X-axis
                            datasets: [
                                {
                                    data: dailyCalories.map(entry => entry.calories),
                                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Custom color
                                    strokeWidth: 2, // Optional: define stroke width
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 20}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=" kcal"
                        chartConfig={{
                            backgroundColor: '#e26a00',
                            backgroundGradientFrom: '#fb8c00',
                            backgroundGradientTo: '#ffa726',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: '#ffa726',
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                </View>
            ) : (
                <Text style={styles.legendText}>No calorie intake data available.</Text>
            )}
        </SafeAreaView>
    );
};

export default FoodLogHistory;
