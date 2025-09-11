// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let db: Firestore;

// This function ensures we initialize the emulator connection only once.
const getDb = () => {
  if (!db) {
    db = getFirestore(app);
    if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("Connected to Firestore Emulator");
      } catch (e) {
        // The error "Firestore has already been started" can be safely ignored.
        // It happens on hot reloads in development.
        if (e instanceof Error && !e.message.includes('already been started')) {
          console.error("Error connecting to Firestore emulator", e);
        }
      }
    }
  }
  return db;
};

// Use the function to get the db instance
db = getDb();

export { app, db };
