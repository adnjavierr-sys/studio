// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "unoti-ticket-i9spt",
  "appId": "1:529378070793:web:4b753d9444c7dfbc50c3d8",
  "storageBucket": "unoti-ticket-i9spt.firebasestorage.app",
  "apiKey": "AIzaSyDyeqPRhp8bdeGnlMayif1kmPnXEJUGR1Y",
  "authDomain": "unoti-ticket-i9spt.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "529378070793"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Connect to Firestore emulator if running in development
if (process.env.NODE_ENV === 'development') {
    try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("Connected to Firestore Emulator");
    } catch (e) {
        console.error("Error connecting to Firestore emulator", e);
    }
}

export { app, db };
