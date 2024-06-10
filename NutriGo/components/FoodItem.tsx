// FoodItem.tsx
import { AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FoodItem = ({ item, onAddFood }: { item: any, onAddFood: () => void }) => {
  const handleAddFood = async () => {
      try {
          await onAddFood();
          console.log('Food added to tracker');
      } catch (error) {
          console.error('Error adding food to tracker:', error);
      }
  };

  return (
      <View style={styles.container}>
          {item && item.label && (
              <>
                  <View style={styles.infoContainer}>
                      <Text>{item.label}</Text>
                      <Text>{item.nutrients.ENERC_KCAL} cal, {item.brand}</Text>
                  </View>
                  <TouchableOpacity onPress={handleAddFood}>
                      <AntDesign name="pluscircleo" size={24} color={"#3279a8"}/>
                  </TouchableOpacity>
              </>
          )}
      </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gainsboro',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 5,
  },
});

export default FoodItem;
