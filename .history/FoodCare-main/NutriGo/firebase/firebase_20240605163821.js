import { getAuth, setPersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from './firebaseUtils';

const firebaseConfig = {
  apiKey: 'AIzaSyBf_udv4BtcZshxjCBlgXZsQAnnKmFPeCU',
  authDomain: 'nutrigo-57bfa.firebaseapp.com',
  projectId: 'nutrigo-57bfa',
  storageBucket: 'nutrigo-57bfa.appspot.com',
  messagingSenderId: '260433369104',
  appId: '1:260433369104:web:b70f62ca2a479b3d5f9295',
  measurementId: 'G-3Y1T1MEP3W'
};

const auth = getAuth(app);

// Get the persistence type using AsyncStorage
const localPersistence = getReactNativePersistence(ReactNativeAsyncStorage);

// Set the persistence for Firebase Authentication
setPersistence(auth, localPersistence);

export { auth };