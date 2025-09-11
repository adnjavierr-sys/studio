
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Connect to Firestore Emulator only when in development/emulator mode.
if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  console.log("Connecting to Firestore Emulator at 127.0.0.1:8080");
  try {
     // The host and port must match the configuration in firebase.json
     connectFirestoreEmulator(db, '127.0.0.1', 8080);
     console.log("Successfully connected to Firestore Emulator.");
  } catch (e) {
     console.error("Error connecting to Firestore emulator", e);
  }
}

export { app, db };
