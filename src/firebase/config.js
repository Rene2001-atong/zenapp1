import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Note : La configuration réelle ne devrait pas être stockée ici dans un projet de production.
// Utilisez des variables d'environnement pour plus de sécurité.
const firebaseConfig = {
    apiKey: "AIzaSyBniZVBUu-v_T9f6lbZYxsxHmxfTFDS8x8", // Remplacez par votre configuration
    authDomain: "zencom-3ddaf.firebaseapp.com",
    projectId: "zencom-3ddaf",
    storageBucket: "zencom-3ddaf.firebasestorage.app",
    messagingSenderId: "1081534381257",
    appId: "1:1081534381257:web:3db66930d08a0af7892118",
  measurementId: "G-GEXYLTKNWB"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId= firebaseConfig.appId;

export { db, auth, appId, firebaseConfig };