// FoodItem.tsx
import { AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FoodItem = ({ item, onAddFood, onRemoveFood, isAdded }: { item: any, onAddFood?: () => void, onRemoveFood?: () => void, isAdded?: boolean }) => {
  const handleAddFood = async () => {
    try {
      await onAddFood?.();
      console.log('Food added to tracker');
    } catch (error) {
      console.error('Error adding food to tracker:', error);
    }
  };

  const handleRemoveFood = async () => {
    try {
      await onRemoveFood?.();
      console.log('Food removed from tracker');
    } catch (error) {
      console.error('Error removing food from tracker:', error);
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
          {isAdded ? (
            <TouchableOpacity onPress={handleRemoveFood}>
              <AntDesign name="minuscircleo" size={24} color={"#ff6347"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleAddFood}>
              <AntDesign name="pluscircleo" size={24} color={"#3279a8"} />
            </TouchableOpacity>
          )}
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
