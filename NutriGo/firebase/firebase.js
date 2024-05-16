import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
