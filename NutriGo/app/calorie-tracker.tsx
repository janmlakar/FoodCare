import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CalorieTracker: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={{width: '100%', backgroundColor:'gainsboro', padding: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flex: 1, gap: 5}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'purple'}}>Jabolko</Text>
        <Text style={{color: '#958'}}>200 kcal, Sladki grič</Text>
        </View>
        <AntDesign name="pluscircleo" size={24} color="purple" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
});

export default CalorieTracker;
