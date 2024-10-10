// Import necessary Firebase modules
import { initializeApp } from 'firebase/app'; 
import { getFirestore, enablePersistence } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; 
import 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrDPt6mnOwTw_qQOE1rCRMffiBNXsyHzU",
  authDomain: "fb-practice-82979.firebaseapp.com",
  projectId: "fb-practice-82979",
  storageBucket: "gs://fb-practice-82979.appspot.com",
  messagingSenderId: "66707242518",
  appId: "1:66707242518:android:839f75acafd24cfa34bf37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
