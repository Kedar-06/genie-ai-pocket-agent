// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0PCeBAXQR68lAhZg1Fnksnc_hvlPu4MA",
  authDomain: "ai-pocket-agent-genie.firebaseapp.com",
  projectId: "ai-pocket-agent-genie",
  storageBucket: "ai-pocket-agent-genie.firebasestorage.app",
  messagingSenderId: "141622342819",
  appId: "1:141622342819:web:b5bc29b5a5da00b7bcfb16",
  measurementId: "G-2NF8G6BQ4P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
