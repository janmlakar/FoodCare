import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView, StyleSheet, Animated } from 'react-native';
import SearchForm from '../components/SearchForm';
import RecipeList from '../components/RecipeList';
import RecipeModal from '../components/RecipeModal';


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

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [healthLabels, setHealthLabels] = useState<string[]>([]);
  const [dietLabels, setDietLabels] = useState<string[]>([]);
  const [calories, setCalories] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const animatedValue = new Animated.Value(0);

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
    console.log('Fetching URL:', url);

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

  const hide = () => {
    setData(null);
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  startAnimation();

  const animatedStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.5],
    }),
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.glitterWrapper} pointerEvents="none">
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Recipe Search</Text>
            <SearchForm
              query={query}
              setQuery={setQuery}
              healthLabels={healthLabels}
              setHealthLabels={setHealthLabels}
              dietLabels={dietLabels}
              setDietLabels={setDietLabels}
              calories={calories}
              setCalories={setCalories}
              fetchRecipes={fetchRecipes}
            />
            {loading && <Text>Loading...</Text>}
            <RecipeList data={data} openModal={openModal} />
            {data && (
              <View style={styles.buttonRow}>
                <Animated.View style={[styles.hideButton, animatedStyle]}>
                  <TouchableOpacity onPress={hide}>
                    <Text style={styles.hideButtonText}>Hide</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </View>
          <RecipeModal visible={modalVisible} onClose={closeModal} recipe={selectedRecipe} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 100,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff', // Changed to white
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000', // Changed to black
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    flexWrap: 'wrap', // allows buttons to wrap to the next line if needed
  },
  hideButton: {
    backgroundColor: 'linear-gradient(274deg, #92a3fd 0%, #9dceff 124.45%)',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
    shadowColor: 'rgba(149, 173, 254, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
  },
  hideButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
  },
  showAllButton: {
    backgroundColor: 'linear-gradient(274deg, #92a3fd 0%, #9dceff 124.45%)',
    borderRadius: 99,
    paddingVertical: 18,
    paddingHorizontal: 60,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
    shadowColor: 'rgba(149, 173, 254, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
  },
  showAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
  },
  glitterWrapper: {
    position: 'absolute',
    width: '100%',
    height: 300,
    top: 0,
    left: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  optionButton: {
    backgroundColor: 'linear-gradient(274deg, #92a3fd 0%, #9dceff 124.45%)',
    borderColor: 'rgba(75, 0, 130, 0.6)',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 2, // Add elevation for Android
    shadowColor: 'rgba(149, 173, 254, 0.3)', // Add shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
  },
  optionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  inputField: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: '#000',
    marginBottom: 10,
  },
  inputFieldFocused: {
    borderColor: '#9dceff',
  },
});

export default App;
