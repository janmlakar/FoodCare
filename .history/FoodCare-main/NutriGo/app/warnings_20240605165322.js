
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  '@firebase/auth: Auth (10.12.1): You are initializing Firebase Auth for React Native without providing AsyncStorage.',
]);

