import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from './/index';


const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get the authentication instance
const auth = getAuth(app);

// Get the persistence type using AsyncStorage
const localPersistence = getReactNativePersistence(ReactNativeAsyncStorage);

// Set the persistence for Firebase Authentication
setPersistence(auth, localPersistence);

export { auth };
