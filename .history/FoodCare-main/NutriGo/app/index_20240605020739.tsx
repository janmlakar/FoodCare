import React, { useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView, StyleSheet, Animated, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import SearchForm from '../components/SearchForm';
import RecipeList from '../components/RecipeList';
import RecipeModal from '../components/RecipeModal';

SplashScreen.preventAutoHideAsync();

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
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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
    <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7d1b3b80e8d2d53ca65549228903a3261984aa03d64dd5545bca2690cd08a72d?' }}
          style={styles.headerImage}
        />
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
  },
  headerImage: {
    width: '100%',
    aspectRatio: 1.33,
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
    color: 'white',
    fontFamily: 'Poppins_700Bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  hideButton: {
    backgroundColor: '#6200ee',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  hideButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  showAllButton: {
    backgroundColor: '#4b0082',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  showAllButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
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
    backgroundColor: 'rgba(75, 0, 130, 0.4)',
    borderColor: 'rgba(75, 0, 130, 0.6)',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  optionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});

export default App;
