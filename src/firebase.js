import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For this project, we will use placeholders. User needs to replace these.
const firebaseConfig = {
    apiKey: "AIzaSyBuy5Vp5rBF0uScfnIFnGhLa_vlN_uQL9c",
    authDomain: "learn-java-36956.firebaseapp.com",
    projectId: "learn-java-36956",
    storageBucket: "learn-java-36956.firebasestorage.app",
    messagingSenderId: "181220514650",
    appId: "1:181220514650:web:6e70bc0359efea329a7163"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
