// search.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { gql, useLazyQuery } from '@apollo/client';
import FoodItem from '@/components/FoodItem';
import { useFood } from '@/components/FoodList';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

const query = gql`
query search($ingr: String, $upc: String) {
  search(ingr: $ingr, upc: $upc) {
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
    flex: 1,
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
  const [scannerEnabled, setScannerEnabled] = useState(false);

  const [runSearch, { data, loading, error }] = useLazyQuery(query);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Camera loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const performSearch = () => {
    runSearch({ variables: { ingr: search } });
  };

  if (scannerEnabled) {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <CameraView style={{ width: '100%', height: '100%' }} onBarcodeScanned={(data) => {
          runSearch({ variables: { upc: data.data } });
          setScannerEnabled(false);
        }}/>
        <Ionicons
          onPress={() => setScannerEnabled(false)}
          name="close-circle-outline"
          size={32}
          color="dimgray"
          style={{ position: 'absolute', right: 10, top: 10 }}
        />
      </View>
    );
  }

  const items = data?.search?.hints || [];

  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
          style={styles.input}
        />
        <Ionicons onPress={() => setScannerEnabled(true)} name='barcode-outline' size={32} />
      </View>
      <View style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10,
      }}>
        <Link href="/tracker" asChild>
          <TouchableOpacity >
            <View>
              <Ionicons name="arrow-back-outline" size={24} />
            </View>
          </TouchableOpacity>
        </Link>
        <View>
          <Button title="Search" onPress={performSearch} />
        </View>
      </View>
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