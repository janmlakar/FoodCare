import { AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useMutation, gql } from '@apollo/client';

const ADD_FOOD_TO_TRACKER = gql`
  mutation AddFoodToTracker($foodId: ID!, $quantity: Float!) {
    addFoodToTracker(foodId: $foodId, quantity: $quantity) {
      id
      foodId
      food {
        label
        brand
        nutrients {
          ENERC_KCAL
        }
      }
    }
  }
`;

const FoodItem = ({ item, onAddFood }: any ) => {
  const [addFoodToTracker] = useMutation(ADD_FOOD_TO_TRACKER);

  const handleAddFood = async () => {
    try {
      const { data } = await addFoodToTracker({
        variables: {
          foodId: item.food.foodId,
          quantity: 1, // You can adjust the quantity as needed
        },
      });
      console.log('Food added to tracker:', data.addFoodToTracker);
      onAddFood(); // Call the onAddFood function to update the UI
    } catch (error) {
      console.error('Error adding food to tracker:', error);
    }
  };

  return (
    <View style={{backgroundColor:'gainsboro', padding: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      <View style={{flex: 1, gap: 5}}>
        <Text>{item.food.label}</Text>
        <Text>{item.food.nutrients.ENERC_KCAL} cal, {item.food.brand}</Text>
      </View>
      <TouchableOpacity onPress={handleAddFood}>
        <AntDesign name="pluscircleo" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default FoodItem;