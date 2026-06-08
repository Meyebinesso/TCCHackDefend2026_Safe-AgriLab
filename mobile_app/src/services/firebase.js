import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDSuveaL3YwJsy29gjzFDatpXQ3EybSYjk",
  authDomain: "tetou-d8645.firebaseapp.com",
  projectId: "tetou-d8645",
  storageBucket: "tetou-d8645.firebasestorage.app",
  messagingSenderId: "241576154310",
  appId: "1:241576154310:web:9e4accfb3d9c114f7d33c7",
  measurementId: "G-95FPBNWK4H"
};

const app = initializeApp(firebaseConfig);

// Initialisation conditionnelle (Web vs Mobile)
let authInstance;
if (Platform.OS === 'web') {
  authInstance = getAuth(app); // Le web gère la mémoire tout seul
} else {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export const auth = authInstance;
export const db = getFirestore(app);

export default app;
