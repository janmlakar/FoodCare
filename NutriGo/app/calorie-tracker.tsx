import FoodItem, { FoodItemProps } from '@/components/FoodItem';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { useState } from 'react';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
      gap: 10,
  },
  input: {
      padding: 10,
      backgroundColor: 'gainsboro',
      borderRadius: 20,
  },
});

const foodItems = [
  { label: 'Jabolko', cal: 120, brand: 'Podgrajšek' },
  { label: 'Pica', cal: 680, brand: 'Lovska Koča' },
  { label: 'Pomfri', cal: 350, brand: 'McDonalds' },
]

export default function CalorieTracker() {
    const [search, setSearch] = useState('');

    const performSearch = () => {
      console.log('Searching for:', search);
      setSearch('');
    }

    return (
    //testni seznam
      <View style={styles.container}>
        <TextInput value={search} onChangeText={setSearch} placeholder='Search...' style={styles.input}/>
        {search && <Button title='Search' onPress={performSearch} />}
        <FlatList
          data={foodItems}
          renderItem={({ item }: FoodItemProps) => <FoodItem item={item} />}
          contentContainerStyle={{ gap: 5}}
          />
      </View>
    );



}