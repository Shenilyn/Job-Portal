// firebase.js or firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfJTTytHRv3XfVWXdxTsL1N6FX3FNjXzw",
  authDomain: "job-recommendation-porta-92ddc.firebaseapp.com",
  projectId: "job-recommendation-porta-92ddc",
  storageBucket: "job-recommendation-porta-92ddc.appspot.com", // 🔧 FIXED `.app` to `.appspot.com`
  messagingSenderId: "221258059842",
  appId: "1:221258059842:web:0881df907ec2e68b2e1ddb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export commonly used services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
