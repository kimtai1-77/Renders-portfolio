// Firebase Configuration
// This file loads configuration from environment variables
// Never commit the .env file to version control

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || window.__FIREBASE_CONFIG__?.apiKey,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "architectural-renders.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "architectural-renders",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "architectural-renders.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "229311854317",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:229311854317:web:9b246ffca49b756f08bee4",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3S4GC0DVQH"
};

export default firebaseConfig;
