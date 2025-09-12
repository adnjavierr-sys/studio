
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";

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
const storage = getStorage(app);
const auth = getAuth(app);

// Connect to Emulators if in development mode
if (typeof window !== 'undefined' && window.location.hostname === "localhost" && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  console.log("Connecting to Firebase Emulators...");
  try {
    // Check to make sure emulators are not already connected
    // @ts-ignore
    if (!db._settings.host) {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, "localhost", 9199);
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
      console.log("Successfully connected to Firebase Emulators.");
    }
  } catch (e) {
    console.error("Error connecting to Firebase emulators", e);
  }
}

export { app, db, storage, auth };
