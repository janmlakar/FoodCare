import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../css/recipes';

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

const RecipeList: React.FC<RecipeListProps> = ({ data, openModal }) => {
  return (
    <View>
      {data && data.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => openModal(item)}>
          <LinearGradient
            colors={['#2e004e', '#240036', '#1a0024']} // Dark purple gradient colors
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
    </View>
  );
};

export default RecipeList;
