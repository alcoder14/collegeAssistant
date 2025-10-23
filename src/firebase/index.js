import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD77kWo2r6uXpOMq18QY8HHtXYt7jYhzNg",
  authDomain: "vpsmbproject1.firebaseapp.com",
  projectId: "vpsmbproject1",
  storageBucket: "vpsmbproject1.firebasestorage.app",
  messagingSenderId: "1042641129599",
  appId: "1:1042641129599:web:6c8b56df9c24272de6ef4a",
  measurementId: "G-985N8MRDKH"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

export { auth, db };
