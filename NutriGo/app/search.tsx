// search.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, ActivityIndicator } from 'react-native';
import { gql, useLazyQuery } from '@apollo/client';
import FoodItem from '@/components/FoodItem';
import { useFood } from '@/components/FoodList';

const query = gql`
query search($ingr: String) {
  search(ingr: $ingr) {
    text
    hints {
      food {
        label
        brand
        foodId
        nutrients {
          ENERC_KCAL
        }
      }
    }
  }
}
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    gap: 10,
    paddingTop: 50,
  },
  input: {
    padding: 10,
    backgroundColor: 'gainsboro',
    borderRadius: 20,
  },
  flatListContent: {
    gap: 5,
  },
  errorText: {
    color: 'red',
  },
});

export default function Search() {
  const [search, setSearch] = useState('');
  const { addFoodItem } = useFood();

  const [runSearch, { data, loading, error }] = useLazyQuery(query);

  const performSearch = () => {
    runSearch({ variables: { ingr: search } });
  };

  const items = data?.search?.hints || [];

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search..."
        style={styles.input}
      />
      {search && <Button title="Search" onPress={performSearch} />}
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <FoodItem
            item={item.food}
            onAddFood={() => {
              addFoodItem({
                foodId: item.food.foodId,
                label: item.food.label,
                nutrients: item.food.nutrients,
                brand: item.food.brand,
              });
            }}
          />
        )}
        ListEmptyComponent={() => !loading && <Text>Search for food</Text>}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}
