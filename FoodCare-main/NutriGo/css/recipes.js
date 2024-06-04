import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 220,
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#5A3D9A', // Purple
  },
  filters: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: '#7A4DFF', // Purple
  },
  filterButtonActive: {
    backgroundColor: '#9B63FF', // Lighter purple
  },
  healthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthButton: {
    padding: 10,
    borderRadius: 50,
    textAlign: 'center',
    marginBottom: 10,
    marginRight: 10,
    minWidth: '22%',
    backgroundColor: '#7A4DFF', // Purple
  },
  healthButtonActive: {
    backgroundColor: '#9B63FF', // Lighter purple
  },
  buttonText: {
    color: '#fff',
  },
  dietContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieLabel: {
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
  },
  calorieInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 100,
    color: '#fff',
    backgroundColor: '#5A3D9A', // Purple
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#7A4DFF', // Purple
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hideButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#7A4DFF', // Purple
  },
  recipeContainer: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#7A4DFF',
  },
  recipeContent: {
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  recipeSource: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
  },
  recipeText: {
    fontSize: 11,
    color: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  link: {
    color: '#cca8e9',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  ingredients: {
    marginTop: 10,
  },
  ingredientTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  ingredient: {
    fontSize: 14,
    marginVertical: 2,
    color: '#fff',
  },
  nutrientsContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientColumn: {
    width: '45%',
  },
  leftNutrientRow: {
    paddingRight: 10,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  divider: {
    width: '2%',
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#fff',
  },
  nutrientValue: {
    fontSize: 14,
    color: '#fff',
  },
  caloriesLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  caloriesValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  nutrientDotProtein: {
    color: 'green',
  },
  nutrientDotFat: {
    color: 'orange',
  },
  nutrientDotCarb: {
    color: 'red',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalScrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  imageModal: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  openButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: '100%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  testImage: {
    width: 24,
    height: 24,
  },
  gradientBackground: {
    flex: 1,
  },
  buttonActive: {
    backgroundColor: '#B47FD8', // Lighter purple for pressed state
  },
  searchButton: {
    backgroundColor: 'rgba(43, 0, 70, 0.8)', // Slightly transparent dark purple
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchButtonActive: {
    backgroundColor: '#FF69B4',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
