import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SearchFormProps {
  query: string;
  setQuery: (query: string) => void;
  healthLabels: string[];
  setHealthLabels: React.Dispatch<React.SetStateAction<string[]>>;
  dietLabels: string[];
  setDietLabels: React.Dispatch<React.SetStateAction<string[]>>;
  calories: string;
  setCalories: (calories: string) => void;
  fetchRecipes: () => void;
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

const SearchForm: React.FC<SearchFormProps> = ({
  query,
  setQuery,
  healthLabels = [],
  setHealthLabels,
  dietLabels = [],
  setDietLabels,
  calories,
  setCalories,
  fetchRecipes,
}) => {
  const shimmerAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // Numeric values for translateX
  });

  const toggleLabel = useCallback((label: string, setLabels: React.Dispatch<React.SetStateAction<string[]>>) => {
    setLabels(prevLabels =>
      prevLabels.includes(label) ? prevLabels.filter(l => l !== label) : [...prevLabels, label]
    );
  }, []);

  const renderLabel = useCallback(({ item, setLabels, labels }: { item: string, setLabels: React.Dispatch<React.SetStateAction<string[]>>, labels: string[] }) => (
    <TouchableOpacity
      onPress={() => toggleLabel(item, setLabels)}
      style={localStyles.labelButtonContainer}
    >
      <LinearGradient
        colors={labels.includes(item) ? ['#92a3fd', '#9dceff'] : ['lightgray', 'lightgray']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={localStyles.gradientBackground}
      >
        <Text style={labels.includes(item) ? localStyles.labelButtonTextSelected : localStyles.labelButtonText}>
          {item}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  ), [toggleLabel]);

  const MemoizedLabel = React.memo(renderLabel);

  return (
    <View>
      <View style={localStyles.inputContainer}>
        <LinearGradient
          colors={['#92a3fd', '#9dceff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={localStyles.gradientBorder}
        >
          <View style={localStyles.inputWrapper}>
            <TextInput
              style={localStyles.input}
              placeholder="Add ingredient"
              placeholderTextColor="#ccc"
              value={query}
              onChangeText={setQuery}
            />
            <Animated.View
              style={[
                localStyles.shimmerOverlay,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      <View style={localStyles.labelContainer}>
        <Text style={localStyles.label}>Health Labels:</Text>
        <View style={localStyles.labels}>
          {healthOptions.map((label) => (
            <MemoizedLabel key={label} item={label} setLabels={setHealthLabels} labels={healthLabels} />
          ))}
        </View>
      </View>

      <View style={localStyles.labelContainer}>
        <Text style={localStyles.label}>Diet Labels:</Text>
        <View style={localStyles.labels}>
          {dietOptions.map((label) => (
            <MemoizedLabel key={label} item={label} setLabels={setDietLabels} labels={dietLabels} />
          ))}
        </View>
      </View>

      <View style={localStyles.smallInputContainer}>
        <LinearGradient
          colors={['#92a3fd', '#9dceff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={localStyles.gradientBorder}
        >
          <View style={localStyles.smallInputWrapper}>
            <TextInput
              style={localStyles.input}
              placeholder="Max Calories"
              placeholderTextColor="#ccc"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
            <Animated.View
              style={[
                localStyles.shimmerOverlay,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      <TouchableOpacity
        style={localStyles.searchButtonContainer}
        onPress={fetchRecipes}
        activeOpacity={0.7}
      >
        <View style={localStyles.searchButton}>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            style={[
              localStyles.shimmerOverlay,
              { transform: [{ translateX: shimmerTranslate }] },
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Text style={localStyles.searchButtonText}>Search</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
  },
  smallInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
    width: '50%', // Make the container half the width
  },
  gradientBorder: {
    flex: 1,
    padding: 2,
    borderRadius: 25,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Changed to white
    borderRadius: 25,
    flex: 1,
    overflow: 'hidden',
  },
  smallInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Changed to white
    borderRadius: 25,
    flex: 1,
    overflow: 'hidden',
    width: '100%', // Ensure it takes full width of the container
  },
  input: {
    flex: 1,
    backgroundColor: '#fff', // Changed to white
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    color: '#000', // Text color changed to black
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  labelContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black', // Changed to black
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  labelButtonContainer: {
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 20,
    overflow: 'hidden', // Ensure the gradient stays within the borders
  },
  gradientBackground: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelButtonText: {
    color: 'black', // Changed to black
    textAlign: 'center',
  },
  labelButtonTextSelected: {
    color: 'white', // Text color for selected state
    textAlign: 'center',
  },
  searchButtonContainer: {
    marginVertical: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  searchButton: {
    backgroundColor: 'linear-gradient(274deg, #92a3fd 0%, #9dceff 124.45%)', // Gradient background
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(149, 173, 254, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
  },
});

export default SearchForm;
