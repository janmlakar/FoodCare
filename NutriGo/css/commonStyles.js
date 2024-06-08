import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000', // Changed to black
    fontFamily: 'SpaceMono-Regular', // Add this line to use the custom font
  },
});