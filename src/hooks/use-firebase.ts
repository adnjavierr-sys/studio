
// src/hooks/use-firebase.ts
import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// La configuración se leerá desde las variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

// Hook personalizado para inicializar y obtener los servicios de Firebase
export function useFirebase() {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    const initializeFirebase = () => {
      // Verifica si las variables de entorno están presentes
      if (
        !firebaseConfig.apiKey ||
        !firebaseConfig.authDomain ||
        !firebaseConfig.projectId ||
        !firebaseConfig.storageBucket ||
        !firebaseConfig.messagingSenderId ||
        !firebaseConfig.appId
      ) {
        console.error("Firebase config is not set. Please check your .env.local file.");
        return null; // No inicializar si falta la configuración
      }
      
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const db = getFirestore(app);
      const auth = getAuth(app);
      const storage = getStorage(app);
      return { app, db, auth, storage };
    };
    
    // Solo ejecutamos esto en el lado del cliente.
    if (typeof window !== 'undefined') {
      const firebaseServices = initializeFirebase();
      if (firebaseServices) {
        setServices(firebaseServices);
      }
    }
  }, []);

  return services;
}
