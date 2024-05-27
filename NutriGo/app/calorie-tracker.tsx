import FoodItem, { FoodItemProps } from '@/components/FoodItem';
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
  },
});

const foodItems = [
  { label: 'Jabolko', cal: 120, brand: 'Podgrajšek' },
  { label: 'Pica', cal: 680, brand: 'Lovska Koča' },
  { label: 'Pomfri', cal: 350, brand: 'McDonalds' },
]

export default function CalorieTracker() {
    return (
    //testni seznam
      <View style={styles.container}>
        <FlatList
          data={foodItems}
          renderItem={({ item }: FoodItemProps) => <FoodItem item={item} />}
          contentContainerStyle={{ gap: 5}}
          />
      </View>
    );



}