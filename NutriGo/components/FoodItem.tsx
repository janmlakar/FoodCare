import { AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet } from 'react-native'



const FoodItem = ({ item }: any ) => {
        return (
                <View style={{backgroundColor:'gainsboro', padding: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flex: 1, gap: 5}}>
                    <Text>{item.food.label}</Text>
                    <Text>{item.food.nutrients.ENERC_KCAL} cal, {item.food.brand}</Text>
                    </View>
                    <AntDesign name="pluscircleo" size={24} />
                </View>
        );
    };

  export default FoodItem;