// src/lib/firebase-config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

const firebaseConfig = {
    "projectId": "unoti-ticket-i9spt",
    "appId": "1:529378070793:web:4b753d9444c7dfbc50c3d8",
    "storageBucket": "unoti-ticket-i9spt.appspot.com",
    "apiKey": "AIzaSyDyeqPRhp8bdeGnlMayif1kmPnXEJUGR1Y",
    "authDomain": "unoti-ticket-i9spt.firebaseapp.com",
    "messagingSenderId": "529378070793",
    "measurementId": "G-56V52G5Z1R"
};

function initializeFirebaseServices(): FirebaseServices {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  return { app, db, auth, storage };
}

// Export a function that returns the services
export const getFirebaseServices = () => initializeFirebaseServices();

// For components that still use the direct 'db' export
const { db } = initializeFirebaseServices();
export { db };

// The initializeFirebase function can now simply return the services.
// This maintains compatibility with existing code that uses it.
export function initializeFirebase(): FirebaseServices {
  return getFirebaseServices();
}
