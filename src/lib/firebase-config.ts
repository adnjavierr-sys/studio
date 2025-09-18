
// src/lib/firebase-config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, initializeFirestore } from 'firebase/firestore';
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
  "databaseId": "unoti-ticket-i9spt"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = initializeFirestore(app, {
  databaseId: "unoti-ticket-i9spt"
});
export const auth = getAuth(app);
export const storage = getStorage(app);

let firebaseServices: FirebaseServices | null = null;

export function initializeFirebase(): FirebaseServices {
  if (firebaseServices) {
    return firebaseServices;
  }
  
  firebaseServices = { app, db, auth, storage };
  
  return firebaseServices;
}
