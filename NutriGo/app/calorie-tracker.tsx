import FoodItem from '@/components/FoodItem';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      padding: 10,
  },
});

export default function CalorieTracker() {
    return (
    //testni seznam
      <View style={styles.container}>
        <FoodItem item={{ label: 'Jabolko', cal: 120, brand: 'Podgrajšek'}}></FoodItem>
        <FoodItem item={{ label: 'Pica', cal: 680, brand: 'Lovska Koča'}}></FoodItem>
      </View>
    );



}