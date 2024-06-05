import FoodItem from '@/components/FoodItem';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

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
`

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
});

export default function Search() {
  const [search, setSearch] = useState('');

  const [runSearch, {data, loading, error}] = useLazyQuery(query);

  const performSearch = () => {
    runSearch({ variables: { ingr: search } });
    //setSearch('');
  }

  //Apollo client statements

  /* if (loading) {
    return <ActivityIndicator />
  } */

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  console.log(JSON.stringify(data, null, 2));

  const items = data?.search?.hints || [];

  return (
    <View style={styles.container}>
      <TextInput value={search} onChangeText={setSearch} placeholder='Search...' style={styles.input} />
      {search && <Button title='Search' onPress={performSearch} />}
      {loading && <ActivityIndicator />}
      <FlatList
        data={items}
        renderItem={({ item }) => <FoodItem item={item} />}
        ListEmptyComponent={() => <Text>Search for food</Text>}
        contentContainerStyle={{ gap: 5 }}
      />
    </View>
  );



}