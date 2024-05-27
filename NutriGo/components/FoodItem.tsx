import { AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet } from 'react-native'

type FoodItemProps = {
    item: {
        label: string;
        cal: number;
        brand: string;
    };
};

const FoodItem = ({ item } : FoodItemProps) => {
        return (
                <View style={{backgroundColor:'gainsboro', padding: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flex: 1, gap: 5}}>
                    <Text>{item.label}</Text>
                    <Text>{item.cal} cal, {item.brand}</Text>
                    </View>
                    <AntDesign name="pluscircleo" size={24} />
                </View>
        );
    };
    
  export default FoodItem;