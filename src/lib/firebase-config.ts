// src/lib/firebase-config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    "projectId": "unoti-ticket-i9spt",
    "appId": "1:529378070793:web:4b753d9444c7dfbc50c3d8",
    "storageBucket": "unoti-ticket-i9spt.appspot.com",
    "apiKey": "AIzaSyDyeqPRhp8bdeGnlMayif1kmPnXEJUGR1Y",
    "authDomain": "unoti-ticket-i9spt.firebaseapp.com",
    "messagingSenderId": "529378070793",
    "measurementId": "G-56V52G5Z1R"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { app, db, auth, storage };
