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
  <View style={modalStyles.nutrientsContainer}>
    <View style={modalStyles.nutrientColumn}>
      <View style={[modalStyles.nutrientRow, modalStyles.leftNutrientRow]}>
        <Text style={modalStyles.nutrientLabel}>
          <Text style={modalStyles.nutrientDotProtein}>●</Text> Protein
        </Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.PROCNT.quantity)} g</Text>
      </View>
      <View style={[modalStyles.nutrientRow, modalStyles.leftNutrientRow]}>
        <Text style={modalStyles.nutrientLabel}>
          <Text style={modalStyles.nutrientDotFat}>●</Text> Fat
        </Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.FAT.quantity)} g</Text>
      </View>
      <View style={[modalStyles.nutrientRow, modalStyles.leftNutrientRow]}>
        <Text style={modalStyles.nutrientLabel}>
          <Text style={modalStyles.nutrientDotCarb}>●</Text> Carbs
        </Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.CHOCDF.quantity)} g</Text>
      </View>
      <View style={modalStyles.caloriesRow}>
        <Text style={modalStyles.caloriesLabel}>Calories:</Text>
        <Text style={modalStyles.caloriesValue}>{Math.round(calories)} kcal</Text>
      </View>
    </View>
    <View style={modalStyles.divider} />
    <View style={modalStyles.nutrientColumn}>
      <View style={modalStyles.nutrientRow}>
        <Text style={modalStyles.nutrientLabel}>Cholesterol</Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.CHOLE.quantity)} mg</Text>
      </View>
      <View style={modalStyles.nutrientRow}>
        <Text style={modalStyles.nutrientLabel}>Sodium</Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.NA.quantity)} mg</Text>
      </View>
      <View style={modalStyles.nutrientRow}>
        <Text style={modalStyles.nutrientLabel}>Calcium</Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.CA.quantity)} mg</Text>
      </View>
      <View style={modalStyles.nutrientRow}>
        <Text style={modalStyles.nutrientLabel}>Magnesium</Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.MG.quantity)} mg</Text>
      </View>
      <View style={modalStyles.nutrientRow}>
        <Text style={modalStyles.nutrientLabel}>Potassium</Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.K.quantity)} mg</Text>
      </View>
      <View style={modalStyles.nutrientRow}>
        <Text style={modalStyles.nutrientLabel}>Iron</Text>
        <Text style={modalStyles.nutrientValue}>{Math.round(nutrients.FE.quantity)} mg</Text>
      </View>
    </View>
  </View>
);

const RecipeModal: React.FC<RecipeModalProps> = ({ visible, onClose, recipe }) => {
  if (!recipe) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.modalContainerWrapper}>
          <LinearGradient
            colors={['#92a3fd', '#9dceff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={modalStyles.modalContainer}
          >
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
          </LinearGradient>
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
  modalContainerWrapper: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    padding: 20,
    borderRadius: 20,
  },
  modalScrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(300, 300, 300, 11)',
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
    marginBottom: 5,
  },
  leftNutrientRow: {
    marginRight: 20,
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
    marginTop: 5,
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
    marginHorizontal: 10,
  },
});

export default RecipeModal;
