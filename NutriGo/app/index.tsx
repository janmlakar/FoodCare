import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView, StyleSheet, Animated, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import ErrorBoundary from 'react-native-error-boundary';
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
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [healthLabels, setHealthLabels] = useState<string[]>([]);
  const [dietLabels, setDietLabels] = useState<string[]>([]);
  const [calories, setCalories] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (fontsLoaded) {
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
        ])
      ).start();
    }
  }, [fontsLoaded, animatedValue]);

  useEffect(() => {
    if (loading) {
      scrollViewRef.current?.scrollTo({
        y: screenHeight * 1,
        animated: true,
      });
    }
  }, [loading, screenHeight]);

  const fetchRecipes = () => {
    if (!query && healthLabels.length === 0 && dietLabels.length === 0 && !calories) {
      alert('Please enter a search term or select a filter.');
      return;
    }

    setLoading(true);
    setRecipes(null);
    setErrorMessage('');

    const params = new URLSearchParams();
    params.append('app_id', '900da95e');
    params.append('app_key', '40698503668e0bb3897581f4766d77f9');
    params.append('q', query);

    if (healthLabels.length > 0) {
      healthLabels.forEach((label) => params.append('health', label));
    }
    if (dietLabels.length > 0) {
      dietLabels.forEach((label) => params.append('diet', label));
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
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Food with that parameters not found, try other filters');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.hits.length > 0) {
          const filteredRecipes = data.hits
            .map((hit: any) => hit.recipe)
            .filter((recipe: Recipe) => !calories || recipe.calories <= parseFloat(calories));
          setRecipes(filteredRecipes);
        } else {
          setRecipes([]);
          setErrorMessage('No such recipes found');
        }
        setLoading(false);
      })
      .catch((error) => {
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

  const animatedStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.5],
    }),
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.glitterWrapper} pointerEvents="none"></View>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent}>
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
            {loading && <Image style={styles.splashImage} source={require('../assets/images/fruit.gif')} />}
            {!loading && recipes && recipes.length > 0 && <RecipeList data={recipes} openModal={openModal} />}
            {!loading && recipes && recipes.length === 0 && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            {recipes && (
              <View style={styles.buttonRow}>
                <Animated.View style={[styles.hideButton, animatedStyle]}>
                  <TouchableOpacity onPress={() => setRecipes(null)}>
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
  splashImage: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 100,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff', // Ensure background is white
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'SpaceMono-Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  hideButton: {
    backgroundColor: '#ADA4A5',
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
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Ensure background is white
  },
});

const AppWithErrorBoundary: React.FC = () => (
  <ErrorBoundary onError={(error: Error) => console.error('Error caught by ErrorBoundary:', error)}>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
