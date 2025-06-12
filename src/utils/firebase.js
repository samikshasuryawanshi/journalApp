// utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwRHbpKL_zVgvpbxpTljKcFeDlqMZFrrw",
  authDomain: "daily-journal-9db6c.firebaseapp.com",
  projectId: "daily-journal-9db6c",
  storageBucket: "daily-journal-9db6c.appspot.com",  // ✅ FIXED DOMAIN
  messagingSenderId: "937435869584",
  appId: "1:937435869584:web:dd48074f1ec4ccd1958315"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
