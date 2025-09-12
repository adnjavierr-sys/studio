
// src/lib/firebase-config.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

// Singleton de servicios de Firebase para evitar reinicializaciones.
let firebaseServices: FirebaseServices | null = null;

export function initializeFirebase(): FirebaseServices | null {
  // Solo ejecutar en el lado del cliente.
  if (typeof window === 'undefined') {
    return null;
  }

  // Si ya está inicializado, devolver la instancia existente.
  if (firebaseServices) {
    return firebaseServices;
  }
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Validar que la configuración esté presente
  if (!firebaseConfig.projectId) {
    console.error("Firebase config is not set. Please check your .env.local file.");
    return null;
  }
  
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  firebaseServices = { app, db, auth, storage };
  
  return firebaseServices;
}
