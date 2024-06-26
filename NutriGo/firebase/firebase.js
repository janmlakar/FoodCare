import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBf_udv4BtcZshxjCBlgXZsQAnnKmFPeCU',
  authDomain: 'nutrigo-57bfa.firebaseapp.com',
  projectId: 'nutrigo-57bfa',
  storageBucket: 'nutrigo-57bfa.appspot.com',
  messagingSenderId: '260433369104',
  appId: '1:260433369104:web:b70f62ca2a479b3d5f9295',
  measurementId: 'G-3Y1T1MEP3W'
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, firestore, firebaseConfig };
