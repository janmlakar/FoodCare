import { Link } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, FlatList, Button } from "react-native";
import ScreenTemplate from "./ScreenTemplate";
import FoodItem from '../components/FoodItem'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        gap: 10,
        paddingTop: 50,
    },
    subtext: {
        fontSize: 18
    }
});

const foodItems = [
    { food: { label: 'Jabolko', nutrients: { ENERC_KCAL: 100 }, brand: 'Podgrajšek' } },
    { food: { label: 'Pica', nutrients: { ENERC_KCAL: 200 }, brand: 'Lovska Koča' } },
    { food: { label: 'Pomfri', nutrients: { ENERC_KCAL: 300 }, brand: 'McDonalds' } },
]

export default function Tracker() {
    return (
        <ScreenTemplate>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{ fontSize: 18, fontWeight: 600}}>Calories</Text>
                    <Text style={{ fontSize: 18, fontWeight: 600}}>2000-1500=500</Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 600}}>Today's Logged Food</Text>
                    <Link href="/search" asChild>
                        <Button title="ADD FOOD" />
                    </Link>
                    <FlatList
                        data={foodItems}
                        renderItem={({ item }) => <FoodItem item={item} />}
                    />
                </View>
            </SafeAreaView>
        </ScreenTemplate>
    )
}