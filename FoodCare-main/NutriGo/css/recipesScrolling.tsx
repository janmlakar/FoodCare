import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, VirtualizedList } from 'react-native';

interface Item {
  key: string;
  text: string;
}

const MyComponent = () => {
  const data: Item[] = Array.from({ length: 100 }, (_, index) => ({ key: String(index), text: `Item ${index}` }));

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <Text>{item.text}</Text>
    </View>
  );

  const handlePress = () => {
    // Handle the button press
    console.log('Button pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchButtonContainer} onPress={handlePress}>
        <View style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </View>
      </TouchableOpacity>
      <VirtualizedList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 60, // Adjust padding to leave space for the button
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 0, // Positioned at the very top of the screen
    left: 0,
    right: 0,
    height: 60, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensure it's above other components
  },
  searchButton: {
    backgroundColor: '#ff007f',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff007f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 30,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MyComponent;
