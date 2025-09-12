
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

// Configuración de Firebase obtenida directamente del servicio.
const firebaseConfig = {
  "projectId": "unoti-ticket-i9spt",
  "appId": "1:529378070793:web:4b753d9444c7dfbc50c3d8",
  "storageBucket": "unoti-ticket-i9spt.appspot.com",
  "apiKey": "AIzaSyDyeqPRhp8bdeGnlMayif1kmPnXEJUGR1Y",
  "authDomain": "unoti-ticket-i9spt.firebaseapp.com",
  "messagingSenderId": "529378070793"
};

export function initializeFirebase(): FirebaseServices | null {
  // Solo ejecutar en el lado del cliente.
  if (typeof window === 'undefined') {
    return null;
  }

  // Si ya está inicializado, devolver la instancia existente.
  if (firebaseServices) {
    return firebaseServices;
  }
  
  // Validar que la configuración esté presente
  if (!firebaseConfig.projectId) {
    console.error("Firebase config is not available.");
    return null;
  }
  
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  firebaseServices = { app, db, auth, storage };
  
  return firebaseServices;
}
