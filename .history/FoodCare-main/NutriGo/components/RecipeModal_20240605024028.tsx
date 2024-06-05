import React from 'react';
import { View, Text, Image, Modal, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
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

interface RecipeModalProps {
  visible: boolean;
  onClose: () => void;
  recipe: Recipe | null;
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

const RecipeModal: React.FC<RecipeModalProps> = ({ visible, onClose, recipe }) => {
  if (!recipe) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.modalContainer}>
          <ScrollView contentContainerStyle={modalStyles.modalScrollViewContent}>
            <Text style={modalStyles.modalTitle}>{recipe.label}</Text>
            <Image source={{ uri: recipe.image }} style={modalStyles.imageModal} />
            {renderNutrients(recipe.totalNutrients, recipe.calories)}
            <Text style={modalStyles.modalText}>Source: {recipe.source}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(recipe.url)}>
              <Text style={modalStyles.link}>View Full Recipe</Text>
            </TouchableOpacity>
            {recipe.ingredientLines && (
              <View style={modalStyles.ingredients}>
                <Text style={modalStyles.ingredientTitle}>Ingredients:</Text>
                {recipe.ingredientLines.map((line, index) => (
                  <Text key={index} style={modalStyles.ingredient}>
                    {line}
                  </Text>
                ))}
              </View>
            )}
            <TouchableOpacity style={modalStyles.closeButtonContainer} onPress={onClose}>
              <LinearGradient
                colors={['#92a3fd', '#9dceff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={modalStyles.closeButton}
              >
                <Text style={modalStyles.closeButtonText}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
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
    backgroundColor: '#1a0024', // Adjusted to match the gradient
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff', // Changed to white
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#ffffff', // Changed to white
  },
  imageModal: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  closeButtonContainer: {
    marginVertical: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  closeButton: {
    borderRadius: 99,
    paddingVertical: 18,
    paddingHorizontal: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(149, 173, 254, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    color: '#ffffff', // Changed to white
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  ingredients: {
    marginTop: 10,
  },
  ingredientTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // Changed to white
  },
  ingredient: {
    fontSize: 14,
    marginVertical: 2,
    color: '#ffffff', // Changed to white
  },
});

export default RecipeModal;
