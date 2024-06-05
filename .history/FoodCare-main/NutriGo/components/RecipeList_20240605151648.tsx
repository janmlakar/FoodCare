import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
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

interface RecipeListProps {
  data: Recipe[] | null;
  openModal: (recipe: Recipe) => void;
}

const renderNutrients = (nutrients: any, calories: number) => (
  <View style={localStyles.nutrientsContainer}>
    <View style={localStyles.nutrientColumn}>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>
          <Text style={localStyles.nutrientDotProtein}>●</Text> Protein
        </Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.PROCNT.quantity)} g</Text>
      </View>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>
          <Text style={localStyles.nutrientDotFat}>●</Text> Fat
        </Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.FAT.quantity)} g</Text>
      </View>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>
          <Text style={localStyles.nutrientDotCarb}>●</Text> Carbs
        </Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.CHOCDF.quantity)} g</Text>
      </View>
      <View style={localStyles.caloriesRow}>
        <Text style={localStyles.caloriesLabel}>Calories:</Text>
        <Text style={localStyles.caloriesValue}>{Math.round(calories)} kcal</Text>
      </View>
    </View>
    <View style={localStyles.divider} />
    <View style={localStyles.nutrientColumn}>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>Cholesterol</Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.CHOLE.quantity)} mg</Text>
      </View>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>Sodium</Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.NA.quantity)} mg</Text>
      </View>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>Calcium</Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.CA.quantity)} mg</Text>
      </View>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>Magnesium</Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.MG.quantity)} mg</Text>
      </View>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>Potassium</Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.K.quantity)} mg</Text>
      </View>
      <View style={localStyles.nutrientRow}>
        <Text style={localStyles.nutrientLabel}>Iron</Text>
        <Text style={localStyles.nutrientValue}>{Math.round(nutrients.FE.quantity)} mg</Text>
      </View>
    </View>
  </View>
);

const RecipeList: React.FC<RecipeListProps> = ({ data, openModal }) => {
  return (
    <View>
      {data && data.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => openModal(item)}>
          <LinearGradient
            colors={index % 2 === 0 ? ['#92a3fd', '#9dceff'] : ['#C58BF2', '#EEA4CE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[localStyles.recipeContainer, { opacity: 2 }]}
          >
            <Image source={{ uri: item.image }} style={localStyles.image} />
            <View style={localStyles.recipeContent}>
              <Text style={localStyles.recipeTitle}>{item.label}</Text>
              {renderNutrients(item.totalNutrients, item.calories)}
              <Text style={localStyles.recipeSource}>Source: {item.source}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const localStyles = StyleSheet.create({
  recipeContainer: {
    borderRadius: 20,
    marginVertical: 15,
    padding: 15,
    overflow: 'hidden',
    shadowColor: 'rgba(149, 173, 254, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  recipeContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  recipeSource: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  nutrientsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nutrientColumn: {
    flex: 1,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#fff',
  },
  nutrientValue: {
    fontSize: 14,
    color: '#fff',
  },
  nutrientDotProtein: {
    color: '#ff6347',
  },
  nutrientDotFat: {
    color: '#ffa500',
  },
  nutrientDotCarb: {
    color: '#1e90ff',
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  caloriesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  caloriesValue: {
    fontSize: 14,
    color: '#fff',
  },
  divider: {
    width: 1,
    backgroundColor: '#fff',
    marginHorizontal: 15,
  },
});

export default RecipeList;
