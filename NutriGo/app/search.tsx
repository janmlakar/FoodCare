import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { gql, useLazyQuery } from '@apollo/client';
import FoodItem from '@/components/FoodItem';
import { useFood } from '@/components/FoodList';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';

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
    paddingTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
    backgroundColor: 'gainsboro',
    borderRadius: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 70,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  flatListContent: {
    gap: 5,
  },
  errorText: {
    color: 'red',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  searchButton: {
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
});

export default function Search() {
  const { user } = useUser();
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
          console.log('Scanned barcode:', data.data);
          runSearch({ variables: { upc: data.data } });
          setScannerEnabled(false);
        }} />
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
      <Link href="/tracker" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} />
        </TouchableOpacity>
      </Link>
      <View style={styles.inputContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
          style={styles.textInput}
        />
        <Ionicons onPress={() => setScannerEnabled(true)} name='barcode-outline' size={32} />
      </View>
      <TouchableOpacity onPress={performSearch} style={styles.button}>
        <LinearGradient colors={['#92A3FD', '#9DCEFF']} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </LinearGradient>
      </TouchableOpacity>
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.foodItemContainer}>
            <LinearGradient colors={['#92A3FD', '#9DCEFF']} style={styles.foodItemGradient}>
              <FoodItem
                item={item.food}
                onAddFood={() => {
                  addFoodItem({
                    foodId: item.food.foodId,
                    label: item.food.label,
                    nutrients: item.food.nutrients,
                    brand: item.food.brand,
                    userId: ''
                  });
                }}
              />
            </LinearGradient>
          </View>
        )}
       
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}
