
// src/lib/firebase-config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

let firebaseServices: FirebaseServices | null = null;

const firebaseConfig = {
  "projectId": "unoti-ticket-i9spt",
  "appId": "1:529378070793:web:4b753d9444c7dfbc50c3d8",
  "storageBucket": "unoti-ticket-i9spt.appspot.com",
  "apiKey": "AIzaSyDyeqPRhp8bdeGnlMayif1kmPnXEJUGR1Y",
  "authDomain": "unoti-ticket-i9spt.firebaseapp.com",
  "messagingSenderId": "529378070793",
};

export function initializeFirebase(): FirebaseServices | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (firebaseServices) {
    return firebaseServices;
  }
  
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  });

  const auth = getAuth(app);
  const storage = getStorage(app);

  firebaseServices = { app, db, auth, storage };
  
  return firebaseServices;
}
