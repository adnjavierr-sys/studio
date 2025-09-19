
// src/lib/firebase-config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    "projectId": "unoti-ticket-i9spt",
    "appId": "1:529378070793:web:4b753d9444c7dfbc50c3d8",
    "apiKey": "AIzaSyDyeqPRhp8bdeGnlMayif1kmPnXEJUGR1Y",
    "authDomain": "unoti-ticket-i9spt.firebaseapp.com",
    "storageBucket": "unoti-ticket-i9spt.appspot.com",
    "messagingSenderId": "529378070793",
    "measurementId": "G-9T4E21J79L"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
