import 'expo-router/entry';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Linking,
  TouchableHighlight,
  ScrollView,
  Button,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Recipe {
  label: string;
  image: string;
  calories: number;
  totalNutrients: {
    PROCNT: { quantity: number };
    FAT: { quantity: number };
    CHOCDF: { quantity: number };
    CHOLE: { quantity: number };
    NA: { quantity: number };
    CA: { quantity: number };
    MG: { quantity: number };
    K: { quantity: number };
    FE: { quantity: number };
  };
  source: string;
  url: string;
  ingredientLines: string[];
}

const dietOptions = [
  'balanced',
  'high-fiber',
  'high-protein',
  'low-carb',
  'low-fat',
  'low-sodium',
];

const healthOptions = [
  'low-potassium',
  'no-oil-added',
  'paleo',
  'pescatarian',
  'pork-free',
  'red-meat-free',
  'sugar-conscious',
  'vegetarian',
  'gluten-free',
  'dairy-free',
  'peanut-free',
  'tree-nut-free',
  'low-sugar',
  'keto-friendly',
  'kidney-friendly',
  'kosher',
  'vegan',
];

export default function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [healthLabels, setHealthLabels] = useState<string[]>([]);
  const [dietLabels, setDietLabels] = useState<string[]>([]);
  const [calories, setCalories] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const toggleLabel = (label: string, setLabels: React.Dispatch<React.SetStateAction<string[]>>) => {
    setLabels(prevLabels =>
      prevLabels.includes(label) ? prevLabels.filter(l => l !== label) : [...prevLabels, label]
    );
  };

  const fetchRecipes = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('app_id', '900da95e');
    params.append('app_key', '40698503668e0bb3897581f4766d77f9');
    params.append('q', query);

    if (healthLabels.length > 0) {
      healthLabels.forEach(label => params.append('health', label));
    }
    if (dietLabels.length > 0) {
      dietLabels.forEach(label => params.append('diet', label));
    }
    if (calories) {
      params.append('calories', `0-${calories}`);
    }

    const url = `https://api.edamam.com/search?${params.toString()}`;
    console.log('Fetching URL:', url); // Za preverjanje končnega URL-ja

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Food with that parameters not found, try other filters');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.hits) {
          const filteredRecipes = data.hits.map((hit: any) => hit.recipe).filter((recipe: Recipe) => !calories || recipe.calories <= parseFloat(calories));
          setData(filteredRecipes);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
        alert(error.message);
      });
  };

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeImages = () => {
    setData(null);
  };

  const renderNutrients = (nutrients: any, calories: number) => (
    <View style={styles.nutrientsContainer}>
      <View style={styles.nutrientColumn}>
        <View style={[styles.nutrientRow, styles.leftNutrientRow]}>
          <Text style={styles.nutrientLabel}>
            <Text style={styles.nutrientDotProtein}>●</Text> Protein
          </Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.PROCNT.quantity)} g</Text>
        </View>
        <View style={[styles.nutrientRow, styles.leftNutrientRow]}>
          <Text style={styles.nutrientLabel}>
            <Text style={styles.nutrientDotFat}>●</Text> Fat
          </Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.FAT.quantity)} g</Text>
        </View>
        <View style={[styles.nutrientRow, styles.leftNutrientRow]}>
          <Text style={styles.nutrientLabel}>
            <Text style={styles.nutrientDotCarb}>●</Text> Carbs
          </Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.CHOCDF.quantity)} g</Text>
        </View>
        <View style={styles.caloriesRow}>
          <Text style={styles.caloriesLabel}>Calories:</Text>
          <Text style={styles.caloriesValue}>{Math.round(calories)} kcal</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.nutrientColumn}>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Cholesterol</Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.CHOLE.quantity)} mg</Text>
        </View>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Sodium</Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.NA.quantity)} mg</Text>
        </View>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Calcium</Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.CA.quantity)} mg</Text>
        </View>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Magnesium</Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.MG.quantity)} mg</Text>
        </View>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Potassium</Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.K.quantity)} mg</Text>
        </View>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Iron</Text>
          <Text style={styles.nutrientValue}>{Math.round(nutrients.FE.quantity)} mg</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Recipe Search</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ingredient"
          value={query}
          onChangeText={setQuery}
        />
        <View style={styles.filters}>
          <Text style={styles.filterTitle}>Health</Text>
          <View style={styles.healthContainer}>
            {healthOptions.map(label => (
              <TouchableOpacity key={label} onPress={() => toggleLabel(label, setHealthLabels)}>
                <Text
                  style={[
                    styles.healthButton,
                    { backgroundColor: healthLabels.includes(label) ? '#cca8e9' : '#cadefc' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.filters}>
          <Text style={styles.filterTitle}>Diets</Text>
          {dietOptions.map(label => (
            <TouchableOpacity key={label} onPress={() => toggleLabel(label, setDietLabels)}>
              <Text
                style={[
                  styles.filterButton,
                  { backgroundColor: dietLabels.includes(label) ? '#cca8e9' : '#cadefc' },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieLabel}>Max Calories:</Text>
          <TextInput
            style={styles.calorieInput}
            placeholder="e.g. 500"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={fetchRecipes}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        {loading && <Text>Loading...</Text>}
        {data && data.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => openModal(item)}>
            <LinearGradient
              colors={['#e6e6fa', '#ffe4e1']}
              style={styles.recipeContainer}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{item.label}</Text>
                {renderNutrients(item.totalNutrients, item.calories)}
                <Text style={styles.recipeSource}>Source: {item.source}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
        {data && <Button title="Close Images" onPress={closeImages} />}
      </View>
      {selectedRecipe && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalScrollViewContent}>
                <Text style={styles.modalTitle}>{selectedRecipe.label}</Text>
                <Image source={{ uri: selectedRecipe.image }} style={styles.imageModal} />
                {renderNutrients(selectedRecipe.totalNutrients, selectedRecipe.calories)}
                <Text style={styles.modalText}>Source: {selectedRecipe.source}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(selectedRecipe.url)}>
                  <Text style={styles.link}>View Full Recipe</Text>
                </TouchableOpacity>
                {selectedRecipe.ingredientLines && (
                  <View style={styles.ingredients}>
                    <Text style={styles.ingredientTitle}>Ingredients:</Text>
                    {selectedRecipe.ingredientLines.map((line, index) => (
                      <Text key={index} style={styles.ingredient}>
                        {line}
                      </Text>
                    ))}
                  </View>
                )}
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: '#cca8e9' }}
                  onPress={closeModal}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#cca8e9',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  filters: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
    marginRight: 10,
  },
  healthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthButton: {
    padding: 10,
    borderRadius: 50,
    textAlign: 'center',
    marginBottom: 10,
    marginRight: 10,
    minWidth: '22%',
  },
  dietContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dietButton: {
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
    marginRight: 10,
    minWidth: '22%',
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieLabel: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  calorieInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 100,
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#cca8e9',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeContainer: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  recipeContent: {
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000000',
  },
  recipeSource: {
    fontSize: 14,
    color: '#000000',
    marginTop: 10,
  },
  recipeText: {
    fontSize: 14,
    color: '#000000',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  link: {
    color: '#cca8e9',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  ingredients: {
    marginTop: 10,
  },
  ingredientTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  ingredient: {
    fontSize: 14,
    marginVertical: 2,
  },
  nutrientsContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientColumn: {
    width: '45%',
  },
  leftNutrientRow: {
    paddingRight: 10,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  divider: {
    width: '2%',
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#000000',
  },
  nutrientValue: {
    fontSize: 14,
    color: '#000000',
  },
  caloriesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  caloriesValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  nutrientDotProtein: {
    color: 'green',
  },
  nutrientDotFat: {
    color: 'orange',
  },
  nutrientDotCarb: {
    color: 'red',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalScrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  imageModal: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  openButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: '100%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
